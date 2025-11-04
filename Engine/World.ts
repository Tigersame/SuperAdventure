import { Item } from './Item';
import { Weapon } from './Weapon';
import { HealingPotion } from './HealingPotion';
import { Monster } from './Monster';
import { Quest } from './Quest';
import { Location } from './Location';
import { Vendor } from './Vendor';
import { LootItem } from './LootItem';
import { QuestCompletionItem } from './QuestCompletionItem';

export class World {
  private static items: Item[] = [];
  private static monsters: Monster[] = [];
  private static quests: Quest[] = [];
  private static locations: Location[] = [];

  public static readonly UNSELLABLE_ITEM_PRICE = -1;

  public static readonly ITEM_ID_RUSTY_SWORD = 1;
  public static readonly ITEM_ID_RAT_TAIL = 2;
  public static readonly ITEM_ID_PIECE_OF_FUR = 3;
  public static readonly ITEM_ID_SNAKE_FANG = 4;
  public static readonly ITEM_ID_SNAKESKIN = 5;
  public static readonly ITEM_ID_CLUB = 6;
  public static readonly ITEM_ID_HEALING_POTION = 7;
  public static readonly ITEM_ID_SPIDER_FANG = 8;
  public static readonly ITEM_ID_SPIDER_SILK = 9;
  public static readonly ITEM_ID_ADVENTURER_PASS = 10;

  public static readonly MONSTER_ID_RAT = 1;
  public static readonly MONSTER_ID_SNAKE = 2;
  public static readonly MONSTER_ID_GIANT_SPIDER = 3;

  public static readonly QUEST_ID_CLEAR_ALCHEMIST_GARDEN = 1;
  public static readonly QUEST_ID_CLEAR_FARMERS_FIELD = 2;

  public static readonly LOCATION_ID_HOME = 1;
  public static readonly LOCATION_ID_TOWN_SQUARE = 2;
  public static readonly LOCATION_ID_GUARD_POST = 3;
  public static readonly LOCATION_ID_ALCHEMIST_HUT = 4;
  public static readonly LOCATION_ID_ALCHEMISTS_GARDEN = 5;
  public static readonly LOCATION_ID_FARMHOUSE = 6;
  public static readonly LOCATION_ID_FARM_FIELD = 7;
  public static readonly LOCATION_ID_BRIDGE = 8;
  public static readonly LOCATION_ID_SPIDER_FIELD = 9;

  static {
    this.populateItems();
    this.populateMonsters();
    this.populateQuests();
    this.populateLocations();
  }

  private static populateItems(): void {
    this.items.push(new Weapon(this.ITEM_ID_RUSTY_SWORD, 'Rusty sword', 'Rusty swords', 0, 5, 5));
    this.items.push(new Item(this.ITEM_ID_RAT_TAIL, 'Rat tail', 'Rat tails', 1));
    this.items.push(new Item(this.ITEM_ID_PIECE_OF_FUR, 'Piece of fur', 'Pieces of fur', 1));
    this.items.push(new Item(this.ITEM_ID_SNAKE_FANG, 'Snake fang', 'Snake fangs', 1));
    this.items.push(new Item(this.ITEM_ID_SNAKESKIN, 'Snakeskin', 'Snakeskins', 2));
    this.items.push(new Weapon(this.ITEM_ID_CLUB, 'Club', 'Clubs', 3, 10, 8));
    this.items.push(new HealingPotion(this.ITEM_ID_HEALING_POTION, 'Healing potion', 'Healing potions', 5, 3));
    this.items.push(new Item(this.ITEM_ID_SPIDER_FANG, 'Spider fang', 'Spider fangs', 1));
    this.items.push(new Item(this.ITEM_ID_SPIDER_SILK, 'Spider silk', 'Spider silks', 1));
    this.items.push(new Item(this.ITEM_ID_ADVENTURER_PASS, 'Adventurer pass', 'Adventurer passes', this.UNSELLABLE_ITEM_PRICE));
  }

  private static populateMonsters(): void {
    const rat = new Monster(this.MONSTER_ID_RAT, 'Rat', 5, 3, 10, 3, 3);
    rat.lootTable.push(new LootItem(this.itemByID(this.ITEM_ID_RAT_TAIL)!, 75, false));
    rat.lootTable.push(new LootItem(this.itemByID(this.ITEM_ID_PIECE_OF_FUR)!, 75, true));

    const snake = new Monster(this.MONSTER_ID_SNAKE, 'Snake', 5, 3, 10, 3, 3);
    snake.lootTable.push(new LootItem(this.itemByID(this.ITEM_ID_SNAKE_FANG)!, 75, false));
    snake.lootTable.push(new LootItem(this.itemByID(this.ITEM_ID_SNAKESKIN)!, 75, true));

    const giantSpider = new Monster(this.MONSTER_ID_GIANT_SPIDER, 'Giant spider', 20, 5, 40, 10, 10);
    giantSpider.lootTable.push(new LootItem(this.itemByID(this.ITEM_ID_SPIDER_FANG)!, 75, true));
    giantSpider.lootTable.push(new LootItem(this.itemByID(this.ITEM_ID_SPIDER_SILK)!, 25, false));

    this.monsters.push(rat);
    this.monsters.push(snake);
    this.monsters.push(giantSpider);
  }

