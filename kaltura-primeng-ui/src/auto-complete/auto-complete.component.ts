import { Component, AfterViewInit, forwardRef, ChangeDetectorRef, AfterViewChecked, Input, ElementRef, OnDestroy, Renderer2, IterableDiffers } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { AutoComplete as PrimeAutoComplete, AUTOCOMPLETE_VALUE_ACCESSOR } from "primeng/components/autocomplete/autocomplete";
import { DomHandler } from "primeng/components/dom/domhandler";
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

// [kmcng] upon upgrade: Be patient and bring a big cup of coffee.... good luck!

export interface SuggestionsProviderData{
    suggestions : any[];
    isLoading : boolean;
    errorMessage? : string;
}

/* tslint:disable */
export const KALTURA_AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoComplete),
    multi: true
};

/* tslint:enable */

@Component({
    selector: 'kAutoComplete',

    /* tslint:disable */
    // [kmcng] upon upgrade: sync with original component
    styleUrls: [ './auto-complete.component.scss' ],
    templateUrl: './auto-complete.component.html',
    providers: [DomHandler,ObjectUtils,KALTURA_AUTOCOMPLETE_VALUE_ACCESSOR],
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    },
    /* tslint:enable */
})
// [kmcng] upon upgrade: compare implemented interfaces in the original component (no need to include ControlValueAccessor)
export class AutoComplete extends PrimeAutoComplete implements OnDestroy, AfterViewInit, AfterViewChecked  {

    private _suggestionsProvider$ : ISubscription = null;
    private _loading = false;
    private _showNoItems = false;
    private _errorMessage = '';
    private _allowMultiple = false;

    @Input()
    onItemAdding : (value : any) => any;

    @Input()
    limitToSuggestions : boolean = true;

    @Input()
    suggestionSelectableField : string = '';

    @Input()
    suggestionItemField : string = '';

    @Input()
    suggestionLabelField : string = '';
    
    @Input()
    lowerCase = true;

    get multiple() : boolean
    {
        // always return true to affect component ui of selected item.
        // internally you should use _allowMultiple
        return true;
    }

    @Input() get suggestions(): any[] {
        return this._suggestions;
    }

    set suggestions(val:any[]) {
        this._suggestions = val;

        if(this.panelEL && this.panelEL.nativeElement) {

            // primeng fix: primeng uses function to show 'noResults' message if exists or hide the suggested otherwise.
            // we removed this logic since it conflict with our improved logic
            if(this._suggestions && this._suggestions.length) {

                this.show();
                this.suggestionsUpdated = true;

                if(this.autoHighlight) {
                    this.highlightOption = this._suggestions[0];
                }
            }
        }
    }

    @Input() set multiple(value : boolean)
    {
        this._allowMultiple = value;
    }

    @Input()
    set suggestionsProvider(provider$ : Observable<SuggestionsProviderData>)
    {
        if (this._suggestionsProvider$)
        {
            this._suggestionsProvider$.unsubscribe();
            this._suggestionsProvider$ = null;
        }

        if (provider$)
        {
            this._suggestionsProvider$ = provider$.subscribe(
                data => {

                    const valueLengthValid = this.input && this.input.value && this.input.value.length >= this.minLength;
                    if (!valueLengthValid) {
                        // primeng fix: if user use backspace to delete search text, should abort the last query.
                        return;
                    }

                    if (data.isLoading)
                    {
                        this._loading = true;
                        this._showNoItems = false;
                        this.suggestions = [];
                        this._errorMessage = '';

                        this.suggestionsUpdated = true; // make sure the suggestions panel is aligned to the height of the component
                        this.show();
                    }else
                    {
                        if (data.suggestions && data.suggestions.length)
                        {
                            this._loading = false;
                            this.suggestions = data.suggestions;
                        }else
                        {
                            this.suggestions = [];

                            if (this._loading = true) {
                                this._showNoItems = !data.errorMessage; // show no items notification only if result is valid
                                this._loading = false;
                                this.suggestionsUpdated = true; // make sure the suggestions panel is aligned to the height of the component
                                this.show();
                            }

                            if (data.errorMessage)
                            {
                                this._errorMessage = data.errorMessage;
                                this.suggestionsUpdated = true; // make sure the suggestions panel is aligned to the height of the component
                                this.show();
                            }


                        }
                    }
                }
            );
        }
    }

