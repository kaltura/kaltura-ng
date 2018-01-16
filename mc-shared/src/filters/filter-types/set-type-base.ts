import { TypeAdapterBase } from './type-adapter-base';

export abstract class SetTypeAdapterBase<T,G extends Set<T>> extends TypeAdapterBase<G> {

    hasChanges(currentValue: Set<T>, previousValue: Set<T>): boolean {
        if (!currentValue && !previousValue) {
            return false;
        } else if ((currentValue && !previousValue) || (previousValue && !currentValue)) {
            return true;
        } else if (currentValue.size !== previousValue.size) {
            return true;
        } else {

            let result = true;
            for (let value of Array.from(currentValue)) {
                if (!previousValue.has(value)) {
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