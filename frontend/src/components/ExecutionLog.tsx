import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, AlertCircle, Info, AlertTriangle, Activity } from 'lucide-react';

interface LogEntry {
    timestamp: string;
    level: 'info' | 'success' | 'warning' | 'error';
    message: string;
}

interface ExecutionLogProps {
    logs: LogEntry[];
    currentStep?: number;
    totalSteps?: number;
}

const LogIcon = ({ level }: { level: string }) => {
    switch (level) {
        case 'success':
            return <CheckCircle className="w-4 h-4" />;
        case 'error':
            return <AlertCircle className="w-4 h-4" />;
        case 'warning':
            return <AlertTriangle className="w-4 h-4" />;
        default:
            return <Info className="w-4 h-4" />;
    }
};

export const ExecutionLog = ({ logs, currentStep, totalSteps }: ExecutionLogProps) => {
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="cyber-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-[#8a2be2]" />
                    <h3 className="text-lg font-bold text-[#8a2be2]" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '2px' }}>
                        EXECUTION LOG
                    </h3>
                </div>
                {currentStep !== undefined && totalSteps !== undefined && (
                    <div className="px-3 py-1 rounded-lg" style={{ background: 'rgba(138, 43, 226, 0.1)', border: '1px solid rgba(138, 43, 226, 0.3)' }}>
                        <span className="text-sm font-mono">
                            <span className="text-[#8a2be2]">{currentStep}</span>
                            <span className="text-gray-600"> / </span>
                            <span className="text-gray-400">{totalSteps}</span>
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                <AnimatePresence initial={false}>
                    {logs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center h-full"
                        >
                            <div className="text-center space-y-2">
                                <Activity className="w-12 h-12 text-gray-700 mx-auto opacity-30" />
                                <p className="text-gray-600 text-sm font-mono">AWAITING COMMANDS...</p>
                            </div>
                        </motion.div>
                    ) : (
                        logs.map((log, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className={`log-entry log-${log.level} flex items-start gap-2`}
                            >
                                <LogIcon level={log.level} />
                                <div className="flex-1 min-w-0">
                                    <p className="break-words">{log.message}</p>
                                    <p className="text-xs opacity-60 mt-1">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
                <div ref={logEndRef} />
            </div>
        </div>
    );
};
