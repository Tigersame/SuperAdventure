import { LivingCreature } from './LivingCreature';
import { Location } from './Location';
import { Weapon } from './Weapon';
import { InventoryItem } from './InventoryItem';
import { HealingPotion } from './HealingPotion';
import { PlayerQuest } from './PlayerQuest';
import { Monster } from './Monster';
import { Quest } from './Quest';
import { Item } from './Item';
import { World } from './World';
import { RandomNumberGenerator } from './RandomNumberGenerator';

export type MessageCallback = (message: string, addExtraNewLine?: boolean) => void;

export class Player extends LivingCreature {
  private _gold: number = 0;
  private _experiencePoints: number = 0;
  private _currentLocation: Location | null = null;
  private currentMonster: Monster | null = null;

  onMessage: MessageCallback | null = null;

  constructor(
    currentHitPoints: number,
    maximumHitPoints: number,
    gold: number,
    experiencePoints: number
  ) {
    super(currentHitPoints, maximumHitPoints);
    this._gold = gold;
    this._experiencePoints = experiencePoints;
    this.inventory = [];
    this.quests = [];
    this.locationsVisited = [];
  }

  get gold(): number {
    return this._gold;
  }

  set gold(value: number) {
    this._gold = value;
  }

  get experiencePoints(): number {
    return this._experiencePoints;
  }

  private set experiencePoints(value: number) {
    this._experiencePoints = value;
  }

  get level(): number {
    return Math.floor(this.experiencePoints / 100) + 1;
  }

  get currentLocation(): Location | null {
    return this._currentLocation;
  }

  set currentLocation(value: Location | null) {
    this._currentLocation = value;
  }

  currentWeapon: Weapon | null = null;
  inventory: InventoryItem[] = [];
  quests: PlayerQuest[] = [];
  locationsVisited: number[] = [];

  get weapons(): Weapon[] {
    return this.inventory
      .filter((x) => x.details instanceof Weapon)
      .map((x) => x.details as Weapon);
  }

  get potions(): HealingPotion[] {
    return this.inventory
      .filter((x) => x.details instanceof HealingPotion)
      .map((x) => x.details as HealingPotion);
  }

  static createDefaultPlayer(): Player {
    const player = new Player(10, 10, 20, 0);
    player.inventory.push(new InventoryItem(World.itemByID(World.ITEM_ID_RUSTY_SWORD)!, 1));
    player.currentLocation = World.locationByID(World.LOCATION_ID_HOME);
    return player;
  }

  moveTo(location: Location): void {
    if (this.playerDoesNotHaveTheRequiredItemToEnter(location)) {
      this.raiseMessage(
        `You must have a ${location.itemRequiredToEnter!.name} to enter this location.`
      );
      return;
    }

    // The player can enter this location
    this.currentLocation = location;

    if (!this.locationsVisited.includes(this.currentLocation.id)) {
      this.locationsVisited.push(this.currentLocation.id);
    }

    this.completelyHeal();

    if (location.hasAQuest) {
      if (this.playerDoesNotHaveThisQuest(location.questAvailableHere!)) {
        this.giveQuestToPlayer(location.questAvailableHere!);
      } else {
        if (
          !this.playerHasNotCompleted(location.questAvailableHere!) &&
          this.playerHasAllQuestCompletionItemsFor(location.questAvailableHere!)
        ) {
          this.givePlayerQuestRewards(location.questAvailableHere!);
        }
      }
    }

    this.setTheCurrentMonsterForTheCurrentLocation(location);
  }

  moveNorth(): void {
    if (this.currentLocation?.locationToNorth) {
      this.moveTo(this.currentLocation.locationToNorth);
    }
  }

  moveEast(): void {
    if (this.currentLocation?.locationToEast) {
      this.moveTo(this.currentLocation.locationToEast);
    }
  }

  moveSouth(): void {
    if (this.currentLocation?.locationToSouth) {
      this.moveTo(this.currentLocation.locationToSouth);
    }
  }

  moveWest(): void {
    if (this.currentLocation?.locationToWest) {
      this.moveTo(this.currentLocation.locationToWest);
    }
  }

  useWeapon(weapon: Weapon): void {
    if (!this.currentMonster) return;

    const damage = RandomNumberGenerator.numberBetween(weapon.minimumDamage, weapon.maximumDamage);

    if (damage === 0) {
      this.raiseMessage(`You missed the ${this.currentMonster.name}`);
    } else {
      this.currentMonster.currentHitPoints -= damage;
      this.raiseMessage(`You hit the ${this.currentMonster.name} for ${damage} points.`);
    }

    if (this.currentMonster.isDead) {
      this.lootTheCurrentMonster();

      // "Move" to the current location, to refresh the current monster
      if (this.currentLocation) {
        this.moveTo(this.currentLocation);
      }
    } else {
      this.letTheMonsterAttack();
    }
  }

  private lootTheCurrentMonster(): void {
    if (!this.currentMonster) return;

    this.raiseMessage('');
    this.raiseMessage(`You defeated the ${this.currentMonster.name}`);
    this.raiseMessage(`You receive ${this.currentMonster.rewardExperiencePoints} experience points`);
    this.raiseMessage(`You receive ${this.currentMonster.rewardGold} gold`);

    this.addExperiencePoints(this.currentMonster.rewardExperiencePoints);
    this._gold += this.currentMonster.rewardGold;

    // Give monster's loot items to the player
    for (const inventoryItem of this.currentMonster.lootItems) {
      this.addItemToInventory(inventoryItem.details);

      this.raiseMessage(`You loot ${inventoryItem.quantity} ${inventoryItem.description}`);
    }

    this.raiseMessage('');
  }

