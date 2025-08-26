import React, { useEffect, useRef } from 'react';

const StarsBackground: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starsContainer = starsRef.current;
    if (!starsContainer) return;

    const numberOfStars = 50;
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star absolute bg-ink rounded-full'; // Use theme-aware ink color
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      const size = Math.random() * 3 + 1; // 1px to 4px
      star.style.width = star.style.height = size + 'px';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (Math.random() * 2 + 2) + 's'; // 2s to 4s
      starsContainer.appendChild(star);
    };

    // Clear existing stars if component re-renders
    starsContainer.innerHTML = '';
    for (let i = 0; i < numberOfStars; i++) {
      createStar();
    }

    // Parallax effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.1;
      if (starsContainer) {
        starsContainer.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={starsRef} className="stars fixed top-0 left-0 w-full h-full pointer-events-none -z-10"> {/* Removed bg-background */}
      {/* Stars will be injected here by JavaScript */}
    </div>
  );
};

export { StarsBackground };