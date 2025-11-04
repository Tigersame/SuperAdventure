import { Item } from './Item';

export class LootItem {
  details: Item;
  dropPercentage: number;
  isDefaultItem: boolean;

  constructor(details: Item, dropPercentage: number, isDefaultItem: boolean) {
    this.details = details;
    this.dropPercentage = dropPercentage;
    this.isDefaultItem = isDefaultItem;
  }
}

