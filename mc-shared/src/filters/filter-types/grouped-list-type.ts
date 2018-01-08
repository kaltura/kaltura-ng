import { TypeAdapterBase } from './type-adapter-base';
import { FiltersUtils } from '../filters-utils';

export interface GroupedListItem {
    value: string;
    label: string;
    tooltip?: string;
}

export interface GroupedListType
{
    [id: string]: GroupedListItem[]
}

export class GroupedListAdapter extends TypeAdapterBase<GroupedListType> {

    hasChanges(currentValue: GroupedListType, previousValue: GroupedListType): boolean {
        const isCurrentValueNull = currentValue === null || typeof currentValue === 'undefined';
        const isPreviousValueNull = previousValue === null || typeof previousValue === 'undefined';

        if (isCurrentValueNull && isPreviousValueNull) {
            return false;
        } else if (FiltersUtils.hasChanges(currentValue, previousValue)) {
            return true;
        } else {
            Object.keys(currentValue).forEach(listName => {
                const currentValueMap = FiltersUtils.toMap(currentValue[listName], 'value');
                const previousValueMap = FiltersUtils.toMap(previousValue[listName], 'value');
                if (FiltersUtils.hasChanges(currentValueMap, previousValueMap)) {
                    return true;
                }
            })
        }

        return false;
    }
}
