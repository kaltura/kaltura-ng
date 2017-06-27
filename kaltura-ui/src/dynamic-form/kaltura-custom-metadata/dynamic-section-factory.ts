import { MetadataProfile } from '@kaltura-ng/kaltura-common/metadata-profile';
import { MetadataItemTypes, MetadataItem } from '@kaltura-ng/kaltura-common';
import { DynamicSectionControl } from '../controls/dynamic-section-control';
import { DynamicFormControlBase } from '../dynamic-form-control-base';
import { TextAreaControl } from '../controls/text-area-control';
import { DatePickerControl } from '../controls/datepicker-control';
import { ListControl } from '../controls/list-control';
import { TextboxControl } from '../controls/textbox-control';
import { DynamicDropdownControl } from '../controls/dynamic-dropdown-control';
import { LinkedEntriesControl } from './linked-entries-control';

export class DynamicSectionFactory{
    create(metadataProfile : MetadataProfile) : DynamicSectionControl
    {
        let result = null;

        if (metadataProfile) {

            result = new DynamicSectionControl({key : 'metadata', children : []});
            result.children = this._extractChildren(metadataProfile.items);

        }

        return result;
    }

    private _extractChildren(items : MetadataItem[]) : DynamicFormControlBase<any>[]
    {
        const result : DynamicFormControlBase<any>[] = [];

        if (items) {
            items.forEach(item => {
                switch (item.type) {
                    case MetadataItemTypes.Text:
                        if (item.allowMultiple) {
                            result.push(this._createTextbox(item));
                        }else
                        {
                            result.push(this._createTextArea(item));
                        }
                        break;
                    case MetadataItemTypes.Object:
                        result.push(this._createLinkedEntriesSelector(item));
                        break;
                    case MetadataItemTypes.Date:
                        result.push(this._createDatePicker(item));
                        break;
                    case MetadataItemTypes.List:
                        if (item.allowMultiple)
                        {
                            result.push(this._createList(item));
                        }else {
                            result.push(this._createDropdown(item));
                        }
                        break;
                    case MetadataItemTypes.Container:
                        result.push(this._createSection(item));
                        break;
                }
            });
        }

        return result;
    }


    private _createTextArea(item : MetadataItem) : DynamicFormControlBase<any>
    {
        return new TextAreaControl(
            {
                label: item.key,
                allowMultiple : item.allowMultiple,
                key: item.name
            }
        );
    }

    private _createLinkedEntriesSelector(item : MetadataItem) : DynamicFormControlBase<any>
    {
        return new LinkedEntriesControl(
            {
                label: item.key,
                allowMultiple : false,
                allowMultipleEntries : item.allowMultiple,
                key: item.name
            }
        );
    }

    private _createTextbox(item : MetadataItem) : DynamicFormControlBase<any>
    {
        return new TextboxControl(
            {
                label: item.key,
                allowMultiple : item.allowMultiple,
                key: item.name
            }
        );
    }

    private _createSection(item : MetadataItem) : DynamicFormControlBase<any>
    {
        return new DynamicSectionControl(
            {
                label : item.key,
                allowMultiple : item.allowMultiple,
                key: item.name,
                children: this._extractChildren(item.children)
            }
        );
    }

    private _createList(item : MetadataItem) : DynamicFormControlBase<any>
    {
        return new ListControl(
            {
                values : item.optionalValues,
                allowMultiple : false,
                label: item.label,
                key: item.name
            }
        );
    }

    private _createDropdown(item : MetadataItem) : DynamicFormControlBase<any>
    {
        return new DynamicDropdownControl(
            {
                values : item.optionalValues,
                allowMultiple : false,
                label: item.key,
                key: item.name
            }
        );
    }

    private _createDatePicker(item : MetadataItem) : DynamicFormControlBase<any>
    {
        return new DatePickerControl(
            {
                label: item.key,
                allowMultiple : item.allowMultiple,
                key: item.name,
                showTime : item.isTimeControl
            }
        );
    }
}