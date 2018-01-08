import { TypeAdapterBase } from './type-adapter-base';
import { FiltersUtils } from '../filters-utils';

export interface ListItem {
    value: string;
    label: string;
    tooltip?: string;
}

export type ListType = ListItem[];


export class ListAdapter extends TypeAdapterBase<ListType> {

    hasChanges(currentValue: ListType, previousValue: ListType): boolean {

        const currentValueMap = FiltersUtils.toMap(currentValue, 'value');
        const previousValueMap = FiltersUtils.toMap(previousValue, 'value');
        return FiltersUtils.hasChanges(currentValueMap, previousValueMap);
    }
}
