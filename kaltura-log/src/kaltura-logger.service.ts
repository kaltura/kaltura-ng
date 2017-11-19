import { Injectable, SkipSelf, Optional, Self, Inject, Provider, OnDestroy } from '@angular/core';
import { JL } from 'jsnlog';
import { InjectionToken } from '@angular/core';

export const KalturaLoggerName = new InjectionToken<string>('kaltura-logger-name');

@Injectable()
export class KalturaLogger implements OnDestroy{
    private _name: string;
    private _logger: JL.JSNLogLogger;

    public get name(): string {
        return this._name;
    }

    constructor(@Inject(KalturaLoggerName) @Self() name: string, @SkipSelf() @Optional() parentLogger: KalturaLogger) {
        this._name = parentLogger ? `${parentLogger.name}.${name}` : name;
        this._logger = JL(this._name);
        this._logger.debug('logger created');
    }

    static createFactory(name): Provider[] {
        const loggerName = (name || 'app').replace(/[.]/g, '_');
        // TODO [kaltura-ng] waiting for NG5
        // {
        //     provide: KalturaLogger,
        //         useFactory: createLoggerFactory
        //     deps: [[new Optional(), new SkipSelf(), KalturaLogger], [new Self(),]]
        // },
        return [
            KalturaLogger,
            {
                provide: KalturaLoggerName, useValue: loggerName
            }]
    }

    ngOnDestroy()
    {
        this._logger.debug('logger destroyed');
        delete this._logger;

    }
    public warn(message: string, context? : any) : void{
        const content = context ? Object.assign({message},context) : message;
        this._logger.warn(content);
    }

    public info(message: string, context? : any) : void{
        const content = context ? Object.assign({message},context) : message;
        this._logger.info(content);
    }
}