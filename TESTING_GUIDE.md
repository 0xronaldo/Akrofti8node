# Akroft i8 Node - Testing & Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MetaMask browser extension
- Git for version control

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Testing Features

#### MetaMask Connection
1. Ensure MetaMask is installed and unlocked
2. Click "Connect Wallet" button in hero section
3. Approve connection in MetaMask popup
4. Verify wallet address appears in button

#### User Registration
1. Connect wallet first (if not already connected)
2. Scroll to "Join the Flow" section
3. Optionally enter email address
4. Click "Register with Wallet"
5. Confirm transaction in MetaMask
6. Wait for Tableland transaction confirmation

#### Visual Elements
- Logo should pulse with animation
- Feature cards should have hover effects (scale + border glow)
- Medusas should float and pulse in the visualization section
- Buttons should have neon glow on hover
- All animations should be smooth and responsive

#### Responsive Design
- Test on mobile (< 768px): Single column layout
- Test on tablet (768px - 1024px): 2-column feature grid
- Test on desktop (> 1024px): 4-column feature grid

## Deployment to Vercel

### 1. GitHub Setup
```bash
git add .
git commit -m "Initial Akroft i8 Node landing page"
git push origin main
```

### 2. Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Deploy

### 3. Environment Variables (if needed)
Add any required environment variables in Vercel dashboard:
- `NEXT_PUBLIC_TABLELAND_CHAIN_ID` (if using specific chain)
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` (if adding WalletConnect)

## Troubleshooting

### Common Issues

1. **MetaMask not detected**
   - Ensure MetaMask extension is installed and enabled
   - Try refreshing the page
   - Check browser console for errors

2. **Tableland registration fails**
   - Ensure wallet has sufficient funds for gas
   - Check network connection
   - Verify table exists (users_123)

3. **Animations not working**
   - Check if `styles/medusa.css` is properly imported
   - Verify Tailwind CSS is configured correctly
   - Clear browser cache

4. **Icons not displaying**
   - Verify SVG files exist in `public/icons/`
   - Check file paths in component
   - Ensure SVG syntax is valid

### Performance Optimization
- Images are SVG for crisp display at any size
- CSS animations use transform/opacity for GPU acceleration
- Minimal dependencies for fast loading
- Responsive images and layouts

## Hackathon Submission Checklist
- ✅ GitHub repository with complete code
- ✅ Vercel deployment URL
- ✅ MetaMask integration working
- ✅ Tableland integration for user registration
- ✅ Responsive design (mobile + desktop)
- ✅ Web3-native design with neon aesthetics
- ✅ Smooth animations and interactions
- ✅ Demo-ready functionality

## Demo Script
1. **Introduction**: "Akroft i8 Node enables collaborative DeFi and AI workflow automation"
2. **Connect Wallet**: Demonstrate MetaMask connection
3. **Features Overview**: Highlight the 4 key features with visual cards
4. **Medusa Visualization**: Show the animated workflow representation
5. **Registration**: Complete user registration with Tableland
6. **CTA**: Navigate to flow editor (placeholder link)

## Next Steps for Full Implementation
- Implement actual flow editor at `/editor` route
- Add more blockchain network support
- Integrate real AI code generation
- Add collaborative features with WebRTC
- Implement actual DeFi protocol integrations