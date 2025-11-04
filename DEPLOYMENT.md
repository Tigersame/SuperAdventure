# Deployment Guide for Farcaster MiniAdv

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project"
   - Import your repository: `Tigersame/SuperAdventure`

2. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

3. **Environment Variables**
   - Add `NEXT_PUBLIC_ROOT_URL` with your Vercel deployment URL
   - Example: `https://your-project.vercel.app`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_ROOT_URL
   # Enter your production URL when prompted
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Steps

### 1. Update Manifest Configuration

After deployment, update `minikit.config.ts` and `app/.well-known/farcaster.json` with your production URL:

```typescript
const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || 'https://your-app.vercel.app';
```

### 2. Create Account Association

1. Go to [Base Build Account Association Tool](https://www.base.dev/preview?tab=account)
2. Paste your deployed URL (e.g., `https://your-app.vercel.app`)
3. Click "Submit" then "Verify"
4. Copy the `accountAssociation` object

### 3. Update minikit.config.ts

Add the `accountAssociation` credentials you copied:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "...",
    payload: "...",
    signature: "..."
  },
  // ... rest of config
}
```

### 4. Push Updates

```bash
git add .
git commit -m "Add account association credentials"
git push origin master
```

Vercel will automatically redeploy with the new configuration.

### 5. Preview Your App

1. Go to [base.dev/preview](https://base.dev/preview)
2. Add your app URL
3. Test the app launch
4. Verify account association in the "Account association" tab
5. Check metadata in the "Metadata" tab

### 6. Publish to Base App

Create a post in the Base app with your app's URL to publish it.

## Troubleshooting

### Manifest Not Found

If `.well-known/farcaster.json` is not accessible:
- Check that `vercel.json` has the correct rewrite rule
- Verify the file exists at `app/.well-known/farcaster.json`
- Check Vercel deployment logs for errors

### Build Errors

- Ensure all dependencies are in `package.json`
- Check Node.js version (requires >= 18.0.0)
- Review build logs in Vercel dashboard

### Environment Variables

- Make sure `NEXT_PUBLIC_ROOT_URL` is set
- Use production URL, not localhost
- Redeploy after adding environment variables

## Custom Domain (Optional)

1. Go to Vercel Project Settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_ROOT_URL` with your custom domain

