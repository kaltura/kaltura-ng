import { Injectable, SkipSelf, Optional, Self, Inject, Provider, OnDestroy } from '@angular/core';
import { JL } from 'jsnlog';
import { InjectionToken } from '@angular/core';

export const KalturaLoggerName = new InjectionToken<string>('kaltura-logger-name');

export type LogLevels = 'All' | 'Trace' | 'Debug' | 'Info' | 'Warn' | 'Error' | 'Fatal' | 'Off';

let randomLoggerNameNumber = 1;

export class KalturaDefaultLogger {
    private static _defaultLogger: KalturaLogger = null;

    static get(): KalturaLogger
    {
        return KalturaDefaultLogger._defaultLogger;
    }

    static set(instance: KalturaLogger): void
    {
        KalturaDefaultLogger._defaultLogger = instance;
    }
}

@Injectable()
export class KalturaLogger implements OnDestroy{
    private _name: string;
    private _logger: JL.JSNLogLogger;

    public get name(): string {
        return this._name;
    }

    static createLogger(loggerName: string) : Provider[] {
	    return [
		    KalturaLogger,
		    {
			    provide: KalturaLoggerName, useValue: loggerName
		    }
	    ];
    }

    constructor(@Inject(KalturaLoggerName) @Optional() @Self() name: string, @SkipSelf() @Optional() parentLogger: KalturaLogger) {

        if (!name)
        {
            name = 'logger' + randomLoggerNameNumber;
            randomLoggerNameNumber++;
        }

        name = name.replace(/[.]/g, '_');

        this._name = parentLogger ? `${parentLogger.name}.${name}` : name;
        this._logger = JL(this._name);
        this._logger.debug('logger created!');
    }

    public setOptions(options: { level?: LogLevels}): void
    {
        let level: number = undefined;
        if (options.level && JL)
        {
            const getLevelValue = JL[`get${options.level}Level`];
            level = typeof getLevelValue === 'function' ? getLevelValue() : undefined;
        }

        JL().setOptions({level: level});
    }
    public subLogger(name: string): KalturaLogger{
        return new KalturaLogger(name, this);
    }

    // TODO check why this doesn't work with AOT
    // static create(name: string): Provider {
    //     return {
    //         provide: KalturaLogger,
    //             useFactory(parentLogger)
    //             {
    //                 return new KalturaLogger(name, parentLogger);
    //             },
    //         deps: [[new Optional(), new SkipSelf(), KalturaLogger]]
    //     }
    // }

    ngOnDestroy()
    {
        this._logger.debug('logger destroyed');
        delete this._logger;

    }

    public debug(message: string, context? : any) : void{
        const content = context ? Object.assign({message},context) : message;
        this._logger.debug(content);
    }

    public trace(message: string, context? : any) : void{
        const content = context ? Object.assign({message},context) : message;
        this._logger.trace(content);
    }

    public fatal(message: string, error? : Error) : void{
        if (error) {
            this._logger.fatalException(message, error);
        }else {
            this._logger.fatal(message);
        }
    }

    public error(message: string, context? : any) : void{
        const content = context ? Object.assign({message},context) : message;
        this._logger.error(content);
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