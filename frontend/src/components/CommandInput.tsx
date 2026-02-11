import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Terminal, Zap } from 'lucide-react';

interface CommandInputProps {
    onSubmit: (command: string) => void;
    isExecuting: boolean;
}

const exampleCommands = [
    { cmd: 'Go to google.com and search for AI agents', icon: '🔍' },
    { cmd: 'Navigate to github.com and find trending repos', icon: '🚀' },
    { cmd: 'Take a full page screenshot', icon: '📸' },
    { cmd: 'Extract all links from this page', icon: '🔗' },
    { cmd: 'Scroll down 500 pixels smoothly', icon: '⬇️' },
];

export const CommandInput = ({ onSubmit, isExecuting }: CommandInputProps) => {
    const [command, setCommand] = useState('');
    const [showExamples, setShowExamples] = useState(false);

    const handleSubmit = () => {
        if (command.trim() && !isExecuting) {
            onSubmit(command.trim());
            setCommand('');
            setShowExamples(false);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleExampleClick = (example: string) => {
        setCommand(example);
        setShowExamples(false);
    };

    return (
        <div className="space-y-4">
            <div className="cyber-card">
                <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-5 h-5 text-[#00ff9d]" />
                    <span className="text-[#00ff9d] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '2px' }}>
                        COMMAND INPUT
                    </span>
                </div>

                <div className="relative">
                    <textarea
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setShowExamples(true)}
                        placeholder="Enter your command... (e.g., 'Navigate to google.com and search for AI')"
                        className="cyber-input min-h-[100px] resize-none pr-14"
                        disabled={isExecuting}
                    />

                    <motion.button
                        onClick={handleSubmit}
                        disabled={!command.trim() || isExecuting}
                        className="absolute bottom-3 right-3 p-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 212, 255, 0.2))',
                            border: '1px solid #00ff9d',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isExecuting ? (
                            <Sparkles className="w-5 h-5 text-[#00ff9d] animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 text-[#00ff9d]" />
                        )}
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {showExamples && !isExecuting && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="cyber-card space-y-2"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-[#00d4ff]" />
                            <span className="text-sm text-[#00d4ff] font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                QUICK COMMANDS
                            </span>
                        </div>
                        <div className="space-y-2">
                            {exampleCommands.map((example, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleExampleClick(example.cmd)}
                                    className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300"
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        border: '1px solid rgba(0, 255, 157, 0.2)',
                                    }}
                                    whileHover={{
                                        x: 4,
                                        borderColor: 'rgba(0, 255, 157, 0.5)',
                                        background: 'rgba(0, 255, 157, 0.05)',
                                    }}
                                >
                                    <span className="mr-2">{example.icon}</span>
                                    <span className="text-gray-300">{example.cmd}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