     public getValue() : any {
         if (this._allowMultiple) {
             if (this.value instanceof Array) {
                 return this.value;
             } else {
                 return this.value ? [this.value] : [];
             }
         } else {
             if (this.value instanceof Array) {
                 return this.value.length > 0 ? this.value[0] : null;
             } else {
                 return this.value;
             }
         }
     }

     public clearValue() : void{
        this.value = null;
        this._clearInputValue()
     }

     public get searchText() : string
     {
        return this.input ? this.input.value : null;
     }

     private get input() : HTMLInputElement
     {
         // [kmcng] we override multi mode to always be multiple so the input should always huse the multiInputEl
         return this.multiInputEL.nativeElement;
     }

    /**
     *
     * @param item
     * @returns {any|boolean}
     * @private
     */
    private _isItemSelected(item : any) : boolean
    {
        if (this.multiple) {
            return this.value && this.value instanceof Array && this.value.indexOf(item) !== -1;
        }else {
            return this.value && this.value === item;
        }
    }

    /**
     * add value provided by user if the following conditions are confirmed:
     * - input component is in focus and its' content length is valid.
     * - no suggestion is currently highlighted
     * @returns { {status} } status 'added' if valid value, 'invalid' if cannot add the value or 'not relevant' if the request should be ignored
     * @private
     */
    private _addValueFromInput() : { status : 'added' | 'invalid' | 'not relevant'}
    {
        let rawInputValue = this.searchText || '';
        
        if (this.lowerCase) {
            rawInputValue = rawInputValue.toLowerCase();
        }
        
        if (!this.limitToSuggestions && rawInputValue && !this.highlightOption && this.focus)
        {
            if ( rawInputValue.length >= 1 && !this._isItemSelected(rawInputValue)) {

                let newValue = this.onItemAdding ? this.onItemAdding.call(null,rawInputValue) : rawInputValue;

                if (newValue) {
                    if (typeof newValue === 'string' && this.field) {
                        console.warn(`The auto-complete component 'field' attribute is set to value '${this.field}' which indicates that the auto-complete value type is an object (did you forget to assign the 'onItemAdding' attribute to convert the user input which is of type type 'string' to a valid value?)`);
                    }

                    super.selectItem(newValue);
                }else {
                    if (typeof newValue === 'undefined' || newValue === null) {
                        console.warn(`the function provided by attribute 'onItemAdding' resulted with null value, abort adding user input to aut-complete value`);
                    }
                }

                this.hide();

                return { status : 'added'};
            }else
            {
                return { status : 'invalid'};
            }


        }else {
            return { status : 'not relevant'};
        }
    }

    onInputBlur(event) {

        this._addValueFromInput();

        if (!this.panelVisible) {
            // primng fix: if the panel is not visible (!panelVisible) and we currently leaving the input field clear input content
            this._clearInputValue();
        }
        super.onInputBlur(event);
    }

