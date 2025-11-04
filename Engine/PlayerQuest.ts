import { Quest } from './Quest';

export class PlayerQuest {
  details: Quest;
  isCompleted: boolean;

  constructor(details: Quest) {
    this.details = details;
    this.isCompleted = false;
  }

  get name(): string {
    return this.details.name;
  }
}

