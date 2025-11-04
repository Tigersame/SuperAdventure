import { QuestCompletionItem } from './QuestCompletionItem';
import { Item } from './Item';

export class Quest {
  id: number;
  name: string;
  description: string;
  rewardExperiencePoints: number;
  rewardGold: number;
  questCompletionItems: QuestCompletionItem[];
  rewardItem: Item | null;

  constructor(
    id: number,
    name: string,
    description: string,
    rewardExperiencePoints: number,
    rewardGold: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.rewardExperiencePoints = rewardExperiencePoints;
    this.rewardGold = rewardGold;
    this.questCompletionItems = [];
    this.rewardItem = null;
  }
}

