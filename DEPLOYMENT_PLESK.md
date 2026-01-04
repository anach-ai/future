# Deploy to Plesk Node.js

## Step 1: Upload Files

Upload all files from this repository to:
```
/var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/future
```

Or use Git:
```bash
cd /var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/
git clone https://github.com/anach-ai/future.git
cd future
```

## Step 2: Install Dependencies

```bash
cd /var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/future
npm install
```

## Step 3: Configure

1. Edit `public/config/user-telegram-config.json` with your Telegram credentials
2. Edit `agent/config/dk_rules.json` with your security rules

## Step 4: Build

```bash
npm run build
```

This creates the `dist/` folder with production files.

## Step 5: Configure Plesk Node.js

1. Go to **Plesk → Websites & Domains → yourdomain.com → Node.js**

2. Set:
   - **Application Root**: `/subdomain.yourdomain.com/future`
   - **Document Root**: `/subdomain.yourdomain.com/future/dist`
   - **Application Startup File**: `server.js`
   - **Application URL**: `http://subdomain.yourdomain.com`
   - **Node.js Version**: 18.x or 20.x (LTS)
   - **Enable Node.js**: ✓ Checked

3. Click **"Restart App"**

4. Wait 10-15 seconds

## Step 6: Test

Visit your domain: `http://subdomain.yourdomain.com`

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:3050 | xargs kill -9
```
Then restart app in Plesk.

### Permission Errors
```bash
chown -R $(stat -c '%U' .):$(stat -c '%G' .) .
chmod -R 755 .
```

### Build Not Found
Make sure you ran `npm run build` and `dist/` folder exists.
