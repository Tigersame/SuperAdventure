# Local Testing Guide

## 🚀 Quick Start

1. **Install Dependencies** (if not done)
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Go to [http://localhost:3000](http://localhost:3000)
   - You should see the Farcaster MiniAdv game!

## 🎮 Testing Features

### Game Features
- ✅ Explore locations (North, South, East, West)
- ✅ Fight monsters
- ✅ Complete quests
- ✅ Manage inventory
- ✅ Level up and gain experience
- ✅ Auto-save game progress

### Wallet Features (Local Testing)
- ⚠️ Wallet connection works with browser extensions (MetaMask, etc.)
- ℹ️ Full Farcaster MiniKit integration requires deployment
- ✅ Rewards system UI is functional (transaction sending requires deployment)

## 📝 Notes for Local Testing

1. **Beta Warning**: You'll see the beta warning banner on first load
2. **Game Save**: Progress is saved to browser localStorage
3. **Wallet Connection**: Uses standard wallet connectors for testing
4. **Rewards**: UI works, but actual transactions require Base network connection

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### TypeScript Errors
```bash
# Check for type errors
npm run lint
```

## 🌐 Testing in Farcaster Environment

To test in actual Farcaster environment:

1. **Expose Local Server**
   - Use `ngrok` or `cloudflared` to create public URL
   - Example with ngrok: `ngrok http 3000`

2. **Update Environment**
   - Set `NEXT_PUBLIC_ROOT_URL` to your public URL

3. **Test in Farcaster**
   - Use Farcaster preview tool with your public URL

## ✅ Ready to Deploy?

Once you've tested locally and everything works:
1. Review `DEPLOYMENT.md` for deployment steps
2. Deploy to Vercel
3. Set up account association
4. Publish to Farcaster!

