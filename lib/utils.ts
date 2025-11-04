export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatReward(amount: bigint): string {
  // Convert wei to ETH (assuming 18 decimals)
  const eth = Number(amount) / 1e18;
  return eth.toFixed(4);
}

