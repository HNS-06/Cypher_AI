import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Sparkles } from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import { CommandInput } from './components/CommandInput';
import { BrowserPreview } from './components/BrowserPreview';
import { ExecutionLog } from './components/ExecutionLog';
import { StatusBar } from './components/StatusBar';
import { StarterScreen } from './components/StarterScreen';
import { AmbientLighting } from './components/AmbientLighting';

interface LogEntry {
    timestamp: string;
    level: 'info' | 'success' | 'warning' | 'error';
    message: string;
}

function App() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [currentUrl, setCurrentUrl] = useState<string>('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>();
    const [totalSteps, setTotalSteps] = useState<number>();
    const [aiConfigured, setAiConfigured] = useState(false);
    const [showStarter, setShowStarter] = useState(true);

    const { sendMessage, lastMessage, isConnected } = useWebSocket('ws://localhost:3001');

    // Check backend health on mount
    useEffect(() => {
        fetch('/api/health')
            .then(res => res.json())
            .then(data => {
                setAiConfigured(data.aiConfigured);
            })
            .catch(err => {
                console.error('Failed to check backend health:', err);
            });
    }, []);

    // Handle WebSocket messages
    useEffect(() => {
        if (!lastMessage) return;

        switch (lastMessage.type) {
            case 'execution_started':
                setIsExecuting(true);
                setLogs([{
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: `🚀 Starting execution: ${lastMessage.command}`
                }]);
                break;

            case 'progress':
                if (lastMessage.step && lastMessage.total) {
                    setCurrentStep(lastMessage.step);
                    setTotalSteps(lastMessage.total);
                }
                setLogs(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: lastMessage.message || 'Processing...'
                }]);
                break;

            case 'execution_complete':
                setIsExecuting(false);
                setCurrentStep(undefined);
                setTotalSteps(undefined);

                const result = lastMessage.result;

                // Add result logs
                if (result.log && Array.isArray(result.log)) {
                    setLogs(prev => [...prev, ...result.log]);
                }

                // Update screenshot
                if (result.screenshot) {
                    setScreenshot(result.screenshot);
                }

                // Add completion message
                setLogs(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    level: result.success ? 'success' : 'error',
                    message: result.success
                        ? `✅ Execution completed successfully!`
                        : `❌ Execution failed: ${result.error}`
                }]);

                // Update current URL if available
                if (result.plan?.steps) {
                    const navStep = result.plan.steps.find((s: any) => s.action === 'navigate');
                    if (navStep) {
                        setCurrentUrl(navStep.target);
                    }
                }
                break;

            case 'screenshot':
                if (lastMessage.screenshot) {
                    setScreenshot(lastMessage.screenshot);
                }
                break;

            case 'error':
                setLogs(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    level: 'error',
                    message: `❌ Error: ${lastMessage.error}`
                }]);
                setIsExecuting(false);
                break;
        }
    }, [lastMessage]);

    const handleCommandSubmit = (command: string) => {
        sendMessage({
            type: 'execute_command',
            command
        });
    };

    const handleStart = () => {
        setShowStarter(false);
    };

    if (showStarter) {
        return <StarterScreen onStart={handleStart} />;
    }

    return (
        <div className="min-h-screen p-6 relative">
            <AmbientLighting />
            <div className="max-w-[1800px] mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Code2 className="w-10 h-10 text-[#00ff9d]" />
                        <h1 className="text-5xl font-bold neon-text">
                            CYPHER
                        </h1>
                        <Sparkles className="w-8 h-8 text-[#00d4ff] animate-pulse" />
                    </div>
                    <p className="text-[#00d4ff] text-sm font-mono" style={{ letterSpacing: '3px' }}>
                        AUTONOMOUS BROWSER INTELLIGENCE
                    </p>
                </motion.div>

                {/* Status Bar */}
                <StatusBar
                    isConnected={isConnected}
                    isExecuting={isExecuting}
                    aiConfigured={aiConfigured}
                />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <CommandInput
                                onSubmit={handleCommandSubmit}
                                isExecuting={isExecuting}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="h-[500px]"
                        >
                            <ExecutionLog
                                logs={logs}
                                currentStep={currentStep}
                                totalSteps={totalSteps}
                            />
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="h-[calc(100vh-300px)] min-h-[600px]"
                    >
                        <BrowserPreview
                            screenshot={screenshot}
                            currentUrl={currentUrl}
                            isLoading={isExecuting && !screenshot}
                        />
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-600 text-xs font-mono"
                >
                    <p>POWERED BY PUPPETEER + GEMINI AI | CYPHER v1.0.0</p>
                </motion.div>
            </div>
        </div>
    );
}

export default App;