  private static populateQuests(): void {
    const clearAlchemistGarden = new Quest(
      this.QUEST_ID_CLEAR_ALCHEMIST_GARDEN,
      "Clear the alchemist's garden",
      "Kill rats in the alchemist's garden and bring back 3 rat tails. You will receive a healing potion and 10 gold pieces.",
      20,
      10
    );

    clearAlchemistGarden.questCompletionItems.push(
      new QuestCompletionItem(this.itemByID(this.ITEM_ID_RAT_TAIL)!, 3)
    );
    clearAlchemistGarden.rewardItem = this.itemByID(this.ITEM_ID_HEALING_POTION);

    const clearFarmersField = new Quest(
      this.QUEST_ID_CLEAR_FARMERS_FIELD,
      "Clear the farmer's field",
      "Kill snakes in the farmer's field and bring back 3 snake fangs. You will receive an adventurer's pass and 20 gold pieces.",
      20,
      20
    );

    clearFarmersField.questCompletionItems.push(
      new QuestCompletionItem(this.itemByID(this.ITEM_ID_SNAKE_FANG)!, 3)
    );
    clearFarmersField.rewardItem = this.itemByID(this.ITEM_ID_ADVENTURER_PASS);

    this.quests.push(clearAlchemistGarden);
    this.quests.push(clearFarmersField);
  }

  private static populateLocations(): void {
    // Create each location
    const home = new Location(this.LOCATION_ID_HOME, 'Home', 'Your house. You really need to clean up the place.');

    const townSquare = new Location(this.LOCATION_ID_TOWN_SQUARE, 'Town square', 'You see a fountain.');

    const bobTheRatCatcher = new Vendor('Bob the Rat-Catcher');
    bobTheRatCatcher.addItemToInventory(this.itemByID(this.ITEM_ID_PIECE_OF_FUR)!, 5);
    bobTheRatCatcher.addItemToInventory(this.itemByID(this.ITEM_ID_RAT_TAIL)!, 3);

    townSquare.vendorWorkingHere = bobTheRatCatcher;

    const alchemistHut = new Location(
      this.LOCATION_ID_ALCHEMIST_HUT,
      "Alchemist's hut",
      'There are many strange plants on the shelves.'
    );
    alchemistHut.questAvailableHere = this.questByID(this.QUEST_ID_CLEAR_ALCHEMIST_GARDEN);

    const alchemistsGarden = new Location(
      this.LOCATION_ID_ALCHEMISTS_GARDEN,
      "Alchemist's garden",
      'Many plants are growing here.'
    );
    alchemistsGarden.addMonster(this.MONSTER_ID_RAT, 100);

    const farmhouse = new Location(
      this.LOCATION_ID_FARMHOUSE,
      'Farmhouse',
      'There is a small farmhouse, with a farmer in front.'
    );
    farmhouse.questAvailableHere = this.questByID(this.QUEST_ID_CLEAR_FARMERS_FIELD);

    const farmersField = new Location(
      this.LOCATION_ID_FARM_FIELD,
      "Farmer's field",
      'You see rows of vegetables growing here.'
    );
    farmersField.addMonster(this.MONSTER_ID_SNAKE, 100);

    const guardPost = new Location(
      this.LOCATION_ID_GUARD_POST,
      'Guard post',
      'There is a large, tough-looking guard here.',
      this.itemByID(this.ITEM_ID_ADVENTURER_PASS)!
    );

    const bridge = new Location(this.LOCATION_ID_BRIDGE, 'Bridge', 'A stone bridge crosses a wide river.');

    const spiderField = new Location(
      this.LOCATION_ID_SPIDER_FIELD,
      'Forest',
      'You see spider webs covering covering the trees in this forest.'
    );
    spiderField.addMonster(this.MONSTER_ID_GIANT_SPIDER, 100);

    // Link the locations together
    home.locationToNorth = townSquare;

    townSquare.locationToNorth = alchemistHut;
    townSquare.locationToSouth = home;
    townSquare.locationToEast = guardPost;
    townSquare.locationToWest = farmhouse;

    farmhouse.locationToEast = townSquare;
    farmhouse.locationToWest = farmersField;

    farmersField.locationToEast = farmhouse;

    alchemistHut.locationToSouth = townSquare;
    alchemistHut.locationToNorth = alchemistsGarden;

    alchemistsGarden.locationToSouth = alchemistHut;

    guardPost.locationToEast = bridge;
    guardPost.locationToWest = townSquare;

    bridge.locationToWest = guardPost;
    bridge.locationToEast = spiderField;

    spiderField.locationToWest = bridge;

    // Add the locations to the static list
    this.locations.push(home);
    this.locations.push(townSquare);
    this.locations.push(guardPost);
    this.locations.push(alchemistHut);
    this.locations.push(alchemistsGarden);
    this.locations.push(farmhouse);
    this.locations.push(farmersField);
    this.locations.push(bridge);
    this.locations.push(spiderField);
  }

  public static itemByID(id: number): Item | null {
    return this.items.find((x) => x.id === id) || null;
  }

  public static monsterByID(id: number): Monster | null {
    return this.monsters.find((x) => x.id === id) || null;
  }

  public static questByID(id: number): Quest | null {
    return this.quests.find((x) => x.id === id) || null;
  }

  public static locationByID(id: number): Location | null {
    return this.locations.find((x) => x.id === id) || null;
  }
}

