import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';

// Define the type for a character item
type Character = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  image_url?: string;
  silhouette_url?: string;
};

// Async function to fetch characters from Supabase
const fetchCharacters = async (): Promise<Character[]> => {
  const { data, error } = await supabase.from('characters').select('*').order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Character[];
};

export const CharactersPage: React.FC = () => {
  const { data: characters, isLoading, isError, error } = useQuery<Character[]>({ queryKey: ['characters'], queryFn: fetchCharacters });

  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const characterSectionRefs = useRef<Array<HTMLElement | null>>([]);

  // Floating background elements
  useEffect(() => {
    if (floatingElementsRef.current) {
      const container = floatingElementsRef.current;
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.className = 'floating-dot';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.animationDelay = Math.random() * 6 + 's';
        dot.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(dot);
      }
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-50px'
    });

    characterSectionRefs.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      characterSectionRefs.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, [characters]); // Re-observe if characters data changes

  // Parallax effect for floating elements
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = floatingElementsRef.current?.querySelectorAll('.floating-dot');
      
      parallaxElements?.forEach((element, index) => {
        const speed = 0.5 + (index % 3) * 0.2;
        (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return <div className="text-center py-8 text-text-light">Loading characters...</div>;
  if (isError) return <div className="text-center py-8 text-red-400">Error loading characters: {error?.message}</div>;

  return (
    <>
      <style jsx>{`
        /* Basic Reset & Body */
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #e0e0e0;
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
        }

        .hero-title {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b35, #f7931e, #ffd23f);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
        }

        .hero-subtitle {
            font-size: 1.5rem;
            opacity: 0.8;
            margin-bottom: 2rem;
        }

        .upload-section {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 15px;
            border: 2px dashed rgba(255, 107, 53, 0.5);
            margin-top: 2rem;
            max-width: 500px;
        }

        .upload-area {
            text-align: center;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upload-area:hover {
            background: rgba(255, 107, 53, 0.1);
        }

        .file-input {
            display: none;
        }

        .upload-text {
            font-size: 1.1rem;
            margin-bottom: 10px;
        }

        .upload-hint {
            font-size: 0.9rem;
            opacity: 0.7;
        }

        .scroll-indicator {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-10px); }
            60% { transform: translateX(-50%) translateY(-5px); }
        }

        /* Character Section */
        .character-section {
            min-height: 100vh;
            padding: 100px 50px;
            display: flex;
            align-items: center;
            position: relative;
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .character-section.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .character-section:nth-child(even) {
            flex-direction: row-reverse;
            background: rgba(255, 255, 255, 0.02);
        }

        .character-silhouette {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .silhouette-container {
            width: 300px;
            height: 400px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 15px;
            overflow: hidden;
        }

        .silhouette-container:hover {
            transform: scale(1.05);
        }

        .character-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 15px;
            transition: all 0.3s ease;
        }

        .silhouette-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            transition: opacity 0.3s ease;
            pointer-events: none;
            border-radius: 15px;
            mask: var(--mask-image);
            -webkit-mask: var(--mask-image);
            mask-size: contain;
            -webkit-mask-size: contain;
            mask-repeat: no-repeat;
            -webkit-mask-repeat: no-repeat;
            mask-position: center;
            -webkit-mask-position: center;
        }

        .silhouette-container:hover .silhouette-overlay {
            opacity: 0;
        }

        .character-image.silhouette-mode {
            opacity: 0;
        }

        .upload-placeholder {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 2px dashed rgba(255, 107, 53, 0.5);
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upload-placeholder:hover {
            background: rgba(255, 107, 53, 0.1);
            border-color: rgba(255, 107, 53, 0.8);
        }

        .upload-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.7;
        }

        .character-info {
            flex: 1;
            padding: 0 50px;
            max-width: 600px;
        }

        .character-name {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .character-title {
            font-size: 1.3rem;
            color: #ffd23f;
            margin-bottom: 1.5rem;
            font-style: italic;
        }

        .character-description {
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .character-traits {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .trait {
            background: rgba(255, 107, 53, 0.2);
            border: 1px solid rgba(255, 107, 53, 0.4);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .trait:hover {
            background: rgba(255, 107, 53, 0.3);
            transform: translateY(-2px);
        }

        .floating-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .floating-dot {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 107, 53, 0.3);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        .image-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            display: flex;
            gap: 5px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .silhouette-container:hover .image-controls {
            opacity: 1;
        }

        .control-btn {
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .control-btn:hover {
            background: rgba(255, 107, 53, 0.8);
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            .hero-title { font-size: 2.5rem; }
            .character-section { 
                flex-direction: column !important; 
                padding: 50px 20px; 
                text-align: center;
            }
            .character-info { padding: 20px 0; } 
            .character-name { font-size: 2rem; } 
            .silhouette-container { width: 250px; height: 320px; } 
        }
      `}</style>
      <div ref={floatingElementsRef} className="floating-elements"></div>

      <section className="hero-section">
        <div>
          <h1 className="hero-title">Meet the Characters</h1>
          <p className="hero-subtitle">Journey into the world of extraordinary souls</p>
          {/* Removed upload section for now, will be handled in admin */}
          <div className="scroll-indicator">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {characters?.map((character, index) => (
        <section
          key={character.id}
          ref={el => characterSectionRefs.current[index] = el}
          className={`character-section ${index % 2 === 0 ? '' : ''}`}
        >
          <div className="character-silhouette">
            <div className="silhouette-container">
              {character.image_url ? (
                <>
                  <img src={character.image_url} alt={character.name} className="character-image" />
                  <div className="silhouette-overlay" style={{ '--mask-image': `url(${character.silhouette_url || character.image_url})` } as React.CSSProperties}></div>
                </>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <div>No Image</div>
                </div>
              )}
            </div>
          </div>
          <div className="character-info">
            <h2 className="character-name">{character.name}</h2>
            <p className="character-title">{character.title}</p>
            <p className="character-description">{character.description}</p>
            <div className="character-traits">
              {character.traits?.map((trait, traitIndex) => (
                <span key={traitIndex} className="trait">{trait}</span>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

