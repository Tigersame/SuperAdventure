'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Player } from '../Engine/Player';

interface RewardSystemProps {
  player: Player;
}

// Reward thresholds in XP
const REWARD_THRESHOLDS = {
  level_5: { xp: 400, amount: parseEther('0.001'), label: 'Level 5 Achievement' },
  level_10: { xp: 900, amount: parseEther('0.002'), label: 'Level 10 Achievement' },
  first_quest: { xp: 0, amount: parseEther('0.0005'), label: 'First Quest Completed' },
  monster_slayer: { xp: 0, amount: parseEther('0.0005'), label: 'Monster Slayer' },
};

export function RewardSystem({ player }: RewardSystemProps) {
  const { address, isConnected } = useAccount();
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());
  const [availableRewards, setAvailableRewards] = useState<string[]>([]);

  const { data: hash, sendTransaction, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    // Check available rewards
    const rewards: string[] = [];

    // Level-based rewards
    if (player.level >= 5 && !claimedRewards.has('level_5')) {
      rewards.push('level_5');
    }
    if (player.level >= 10 && !claimedRewards.has('level_10')) {
      rewards.push('level_10');
    }

    // Quest completion reward
    const hasCompletedQuest = player.quests.some(q => q.isCompleted);
    if (hasCompletedQuest && !claimedRewards.has('first_quest')) {
      rewards.push('first_quest');
    }

    // Monster slayer reward (if player has defeated a monster)
    // This would need to be tracked separately - for now, check if player has loot items
    const hasLoot = player.inventory.length > 1; // More than just starting weapon
    if (hasLoot && !claimedRewards.has('monster_slayer')) {
      rewards.push('monster_slayer');
    }

    setAvailableRewards(rewards);
  }, [player.level, player.quests, player.inventory.length, claimedRewards]);

  const claimReward = async (rewardKey: string) => {
    if (!address || !isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const reward = REWARD_THRESHOLDS[rewardKey as keyof typeof REWARD_THRESHOLDS];
    if (!reward) return;

    try {
      sendTransaction({
        to: address,
        value: reward.amount,
      });

      setClaimedRewards(prev => new Set([...prev, rewardKey]));
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="rewards-section">
        <h3>Earn Rewards</h3>
        <p className="rewards-info">Connect your wallet to earn Base rewards for playing!</p>
      </div>
    );
  }

  return (
    <div className="rewards-section">
      <h3>🎁 Available Rewards</h3>
      
      {isPending && (
        <div className="reward-status">
          <p>Transaction pending...</p>
        </div>
      )}

      {isConfirming && (
        <div className="reward-status">
          <p>Confirming transaction...</p>
        </div>
      )}

      {isConfirmed && (
        <div className="reward-status success">
          <p>✅ Reward claimed successfully!</p>
        </div>
      )}

      {availableRewards.length === 0 ? (
        <p className="no-rewards">No rewards available. Keep playing to unlock rewards!</p>
      ) : (
        <div className="rewards-list">
          {availableRewards.map((rewardKey) => {
            const reward = REWARD_THRESHOLDS[rewardKey as keyof typeof REWARD_THRESHOLDS];
            return (
              <div key={rewardKey} className="reward-item">
                <div className="reward-info">
                  <strong>{reward.label}</strong>
                  <span className="reward-amount">
                    {formatEther(reward.amount)} ETH
                  </span>
                </div>
                <button
                  onClick={() => claimReward(rewardKey)}
                  disabled={isPending || isConfirming}
                  className="claim-btn"
                >
                  Claim
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="rewards-progress">
        <h4>Progress to Next Reward</h4>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(player.experiencePoints % 500 / 500) * 100}%` }}
          ></div>
        </div>
        <p>XP: {player.experiencePoints} / {Math.ceil(player.experiencePoints / 500) * 500}</p>
      </div>
    </div>
  );
}

