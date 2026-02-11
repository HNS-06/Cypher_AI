import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  // API Configuration
  geminiApiKey: process.env.GEMINI_API_KEY || '',

  // Server Configuration
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Browser Configuration
  browser: {
    headless: process.env.HEADLESS === 'true',
    timeout: parseInt(process.env.BROWSER_TIMEOUT || '30000'),
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  },

  // Session Storage
  sessionDir: process.env.SESSION_DIR || './sessions',

  // AI Configuration
  ai: {
    model: 'gemini-1.5-flash-latest', // Free tier model - correct API name
    temperature: 0.7,
    maxTokens: 8192
  }
};

// Validate required configuration
if (!config.geminiApiKey) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY not set. AI features will not work.');
  console.warn('   Please set GEMINI_API_KEY in your .env file');
}

export default config;
