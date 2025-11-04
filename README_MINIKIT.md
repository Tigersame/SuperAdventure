# Super Adventure - Farcaster Mini App

A text-based RPG adventure game converted to run as a Farcaster Mini App using MiniKit.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Farcaster Mini App Setup

1. Enable Developer Mode in Farcaster:
   - Go to [Farcaster Developer Tools](https://farcaster.xyz/~/settings/developer-tools)
   - Toggle on "Developer Mode"

2. Update the manifest:
   - Edit `.well-known/farcaster.json` with your app's metadata
   - Update icon, splash, and hero image URLs

3. Deploy your app:
   - Deploy to a hosting service (Vercel, Netlify, etc.)
   - Ensure `.well-known/farcaster.json` is accessible at your domain

## Game Features

- Explore different locations
- Fight monsters
- Complete quests
- Manage inventory
- Trade with vendors
- Level up and gain experience

## Original Project

This is a conversion of the C# Super Adventure RPG project to a web-based Farcaster Mini App.

