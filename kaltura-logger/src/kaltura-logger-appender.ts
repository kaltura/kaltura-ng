import * as JL from 'jsnlog';
import JSNLogAppenderOptions = JL.JSNLogAppenderOptions;
import JSNLogAppender = JL.JSNLogAppender;

// extend module to resolve typings
declare module 'jsnlog' {
  class Appender {
    constructor(appenderName: string,
                sendLogItems: (logItems: LogItem[]) => void);
    
    setOptions(options: JSNLogAppenderOptions);
  }
  
  class LogItem {
    constructor(l: number, m: string, n: string, t: number);
  }
}

export class KalturaLoggerAppender extends JL.Appender implements JSNLogAppender {
    constructor(appenderName) {
        super(appenderName, KalturaLoggerAppender.prototype._sendLogItemsLocal);
    }

    _sendLogItemsLocal(logItems: JL.LogItem[]): void {
        console.warn(logItems);
    }
    
    setOptions(options: JSNLogAppenderOptions): JSNLogAppender {
      super.setOptions(options);
      return this;
    }
}