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
  description?: string;
  release_date?: string;
};

// Prophecy quote interface
interface ProphecyQuote {
  english: string;
  author?: string;
}

// --- ENHANCED DUAL SCROLLING TEXT PROPHECY COMPONENT ---
const DualScrollingProphecy: React.FC<{ 
  spinsLeft: number, 
  setSpinsLeft: React.Dispatch<React.SetStateAction<number>>, 
  onSpin?: (spinCount: number) => Promise<void>,
  quotes?: ProphecyQuote[]
}> = ({ spinsLeft, setSpinsLeft, onSpin, quotes = [] }) => {
    const englishReelRef = useRef<HTMLDivElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const itemHeight = 150;

    // Default fallback quotes (your original quotes)
    const defaultFortunes = [
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

    // Use API quotes if available and properly formatted, otherwise use defaults
    const fortunes = (quotes && quotes.length > 0) ? quotes : defaultFortunes;
    
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

// --- ENHANCED UI COMPONENTS ---
const HeroSection: React.FC<{ 
  contentMap: Map<string, HomepageContentItem>, 
  homepageApiData?: any,
  spinsLeft: number, 
  setSpinsLeft: React.Dispatch<React.SetStateAction<number>>, 
  onSpin?: (spinCount: number) => Promise<void>,
  quotes?: ProphecyQuote[]
}> = ({ contentMap, homepageApiData, spinsLeft, setSpinsLeft, onSpin, quotes }) => {
    // Use API data if available, otherwise fall back to old contentMap system
    const apiContent = homepageApiData?.content;
    
    const title = apiContent?.hero_title || contentMap.get('hero_title')?.content || 'Zoroastervers';
    const quote = apiContent?.hero_quote || contentMap.get('hero_quote')?.content || '"Happiness comes to them who bring happiness to others."';
    const intro = apiContent?.hero_description || contentMap.get('hero_description')?.content || 'Learn about the teachings of the prophet Zarathustra, the history of one of the world\'s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.';
    const ctaText = apiContent?.cta_button_text || 'Learn More';
    const ctaLink = apiContent?.cta_button_link || '/blog/about';

    return (
        <section id="home" className={styles.zrHero}>
            <div className={styles.zrHeroContent}>
                <h1 className={styles.zrTitle}>{title}</h1>
                <p className={styles.zrQuote}>{quote}</p>
                <p className={styles.zrIntro}>{intro}</p>
                <Link className={styles.zrCta} to={ctaLink}>
                    {ctaText}
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
                <DualScrollingProphecy 
                    spinsLeft={spinsLeft} 
                    setSpinsLeft={setSpinsLeft} 
                    onSpin={onSpin}
                    quotes={quotes}
                />
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

    // Show empty state if no releases
    if (!releases || releases.length === 0) {
        return (
            <section className={styles.zrSection}>
                <h2 className={styles.zrH2}>Latest Releases</h2>
                <div className="text-center py-12">
                    <div className={`${styles.parchmentCard} ${isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'}`}>
                        <div className="p-8">
                            <div className="text-6xl mb-4 opacity-20">📚</div>
                            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                No Releases Yet
                            </h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                New chapter releases will appear here automatically when you publish content in your library.
                            </p>
                            <Link 
                                to="/library" 
                                className={`mt-4 inline-block px-4 py-2 rounded-lg transition-colors ${
                                    isDark ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                                }`}
                            >
                                Browse Library
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

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
                        {release.description && (
                            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {release.description}
                            </p>
                        )}
                        {release.release_date && (
                            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Released: {new Date(release.release_date).toLocaleDateString()}
                            </p>
                        )}
                        <a href={release.link || '#'} className={`mt-4 inline-block ${
                            isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
                        }`}>View Details</a>
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

// Simple hook to fetch homepage data directly
const useHomepageDataFallback = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try the API first
        const API_BASE = window.location.hostname === 'localhost' 
          ? 'http://localhost:3001'
          : 'https://webcite-for-new-authors.onrender.com';
          
        const response = await fetch(`${API_BASE}/api/homepage`);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ HomePage: Fetched API data successfully', data);
          setData(data);
          setQuotes(data.quotes || []);
        } else {
          console.log('🔄 HomePage: API failed, using defaults');
        }
      } catch (error) {
        console.log('🔄 HomePage: API unavailable, using defaults:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { data, isLoading, quotes };
};

// Helper function to format numbers for display
const formatMetricValue = (value: number, type: 'number' | 'rating' | 'words') => {
  switch (type) {
    case 'rating':
      return Number(value).toFixed(1);
    case 'words':
      return value >= 1000000 
        ? `${(value / 1000000).toFixed(1)}M`
        : value >= 1000 
          ? `${(value / 1000).toFixed(0)}K`
          : value.toString();
    case 'number':
    default:
      return value.toLocaleString();
  }
};

// Helper function to check if a section should be visible
const isSectionVisible = (sectionFlag: boolean | undefined, defaultValue: boolean = true): boolean => {
  // If sectionFlag is explicitly false, hide the section
  if (sectionFlag === false) {
    return false;
  }
  // If sectionFlag is true or undefined, use the default (which is true for all sections)
  return sectionFlag === true || (sectionFlag === undefined && defaultValue);
};

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
  // ALL HOOKS MUST BE CALLED IN THE SAME ORDER EVERY TIME
  const [currentSpinsLeft, setCurrentSpinsLeft] = useState(spinsLeft);
  const [isDark, setIsDark] = useState(false);
  
  // Use the fallback hook (always called in the same order)
  const fallbackHook = useHomepageDataFallback();
  const apiData = fallbackHook.data;
  const apiQuotes = fallbackHook.quotes;
  const apiLoading = fallbackHook.isLoading;
  
  // Transform quotes for prophecy wheel
  const prophecyQuotes = apiQuotes.map((quote: any) => ({
    english: quote.quote_text,
    author: quote.author
  }));

  // Dark mode detection - always called in the same order
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

  // Supabase client effect - always called in the same order
  useEffect(() => {
    if (supabaseClient && typeof window !== 'undefined') {
      (window as any).__supabase = supabaseClient;
      console.log('🔗 UI HomePage: Set supabase client on window object as backup');
    }
  }, [supabaseClient]);

  // Early return after all hooks have been called
  if (isLoading || apiLoading) {
    return (
      <div className={`text-center py-8 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Loading homepage content...
      </div>
    );
  }
  
  if (isError) {
    return <div className="text-center py-8 text-red-400">Error loading homepage content.</div>;
  }

  // For backward compatibility with old contentMap system
  const contentMap = new Map(homepageData?.map(item => [item.section, item]));
  
  // Use API metrics if available
  const metrics = apiData?.metrics;
  const sections = apiData?.sections;

  // Debug section visibility
  console.log('🏠 UI HomePage: Section visibility check:', {
    sections,
    show_progress_metrics: sections?.show_progress_metrics,
    show_latest_news: sections?.show_latest_news,
    show_latest_releases: sections?.show_latest_releases,
    show_artist_collaboration: sections?.show_artist_collaboration,
    progressVisible: isSectionVisible(sections?.show_progress_metrics),
    newsVisible: isSectionVisible(sections?.show_latest_news),
    releasesVisible: isSectionVisible(sections?.show_latest_releases),
    artistVisible: isSectionVisible(sections?.show_artist_collaboration)
  });

  console.log('🏠 UI HomePage: Rendering with API integration:', {
    hasSupabaseClient: !!supabaseClient,
    hasApiData: !!apiData,
    hasMetrics: !!metrics,
    quotesCount: prophecyQuotes.length,
    sectionsConfig: sections,
    releaseDataCount: releaseData?.length || 0
  });

  return (
    <div>
      <HeroSection 
        contentMap={contentMap} 
        homepageApiData={apiData}
        spinsLeft={currentSpinsLeft} 
        setSpinsLeft={setCurrentSpinsLeft} 
        onSpin={onSpin}
        quotes={prophecyQuotes}
      />

      {/* Statistics Section - Use API metrics if available */}
      {isSectionVisible(sections?.show_progress_metrics) && (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Our Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className={`${styles.parchmentCard} ${
                  isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
                }`}>
                    <h3 className={`text-4xl font-bold ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                        {metrics ? formatMetricValue(metrics.words_written, 'words') : (contentMap.get('statistics_words_written')?.content || '50K')}
                    </h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Words Written</p>
                </div>
                <div className={`${styles.parchmentCard} ${
                  isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
                }`}>
                    <h3 className={`text-4xl font-bold ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                        {metrics ? formatMetricValue(metrics.beta_readers, 'number') : (contentMap.get('statistics_beta_readers')?.content || '5')}
                    </h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Beta Readers</p>
                </div>
                <div className={`${styles.parchmentCard} ${
                  isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
                }`}>
                    <h3 className={`text-4xl font-bold ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                        {metrics ? formatMetricValue(metrics.average_rating, 'rating') : (contentMap.get('statistics_average_rating')?.content || '4.5')}
                    </h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Average Rating</p>
                </div>
                <div className={`${styles.parchmentCard} ${
                  isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900'
                }`}>
                    <h3 className={`text-4xl font-bold ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                        {metrics ? formatMetricValue(metrics.books_published, 'number') : (contentMap.get('statistics_books_published')?.content || '1')}
                    </h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Books Published</p>
                </div>
            </div>
        </section>
      )}
      
      {/* Latest News & Updates - Only show if enabled */}
      {isSectionVisible(sections?.show_latest_news) && (
        <section className={styles.zrSection}>
          <h2 className={styles.zrH2}>Latest News & Updates</h2>
          <LatestPosts 
            supabaseClient={supabaseClient} 
            limit={5}
          />
        </section>
      )}
      
      {/* Latest Releases - Only show if enabled */}
      {isSectionVisible(sections?.show_latest_releases) && (
        <LatestReleases releases={releaseData || []} />
      )}

      {/* Artist Collaboration - Only show if enabled */}
      {isSectionVisible(sections?.show_artist_collaboration) && (
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
      )}
    </div>
  );
};