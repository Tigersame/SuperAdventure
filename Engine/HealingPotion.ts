import { Item } from './Item';

export class HealingPotion extends Item {
  amountToHeal: number;

  constructor(
    id: number,
    name: string,
    namePlural: string,
    price: number,
    amountToHeal: number
  ) {
    super(id, name, namePlural, price);
    this.amountToHeal = amountToHeal;
  }
}

