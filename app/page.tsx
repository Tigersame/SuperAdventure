'use client';

import { useState, useEffect } from 'react';
import { Player, MessageCallback } from '../Engine/Player';
import { World } from '../Engine/World';
import { Weapon } from '../Engine/Weapon';
import { HealingPotion } from '../Engine/HealingPotion';
import { WalletConnect } from '../components/WalletConnect';
import { RewardSystem } from '../components/RewardSystem';
import { saveGame, loadGame } from '../lib/gameStorage';
import { PlayerQuest } from '../Engine/PlayerQuest';

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

  useEffect(() => {
    const savedData = loadGame();
    let newPlayer: Player;

    if (savedData) {
      // Load from save
      newPlayer = new Player(
        savedData.currentHitPoints || 10,
        savedData.maximumHitPoints || 10,
        savedData.gold || 20,
        savedData.experiencePoints || 0
      );
      
      // Restore location
      if (savedData.currentLocationId) {
        newPlayer.currentLocation = World.locationByID(savedData.currentLocationId);
      }
      
      // Restore inventory
      if (savedData.inventory) {
        savedData.inventory.forEach((item: any) => {
          const itemDetails = World.itemByID(item.itemId);
          if (itemDetails) {
            newPlayer.addItemToInventory(itemDetails, item.quantity);
          }
        });
      }
      
      // Restore weapon
      if (savedData.currentWeaponId) {
        const weapon = World.itemByID(savedData.currentWeaponId);
        if (weapon instanceof Weapon) {
          newPlayer.currentWeapon = weapon;
        }
      }
      
      // Restore quests
      if (savedData.quests) {
        savedData.quests.forEach((quest: any) => {
          const questDetails = World.questByID(quest.questId);
          if (questDetails) {
            const existingQuest = newPlayer.quests.find(q => q.details.id === questDetails.id);
            if (!existingQuest) {
              const playerQuest = new PlayerQuest(questDetails);
              playerQuest.isCompleted = quest.isCompleted;
              newPlayer.quests.push(playerQuest);
            } else {
              existingQuest.isCompleted = quest.isCompleted;
            }
          }
        });
      }
      
      // Restore locations visited
      if (savedData.locationsVisited) {
        newPlayer.locationsVisited = savedData.locationsVisited;
      }
    } else {
      // Create new player
      newPlayer = Player.createDefaultPlayer();
    }
    
    const messageHandler: MessageCallback = (message: string, addExtraNewLine = false) => {
      setMessages((prev) => [...prev, message]);
      if (addExtraNewLine) {
        setMessages((prev) => [...prev, '']);
      }
    };

    newPlayer.onMessage = messageHandler;
    setPlayer(newPlayer);
    
    // Initial location message
    if (newPlayer.currentLocation) {
      messageHandler(`You are at: ${newPlayer.currentLocation.name}`);
      messageHandler(newPlayer.currentLocation.description);
    }
  }, []);

  // Auto-save game state
  useEffect(() => {
    if (player) {
      const saveTimer = setTimeout(() => {
        saveGame(player);
      }, 2000); // Save 2 seconds after any change

      return () => clearTimeout(saveTimer);
    }
  }, [player]);

  if (!player) {
    return <div className="container">Loading...</div>;
  }

  const handleMove = (direction: 'north' | 'east' | 'south' | 'west') => {
    setMessages([]);
    switch (direction) {
      case 'north':
        player.moveNorth();
        break;
      case 'east':
        player.moveEast();
        break;
      case 'south':
        player.moveSouth();
        break;
      case 'west':
        player.moveWest();
        break;
    }
  };

  const handleAttack = () => {
    if (!player.currentWeapon) {
      const weapon = player.weapons[0];
      if (weapon) {
        player.currentWeapon = weapon;
      } else {
        setMessages(['You do not have any weapons']);
        return;
      }
    }
    if (player.currentWeapon) {
      setMessages([]);
      player.useWeapon(player.currentWeapon);
    }
  };

  const handleUsePotion = (potion: HealingPotion) => {
    setMessages([]);
    player.usePotion(potion);
  };

  const canMoveNorth = player.currentLocation?.locationToNorth !== null;
  const canMoveEast = player.currentLocation?.locationToEast !== null;
  const canMoveSouth = player.currentLocation?.locationToSouth !== null;
  const canMoveWest = player.currentLocation?.locationToWest !== null;
  const hasMonster = player.currentLocation?.hasAMonster ?? false;

  return (
    <div className="container">
      <div className="game-header">
        <div className="header-top">
          <h1>Super Adventure</h1>
          <WalletConnect />
        </div>
        <div className="stats">
          <div>
            <strong>{player.currentHitPoints}/{player.maximumHitPoints}</strong>
            <span>Health</span>
          </div>
          <div>
            <strong>{player.level}</strong>
            <span>Level</span>
          </div>
          <div>
            <strong>{player.experiencePoints}</strong>
            <span>Experience</span>
          </div>
          <div>
            <strong>{player.gold}</strong>
            <span>Gold</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="location-info">
          <h2>{player.currentLocation?.name}</h2>
          <p>{player.currentLocation?.description}</p>
          {player.currentLocation?.vendorWorkingHere && (
            <p className="vendor-info">
              Vendor: {player.currentLocation.vendorWorkingHere.name}
            </p>
          )}
        </div>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>

        <div className="actions">
          <div className="movement">
            <h3>Movement</h3>
            <div className="movement-buttons">
              <button disabled={!canMoveNorth} onClick={() => handleMove('north')}>
                North
              </button>
              <button disabled={!canMoveEast} onClick={() => handleMove('east')}>
                East
              </button>
              <button disabled={!canMoveSouth} onClick={() => handleMove('south')}>
                South
              </button>
              <button disabled={!canMoveWest} onClick={() => handleMove('west')}>
                West
              </button>
            </div>
          </div>

          {hasMonster && (
            <div className="combat">
              <h3>Combat</h3>
              <button onClick={handleAttack}>Attack</button>
            </div>
          )}

          <div className="game-actions">
            <button onClick={() => setShowInventory(!showInventory)}>
              {showInventory ? 'Hide' : 'Show'} Inventory
            </button>
            <button onClick={() => setShowQuests(!showQuests)}>
              {showQuests ? 'Hide' : 'Show'} Quests
            </button>
          </div>

          {showInventory && (
            <div className="inventory">
              <h3>Inventory</h3>
              <div className="weapons">
                <h4>Weapons</h4>
                {player.weapons.map((weapon, idx) => (
                  <div key={idx}>
                    {weapon.name} {player.currentWeapon?.id === weapon.id && '(Equipped)'}
                  </div>
                ))}
              </div>
              <div className="potions">
                <h4>Potions</h4>
                {player.potions.map((potion, idx) => (
                  <button key={idx} onClick={() => handleUsePotion(potion)}>
                    Use {potion.name}
                  </button>
                ))}
              </div>
              <div className="items">
                <h4>Items</h4>
                {player.inventory
                  .filter((item) => !(item.details instanceof Weapon) && !(item.details instanceof HealingPotion))
                  .map((item, idx) => (
                    <div key={idx}>
                      {item.quantity} {item.description}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {showQuests && (
            <div className="quests">
              <h3>Quests</h3>
              {player.quests.length === 0 ? (
                <p>No active quests</p>
              ) : (
                player.quests.map((quest, idx) => (
                  <div key={idx}>
                    <strong>{quest.name}</strong> - {quest.isCompleted ? 'Completed' : 'In Progress'}
                  </div>
                ))
              )}
            </div>
          )}

          <RewardSystem player={player} />
        </div>
      </div>
    </div>
  );
}

