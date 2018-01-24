import { Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from 'primeng/primeng';

export type InputType = 'minutes' | 'seconds';

export const SPINNER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimeSpinnerComponent),
  multi: true
};

@Component({
  selector: 'kTimeSpinner',
  templateUrl: './time-spinner.component.html',
  styleUrls: ['./time-spinner.component.scss'],
  providers: [DomHandler, SPINNER_VALUE_ACCESSOR],
})
export class TimeSpinnerComponent implements ControlValueAccessor {
  @ViewChild('minutes') minutesInputField: ElementRef;
  @ViewChild('seconds') secondsInputField: ElementRef;
  
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  @Output() onBlur: EventEmitter<any> = new EventEmitter();
  
  private _allowedKeys = [
    9,  // tab
    8,  // backspace
    37, // leftArrow
    39, // rightArrow
    46  // deleteBtn
  ];
  private _spinKeys = {
    upArrow: 38,
    rightArrow: 39,
    downArrow: 40,
    leftArrow: 37
  };
  private _currentInput: InputType = 'minutes';
  private _keyPattern: RegExp = /[0-9]/;
  private _timer: any;
  
  public _minutesAsString = '00';
  public _secondsAsString = '00';
  
  public _minutes = 0;
  public _seconds = 0;
  public _disabled = false;
  
  public onModelChange: Function = () => {
  };
  
  public onModelTouched: Function = () => {
  };
  
  private _spin(event: Event, dir: 1 | -1) {
    const currentValue = this._getCurrentInputValue();
    let nextValue = currentValue;
    if (currentValue === 0 && dir === -1) {
      nextValue = 59;
    } else if (currentValue === 59 && dir === 1) {
      nextValue = 0;
    } else {
      nextValue = currentValue + dir;
    }
    
    this._setCurrentInputValue(nextValue);
    this._formatValue();
    
    this.onModelChange((this._minutes * 60) + this._seconds);
    this.onChange.emit(event);
  }
  
  private _getCurrentInputValue(): number {
    if (this._currentInput === 'minutes') {
      return this._minutes;
    } else if (this._currentInput === 'seconds') {
      return this._seconds;
    } else {
      throw Error('Must not reach this part');
    }
  }
  
  private _setCurrentInputValue(value: number): void {
    if (this._currentInput === 'minutes') {
      this._minutes = value;
    } else if (this._currentInput === 'seconds') {
      this._seconds = value;
    } else {
      throw Error('Must not reach this part');
    }
  }
  
  private _setValue(input: string): void {
    let value = Number(input);
    value = isNaN(value) ? 0 : value;
    
    if (value > 59) {
      this._setCurrentInputValue(59);
    } else if (value < 0) {
      this._setCurrentInputValue(0);
    } else {
      this._setCurrentInputValue(value);
    }
  }
  
  private _highlightInput(): void {
    if (this._currentInput === 'minutes') {
      this.minutesInputField.nativeElement.focus();
      this.minutesInputField.nativeElement.select();
    } else if (this._currentInput === 'seconds') {
      this.secondsInputField.nativeElement.focus();
      this.secondsInputField.nativeElement.select();
    } else {
      throw Error('Must not reach this part');
    }
  }
  
  private _clearTimer(): void {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }
  
  private _repeat(event: Event, interval: number, dir: 1 | -1): void {
    const i = interval || 500;
    
    this._clearTimer();
    this._timer = setTimeout(() => {
      this._repeat(event, 40, dir);
    }, i);
    
    this._spin(event, dir);
  }
  
  private _formatValue(): void {
    if (this._currentInput === 'minutes') {
      this._minutesAsString = this._minutes < 10 ? `0${this._minutes}` : String(this._minutes);
      this.minutesInputField.nativeElement.value = this._minutesAsString;
    } else if (this._currentInput === 'seconds') {
      this._secondsAsString = this._seconds < 10 ? `0${this._seconds}` : String(this._seconds);
      this.secondsInputField.nativeElement.value = this._secondsAsString;
    } else {
      throw Error('Must not reach this part');
    }
  }
  
  private _setDefaultValues(): void {
    this._minutes = 0;
    this._seconds = 0;
    this._secondsAsString = '00';
    this._minutesAsString = '00';
  }
  
  private _setInitialValues(value: number): void {
    this._minutes = Math.floor(value / 60);
    this._seconds = value % 60;
    this._minutesAsString = this._minutes < 10 ? `0${this._minutes}` : String(this._minutes);
    this.minutesInputField.nativeElement.value = this._minutesAsString;
    this._secondsAsString = this._seconds < 10 ? `0${this._seconds}` : String(this._seconds);
    this.secondsInputField.nativeElement.value = this._secondsAsString;
  }
  
  public _onInputKeydown(event: KeyboardEvent): void {
    if (event.which === this._spinKeys.upArrow || event.which === this._spinKeys.rightArrow) {
      // increment
      this._spin(event, 1);
      event.preventDefault();
    } else if (event.which === this._spinKeys.downArrow || event.which === this._spinKeys.leftArrow) {
      // decrement
      this._spin(event, -1);
      event.preventDefault();
    }
  }
  
  public _onInputKeyPress(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);
    const notANumber = !this._keyPattern.test(inputChar);
    const notAllowedKey = this._allowedKeys.indexOf(event.keyCode) === -1;
    if (notANumber && notAllowedKey) {
      event.preventDefault();
    }
  }
  
  public _onInputKeyup(event: KeyboardEvent): void {
    const inputValue = (<HTMLInputElement> event.target).value;
    this._setValue(inputValue);
    this._formatValue();
    
    this.onModelChange((this._minutes * 60) + this._seconds);
  }
  
  public _handleChange(event: KeyboardEvent): void {
    this.onChange.emit(event);
  }
  
  public _onInputFocus(event: KeyboardEvent, input: InputType): void {
    this._currentInput = input;
    this.onFocus.emit(event);
  }
  
  public _onInputBlur(event: KeyboardEvent): void {
    this.onModelTouched();
    this.onBlur.emit(event);
  }
  
  public _onButtonMousedown(event: Event, dir: 1 | -1): void {
    if (!this._disabled) {
      this._highlightInput();
      this._repeat(event, null, dir);
    }
  }
  
  public _onButtonMouseup(event: Event): void {
    if (!this._disabled) {
      this._clearTimer();
    }
  }
  
  public _onButtonMouseleave(event: Event): void {
    if (!this._disabled) {
      this._clearTimer();
    }
  }
  
  public setDisabledState(val: boolean): void {
    this._disabled = val;
  }
  
  public writeValue(value: number): void {
    if (typeof value !== 'number') {
      this._setDefaultValues();
    } else {
      this._setInitialValues(value);
    }
  }
  
  public registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }
  
  public registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
  
}
