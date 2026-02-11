import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import config from './config/config.js';
import TaskExecutor from './executor/taskExecutor.js';
import SessionRecorder from './recorder/sessionRecorder.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
    origin: config.frontendUrl,
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Global instances
const executor = new TaskExecutor();
const recorder = new SessionRecorder(config.sessionDir);

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('🔌 Client connected via WebSocket');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case 'execute_command':
                    await handleExecuteCommand(ws, data.command);
                    break;

                case 'get_screenshot':
                    await handleGetScreenshot(ws);
                    break;

                case 'stop_execution':
                    await handleStopExecution(ws);
                    break;

                default:
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: 'Unknown message type'
                    }));
            }
        } catch (error) {
            console.error('WebSocket error:', error);
            ws.send(JSON.stringify({
                type: 'error',
                error: error.message
            }));
        }
    });

    ws.on('close', () => {
        console.log('🔌 Client disconnected');
    });
});

/**
 * Handle command execution
 */
async function handleExecuteCommand(ws, command) {
    // Start recording session
    await recorder.startSession({
        command,
        timestamp: new Date().toISOString()
    });

    // Send acknowledgment
    ws.send(JSON.stringify({
        type: 'execution_started',
        command
    }));

    // Execute command with progress updates
    const result = await executor.executeCommand(command, (progress) => {
        ws.send(JSON.stringify({
            type: 'progress',
            ...progress
        }));
    });

    // Record final result
    await recorder.recordAction('execute_command', result);

    if (result.screenshot) {
        await recorder.recordScreenshot(result.screenshot, {
            type: 'final',
            command
        });
    }

    // End session
    await recorder.endSession({
        success: result.success,
        command
    });

    // Send completion
    ws.send(JSON.stringify({
        type: 'execution_complete',
        result
    }));
}

/**
 * Handle screenshot request
 */
async function handleGetScreenshot(ws) {
    const screenshot = await executor.browser.screenshot();

    ws.send(JSON.stringify({
        type: 'screenshot',
        screenshot: screenshot.success ? screenshot.screenshot : null,
        error: screenshot.error
    }));
}

/**
 * Handle stop execution
 */
async function handleStopExecution(ws) {
    // For now, just acknowledge
    // In a real implementation, you'd interrupt the executor
    ws.send(JSON.stringify({
        type: 'execution_stopped'
    }));
}

// REST API Endpoints

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        aiConfigured: !!config.geminiApiKey
    });
});

/**
 * Get browser status
 */
app.get('/api/browser/status', async (req, res) => {
    try {
        const context = await executor.browser.getContext();
        res.json({
            success: true,
            initialized: executor.browser.isInitialized,
            context: context.success ? context.context : null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Execute command (REST alternative to WebSocket)
 */
app.post('/api/execute', async (req, res) => {
    try {
        const { command } = req.body;

        if (!command) {
            return res.status(400).json({
                success: false,
                error: 'Command is required'
            });
        }

        const result = await executor.executeCommand(command);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get sessions
 */
app.get('/api/sessions', async (req, res) => {
    try {
        const result = await recorder.listSessions();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get session details
 */
app.get('/api/sessions/:sessionId', async (req, res) => {
    try {
        const result = await recorder.loadSession(req.params.sessionId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Take screenshot
 */
app.get('/api/screenshot', async (req, res) => {
    try {
        const screenshot = await executor.browser.screenshot();
        res.json(screenshot);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await executor.cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await executor.cleanup();
    process.exit(0);
});

// Start server
server.listen(config.port, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🤖 Autonomous Browser Agent Server                      ║
║                                                            ║
║   Server running on: http://localhost:${config.port}              ║
║   WebSocket ready for connections                         ║
║   AI Configured: ${config.geminiApiKey ? '✅ Yes' : '❌ No (set GEMINI_API_KEY)'}                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
