export class LivingCreature {
  currentHitPoints: number;
  maximumHitPoints: number;

  constructor(currentHitPoints: number, maximumHitPoints: number) {
    this.currentHitPoints = currentHitPoints;
    this.maximumHitPoints = maximumHitPoints;
  }

  get isDead(): boolean {
    return this.currentHitPoints <= 0;
  }
}

