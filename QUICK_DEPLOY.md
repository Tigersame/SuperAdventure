# Quick Deploy to Vercel

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Tigersame/SuperAdventure)

## 📝 Manual Steps

1. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select `Tigersame/SuperAdventure`
   - Click "Import"

3. **Configure Project**
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)

4. **Environment Variables** (Optional for now)
   - Add `NEXT_PUBLIC_ROOT_URL` after first deployment
   - Will be something like: `https://your-project.vercel.app`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes

## ✅ After Deployment

1. **Copy your deployment URL** (e.g., `https://your-project.vercel.app`)

2. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_ROOT_URL` with your URL
   - Redeploy

3. **Set up Account Association**
   - Visit [Base Build Account Association](https://www.base.dev/preview?tab=account)
   - Enter your Vercel URL
   - Follow the verification steps
   - Update `minikit.config.ts` with credentials

4. **Test Your App**
   - Visit [base.dev/preview](https://base.dev/preview)
   - Add your app URL
   - Test the launch and features

## 🎉 You're Done!

Your Farcaster MiniAdv is now live! 🎮

