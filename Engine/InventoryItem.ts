import { Item } from './Item';

export class InventoryItem {
  details: Item;
  quantity: number;

  constructor(details: Item, quantity: number = 1) {
    this.details = details;
    this.quantity = quantity;
  }

  get description(): string {
    return this.quantity === 1 ? this.details.name : this.details.namePlural;
  }

  get price(): number {
    return this.details.price;
  }
}

