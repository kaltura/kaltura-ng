import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { FriendlyHashId } from '../friendly-hash-id';
import { Subject } from 'rxjs/Subject';

export type PollInterval = 10 | 30 | 60 | 300;

export interface RequestFactory<T> {
  create(): T;
}

interface PollItem<TRequest> {
  id: string;
  interval: PollInterval;
  lastExecution: Date,
  requestFactory: RequestFactory<TRequest>,
  observer: Subscriber<any>
}

// export class BlaRequestPoll extends KalturaRequest<BaseEntryGetAction> {
//
// }
//
// // applciation
// export class bla {
//
//   ngOnInit() {
//     this.ServerPolls.register(10, new BlaRequestPoll())
//       .cancelOnDestroy(this)
//       .subscribe(response => {
//         if (response.error) {
//
//         } else if (response.result instanceof BaseEntryGetActionResult) {
//
//         }
//       })
//   }
// }

export abstract class ServerPolls<TRequest, TError> {
  private _pollQueue: { [key: string]: PollItem<TRequest> };
  private _tokenGenerator = new FriendlyHashId();
  private _queueTimeout: number;

  protected _onDestroy = new Subject<void>();

  protected abstract _executeRequests(requests: TRequest[]): Observable<{ error: TError, result: any }[]>;

  protected abstract _createGlobalError(): TError;

  constructor() {
    this._onDestroy.subscribe(() => {
      clearTimeout(this._queueTimeout);
    });
  }

  private _getPollQueueList(): PollItem<TRequest>[] {
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

  private _runQueue(): void {
    const pollQueueList = this._getPollQueueList();
    if (!pollQueueList.length) {
      this._log('info', `There's nothing in the queue. Waiting for subscribers...`);
      return;
    }

    const interval = Math.min(...pollQueueList.map(({ interval }) => interval));

    this._queueTimeout = setTimeout(() => {
      this._onTick(() => {
        this._runQueue();
      });
    }, interval);
  }

  private _onTick(runNextTick: () => void): void {
    const queue = this._getPollQueueList().filter(item => Number(item.lastExecution) + item.interval >= Number(new Date()));
    const requests = queue.map(item => item.requestFactory.create());
    const queue$ = Observable.from(queue);
    const responses$ = this._executeRequests(requests);

    Observable.zip(responses$, queue$)
      .subscribe(
        ([response, item]) => {
          if (this._pollQueue[item.id]) {
            item.observer.next(response);
            item.lastExecution = new Date();
          }
          runNextTick();
        },
        () => {
          const error = this._createGlobalError();
          queue.forEach((item) => {
            if (this._pollQueue[item.id]) {
              item.observer.next({ error, result: null });
              item.lastExecution = new Date();
            }
          });
          runNextTick();
        }
      );
  }

  public register(intervalInSeconds: PollInterval, requestFactory: RequestFactory<TRequest>): Observable<{ error: TError, result: any }> {
    const newPollId = this._tokenGenerator.generateUnique(Object.keys(this._pollQueue));

    return Observable.create(observer => {
      this._pollQueue[newPollId] = {
        id: newPollId,
        interval: intervalInSeconds,
        lastExecution: new Date(),
        requestFactory: requestFactory,
        observer: observer
      };

      if (this._getPollQueueList().length === 1) {
        this._log('info', 'Starting the new interval');
        this._runQueue();
      }

      return () => {
        delete this._pollQueue[newPollId];
      }
    });
  }
}
