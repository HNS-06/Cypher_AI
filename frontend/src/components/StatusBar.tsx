import { motion } from 'framer-motion';
import { Activity, Wifi, WifiOff, Cpu, Zap } from 'lucide-react';

interface StatusBarProps {
    isConnected: boolean;
    isExecuting: boolean;
    aiConfigured: boolean;
}

export const StatusBar = ({ isConnected, isExecuting, aiConfigured }: StatusBarProps) => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="cyber-card mb-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <>
                                <div className="status-dot status-online" />
                                <Wifi className="w-5 h-5 text-[#00ff9d]" />
                            </>
                        ) : (
                            <>
                                <div className="status-dot status-offline" />
                                <WifiOff className="w-5 h-5 text-[#ff0080]" />
                            </>
                        )}
                        <span className="text-sm font-mono">
                            {isConnected ? (
                                <span className="text-[#00ff9d]">CONNECTED</span>
                            ) : (
                                <span className="text-[#ff0080]">DISCONNECTED</span>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Cpu className={`w-5 h-5 ${aiConfigured ? 'text-[#00d4ff]' : 'text-[#ffd700]'}`} />
                        <span className="text-sm font-mono">
                            {aiConfigured ? (
                                <span className="text-[#00d4ff]">AI READY</span>
                            ) : (
                                <span className="text-[#ffd700]">AI NOT CONFIGURED</span>
                            )}
                        </span>
                    </div>

                    {isExecuting && (
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#8a2be2] animate-pulse" />
                            <span className="text-sm font-mono text-[#8a2be2]">EXECUTING...</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-[#00ff9d] animate-pulse" />
                    <span className="text-xs font-mono text-gray-500">SYSTEM ACTIVE</span>
                </div>
            </div>
        </motion.div>
    );
};
