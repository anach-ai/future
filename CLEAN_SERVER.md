# Complete Server Setup Guide

## Prerequisites

- Fresh Ubuntu 20.04+ or CentOS 7+ server
- Root or sudo access
- Domain name pointed to server IP

## Step 1: Initial Server Setup

### Ubuntu
```bash
apt update && apt upgrade -y
```

### CentOS
```bash
yum update -y
```

## Step 2: Install Node.js

### Ubuntu
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### CentOS
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs
```

### Verify Installation
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

## Step 3: Install Plesk (Optional but Recommended)

### Ubuntu
```bash
wget https://autoinstall.plesk.com/plesk-installer
chmod +x plesk-installer
./plesk-installer install
```

### CentOS
```bash
wget https://autoinstall.plesk.com/plesk-installer
chmod +x plesk-installer
./plesk-installer install
```

Follow Plesk installation wizard. Access Plesk at: `https://your-server-ip:8443`

## Step 4: Create Domain in Plesk

1. Login to Plesk
2. Go to **Websites & Domains → Add Domain**
3. Enter your domain name
4. Complete domain setup wizard

## Step 5: Clone Repository

### Via SSH
```bash
cd /var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/
git clone https://github.com/anach-ai/future.git
cd future
```

### Via Plesk File Manager
1. Go to **Files → File Manager**
2. Navigate to your domain directory
3. Use **Git** extension to clone: `https://github.com/anach-ai/future.git`

## Step 6: Install Dependencies

```bash
cd /var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/future
npm install
```

## Step 7: Configure Application

### Configure Telegram
```bash
nano public/config/user-telegram-config.json
```

Edit:
```json
{
  "telegram": {
    "bot_token": "YOUR_BOT_TOKEN_HERE",
    "chat_id": "YOUR_CHAT_ID_HERE",
    "enabled": true
  }
}
```

### Configure Security Rules
```bash
nano agent/config/dk_rules.json
```

Edit security rules as needed (country restrictions, VPN blocking, etc.)

## Step 8: Build Application

```bash
npm run build
```

This creates `dist/` folder with production files.

## Step 9: Configure Plesk Node.js

1. Go to **Plesk → Websites & Domains → yourdomain.com → Node.js**

2. Configure:
   - **Application Root**: `/subdomain.yourdomain.com/future`
   - **Document Root**: `/subdomain.yourdomain.com/future/dist`
   - **Application Startup File**: `server.js`
   - **Application URL**: `http://subdomain.yourdomain.com`
   - **Node.js Version**: 20.x (LTS)
   - **Enable Node.js**: ✓ Checked

3. Click **"Restart App"**

4. Wait 10-15 seconds

## Step 10: Fix Permissions (If Needed)

```bash
cd /var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/future
chown -R $(stat -c '%U' .):$(stat -c '%G' .) .
chmod -R 755 .
```

## Step 11: Test Application

1. Visit: `http://subdomain.yourdomain.com`
2. Check browser console (F12) for errors
3. Verify page loads correctly
4. Test form submissions
5. Verify Telegram notifications work

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:3050 | xargs kill -9
```
Then restart app in Plesk.

### Permission Denied
```bash
chown -R $(stat -c '%U' .):$(stat -c '%G' .) .
chmod -R 755 .
```

### Build Fails
```bash
# Clean and rebuild
rm -rf dist/ node_modules/
npm install
npm run build
```

### Node.js Not Starting
- Check Plesk Node.js logs
- Verify `server.js` exists
- Check Application Root path is correct
- Ensure `dist/` folder exists

### Git Permission Error
```bash
git config --global --add safe.directory /var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/future
```

## Quick Reference Commands

```bash
# Navigate to app
cd /var/www/vhosts/yourdomain.com/subdomain.yourdomain.com/future

# Update from GitHub
git pull origin main

# Rebuild after changes
npm run build

# Check Node.js process
ps aux | grep "node server.js"

# View server logs
tail -f server.log
```

## Complete Setup Checklist

- [ ] Server updated (Ubuntu/CentOS)
- [ ] Node.js 20.x installed
- [ ] Plesk installed and configured
- [ ] Domain created in Plesk
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Telegram config edited
- [ ] Security rules configured
- [ ] Application built (`npm run build`)
- [ ] Plesk Node.js configured
- [ ] Permissions fixed
- [ ] Application tested and working

