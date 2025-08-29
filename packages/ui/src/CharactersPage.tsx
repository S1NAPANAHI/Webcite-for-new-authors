import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../packages/shared/src/supabaseClient.js';

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
  const textAreaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
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
          ref={el => { characterSectionRefs.current[index] = el; }}
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

