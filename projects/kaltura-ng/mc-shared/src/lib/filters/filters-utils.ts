


export class FiltersUtils {
    static toMap<T, K extends keyof T>(value: T[], keyPropertyName?: K): { [key: string]: T } {
        const result:  { [key: string]: T } = {};
        if (value) {
            if (keyPropertyName) {
                for (let i = 0; i < value.length; i++) {
                    result[(<any>value[i][keyPropertyName])] = value[i];
                }
            }else {
                value.forEach(item =>
                {
                    if (typeof item === 'string' || typeof item === 'number') {
                        result[String(item)] = item;
                    }else {
                        throw new Error('array should include items of type string/number only if no property name provided');
                    }
                });
            }
        }
        return result;
    }

    static getDiff<TSource, TCompareTo>(source: { [key: string]: TSource }, compareTo: { [key: string]: TCompareTo }): { added: TCompareTo[], deleted: TSource[] } {
        const delta = {
            added: [],
            deleted: []
        };

        Object.keys(source).forEach(propertyName => {
            if (!compareTo.hasOwnProperty(propertyName)) {
                delta.deleted.push(source[propertyName]);
            }
        });

        Object.keys(compareTo).forEach(propertyName => {
            if (!source.hasOwnProperty(propertyName)) {
                delta.added.push(compareTo[propertyName]);
            }
        });

        return delta;
    }

    static hasChanges(source: { [key: string]: any }, compareTo: { [key: string]: any }): boolean {
        const isSourceNull = source === null || typeof source === 'undefined';
        const isCompareToNull = compareTo === null || typeof compareTo === 'undefined';

        if (source instanceof Array || compareTo instanceof Array)
        {
            throw new Error('cannot compare items. one of them or both of them is of type Array');
        } else if ((isSourceNull && !isCompareToNull) || (!isSourceNull && isCompareToNull)) {
            return true;
        } else if (!isSourceNull  && !isCompareToNull) {
            for(const propertyName in source)
            {
                if (source.hasOwnProperty(propertyName))
                {
                    if (!compareTo.hasOwnProperty(propertyName) || source[propertyName] !== compareTo[propertyName]) {
                        return true;
                    }
                }
            }

            for(const propertyName in compareTo)
            {
                if (compareTo.hasOwnProperty(propertyName))
                {
                    if (!source.hasOwnProperty(propertyName)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
