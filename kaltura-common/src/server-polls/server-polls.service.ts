import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { FriendlyHashId } from '../friendly-hash-id';
import { ISubscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export type PollInterval = 10 | 30 | 60 | 300;

export interface RequestFactory<TRequest, TResponse> {
  create(): TRequest;
}

interface PollItem<TError> {
  id: string;
  interval: PollInterval;
  lastExecution: Date,
  requestFactory: RequestFactory<any, any>,
  observer: Subscriber<{result: any, error: TError}>
}

export abstract class ServerPolls<TRequest, TError> {
  private _pollQueue: { [key: string]: PollItem<TError> } = {};
  private _tokenGenerator = new FriendlyHashId();
  private _queueTimeout: number;
  private _isInitialized = false;
  private _executionSubscription: ISubscription;
  private _state = new BehaviorSubject({ busy: false });

  public state$ = this._state.asObservable();
  
  protected abstract _executeRequests(requests: TRequest[]): Observable<{ error: TError, result: any }[]>;
  
  protected abstract _createGlobalError(error?: Error): TError;
  
  protected abstract _getOnDestroy$(): Observable<void>;
  
  constructor() {
    this._initialize();
  }
  
  private _initialize(): void {
    this._log('silly','_initialize()');
    setTimeout(() => {
      const onDestroy$ = this._getOnDestroy$();
      
      if (!onDestroy$) {
        const error = `calling method '_getOnDestroy$()' didn't return valid observable (did you remember to provide 'Observable' that will be invoked from ngOnDestroy method?)`;
          this._log('error',error);
        throw new Error(error);
      } else {
        onDestroy$.subscribe(() => {
            this._log('silly','onDestroy$.subscribe()');
          this._cancelCurrentInterval();
          if (this._executionSubscription) {
            this._executionSubscription.unsubscribe();
            this._executionSubscription = null;
          }
        });
        
        this._isInitialized = true;
      }
    });
  }
  
  private _cancelCurrentInterval(): void {
    clearTimeout(this._queueTimeout);
  }
  
  private _getPollQueueList(): PollItem<TError>[] {
    return Object.keys(this._pollQueue).map(key => this._pollQueue[key]);
  }
  
  // TODO [kmcng] replace this function with log library
  private _log(level: 'silly' | 'debug' | 'info' | 'warn' | 'error', message: string, fileId?: string): void {
    const messageContext = fileId ? `file '${fileId}'` : '';
    const origin = 'server-polls';
    const formattedMessage = `log: [${level}] [${origin}] ${messageContext}: ${message}`;
    switch (level) {
      case 'silly':
      case 'debug':
      case 'info':
        console.log(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  private _queueInterval: number = null;

  private _runQueue(): void {
      this._cancelCurrentInterval();

      const pollQueueList = this._getPollQueueList();

      if (!pollQueueList.length) {
          this._log('info','no actions found in the queue. suspending interval until an action will be added');
          return;
      }

      let newInterval: number = null;
      const hasNewPolls = pollQueueList.some(({lastExecution}) => !!lastExecution);
      if (!hasNewPolls) {
          newInterval = Math.min(...pollQueueList.map(({interval}) => interval)) / 2;
      }
      newInterval = newInterval && newInterval > 10 ? newInterval : 10; // default to ten seconds (minimum value)
      if (this._queueInterval !== newInterval) {
          this._log('info', `updating queue interval to poll server every ${newInterval} seconds`);
          this._queueInterval = newInterval;
      }

      this._queueTimeout = setTimeout(() => {
          this._onTick(() => {
              this._runQueue();
          });
      }, this._queueInterval * 1000);
  }
  
  private _onTick(runNextTick: () => void): void {
    this._log('debug', 'prepare server poll request');

    if (!this._isInitialized) {
      this._log('warn', 'service is disabled due to error during initialization, view error log for more details.');
      return;
    }

    const queue = this._getPollQueueList()
      .filter(item => !item.lastExecution || Number(item.lastExecution) + (item.interval * 1000) <= Number(new Date()));
    const requests = queue.map(item => {
      let result: TRequest;
      let error: TError;
      try {
        result = item.requestFactory.create();
      } catch (err) {
        this._log('error',`failed to create a request for '${item.id}'. got the following error : '${err.message}'`);

          result = null;
          error = this._createGlobalError(err);
      }

      if (error) {
        this._propagateServerResponse(item, { error: error, result: null });
      }
      return result;
    }).filter(Boolean);

    if (!queue.length) {
      this._log('debug', 'nothing to run. Waiting next tick...');
      runNextTick();
      return;
    }

    this._log('info', `has ${queue.length} pending requests. send requests to server (set busy mode to true)`);
    this._state.next({ busy: true});
    this._executionSubscription = this._executeRequests(requests)
      .subscribe(
        response => {
            this._executionSubscription = null;
            this._log('info', `got ${response.length} responses. propagate responses to relevant actions`);
            queue.forEach((item, index) => {

                if (this._pollQueue[item.id]) {
                    this._propagateServerResponse(item, response[index]);
                } else {
                    this._log('info', `failed to find action ${item.id}, ignoring response (it might indicate that this action was unsubscribed while a request to the server was executed)`);
                }
            });

            this._state.next({busy: false});
            runNextTick();
        },
        (error) => {

            this._log('error',`failed to query the server. got the following error : '${error.message}'`);
            this._executionSubscription = null;

            const globalError = this._createGlobalError(error);
            queue.forEach((item) => {
                if (this._pollQueue[item.id]) {
                    item.lastExecution = new Date();
                    item.observer.next({error: globalError, result: null});
                }
            });

            this._state.next({busy: false});

            runNextTick();
        }
      );
  }

  private _propagateServerResponse(item: PollItem<TError>, response: { error: TError, result: any }): void{
      try {
          this._log('debug', `propagating response for ${item.id}`);
          item.lastExecution = new Date();
          item.observer.next(response);
      } catch (err) {
          this._log('warn', `error happened while propagating response of '${item.id}'.ignoring error. got the following error: ${err.message}`);
      }
  }

  public isBusy(): boolean {
      return this._state.getValue().busy;
  }
  
  public register<TResponse>(intervalInSeconds: PollInterval, requestFactory: RequestFactory<TRequest, TResponse>): Observable<{ error: TError, result: TResponse }> {
    return Observable.create(observer => {
      const newPollId = this._tokenGenerator.generateUnique(Object.keys(this._pollQueue));
      this._pollQueue[newPollId] = {
        id: newPollId,
        interval: intervalInSeconds,
        lastExecution: null,
        requestFactory: requestFactory,
        observer: observer
      };
      
      this._log('info', `register new poll request ${newPollId}`);
      this._runQueue();
      
      return () => {
        this._log('info', `stop polling for ${newPollId}`);
        delete this._pollQueue[newPollId];
      }
    });
  }
}