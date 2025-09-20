import React, { useEffect, useRef } from 'react';

const StarsBackground: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starsContainer = starsRef.current;
    if (!starsContainer) return;

    const numberOfStars = 100;
    
    // Function to get theme-aware star color
    const getStarColor = (): string => {
      const rootStyles = getComputedStyle(document.documentElement);
      const starColor = rootStyles.getPropertyValue('--stars-color').trim();
      return starColor || '#4B1D6B'; // fallback for light mode
    };

    const getStarOpacity = (): string => {
      const rootStyles = getComputedStyle(document.documentElement);
      const opacity = rootStyles.getPropertyValue('--stars-opacity').trim();
      return opacity || '0.6'; // fallback opacity
    };

    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.position = 'absolute';
      // Use theme-aware color from CSS custom properties
      star.style.backgroundColor = 'var(--stars-color)';
      star.style.borderRadius = '50%';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      
      const size = Math.random() * 3 + 1; // 1px to 4px
      star.style.width = star.style.height = size + 'px';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (Math.random() * 2 + 3) + 's'; // 3s to 5s
      star.style.pointerEvents = 'none';
      
      // Use theme-aware opacity
      star.style.opacity = 'var(--stars-opacity)';
      
      // Add subtle glow effect for better visibility
      star.style.boxShadow = `0 0 ${size * 2}px var(--stars-color)`;
      
      // Add CSS animation class
      star.classList.add('animate-twinkle');
      
      // Add theme transition
      star.style.transition = 'background-color var(--transition), opacity var(--transition), box-shadow var(--transition)';
      
      starsContainer.appendChild(star);
    };

    const updateStarsTheme = () => {
      const stars = starsContainer.querySelectorAll('.star');
      stars.forEach((star) => {
        const element = star as HTMLElement;
        // Force update of CSS custom properties
        element.style.backgroundColor = 'var(--stars-color)';
        element.style.opacity = 'var(--stars-opacity)';
        const size = parseFloat(element.style.width);
        element.style.boxShadow = `0 0 ${size * 2}px var(--stars-color)`;
      });
    };

    // Clear existing stars if component re-renders
    starsContainer.innerHTML = '';
    
    // Create stars
    for (let i = 0; i < numberOfStars; i++) {
      createStar();
    }

    // Parallax effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.05; // Reduced parallax for subtlety
      if (starsContainer) {
        starsContainer.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          // Small delay to ensure CSS custom properties are updated
          setTimeout(updateStarsTheme, 50);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={starsRef} 
        className="stars fixed top-0 left-0 w-full h-full pointer-events-none -z-10 transition-opacity duration-300"
      >
        {/* Stars will be injected here by JavaScript */}
      </div>
      
      {/* Add the twinkle animation styles */}
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: var(--stars-opacity);
            transform: scale(1);
          }
          50% {
            opacity: calc(var(--stars-opacity) * 1.5);
            transform: scale(1.2);
          }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export { StarsBackground };