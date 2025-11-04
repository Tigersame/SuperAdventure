import { Item } from './Item';

export class QuestCompletionItem {
  details: Item;
  quantity: number;

  constructor(details: Item, quantity: number) {
    this.details = details;
    this.quantity = quantity;
  }
}

