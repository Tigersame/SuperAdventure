export class Item {
  id: number;
  name: string;
  namePlural: string;
  price: number;

  constructor(id: number, name: string, namePlural: string, price: number) {
    this.id = id;
    this.name = name;
    this.namePlural = namePlural;
    this.price = price;
  }
}

