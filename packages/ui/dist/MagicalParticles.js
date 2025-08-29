import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
const MagicalParticles = () => {
    const [particles] = useState(() => Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.1
    })));
    return (_jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: particles.map(particle => (_jsx("div", { className: "absolute rounded-full bg-amber-400/30", style: {
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animation: `float ${particle.speed + 8}s linear infinite`,
                boxShadow: `0 0 ${particle.size * 4}px rgba(251, 191, 36, 0.4)`,
            } }, particle.id))) }));
};
export { MagicalParticles };
