import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Maximize2, Activity } from 'lucide-react';

interface BrowserPreviewProps {
    screenshot: string | null;
    currentUrl?: string;
    isLoading?: boolean;
}

export const BrowserPreview = ({ screenshot, currentUrl, isLoading }: BrowserPreviewProps) => {
    return (
        <div className="cyber-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-[#00d4ff]" />
                    <h3 className="text-lg font-bold text-[#00d4ff]" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '2px' }}>
                        BROWSER VIEWPORT
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && (
                        <Activity className="w-4 h-4 text-[#00ff9d] animate-pulse" />
                    )}
                    <button className="p-2 rounded-lg transition-all duration-300 hover:bg-[rgba(0,255,157,0.1)]">
                        <Maximize2 className="w-4 h-4 text-[#00ff9d]" />
                    </button>
                </div>
            </div>

            {currentUrl && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 px-4 py-2 rounded-lg"
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                    }}
                >
                    <p className="text-xs text-gray-500 font-mono">CURRENT URL</p>
                    <p className="text-sm text-[#00d4ff] font-mono truncate">{currentUrl}</p>
                </motion.div>
            )}

            <div className="flex-1 relative rounded-xl overflow-hidden neon-border">
                <div className="absolute inset-0" style={{ background: 'rgba(0, 0, 0, 0.8)' }} />

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="text-center space-y-4">
                                <div className="relative w-20 h-20 mx-auto">
                                    <motion.div
                                        className="absolute inset-0 border-4 border-transparent border-t-[#00ff9d] rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div
                                        className="absolute inset-2 border-4 border-transparent border-r-[#00d4ff] rounded-full"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                                <p className="text-[#00ff9d] font-mono">LOADING VIEWPORT...</p>
                            </div>
                        </motion.div>
                    ) : screenshot ? (
                        <motion.img
                            key="screenshot"
                            src={`data:image/png;base64,${screenshot}`}
                            alt="Browser screenshot"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full h-full object-contain relative z-10"
                        />
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="text-center space-y-3">
                                <Monitor className="w-20 h-20 text-[#00ff9d] mx-auto opacity-30" />
                                <p className="text-[#00ff9d] font-mono">NO ACTIVE SESSION</p>
                                <p className="text-sm text-gray-600">Execute a command to initialize</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
