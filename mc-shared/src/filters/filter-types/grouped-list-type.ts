import { TypeAdapterBase } from './type-adapter-base';
import { FiltersUtils } from '../filters-utils';

export interface GroupedListType<T>
{
    [id: string]: T[]
}


export class GroupedListAdapter<T> extends TypeAdapterBase<GroupedListType<T>> {

    hasChanges(currentValue: GroupedListType<T>, previousValue: GroupedListType<T>): boolean {
        const isCurrentValueNull = currentValue === null || typeof currentValue === 'undefined';
        const isPreviousValueNull = previousValue === null || typeof previousValue === 'undefined';

        if (isCurrentValueNull && isPreviousValueNull) {
            return false;
        } else if (FiltersUtils.hasChanges(currentValue, previousValue)) {
            return true;
        } else {
            Object.keys(currentValue).forEach(listName => {
                const currentValueMap = FiltersUtils.toMap(currentValue[listName]);
                const previousValueMap = FiltersUtils.toMap(previousValue[listName]);
                if (FiltersUtils.hasChanges(currentValueMap, previousValueMap)) {
                    return true;
                }
            })
        }

        return false;
    }
}
