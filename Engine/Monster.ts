import { LivingCreature } from './LivingCreature';
import { LootItem } from './LootItem';
import { InventoryItem } from './InventoryItem';
import { RandomNumberGenerator } from './RandomNumberGenerator';
import { World } from './World';

export class Monster extends LivingCreature {
  id: number;
  name: string;
  maximumDamage: number;
  rewardExperiencePoints: number;
  rewardGold: number;
  lootTable: LootItem[];
  lootItems: InventoryItem[];

  constructor(
    id: number,
    name: string,
    maximumDamage: number,
    rewardExperiencePoints: number,
    rewardGold: number,
    currentHitPoints: number,
    maximumHitPoints: number
  ) {
    super(currentHitPoints, maximumHitPoints);
    this.id = id;
    this.name = name;
    this.maximumDamage = maximumDamage;
    this.rewardExperiencePoints = rewardExperiencePoints;
    this.rewardGold = rewardGold;
    this.lootTable = [];
    this.lootItems = [];
  }

  newInstanceOfMonster(): Monster {
    const newMonster = new Monster(
      this.id,
      this.name,
      this.maximumDamage,
      this.rewardExperiencePoints,
      this.rewardGold,
      this.currentHitPoints,
      this.maximumHitPoints
    );

    // Add items to the lootedItems list, comparing a random number to the drop percentage
    for (const lootItem of this.lootTable) {
      if (RandomNumberGenerator.numberBetween(1, 100) <= lootItem.dropPercentage) {
        newMonster.lootItems.push(new InventoryItem(lootItem.details, 1));
      }
    }

    // If no items were randomly selected, add the default loot item(s).
    if (newMonster.lootItems.length === 0) {
      for (const lootItem of this.lootTable) {
        if (lootItem.isDefaultItem) {
          newMonster.lootItems.push(new InventoryItem(lootItem.details, 1));
        }
      }
    }

    return newMonster;
  }
}

