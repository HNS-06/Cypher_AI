<<<<<<< HEAD
# Cypher_AI
=======
# 🤖 CYPHER - Autonomous Browser Intelligence

An advanced AI-powered browser automation agent that understands natural language commands and executes complex web tasks autonomously. Built with cutting-edge AI and modern web technologies, featuring a stunning cyberpunk-inspired interface.

![CYPHER](https://img.shields.io/badge/AI-Powered-00ff9d?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8a2be2?style=for-the-badge)

## ✨ Features

- 🧠 **AI-Powered Command Understanding** - Natural language processing with Google Gemini
- 🌐 **Full Browser Automation** - Complete control via Puppeteer
- 👁️ **Visual Intelligence** - Screenshot analysis and element detection
- 📊 **Real-Time Monitoring** - Live browser preview and execution logs
- 💾 **Session Recording** - Record, replay, and share automation workflows
- 🎨 **Beautiful Modern UI** - Glassmorphism design with smooth animations

## 🏗️ Architecture

```
autonomous-browser-agent/
├── backend/                 # Node.js + Express backend
│   ├── ai/                 # AI command processor (Gemini)
│   ├── browser/            # Puppeteer browser controller
│   ├── executor/           # Task execution orchestrator
│   ├── recorder/           # Session recording
│   ├── config/             # Configuration management
│   └── server.js           # Main server with WebSocket
│
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Tailwind CSS styles
│   └── package.json
│
└── package.json           # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or navigate to the project directory**

```bash
cd autonomous-browser-agent
```

2. **Install dependencies**

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
HEADLESS=false
```

4. **Start the application**

```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

5. **Open your browser**

Navigate to `http://localhost:5173`

## 📖 Usage

### Example Commands

Try these natural language commands:

- `Go to google.com and search for puppeteer`
- `Navigate to github.com`
- `Click the login button`
- `Fill the search box with "autonomous agents"`
- `Take a screenshot of the current page`
- `Extract all product prices from this page`
- `Scroll down 500 pixels`

### API Endpoints

The backend exposes several REST endpoints:

- `GET /api/health` - Health check
- `GET /api/browser/status` - Get browser status
- `POST /api/execute` - Execute command (REST alternative to WebSocket)
- `GET /api/sessions` - List all recorded sessions
- `GET /api/sessions/:sessionId` - Get session details
- `GET /api/screenshot` - Take screenshot

### WebSocket Events

Real-time communication via WebSocket:

**Client → Server:**
- `execute_command` - Execute a command
- `get_screenshot` - Request current screenshot
- `stop_execution` - Stop current execution

**Server → Client:**
- `execution_started` - Command execution started
- `progress` - Execution progress update
- `execution_complete` - Command execution finished
- `screenshot` - Screenshot data
- `error` - Error occurred

## 🛠️ Technology Stack

### Backend
- **Node.js + Express** - Server framework
- **Puppeteer** - Headless browser automation
- **Google Gemini API** - AI command understanding
- **WebSocket (ws)** - Real-time communication
- **Sharp** - Image processing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 🎨 UI Features

- **Glassmorphism Design** - Modern, translucent UI elements
- **Dark Mode Optimized** - Beautiful dark gradient background
- **Real-Time Updates** - Live execution logs and browser preview
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Layout** - Works on all screen sizes

## 📝 Configuration

### Browser Settings

Modify `backend/config/config.js`:

```javascript
browser: {
  headless: false,           // Set to true for headless mode
  timeout: 30000,            // Default timeout in ms
  defaultViewport: {
    width: 1920,
    height: 1080
  }
}
```

### AI Settings

```javascript
ai: {
  model: 'gemini-2.0-flash-exp',
  temperature: 0.7,
  maxTokens: 8192
}
```

## 🔒 Security Notes

- Never commit your `.env` file
- Keep your Gemini API key secure
- Use environment variables for sensitive data
- Consider rate limiting for production use

## 🐛 Troubleshooting

### Browser won't launch
- Ensure Puppeteer dependencies are installed
- Try setting `HEADLESS=true` in `.env`
- Check Chrome/Chromium is available on your system

### AI not working
- Verify `GEMINI_API_KEY` is set correctly
- Check API key has proper permissions
- Ensure you have internet connectivity

### WebSocket connection fails
- Check backend is running on port 3001
- Verify CORS settings in `backend/server.js`
- Check firewall settings

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🙏 Acknowledgments

- [Puppeteer](https://pptr.dev/) - Browser automation
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI capabilities
- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Built with ❤️ using AI-powered automation**
>>>>>>> 93b073e (🎉 Initial commit: CYPHER - Autonomous Browser Intelligence)
