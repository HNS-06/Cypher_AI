import { motion } from 'framer-motion';

export const AmbientLighting = () => {
    // Generate random positions and colors for lighting orbs
    const lights = [
        { color: 'rgba(0, 255, 157, 0.15)', size: 400, x: '10%', y: '20%', duration: 20 },
        { color: 'rgba(0, 212, 255, 0.12)', size: 350, x: '80%', y: '10%', duration: 25 },
        { color: 'rgba(138, 43, 226, 0.1)', size: 450, x: '70%', y: '70%', duration: 22 },
        { color: 'rgba(255, 0, 128, 0.08)', size: 300, x: '20%', y: '80%', duration: 28 },
        { color: 'rgba(0, 255, 157, 0.1)', size: 380, x: '50%', y: '50%', duration: 30 },
        { color: 'rgba(0, 212, 255, 0.08)', size: 320, x: '90%', y: '60%', duration: 24 },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {lights.map((light, index) => (
                <motion.div
                    key={index}
                    className="absolute rounded-full"
                    style={{
                        width: light.size,
                        height: light.size,
                        background: `radial-gradient(circle, ${light.color} 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        left: light.x,
                        top: light.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                        x: [0, 30, -20, 40, 0],
                        y: [0, -40, 30, -20, 0],
                        scale: [1, 1.1, 0.9, 1.05, 1],
                        opacity: [0.3, 0.5, 0.4, 0.6, 0.3],
                    }}
                    transition={{
                        duration: light.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                />
            ))}

            {/* Additional smaller accent lights */}
            {[...Array(8)].map((_, index) => (
                <motion.div
                    key={`accent-${index}`}
                    className="absolute rounded-full"
                    style={{
                        width: 150,
                        height: 150,
                        background: `radial-gradient(circle, ${['rgba(0, 255, 157, 0.2)', 'rgba(0, 212, 255, 0.2)', 'rgba(138, 43, 226, 0.15)'][index % 3]
                            } 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                        x: [0, Math.random() * 50 - 25],
                        y: [0, Math.random() * 50 - 25],
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                />
            ))}

            {/* Subtle light rays */}
            <motion.div
                className="absolute top-0 left-1/4 w-px h-full"
                style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 157, 0.1) 50%, transparent 100%)',
                    filter: 'blur(2px)',
                }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scaleY: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-0 right-1/3 w-px h-full"
                style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.1) 50%, transparent 100%)',
                    filter: 'blur(2px)',
                }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scaleY: [1, 1.1, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
        </div>
    );
};
