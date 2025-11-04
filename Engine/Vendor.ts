import { InventoryItem } from './InventoryItem';
import { Item } from './Item';

export class Vendor {
  name: string;
  inventory: InventoryItem[];

  constructor(name: string) {
    this.name = name;
    this.inventory = [];
  }

  addItemToInventory(item: Item, quantity: number = 1): void {
    const existingItem = this.inventory.find(
      (ii) => ii.details.id === item.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.inventory.push(new InventoryItem(item, quantity));
    }
  }
}

