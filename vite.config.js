import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function obfuscateTelegramConfig() {
  return {
    name: 'obfuscate-telegram-config',
    buildStart() {
      const configPath = path.join(__dirname, 'public', 'config', 'user-telegram-config.json')
      const indexHtmlPath = path.join(__dirname, 'index.html')
      
      if (!fs.existsSync(configPath)) {
        return
      }
      
      const OBFUSCATION_KEY = 'dk_telegram_obf_key_2024_secure_xor_mask'
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      
      function obfuscate(text, key) {
        const textBytes = Buffer.from(text, 'utf8')
        const keyBytes = Buffer.from(key, 'utf8')
        const result = Buffer.alloc(textBytes.length)
        for (let i = 0; i < textBytes.length; i++) {
          result[i] = textBytes[i] ^ keyBytes[i % keyBytes.length]
        }
        return result.toString('hex')
      }
      
      const configJson = JSON.stringify(config)
      const obfuscated = obfuscate(configJson, OBFUSCATION_KEY)
      
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8')
      const scriptTagRegex = /<script type="text\/plain" id="user-telegram-config" data-obfuscated="true">[\s\S]*?<\/script>/
      const newScriptTag = `    <script type="text/plain" id="user-telegram-config" data-obfuscated="true">
${obfuscated}
    </script>`
      
      if (scriptTagRegex.test(indexHtml)) {
        indexHtml = indexHtml.replace(scriptTagRegex, newScriptTag)
      } else {
        const bodyMatch = indexHtml.match(/<body>([\s\S]*?)<\/body>/)
        if (bodyMatch) {
          indexHtml = indexHtml.replace(/<body>([\s\S]*?)<\/body>/, `<body>$1${newScriptTag}\n`)
        }
      }
      
      fs.writeFileSync(indexHtmlPath, indexHtml)
    }
  }
}

export default defineConfig({
  plugins: [obfuscateTelegramConfig(), react()],
  server: {
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})

