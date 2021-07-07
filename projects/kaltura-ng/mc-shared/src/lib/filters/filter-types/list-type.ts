import { TypeAdapterBase } from './type-adapter-base';
import { FiltersUtils } from '../filters-utils';

export class ListTypeAdapter<T> extends TypeAdapterBase<T[]> {

    hasChanges(currentValue: T[], previousValue: T[]): boolean {

        if (!currentValue && !previousValue) {
            return false;
        } else if ((currentValue && !previousValue) || (previousValue && !currentValue)) {
            return true;
        } else if (currentValue.length !== previousValue.length) {
            return true;
        } else {

            let result = false;
            for (let value of currentValue) {

                // using indexOf for now as we don't expect big arrays.
                // if a performance hit will happen then we should map
                // to hashmaps first and use them for comparison.

                if (previousValue.indexOf(value) === -1) {
                    result = true;
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
