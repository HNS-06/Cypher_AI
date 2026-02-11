import { motion } from 'framer-motion';
import { Zap, Brain, Globe, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { AmbientLighting } from './AmbientLighting';

interface StarterScreenProps {
    onStart: () => void;
}

export const StarterScreen = ({ onStart }: StarterScreenProps) => {
    const features = [
        {
            icon: Brain,
            title: 'AI-Powered',
            description: 'Natural language understanding with Gemini',
            color: '#00ff9d'
        },
        {
            icon: Globe,
            title: 'Full Control',
            description: 'Complete browser automation capabilities',
            color: '#00d4ff'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Real-time execution and feedback',
            color: '#8a2be2'
        },
        {
            icon: Shield,
            title: 'Secure',
            description: 'Local execution with session recording',
            color: '#ff0080'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <AmbientLighting />

            {/* Animated background elements */}
            <div className="absolute inset-0 grid-bg opacity-20" />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        background: `rgba(0, 255, 157, ${Math.random() * 0.5})`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <div className="max-w-6xl w-full z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    {/* Logo */}
                    <motion.div
                        className="flex items-center justify-center gap-4 mb-6"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="relative"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-[#00ff9d] border-r-[#00d4ff]" />
                            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-b-[#8a2be2] border-l-[#ff0080]"
                                style={{ transform: 'rotate(45deg)' }} />
                        </motion.div>

                        <h1 className="text-7xl font-bold neon-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            CYPHER
                        </h1>

                        <Sparkles className="w-12 h-12 text-[#00ff9d] animate-pulse" />
                    </motion.div>

                    <motion.p
                        className="text-2xl text-[#00d4ff] mb-4"
                        style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '3px' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        AUTONOMOUS BROWSER INTELLIGENCE
                    </motion.p>

                    <motion.p
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Your AI-powered agent for intelligent web automation.
                        Command the web with natural language.
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="cyber-card group cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <feature.icon
                                className="w-12 h-12 mb-4 transition-all duration-300"
                                style={{ color: feature.color }}
                            />
                            <h3
                                className="text-xl font-bold mb-2"
                                style={{
                                    fontFamily: 'Rajdhani, sans-serif',
                                    color: feature.color
                                }}
                            >
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Start Button */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <motion.button
                        onClick={onStart}
                        className="cyber-button text-xl px-12 py-4 group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="flex items-center gap-3">
                            INITIALIZE CYPHER
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </span>
                    </motion.button>

                    <motion.p
                        className="mt-6 text-gray-500 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        Press to activate autonomous mode
                    </motion.p>
                </motion.div>

                {/* Version info */}
                <motion.div
                    className="text-center mt-12 text-gray-600 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    style={{ fontFamily: 'Fira Code, monospace' }}
                >
                    <p>CYPHER v1.0.0 | GEMINI AI POWERED | PUPPETEER ENGINE</p>
                    <p className="mt-1">[ SYSTEM READY ]</p>
                </motion.div>
            </div>
        </div>
    );
};