  usePotion(potion: HealingPotion): void {
    this.raiseMessage(`You drink a ${potion.name}`);

    this.healPlayer(potion.amountToHeal);

    this.removeItemFromInventory(potion);

    // The player used their turn to drink the potion, so let the monster attack now
    this.letTheMonsterAttack();
  }

  addItemToInventory(itemToAdd: Item, quantity: number = 1): void {
    const existingItemInInventory = this.inventory.find((ii) => ii.details.id === itemToAdd.id);

    if (!existingItemInInventory) {
      this.inventory.push(new InventoryItem(itemToAdd, quantity));
    } else {
      existingItemInInventory.quantity += quantity;
    }
  }

  removeItemFromInventory(itemToRemove: Item, quantity: number = 1): void {
    const item = this.inventory.find(
      (ii) => ii.details.id === itemToRemove.id && ii.quantity >= quantity
    );

    if (item) {
      item.quantity -= quantity;

      if (item.quantity === 0) {
        const index = this.inventory.indexOf(item);
        this.inventory.splice(index, 1);
      }
    }
  }

  private hasRequiredItemToEnterThisLocation(location: Location): boolean {
    if (location.doesNotHaveAnItemRequiredToEnter) {
      return true;
    }

    // See if the player has the required item in their inventory
    return this.inventory.some((ii) => ii.details.id === location.itemRequiredToEnter!.id);
  }

  private setTheCurrentMonsterForTheCurrentLocation(location: Location): void {
    // Populate the current monster with this location's monster (or null, if there is no monster here)
    this.currentMonster = location.newInstanceOfMonsterLivingHere();

    if (this.currentMonster) {
      this.raiseMessage(`You see a ${this.currentMonster.name}`);
    }
  }

  private playerDoesNotHaveTheRequiredItemToEnter(location: Location): boolean {
    return !this.hasRequiredItemToEnterThisLocation(location);
  }

  private playerDoesNotHaveThisQuest(quest: Quest): boolean {
    return !this.quests.some((pq) => pq.details.id === quest.id);
  }

  private playerHasNotCompleted(quest: Quest): boolean {
    return this.quests.some((pq) => pq.details.id === quest.id && !pq.isCompleted);
  }

  private giveQuestToPlayer(quest: Quest): void {
    this.raiseMessage(`You receive the ${quest.name} quest.`);
    this.raiseMessage(quest.description);
    this.raiseMessage('To complete it, return with:');

    for (const qci of quest.questCompletionItems) {
      this.raiseMessage(
        `${qci.quantity} ${qci.quantity === 1 ? qci.details.name : qci.details.namePlural}`
      );
    }

    this.raiseMessage('');

    this.quests.push(new PlayerQuest(quest));
  }

  private playerHasAllQuestCompletionItemsFor(quest: Quest): boolean {
    // See if the player has all the items needed to complete the quest here
    for (const qci of quest.questCompletionItems) {
      // Check each item in the player's inventory, to see if they have it, and enough of it
      if (!this.inventory.some((ii) => ii.details.id === qci.details.id && ii.quantity >= qci.quantity)) {
        return false;
      }
    }

    // If we got here, then the player must have all the required items, and enough of them, to complete the quest.
    return true;
  }

  private removeQuestCompletionItems(quest: Quest): void {
    for (const qci of quest.questCompletionItems) {
      const item = this.inventory.find((ii) => ii.details.id === qci.details.id);

      if (item) {
        this.removeItemFromInventory(item.details, qci.quantity);
      }
    }
  }

  private addExperiencePoints(experiencePointsToAdd: number): void {
    this._experiencePoints += experiencePointsToAdd;
    this.maximumHitPoints = this.level * 10;
  }

  private givePlayerQuestRewards(quest: Quest): void {
    this.raiseMessage('');
    this.raiseMessage(`You complete the '${quest.name}' quest.`);
    this.raiseMessage('You receive: ');
    this.raiseMessage(`${quest.rewardExperiencePoints} experience points`);
    this.raiseMessage(`${quest.rewardGold} gold`);
    if (quest.rewardItem) {
      this.raiseMessage(quest.rewardItem.name, true);
    }

    this.addExperiencePoints(quest.rewardExperiencePoints);
    this._gold += quest.rewardGold;

    this.removeQuestCompletionItems(quest);
    if (quest.rewardItem) {
      this.addItemToInventory(quest.rewardItem);
    }

    this.markPlayerQuestCompleted(quest);
  }

  private markPlayerQuestCompleted(quest: Quest): void {
    const playerQuest = this.quests.find((pq) => pq.details.id === quest.id);

    if (playerQuest) {
      playerQuest.isCompleted = true;
    }
  }

  private letTheMonsterAttack(): void {
    if (!this.currentMonster) return;

    const damageToPlayer = RandomNumberGenerator.numberBetween(0, this.currentMonster.maximumDamage);

    this.raiseMessage(`The ${this.currentMonster.name} did ${damageToPlayer} points of damage.`);

    this.currentHitPoints -= damageToPlayer;

    if (this.isDead) {
      this.raiseMessage(`The ${this.currentMonster.name} killed you.`);

      this.moveHome();
    }
  }

  private healPlayer(hitPointsToHeal: number): void {
    this.currentHitPoints = Math.min(this.currentHitPoints + hitPointsToHeal, this.maximumHitPoints);
  }

  private completelyHeal(): void {
    this.currentHitPoints = this.maximumHitPoints;
  }

  private moveHome(): void {
    const home = World.locationByID(World.LOCATION_ID_HOME);
    if (home) {
      this.moveTo(home);
    }
  }

  private raiseMessage(message: string, addExtraNewLine: boolean = false): void {
    if (this.onMessage) {
      this.onMessage(message, addExtraNewLine);
    }
  }

  get currentMonsterForDisplay(): Monster | null {
    return this.currentMonster;
  }
}

