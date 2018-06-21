import { Injectable } from '@angular/core';

@Injectable()
export class KalturaLoggerRecordService {
  private _recordLogs = false;
  private _logsBuffer: any[] = [];
  
  
  public get isRecordingLogs(): boolean {
    return this._recordLogs;
  }
  
  public startRecord(): void {
    this._recordLogs = true;
  }
  
  public getRecordedLogs(): any[] {
    const result = [...this._logsBuffer];
    this._recordLogs = false;
    this._logsBuffer = [];
    return result;
  }
  
  public addLogItemToBuffer(logItem: any): void {
    if (this.isRecordingLogs) {
      this._logsBuffer.push(logItem);
    }
  }
}