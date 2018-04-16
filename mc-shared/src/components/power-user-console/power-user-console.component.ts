import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { KalturaLogger, LogLevels } from '@kaltura-ng/kaltura-logger';
import { APP_STORAGE_TOKEN, IAppStorage } from '@kaltura-ng/kaltura-common';

const logLevelCacheToken = 'power-user.log-level';

@Component({
  selector: 'kPowerUserConsole',
  templateUrl: './power-user-console.component.html',
  styleUrls: ['./power-user-console.component.scss']
})
export class PowerUserConsoleComponent implements OnInit, OnChanges {
  @Input() visible = false;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  
  public _logLevelValues: { value: LogLevels, label: string }[] = [
    { value: 'Off', label: 'Off' },
    { value: 'All', label: 'All' },
    { value: 'Trace', label: 'Trace' },
    { value: 'Debug', label: 'Debug' },
    { value: 'Info', label: 'Info' },
    { value: 'Warn', label: 'Warn' },
    { value: 'Error', label: 'Error' },
    { value: 'Fatal', label: 'Fatal' }
  ];
  
  public _selectedLogLevel: LogLevels;
  public _ready = false;

  constructor(private _logger: KalturaLogger, @Inject(APP_STORAGE_TOKEN) private _storage: IAppStorage) {
    this._logger = _logger.subLogger('PowerUserConsoleComponent');
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible && !this._ready) {
      this._ready = true;
      this._logger.info(`handle open power user console for the first time, set default logLevel value to ${this._selectedLogLevel}`);
      this._logger.setOptions({ level: this._selectedLogLevel });
    }
  }
  
  ngOnInit() {
    const cachedLogLevel = this._storage.getFromLocalStorage(logLevelCacheToken);
    const relevantLogLevel = this._logLevelValues.find(({ value }) => value === cachedLogLevel);
    this._selectedLogLevel = relevantLogLevel ? relevantLogLevel.value : this._logLevelValues[0].value;
    this._logger.info(`init service: load default values from storage: ${this._selectedLogLevel}`);
  }
  
  public _logLevelChange(level: LogLevels): void {
    this._logger.info(`handle log level change action by user, set log level to ${level}, update storage value`);
    this._logger.setOptions({ level });
    this._storage.setInLocalStorage(logLevelCacheToken, level);
  }
}
