import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs/Subscriber';
import { FriendlyHashId } from '../friendly-hash-id';
import { ISubscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs';
import { EmptyLogger, KalturaLogger } from '../kaltura-logger';
import { Optional } from '@angular/core';

export type PollInterval = 10 | 30 | 60 | 300;

export interface RequestFactory<TRequest, TResponse> {
  create(): TRequest;
}

interface PollItem<TError> {
  id: string;
  interval: PollInterval;
  lastExecution: Date,
  queryEnabled: boolean,
  requestFactory: RequestFactory<any, any>,
  observer: Subscriber<{result: any, error: TError}>
}

export abstract class ServerPolls<TRequest, TError> {
  private _pollQueue: { [key: string]: PollItem<TError> } = {};
  private _tokenGenerator = new FriendlyHashId();
  private _queueTimeout: number;
  private _missingDestoryHandling = false;
  private _subscriptions: ISubscription[] = [];
  private _state = new BehaviorSubject({ busy: false });
    private _logger: KalturaLogger;
  public state$ = this._state.asObservable();
  private _queueInterval: number = null;

  protected abstract _executeRequests(requests: TRequest[]): Observable<{ error: TError, result: any }[]>;

  protected abstract _createGlobalError(error?: Error): TError;

  protected abstract _getOnDestroy$(): Observable<void>;

  protected abstract _canExecute(): boolean;

  constructor(kalturaLogger: KalturaLogger) {

	  if (kalturaLogger) {
		  this._logger = kalturaLogger;
	  } else {
		  this._logger = new EmptyLogger();
	  }
	  this._initialize();
  }

  private _warnAboutMissingDestory(): void {
      // NOTICE: showing a warning every time since this is an implementation issue that must be addressed during development.
      const error = `calling method '_getOnDestroy$()' didn't return valid observable (did you remember to provide 'Observable' that will be invoked from ngOnDestroy method?)`;
      this._logger.error(error);
  }

  private _initialize(): void {
      this._logger.trace('_initialize()');
      setTimeout(() => {
          const onDestroy$ = this._getOnDestroy$();

          if (!onDestroy$) {
              this._missingDestoryHandling = true;
              this._warnAboutMissingDestory();
          } else {
              onDestroy$.subscribe(() => {
                  this._logger.trace('onDestroy$.subscribe()');
                  this._cancelQueueInterval();
                  this._subscriptions.forEach(item => {
                      item.unsubscribe();
                  });
                  this._subscriptions = [];
              });
          }
      });
  }

  private _cancelQueueInterval(): void {
    clearTimeout(this._queueTimeout);
  }

  private _getPollQueueList(): PollItem<TError>[] {
    return Object.keys(this._pollQueue).map(key => this._pollQueue[key]);
  }

  private _setupQueueTimer(): void {
      this._cancelQueueInterval();

      const pollQueueList = this._getPollQueueList();

      if (this._missingDestoryHandling) {
          // NOTICE: showing a warning every time since this is an implementation issue that must be addressed during development.
          this._warnAboutMissingDestory();
      }


      if (!pollQueueList.length) {
          this._logger.info('no actions found in the queue. suspending interval until an action will be added');
          return;
      }

      let newInterval: number = null;
      const hasNewPolls = pollQueueList.some(({lastExecution}) => !!lastExecution);
      if (!hasNewPolls) {
          newInterval = Math.min(...pollQueueList.map(({interval}) => interval)) / 2;
      }
      newInterval = newInterval && newInterval > 10 ? newInterval : 10; // default to ten seconds (minimum value)
      if (this._queueInterval !== newInterval) {
          this._logger.info( `updating queue interval to poll server every ${newInterval} seconds`);
          this._queueInterval = newInterval;
      }

      this._queueTimeout = setTimeout(() => {
          this._onQueueTimerTick();
      }, this._queueInterval * 1000);
  }

  public forcePolling() {
      this._logger.info('force server polling requested');
      // cancel active requests
      this._cancelQueueInterval();
      this._subscriptions.forEach(subscription => {
          subscription.unsubscribe();
      });
      this._subscriptions = [];

      // enable all requests
      this._getPollQueueList().forEach(item => item.queryEnabled = true);

      // send poll request for all requests
      const subscription = this._queryPollItems(this._getPollQueueList())
          .subscribe(() => this._setupQueueTimer(), () => this._setupQueueTimer());
  }

    private _queryPollItems(items: PollItem<TError>[]): Observable<void> {
        return Observable.create(observer => {
            this._logger.debug(`execute server polling`);

            if (!this._canExecute() || !items || items.length === 0) {
                this._logger.debug(`execute server polling ignored, cannot execute request or no items provided to query`);
                observer.next(undefined);
                return;
            }

            const requests = items.map(item => {
                let ItemRequest: TRequest;
                let error: TError;
                try {
                    ItemRequest = item.requestFactory.create();
                } catch (err) {
                    this._logger.error(`failed to create a request for '${item.id}'. got the following error : '${err.message}'`);

                    ItemRequest = null;
                    error = this._createGlobalError(err);
                }

                if (error) {
                    this._propagateServerResponse(item, {error: error, result: null});
                }
                return ItemRequest ? {pollItem: item, request: ItemRequest} : null;
            }).filter(Boolean);

            this._logger.info(`executing server poll for ${requests.length} items`);

            if (!requests.length)
            {
                observer.next(undefined);
            }else {
                const subscription = this._executeRequests(requests.map(item => item.request))
                    .subscribe(
                        response => {
                            this._removeSubscription(subscription);

                            this._logger.info(`got ${response.length} responses. propagate responses to relevant actions`);
                            requests.forEach(({pollItem}, index) => {
                                let result = response[index];
                                if (Array.isArray(result)) {
                                    result = { result, error: null }
                                }
                                this._propagateServerResponse(pollItem, result);
                            });

                            observer.next(undefined);
                        },
                        (error) => {

                            this._logger.error(`failed to query the server. got the following error : '${error.message}'`);
                            this._removeSubscription(subscription);

                            const errorResponse = {error: this._createGlobalError(error), result: null};
                            requests.forEach(({pollItem}) => {
                                this._propagateServerResponse(pollItem, errorResponse);
                            });

                            observer.next(undefined);
                        }
                    );
                this._subscriptions.push(subscription);

                return () => {
                    this._removeSubscription(subscription);
                };
            }


        });
    }

    private _removeSubscription(subscription: ISubscription): void {
        if (subscription) {
            const subscriptionIndex = this._subscriptions.indexOf(subscription);

            if (subscriptionIndex > -1) {
                this._subscriptions.splice(
                    subscriptionIndex,
                    1
                )
            }
        }
    }

    private _onQueueTimerTick(): void {

        if (!this._canExecute()) {
            this._setupQueueTimer();
            this._logger.trace('_onQueueTimerTick(): canExecute() check failed. ignore current execution');
            return;
        }

        this._logger.debug('prepare server poll request');

        const now = Number(new Date());
        const itemsToBeExecuted = this._getPollQueueList()
            .filter(item => item.queryEnabled && (!item.lastExecution || (Number(item.lastExecution) + (item.interval * 1000) <= now)));


        if (!itemsToBeExecuted.length) {
            this._logger.debug('nothing to run. Waiting next tick...');
            this._setupQueueTimer();
            return;
        }

        this._logger.info(`set busy mode to true`);
        this._state.next({busy: true});
        this._queryPollItems(itemsToBeExecuted)
            .subscribe(
                () => {
                    this._state.next({busy: false});
                    this._setupQueueTimer();
                },
                (error) => {
                    this._state.next({busy: false});
                }
            );
    }

  private _propagateServerResponse(item: PollItem<TError>, response: { error: TError, result: any }): void{
      try {
          if (this._pollQueue[item.id]) {
              this._logger.debug(`propagating response for ${item.id}`);
              item.lastExecution = new Date();
              item.observer.next(response);
          }else
          {
              this._logger.info(`cannot find registered action for '${item.id} (it might indicate that this action was unsubscribed while a request to the server was executed)`);
          }
      } catch (err) {
          this._logger.warn( `error happened while propagating response of '${item.id}'.ignoring error. got the following error: ${err.message}`);
      }
  }

  public isBusy(): boolean {
      return this._state.getValue().busy;
  }

  public register<TResponse>(intervalInSeconds: PollInterval, requestFactory: RequestFactory<TRequest, TResponse>): Observable<{ error: TError, result: TResponse }> {
    return Observable.create(observer => {
      const newPollId = this._tokenGenerator.generateUnique(Object.keys(this._pollQueue));
        this._logger.info( `register new poll request ${newPollId} (interval = ${intervalInSeconds} seconds)`);
      const newPollItem: PollItem<TError> = this._pollQueue[newPollId] = {
        id: newPollId,
        interval: intervalInSeconds,
        lastExecution: null,
          queryEnabled: false,
        requestFactory: requestFactory,
        observer: observer
      };

      this._logger.info( `execute the added request '${newPollId}'`);
      let initialRequest = this._queryPollItems([newPollItem])
          .subscribe(
              () =>
              {
                  initialRequest = null;
                  newPollItem.queryEnabled = true;
                  this._setupQueueTimer();
              },
              () =>
              {
                  initialRequest = null;
                  newPollItem.queryEnabled = true;
                  this._setupQueueTimer();
              }
          );

      return () => {
          this._logger.info(`stop polling for ${newPollId}`);
          if (initialRequest) {
              initialRequest.unsubscribe();
          }
          delete this._pollQueue[newPollId];
      }
    });
  }
}
