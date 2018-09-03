import {Component, ChangeDetectionStrategy, OnInit, Input} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
@Component({
  selector: 'kInputRange',
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputRangeComponent,
      multi: true
    }
  ]
})

export class InputRangeComponent implements OnInit, ControlValueAccessor {
  @Input() options: Array<{value: string | number, tooltip: string, isSelected: boolean, label: string}>;
  @Input() width: string;

  public selectedOptionIndex: number;
  public selectedText: string;
  public pointOvered = [];

  onChange = (value: string | number) => {};
  onTouched = () => {};

  constructor() {
  }

  ngOnInit() {
    this.selectedOptionIndex = this.options.findIndex(option => option.isSelected);
    this.selectedOptionIndex = this.selectedOptionIndex == -1 ? 0 : this.selectedOptionIndex;
    this.selectedText = this.options[this.selectedOptionIndex].label;

  }

  getProgressBarStyle() {

    return 100 / (this.options.length - 1) * (this.selectedOptionIndex >= 0 ? this.selectedOptionIndex : 0);

  }

  pointSelected(index) {
    if (this.selectedOptionIndex > 0) {
      this.options[this.selectedOptionIndex].isSelected = false;
    }

    this.options[index].isSelected = true;

    this.selectedText = this.options[index].label;
    this.selectedOptionIndex = index;

    this.onTouched();
    this.onChange(this.options[index].value);

  }

  //From ControlValueAccessor interface
  writeValue(value: string | number) {
    const valueOptionIndex = this.options.findIndex(option => option.value == value);
    if (valueOptionIndex !== -1) {
      this.pointSelected(valueOptionIndex);
    }

  }

  //From ControlValueAccessor interface
  registerOnChange(fn: (value: string | number) => void) {
    this.onChange = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
