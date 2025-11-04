import { Item } from './Item';
import { Quest } from './Quest';
import { Vendor } from './Vendor';
import { Monster } from './Monster';
import { RandomNumberGenerator } from './RandomNumberGenerator';
import { World } from './World';

export class Location {
  id: number;
  name: string;
  description: string;
  itemRequiredToEnter: Item | null;
  questAvailableHere: Quest | null;
  vendorWorkingHere: Vendor | null;
  locationToNorth: Location | null;
  locationToEast: Location | null;
  locationToSouth: Location | null;
  locationToWest: Location | null;
  private monstersAtLocation: Map<number, number>;

  constructor(
    id: number,
    name: string,
    description: string,
    itemRequiredToEnter: Item | null = null,
    questAvailableHere: Quest | null = null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.itemRequiredToEnter = itemRequiredToEnter;
    this.questAvailableHere = questAvailableHere;
    this.vendorWorkingHere = null;
    this.locationToNorth = null;
    this.locationToEast = null;
    this.locationToSouth = null;
    this.locationToWest = null;
    this.monstersAtLocation = new Map();
  }

  get hasAMonster(): boolean {
    return this.monstersAtLocation.size > 0;
  }

  get hasAQuest(): boolean {
    return this.questAvailableHere !== null;
  }

  get doesNotHaveAnItemRequiredToEnter(): boolean {
    return this.itemRequiredToEnter === null;
  }

  addMonster(monsterId: number, percentageOfAppearance: number): void {
    this.monstersAtLocation.set(monsterId, percentageOfAppearance);
  }

  newInstanceOfMonsterLivingHere(): Monster | null {
    if (!this.hasAMonster) {
      return null;
    }

    // Total the percentages of all monsters at this location.
    let totalPercentages = 0;
    for (const percentage of this.monstersAtLocation.values()) {
      totalPercentages += percentage;
    }

    // Select a random number between 1 and the total
    const randomNumber = RandomNumberGenerator.numberBetween(1, totalPercentages);

    // Loop through the monster list
    let runningTotal = 0;
    for (const [monsterId, percentage] of this.monstersAtLocation) {
      runningTotal += percentage;

      if (randomNumber <= runningTotal) {
        const monster = World.monsterByID(monsterId);
        return monster ? monster.newInstanceOfMonster() : null;
      }
    }

    // In case there was a problem, return the last monster in the list
    const lastMonsterId = Array.from(this.monstersAtLocation.keys())[
      this.monstersAtLocation.size - 1
    ];
    const lastMonster = World.monsterByID(lastMonsterId);
    return lastMonster ? lastMonster.newInstanceOfMonster() : null;
  }
}

