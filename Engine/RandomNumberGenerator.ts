export class RandomNumberGenerator {
  static numberBetween(minimumValue: number, maximumValue: number): number {
    return Math.floor(Math.random() * (maximumValue - minimumValue + 1)) + minimumValue;
  }
}

