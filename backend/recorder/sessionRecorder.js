import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SessionRecorder {
    constructor(sessionDir = './sessions') {
        this.sessionDir = sessionDir;
        this.currentSession = null;
    }

    /**
     * Start a new recording session
     */
    async startSession(metadata = {}) {
        const sessionId = `session_${Date.now()}`;
        const sessionPath = path.join(this.sessionDir, sessionId);

        try {
            await fs.mkdir(sessionPath, { recursive: true });
            await fs.mkdir(path.join(sessionPath, 'screenshots'), { recursive: true });

            this.currentSession = {
                id: sessionId,
                path: sessionPath,
                startTime: new Date().toISOString(),
                metadata,
                actions: [],
                screenshots: []
            };

            await this.saveSessionData();
            console.log(`📹 Started recording session: ${sessionId}`);

            return {
                success: true,
                sessionId
            };
        } catch (error) {
            console.error('Failed to start session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Record an action
     */
    async recordAction(action, result) {
        if (!this.currentSession) {
            return;
        }

        const actionRecord = {
            timestamp: new Date().toISOString(),
            action,
            result,
            index: this.currentSession.actions.length
        };

        this.currentSession.actions.push(actionRecord);
        await this.saveSessionData();
    }

    /**
     * Record a screenshot
     */
    async recordScreenshot(screenshotBase64, metadata = {}) {
        if (!this.currentSession) {
            return;
        }

        const screenshotIndex = this.currentSession.screenshots.length;
        const filename = `screenshot_${screenshotIndex}_${Date.now()}.png`;
        const filepath = path.join(this.currentSession.path, 'screenshots', filename);

        try {
            // Save screenshot file
            const buffer = Buffer.from(screenshotBase64, 'base64');
            await fs.writeFile(filepath, buffer);

            // Record metadata
            this.currentSession.screenshots.push({
                timestamp: new Date().toISOString(),
                filename,
                path: filepath,
                metadata,
                index: screenshotIndex
            });

            await this.saveSessionData();

            return {
                success: true,
                path: filepath
            };
        } catch (error) {
            console.error('Failed to save screenshot:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * End current session
     */
    async endSession(summary = {}) {
        if (!this.currentSession) {
            return {
                success: false,
                error: 'No active session'
            };
        }

        this.currentSession.endTime = new Date().toISOString();
        this.currentSession.summary = summary;

        await this.saveSessionData();

        const sessionId = this.currentSession.id;
        this.currentSession = null;

        console.log(`🏁 Ended recording session: ${sessionId}`);

        return {
            success: true,
            sessionId
        };
    }

    /**
     * Save session data to file
     */
    async saveSessionData() {
        if (!this.currentSession) {
            return;
        }

        const dataPath = path.join(this.currentSession.path, 'session.json');
        await fs.writeFile(dataPath, JSON.stringify(this.currentSession, null, 2));
    }

    /**
     * Load a session
     */
    async loadSession(sessionId) {
        const sessionPath = path.join(this.sessionDir, sessionId);
        const dataPath = path.join(sessionPath, 'session.json');

        try {
            const data = await fs.readFile(dataPath, 'utf-8');
            return {
                success: true,
                session: JSON.parse(data)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * List all sessions
     */
    async listSessions() {
        try {
            await fs.mkdir(this.sessionDir, { recursive: true });
            const entries = await fs.readdir(this.sessionDir, { withFileTypes: true });

            const sessions = [];
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const sessionData = await this.loadSession(entry.name);
                    if (sessionData.success) {
                        sessions.push({
                            id: entry.name,
                            startTime: sessionData.session.startTime,
                            endTime: sessionData.session.endTime,
                            actionCount: sessionData.session.actions.length,
                            screenshotCount: sessionData.session.screenshots.length
                        });
                    }
                }
            }

            return {
                success: true,
                sessions: sessions.sort((a, b) =>
                    new Date(b.startTime) - new Date(a.startTime)
                )
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default SessionRecorder;
