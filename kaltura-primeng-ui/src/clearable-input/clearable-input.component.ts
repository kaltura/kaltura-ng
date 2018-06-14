import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from 'primeng/primeng';

export const SPINNER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ClearableInputComponent),
  multi: true
};

@Component({
  selector: 'kClearableInput',
  templateUrl: './clearable-input.component.html',
  styleUrls: ['./clearable-input.component.scss'],
  providers: [DomHandler, SPINNER_VALUE_ACCESSOR],
})
export class ClearableInputComponent implements ControlValueAccessor {
  @Input() disabled: boolean;
  @Input() placeholder: string;
  
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  @Output() onBlur: EventEmitter<any> = new EventEmitter();
  @Output() onEnterKeyup: EventEmitter<string> = new EventEmitter<string>();
  @Output() onClear: EventEmitter<void> = new EventEmitter<void>();
  
  public _disabled = false;
  public _value = '';
  
  public _clearInput(): void {
    this._value = '';
    this.onModelChange(this._value);
    this.onChange.emit(this._value);
    this.onClear.emit();
  }
  
  public onModelChange: Function = () => {
  };
  
  public onModelTouched: Function = () => {
  };
  
  public setDisabledState(val: boolean): void {
    this._disabled = val;
  }
  
  public registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }
  
  public registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
  
  public writeValue(value: any): void {
    this._value = value || '';
  }
  
  public clearValue(): void {
    this._value = '';
    this.onModelChange(this._value);
    this.onChange.emit(this._value);
  }
}