    /**
     * Consume the arguments needed to construct 'AutoComplete' and pass them to self (the 'AutoComplete' constructor).
     *
     * This is a workaround since according to NG2 documentation the parent constructor should be called even if
     * this component doesn't need a constructor.
     * @param el
     * @param domHandler
     * @param differs
     * @param renderer
     * @param objectUtils
     */
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2, public objectUtils: ObjectUtils, public cd: ChangeDetectorRef, public differs: IterableDiffers)
    {
        super(el,domHandler, renderer, objectUtils, cd, differs);
    }


    hide()
    {
        if (this.panelVisible)
        {
            this.panelEL.nativeElement.scrollTop = 0; // primeng fix: scroll suggestions list to top (otherwise the scroll will be persist)
            this.highlightOption = null; // primeng fix: the last selection using keyboard is not being cleared when selecting using 'enter'

            // clear user notifications
            this._loading = false;
            this._showNoItems = false;
            this._errorMessage = null;
        }

        if (!this.focus) {
            // primng fix: if user not in the input (!focus) and we currently closing the visible panel - clear input content (relevant only for components whose 'limitToSuggestions' property is set to true
            this._clearInputValue();
        }

        super.hide();
    }

    private _clearInputValue() : void{
        if (this.input && this.input.value) {
            this.input.value = ''; // clear existing value
        }
    }

    public onInput($event) : void{
        if (!this._allowMultiple)
        {
            this.value = null;
        }

        // primng fix: hide panel once the value length is less the minLength, primeng handles only situation where input value length == 0
        if(this.input.value.length < this.minLength) {
            this.hide();
        }

        super.onInput($event);
    }

    onKeydown(event)  {
        let preventKeydown = false;

        if ((event.which === 9 || event.which === 13) && this._addValueFromInput().status !== 'not relevant')
        {
            preventKeydown = true;
        }

        if(!preventKeydown && this.panelVisible) {
            switch (event.which) {
                case 9:  //tab
                    // primeng fix: pressing 'tab' move the focus from the component but doesn't hide the suggestions.
                    this.hide();
                break;
                case 13: //enter
                    // prevent selecting of disabled item using keyboard (the mouse selection is handled separately)
                    const highlightItemDisabled = this.highlightOption && this.suggestionSelectableField ?
                        (typeof this.highlightOption[this.suggestionSelectableField] !== undefined && !this.highlightOption[this.suggestionSelectableField])
                        : false;

                    if (highlightItemDisabled) {
                        preventKeydown = true;
                    }
                    break;
            }
        }

        if (!preventKeydown)
        {
            super.onKeydown(event);
        }else {
            event.preventDefault();
            event.stopPropagation();
        }
    }



    ngOnDestroy()
    {
        if (this._suggestionsProvider$)
        {
            this._suggestionsProvider$.unsubscribe();
            this._suggestionsProvider$ = null;
        }
    }

    onUserSelectItem(event : any, item : any) : void {
        if (!this._canSelectSuggestion(item)) {
            // prevent selection of disabled suggestions.
            event.stopPropagation();
            event.preventDefault();
            this.input.focus(); // move the focus back to the input box otherwise the compmonent will stop working
            return;
        }

        this.selectItem(item);
    }

    public _getSuggestionText(suggestion: any)
    {
        let result = suggestion;
        if (suggestion)
        {
            if (this.suggestionLabelField)
            {
                result = suggestion[this.suggestionLabelField];
            }else if (this.suggestionItemField && this.field)
            {
                result = suggestion[this.suggestionItemField];
                result = result ? result[this.field] : '';
            }else if (this.suggestionItemField)
            {
                result = suggestion[this.suggestionItemField];
            }else if (this.field)
            {
                result = suggestion[this.field];
            }
        }

        return result;
    }

    private _canSelectSuggestion(item : any) : boolean {
        if (this.suggestionSelectableField)
        {
            if (typeof item[this.suggestionSelectableField] !== undefined && !item[this.suggestionSelectableField])
            {
                return false;
            }
        }

        return true;
    }

    selectItem(item : any) {
        this.highlightOption = null; // primeng fix:  the last selected item when using keyboard is not being removed and will be used later to do a random selection

        if (this._canSelectSuggestion(item)) {

            let selectedItemValue = item;
            if (this.suggestionItemField)
            {
                selectedItemValue = item[this.suggestionItemField];
            }

            if (selectedItemValue === null || typeof selectedItemValue === 'undefined') {
                console.warn("[kaltura] -> trying to select a value that is either null or undefined. action ignored"); // keep warning
            }else {
                super.selectItem(selectedItemValue);
            }
        }
    }

    public focusInput() {
        setTimeout(() => {
                if (this.input && this.input.focus && !this.input.disabled) {
                    this.input.focus();
                }
        }, 0);
    }
}
