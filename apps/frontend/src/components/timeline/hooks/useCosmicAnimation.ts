import { useState, useEffect } from 'react';

export const useCosmicAnimation = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.1) % 360);
    }, 100); // Update every 100ms for smooth rotation

    return () => clearInterval(interval);
  }, [isAnimating]);

  const pauseAnimation = () => setIsAnimating(false);
  const resumeAnimation = () => setIsAnimating(true);

  return {
    rotationAngle,
    isAnimating,
    pauseAnimation,
    resumeAnimation
  };
};
