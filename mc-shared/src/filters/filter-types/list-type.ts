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

export class NewListTypeAdapter<T> extends TypeAdapterBase<T[]> {

    hasChanges(currentValue: T[], previousValue: T[]): boolean {

        if (!currentValue && !previousValue) {
            return false;
        } else if ((currentValue && !previousValue) || (previousValue && !currentValue)) {
            return true;
        } else if (currentValue.length !== previousValue.length) {
            return true;
        } else {

            let result = true;
            for (let value of currentValue) {

                // using indexOf for now as we don't expect big arrays.
                // if a performance hit will happen then we should map
                // to hashmaps first and use them for comparison.

                if (previousValue.indexOf(value) === -1) {
                    result = false;
                    break;
                }
            }
            return result;
        }
    }

    get isValueImmutable(): boolean
    {
        return false;
    }
}