const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // This will be added after deploying and verifying with Base Build
    header: '',
    payload: '',
    signature: '',
  },
  miniapp: {
    version: '1',
    name: 'Super Adventure',
    subtitle: 'Epic RPG Adventure',
    description: 'A text-based RPG adventure game. Explore locations, fight monsters, complete quests, and level up!',
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: '#1a1a2e',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'games',
    tags: ['rpg', 'adventure', 'game', 'text-based', 'quest'],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: 'Embark on an epic adventure!',
    ogTitle: 'Super Adventure - RPG Mini App',
    ogDescription: 'A text-based RPG adventure game on Farcaster',
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;

