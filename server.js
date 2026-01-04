import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Get port from environment or use default
const defaultPort = process.env.PORT || process.env.PLESK_NODEJS_PORT || process.env.PORT_NUMBER || 3050;

// Serve static files from dist folder
const distPath = path.join(__dirname, 'dist');

// Check if dist folder exists
if (!existsSync(distPath)) {
  console.error('ERROR: dist/ folder does not exist!');
  console.error('Please run: npm run build');
  process.exit(1);
}

// Check if index.html exists
const indexPath = path.join(distPath, 'index.html');
if (!existsSync(indexPath)) {
  console.error('ERROR: dist/index.html does not exist!');
  console.error('Please run: npm run build');
  process.exit(1);
}

app.use(express.static(distPath));

// Handle React routing - return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Function to start server on a port
function startServer(port) {
  const server = createServer(app);
  
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`Serving files from: ${distPath}`);
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use`);
      console.error('');
      console.error('Solutions:');
      console.error('1. Kill the process using port ' + port + ':');
      console.error('   lsof -ti:' + port + ' | xargs kill -9');
      console.error('   OR');
      console.error('   fuser -k ' + port + '/tcp');
      console.error('');
      console.error('2. Or restart Node.js app in Plesk (it will handle the port)');
      console.error('');
      console.error('3. Or wait 30 seconds and try again');
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
  
  return server;
}

// Start server
startServer(defaultPort);

