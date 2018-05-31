import { InjectionToken } from '@angular/core';

export type Context = { [key: string]: any };
export type DefferedContext = () => Context;

export const KalturaLoggerInjectionToken = new InjectionToken<KalturaLogger>('kaltura-logger');

export interface KalturaLogger {
	trace(message: string, context?: Context): void;

	trace(message: string, context?: DefferedContext): void;

	trace(message: string, context?: Context | DefferedContext): void;

	debug(message: string, context?: Context): void;

	debug(message: string, context?: DefferedContext): void;

	debug(message: string, context?: Context | DefferedContext): void;

	info(message: string, context?: Context): void;

	info(message: string, context?: DefferedContext): void;

	info(message: string, context?: Context | DefferedContext): void;

	warn(message: string, context?: Context): void;

	warn(message: string, context?: DefferedContext): void;

	warn(message: string, context?: Context | DefferedContext): void;

	error(message: string, context?: Context): void;

	error(message: string, error?: Error): void;

	error(message: string, context?: Error | Context): void;

	fatal(message: string, context?: Context): void;

	fatal(message: string, error?: Error): void;

	fatal(message: string, context?: Error | Context): void;

	subLogger(name: string): KalturaLogger;
}

export class EmptyLogger implements KalturaLogger {
	trace(message: string, context?: Context): void;
	trace(message: string, context?: DefferedContext): void;
	trace(message: string, context?: Context | DefferedContext): void;
	trace(message: string, context?): void {
	}

	debug(message: string, context?: Context): void;
	debug(message: string, context?: DefferedContext): void;
	debug(message: string, context?: Context | DefferedContext): void;
	debug(message: string, context?): void {
	}

	info(message: string, context?: Context): void;
	info(message: string, context?: DefferedContext): void;
	info(message: string, context?: Context | DefferedContext): void;
	info(message: string, context?): void {
	}

	warn(message: string, context?: Context): void;
	warn(message: string, context?: DefferedContext): void;
	warn(message: string, context?: Context | DefferedContext): void;
	warn(message: string, context?): void {
	}

	error(message: string, context?: Context): void;
	error(message: string, error?: Error): void;
	error(message: string, context?: Error | Context): void;
	error(message: string, context?): void {
	}

	fatal(message: string, context?: Context): void;
	fatal(message: string, error?: Error): void;
	fatal(message: string, context?: Error | Context): void;
	fatal(message: string, context?): void {
	}

	subLogger(name: string): KalturaLogger {
		return new EmptyLogger();
	}
}

