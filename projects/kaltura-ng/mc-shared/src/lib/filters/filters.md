

## Add filters to existing data service
1. create an interface that represent the filters model.
    - **You should avoid having nested objects.** this interface should represet a flat object where the property name is the filter name and the value is taken from a list of supported types that can be found in sub folder `filter-types`.
```
export interface EntriesFilters {
    freetext: string,
    pageSize: number,
    pageIndex: number,
    createdAt: DatesRangeType,
    mediaTypes: ListType,
    customMetadata: GroupedListType
}
```
2. extend your data service with `FiltersStoreBase<T>`.
    - replace `EntriesFilters` with your actual interface name.
```
@Injectable()
export class EntriesStore extends FiltersStoreBase<EntriesFilters> implements OnDestroy {
}
```
3. implement an abstract function that returns a default filters value.
    - replace `EntriesFilters` with your actual interface name.
```
protected _createDefaultFiltersValue(): EntriesFilters {
    return {
        freetext: '',
        pageSize: 50,
        pageIndex: 0,
        createdAt: {fromDate: null, toDate: null},
        mediaTypes: [],
        customMetadata: {}
    };
}
```

4. implement an abstract function that returns a mapping between each filter to a matching type adapter.
    - replace `EntriesFilters` with your actual interface name.
    - a list of supported types can be found in sub folder `filter-types`.

```
protected abstract _getTypeAdaptersMapping(): TypeAdaptersMapping<EntriesFilters>
{
    return {
            freetext: new StringTypeAdapter(),
            pageSize: new NumberTypeAdapter(),
            pageIndex: new NumberTypeAdapter(),
            createdAt: new DatesRangeAdapter(),
            mediaTypes: new ListAdapter(),
            customMetadata: new GroupedListAdapter()
    };
}
```

### React to filter changes (both in components and in services)
1. add method `private _prepare(): void` and call it from the constructor.
    - if you need to fetch data as a preparation, add it in this method.
    - don't forget to handle failures if needed. you can then run this function again if the user tries to recover.
2. for components that contains filter controls:
3. add method `private _registerToFilterStoreDataChanges(): void`. call it from `_prepare()` method.
   - register to the service `filtersChange$` property hand react to filter changes.


## Update service filters from UI

