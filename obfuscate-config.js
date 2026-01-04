import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OBFUSCATION_KEY = 'dk_telegram_obf_key_2024_secure_xor_mask';

const configPath = path.join(__dirname, 'public', 'config', 'user-telegram-config.json');

if (!fs.existsSync(configPath)) {
  console.error(`Error: ${configPath} not found!`);
  console.error('Create user-telegram-config.json with your Telegram credentials first.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

function obfuscate(text, key) {
  const textBytes = Buffer.from(text, 'utf8');
  const keyBytes = Buffer.from(key, 'utf8');
  const result = Buffer.alloc(textBytes.length);
  
  for (let i = 0; i < textBytes.length; i++) {
    result[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return result.toString('hex');
}

const configJson = JSON.stringify(config);
const obfuscated = obfuscate(configJson, OBFUSCATION_KEY);

console.log('Original config:');
console.log(configJson);
console.log('\nObfuscated (hex):');
console.log(obfuscated);
console.log('\nLength:', obfuscated.length, 'characters');

const htmlScriptTag = `    <script type="text/plain" id="user-telegram-config" data-obfuscated="true">
${obfuscated}
    </script>`;

const indexHtmlPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const scriptTagRegex = /<script type="text\/plain" id="user-telegram-config" data-obfuscated="true">[\s\S]*?<\/script>/;

if (scriptTagRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(scriptTagRegex, htmlScriptTag);
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('\n✓ Updated index.html with obfuscated config');
} else {
  console.log('\n=== HTML Script Tag (copy to index.html) ===');
  console.log(htmlScriptTag);
  const outputPath = path.join(__dirname, 'obfuscated-config.txt');
  fs.writeFileSync(outputPath, htmlScriptTag);
  console.log(`✓ Saved to ${outputPath}`);
}

