import { Player } from '../Engine/Player';

const STORAGE_KEY = 'super_adventure_save';

export interface SaveData {
  currentHitPoints: number;
  maximumHitPoints: number;
  gold: number;
  experiencePoints: number;
  currentLocationId: number;
  currentWeaponId: number | null;
  inventory: Array<{ itemId: number; quantity: number }>;
  quests: Array<{ questId: number; isCompleted: boolean }>;
  locationsVisited: number[];
}

export function saveGame(player: Player): void {
  if (typeof window === 'undefined') return;
  
  const saveData: SaveData = {
    currentHitPoints: player.currentHitPoints,
    maximumHitPoints: player.maximumHitPoints,
    gold: player.gold,
    experiencePoints: player.experiencePoints,
    currentLocationId: player.currentLocation?.id || 1,
    currentWeaponId: player.currentWeapon?.id || null,
    inventory: player.inventory.map(item => ({
      itemId: item.details.id,
      quantity: item.quantity,
    })),
    quests: player.quests.map(quest => ({
      questId: quest.details.id,
      isCompleted: quest.isCompleted,
    })),
    locationsVisited: player.locationsVisited,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

export function loadGame(): Partial<SaveData> | null {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as Partial<SaveData>;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

