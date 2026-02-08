interface SortOption<T> {
  id: string;
  fnc: (a: T, b: T) => number;
}

interface FilterOption<T> {
  id: string;
  fnc: (item: T) => boolean;
}

export interface FilterAndSortState<T> {
  sort: SortOption<T> | null;
  filters: Record<string, FilterOption<T>>;
}

export type FilterAndSortAction<T> =
  | { type: "SET SORT"; payload: SortOption<T> }
  | { type: "ADD FILTER"; payload: FilterOption<T> }
  | { type: "REMOVE FILTER"; payload: { id: string } };

/**
 * Manages filters and sorting functions. To set/add a sorting/filtering function (respectively), set the payload to an object with an `id` and a `func`. For sorting, `func` should take two objects and return a number. For filtering, `func` should take one object and return a boolean.
 * @param state an object with at least: a key `filters` pointing to an array of filters, and a key `sort` pointing to an object and
 * @param action containing the `type` (a string) and a `payload`. The payload should always have an `id`. If adding/setting a filter/sort function (respectively), it should also contain a `func`.
 * @returns the new state containing `sort` object (or null if none), and a `filters` array containing filter objects.
 */
const filterAndSortReducer = <T extends unknown>(
  state: FilterAndSortState<T>,
  action: FilterAndSortAction<T>
): FilterAndSortState<T> => {
  const { payload, type } = action;

  let newState: FilterAndSortState<T> = {
    sort: state.sort,
    filters: {
      ...state.filters,
    },
  };

  switch (type) {
    case "SET SORT":
      // there can only be one sort function
      newState.sort = payload;
      break;
    case "ADD FILTER":
      newState.filters[payload.id] = payload;
      break;
    case "REMOVE FILTER":
      // identify the filter to be removed (by its id),
      // remove it from the filters list
      if (!payload.id) {
        console.log("filterAndSort reducer tried to remove a filter with no id");
      }
      delete newState.filters[payload.id];
      break;
    default:
      console.log("filterAndSortReducer was called without a valid action type");
      break;
  }
  return newState;
};

export default filterAndSortReducer;
