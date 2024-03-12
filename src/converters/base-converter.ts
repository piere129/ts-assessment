import { ConvertedItem } from '../types/output';

export abstract class BaseConverter<X> {
  protected sortItems<T extends ConvertedItem<X>>(items: T[], sortFunc: (itemA: T, itemB: T) => number): T[] {
    items.sort(sortFunc);
    items.forEach((item: T) => {
      if (item.children.length > 0) {
        this.sortItems(item.children as T[], sortFunc);
      }
    });
    return items;
  }
}
