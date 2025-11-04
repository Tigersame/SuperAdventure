import { Item } from './Item';

export class Weapon extends Item {
  minimumDamage: number;
  maximumDamage: number;

  constructor(
    id: number,
    name: string,
    namePlural: string,
    price: number,
    minimumDamage: number,
    maximumDamage: number
  ) {
    super(id, name, namePlural, price);
    this.minimumDamage = minimumDamage;
    this.maximumDamage = maximumDamage;
  }
}

