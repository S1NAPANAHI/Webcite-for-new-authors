import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { LatestPosts } from './components/LatestPosts';

// --- TYPE DEFINITIONS ---
export type HomepageContentItem = {
  id: number;
  created_at: string;
  title?: string;
  content: string;
  section: string;
};
export type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  created_at: string;
};
export type ReleaseItem = {
  id: string;
  created_at: string;
  title: string;
  type: string;
  link?: string;
};

// --- NEW DUAL SCROLLING TEXT PROPHECY COMPONENT ---
const DualScrollingProphecy: React.FC<{ spinsLeft: number, setSpinsLeft: React.Dispatch<React.SetStateAction<number>>, onSpin?: (spinCount: number) => Promise<void> }> = ({ spinsLeft, setSpinsLeft, onSpin }) => {
    const englishReelRef = useRef<HTMLDivElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const itemHeight = 150;

    const fortunes = [
        { english: "Your heart is a compass that always points toward love—trust it, follow it, honor it." },
        { english: "You are not who you were yesterday unless you choose to be—each day offers the gift of becoming." },
        { english: "The friend of truth shall be the friend of my spirit, O Ahura Mazda. (Yasna 46.2)" },
        { english: "Every moment is sacred when approached with reverence, every task holy when performed with love." },
        { english: "The mind aligned with truth thinks God's thoughts after Him, sees with divine eyes, loves with cosmic heart." },
        { english: "May the beneficent spirit help us to speak truth and act righteously. (Yasna 47.6)" },
        { english: "Hope is the thing with feathers that perches in the soul and sings without words." },
        { english: "Self-knowledge is the beginning of wisdom, self-acceptance the foundation of growth." },
        { english: "Grant me, O Truth, the rewards of good thinking that bring joy and satisfaction. (Yasna 50.4)" },
        { english: "The sacred fire burns brightest in the heart that chooses truth over comfort. Let your conscience be the altar where right intention dwells." }
    ];

    const numRepeats = 5;
    const prePendCount = fortunes.length;

    const baseReelItems = [];
    for (let i = 0; i < numRepeats; i++) {
        baseReelItems.push(...fortunes);
    }

    const reelItems = [
        ...baseReelItems.slice(baseReelItems.length - prePendCount),
        ...baseReelItems,
        ...baseReelItems.slice(0, prePendCount)
    ];

    const handleSpin = async () => {
        if (isSpinning || !englishReelRef.current || spinsLeft <= 0) {
            return;
        }

        try {
            const sound = new Audio('/gear-click-351962.mp3');
            sound.play().catch(e => console.error("Error playing sound:", e));
        } catch (e) {
            console.error("Error creating Audio object:", e);
        }
        setIsSpinning(true);
        setSpinsLeft(prev => prev - 1);

        if (onSpin) {
            try {
                await onSpin(3 - spinsLeft + 1);
            } catch (error) {
                console.error('Error updating spin count:', error);
            }
        }

        const finalIndexInFortunes = Math.floor(Math.random() * fortunes.length);
        const targetIndexInReelItems = prePendCount + finalIndexInFortunes + (fortunes.length * Math.floor(numRepeats / 2));
        
        const englishTargetY = targetIndexInReelItems * itemHeight;
        englishReelRef.current.classList.add('prophecy-reel-spinning');
        englishReelRef.current.style.transform = `translateY(-${englishTargetY}px)`;

        setTimeout(() => {
            if (!englishReelRef.current) return;
            englishReelRef.current.classList.remove('prophecy-reel-spinning');
            
            englishReelRef.current.style.transition = 'none';
            const englishResetY = finalIndexInFortunes * itemHeight;
            englishReelRef.current.style.transform = `translateY(-${englishResetY}px)`;
            
            void englishReelRef.current.offsetHeight;

            englishReelRef.current.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
            setIsSpinning(false);
        }, 1600);
    };

    return (
        <>
            <div className={styles.prophecyMask} onClick={handleSpin}>
                <div ref={englishReelRef} className={styles.prophecyReel}>
                    {reelItems.map((item, index) => (
                        <div key={index} className={styles.prophecyItem}>
                            <span className={styles.englishText}>{item.english}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

// --- UI COMPONENTS ---
const HeroSection: React.FC<{ contentMap: Map<string, HomepageContentItem>, spinsLeft: number, setSpinsLeft: React.Dispatch<React.SetStateAction<number>>, onSpin?: (spinCount: number) => Promise<void> }> = ({ contentMap, spinsLeft, setSpinsLeft, onSpin }) => {
    const title = contentMap.get('hero_title')?.content || 'Zoroasterverse';
    const quote = contentMap.get('hero_quote')?.content || '"Happiness comes to them who bring happiness to others."';
    const intro = contentMap.get('hero_description')?.content || 'Learn about the teachings of the prophet Zarathustra, the history of one of the world\'s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.';

    return (
        <section id="home" className={styles.zrHero}>
            <div className={styles.zrHeroContent}>
                <h1 className={styles.zrTitle}>{title}</h1>
                <p className={styles.zrQuote}>{quote}</p>
                <p className={styles.zrIntro}>{intro}</p>
                <Link className={styles.zrCta} to="/blog/about">
                    Learn More
                </Link>
            </div>
            <figure className={styles.zrHeroArt} aria-labelledby="art-caption">
                <video 
                    src="/200716-913538378.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className={styles.videoFire}
                />
                <div className={styles.spinsIndicator}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`${styles.spinDot} ${i < spinsLeft ? styles.spinDotActive : ''}`}></div>
                    ))}
                </div>
                <DualScrollingProphecy spinsLeft={spinsLeft} setSpinsLeft={setSpinsLeft} onSpin={onSpin} />
                <figcaption id="art-caption" className="sr-only">
                    A stylized winged figure above a sacred fire.
                </figcaption>
            </figure>
        </section>
    );
};

const LatestReleases: React.FC<{ releases: ReleaseItem[] }> = ({ releases }) => {
    const [isDark, setIsDark] = useState(false);

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            const isDarkMode = document.documentElement.classList.contains('dark') ||
                              window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(isDarkMode);
        };

        checkDarkMode();

        // Listen for theme changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', checkDarkMode);

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener('change', checkDarkMode);
        };
    }, []);

    return (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Latest Releases</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {releases.map(release => (
                    <div key={release.id} className={`${styles.parchmentCard} ${
                        isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
                    }`}>
                        <h3 className={isDark ? 'text-white' : 'text-gray-900'}>{release.title}</h3>
                        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Type: {release.type}</p>
                        <a href={release.link || '#'} className={`mt-4 inline-block ${
                            isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
                        }`}>View Details / Purchase</a>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Props interface for HomePage
interface HomePageProps {
  homepageData?: HomepageContentItem[];
  latestPosts?: Post[];
  releaseData?: ReleaseItem[];
  spinsLeft?: number;
  isLoading?: boolean;
  isError?: boolean;
  onSpin?: (spinCount: number) => Promise<void>;
  supabaseClient?: any;
}

// --- MAIN HOME PAGE COMPONENT ---
export const HomePage: React.FC<HomePageProps> = ({ 
  homepageData = [], 
  latestPosts = [], 
  releaseData = [], 
  spinsLeft = 0,
  isLoading = false,
  isError = false,
  onSpin,
  supabaseClient
}) => {
  const [currentSpinsLeft, setCurrentSpinsLeft] = useState(spinsLeft);
  const [isDark, setIsDark] = useState(false);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
                        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  if (isLoading) return <div className={`text-center py-8 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`}>Loading homepage content...</div>;
  
  if (isError) return <div className="text-center py-8 text-red-400">Error loading homepage content.</div>;

  const contentMap = new Map(homepageData?.map(item => [item.section, item]));

  console.log('🏠 UI HomePage: Rendering with comprehensive debug info:', {
    hasSupabaseClient: !!supabaseClient,
    supabaseClientType: typeof supabaseClient,
    supabaseClientKeys: supabaseClient ? Object.keys(supabaseClient).slice(0, 5) : [],
    postsCount: latestPosts.length,
    spinsLeft: currentSpinsLeft,
    homepageDataLength: homepageData.length,
    releaseDataLength: releaseData.length
  });

  // CRITICAL: Also set global window for backup
  useEffect(() => {
    if (supabaseClient && typeof window !== 'undefined') {
      (window as any).__supabase = supabaseClient;
      console.log('🔗 UI HomePage: Set supabase client on window object as backup');
    }
  }, [supabaseClient]);

  return (
    <div>
      <HeroSection contentMap={contentMap} spinsLeft={currentSpinsLeft} setSpinsLeft={setCurrentSpinsLeft} onSpin={onSpin} />

      {/* Statistics Section */}
      <section className={styles.zrSection}>
          <h2 className={styles.zrH2}>Our Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className={`${styles.parchmentCard} ${
                isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
              }`}>
                  <h3 className={`text-4xl font-bold ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                      {contentMap.get('statistics_words_written')?.content || '0'}
                  </h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Words Written</p>
              </div>
              <div className={`${styles.parchmentCard} ${
                isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
              }`}>
                  <h3 className={`text-4xl font-bold ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                      {contentMap.get('statistics_beta_readers')?.content || '0'}
                  </h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Beta Readers</p>
              </div>
              <div className={`${styles.parchmentCard} ${
                isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
              }`}>
                  <h3 className={`text-4xl font-bold ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                      {contentMap.get('statistics_average_rating')?.content || '0'}
                  </h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Average Rating</p>
              </div>
              <div className={`${styles.parchmentCard} ${
                isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
              }`}>
                  <h3 className={`text-4xl font-bold ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                      {contentMap.get('statistics_books_published')?.content || '0'}
                  </h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Books Published</p>
              </div>
          </div>
      </section>
      
      {/* 🔥 LATEST NEWS & UPDATES - Now using standalone component with guaranteed client passing */}
      <section className={styles.zrSection}>
        <h2 className={styles.zrH2}>Latest News & Updates</h2>
        <LatestPosts 
          supabaseClient={supabaseClient} 
          limit={5}
        />
      </section>
      
      <LatestReleases releases={releaseData || []} />

      <section className={styles.zrSection}>
          <h2 className={styles.zrH2}>Artist Collaboration</h2>
          <div className="relative rounded-lg shadow-lg overflow-hidden w-full">
              <img src="/images/invite_to_Colab_card.png" alt="Artist Collaboration Invitation" className="w-full h-full object-contain" />
              <div className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8 ${
                isDark ? 'bg-opacity-70' : 'bg-opacity-50'
              }`}>
                  <h3 className="text-2xl font-bold text-white mb-4 text-shadow-md">Join Our Creative Team!</h3>
                  <p className="text-white mb-6 text-shadow-sm">We're looking for talented artists to help shape the visual identity of the Zangar/Spandam Series. Explore revenue-share opportunities and bring your vision to life.</p>
                  <Link to="/artist-collaboration" className={`inline-block font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                    isDark ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}>
                      Apply Now
                  </Link>
              </div>
          </div>
      </section>
    </div>
  );
};