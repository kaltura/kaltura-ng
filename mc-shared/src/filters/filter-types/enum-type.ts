import { TypeAdapterBase } from './type-adapter-base';

export class EnumTypeAdapter<T> extends TypeAdapterBase<T> {

    hasChanges(currentValue: T, previousValue: T): boolean {
        return previousValue !== currentValue;
    }

    get isValueImmutable(): boolean
    {
        return true;
    }
}