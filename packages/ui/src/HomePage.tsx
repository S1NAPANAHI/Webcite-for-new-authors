import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

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

// Add BlogPost interface for the real blog posts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author?: string;
  published_at: string;
  views?: number;
  category?: string;
  reading_time?: number;
}

// --- NEW DUAL SCROLLING TEXT PROPHECY COMPONENT ---
const DualScrollingProphecy: React.FC<{ spinsLeft: number, setSpinsLeft: React.Dispatch<React.SetStateAction<number>>, onSpin?: (spinCount: number) => Promise<void> }> = ({ spinsLeft, setSpinsLeft, onSpin }) => {
    const englishReelRef = useRef<HTMLDivElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const itemHeight = 150; // Must match .prophecyItem height in CSS

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

    // Create a long, seamless loop for the reel
    const numRepeats = 5; // Number of times to repeat the fortunes array
    const prePendCount = fortunes.length; // Number of items to prepend for smooth loop

    const baseReelItems = [];
    for (let i = 0; i < numRepeats; i++) {
        baseReelItems.push(...fortunes);
    }

    const reelItems = [
        ...baseReelItems.slice(baseReelItems.length - prePendCount),
        ...baseReelItems,
        ...baseReelItems.slice(0, prePendCount) // Append for smooth loop
    ];

    const handleSpin = async () => {
        if (isSpinning || !englishReelRef.current || spinsLeft <= 0) {
            console.log('No spins left or already spinning.');
            return;
        }

        console.log('handleSpin called'); // Debugging line
        try {
            const sound = new Audio('/gear-click-351962.mp3');
            sound.play().catch(e => console.error("Error playing sound:", e));
        } catch (e) {
            console.error("Error creating Audio object:", e);
        }
        setIsSpinning(true);
        setSpinsLeft(prev => prev - 1); // Decrement spins left

        // Call external spin handler if provided
        if (onSpin) {
            try {
                await onSpin(3 - spinsLeft + 1);
            } catch (error) {
                console.error('Error updating spin count:', error);
            }
        }

        const finalIndexInFortunes = Math.floor(Math.random() * fortunes.length);
        // Calculate target index within the *middle* section of baseReelItems
        const targetIndexInReelItems = prePendCount + finalIndexInFortunes + (fortunes.length * Math.floor(numRepeats / 2));
        
        // English reel scrolls up (negative transform)
        const englishTargetY = targetIndexInReelItems * itemHeight;
            englishReelRef.current.classList.add('prophecy-reel-spinning');
        englishReelRef.current.style.transform = `translateY(-${englishTargetY}px)`;

        

        setTimeout(() => {
            if (!englishReelRef.current) return;
            englishReelRef.current.classList.remove('prophecy-reel-spinning');
            
            // Reset English reel to the equivalent position in the *first* repetition
            englishReelRef.current.style.transition = 'none';
            const englishResetY = finalIndexInFortunes * itemHeight;
            englishReelRef.current.style.transform = `translateY(-${englishResetY}px)`;
            
            
            
            void englishReelRef.current.offsetHeight; // Force reflow

            englishReelRef.current.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
            setIsSpinning(false);
        }, 1600); // Slightly longer than 1.5s transition in CSS for smoother reset
    };

    return (
        <>
            {/* English Reel (Top Left) */}
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

// 🔥 FIXED: Dynamic Latest Posts component that fetches real blog posts
const LatestPosts: React.FC<{ posts: Post[] }> = ({ posts }) => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fallback posts for when no real posts exist
    const fallbackPosts: BlogPost[] = [
        {
            id: 'fallback-1',
            title: 'Welcome to Zoroasterverse',
            slug: 'welcome-to-zoroasterverse',
            excerpt: 'Discover the ancient wisdom of Zoroastrianism and its profound impact on modern spirituality.',
            content: 'Welcome to Zoroasterverse, your gateway to understanding one of the world\'s oldest monotheistic religions.',
            featured_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
            author: 'Zoroasterverse Team',
            published_at: new Date().toISOString(),
            views: 234,
            category: 'Philosophy',
            reading_time: 5
        },
        {
            id: 'fallback-2',
            title: 'The Sacred Fire: Symbol of Divine Light',
            slug: 'sacred-fire-divine-light',
            excerpt: 'Fire holds a central place in Zoroastrian worship, representing the light of Ahura Mazda.',
            content: 'In Zoroastrian tradition, fire serves as a symbol of purity and divine presence.',
            featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
            author: 'Zoroasterverse Team',
            published_at: new Date(Date.now() - 86400000).toISOString(),
            views: 456,
            category: 'Religion',
            reading_time: 7
        },
        {
            id: 'fallback-3',
            title: 'Good Thoughts, Good Words, Good Deeds',
            slug: 'good-thoughts-words-deeds',
            excerpt: 'The threefold path of righteousness that guides Zoroastrians in ethical living.',
            content: 'Humata, Hukhta, Hvarshta - the foundation of Zoroastrian ethics and spiritual practice.',
            featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            author: 'Zoroasterverse Team',
            published_at: new Date(Date.now() - 172800000).toISOString(),
            views: 678,
            category: 'Philosophy',
            reading_time: 6
        }
    ];

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                console.log('🔥 UI Package LatestPosts: Fetching blog posts...');
                
                // We need to import supabase here, but since this is a UI package,
                // we'll try to use the global window object or check if supabase is available
                const supabaseClient = (window as any).supabase || null;
                
                if (!supabaseClient) {
                    console.log('📦 UI Package: No supabase client available, using fallback posts');
                    setBlogPosts(fallbackPosts);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabaseClient
                    .from('blog_posts')
                    .select(`
                        id,
                        title,
                        slug,
                        excerpt,
                        content,
                        featured_image,
                        author,
                        published_at,
                        views,
                        category,
                        reading_time
                    `)
                    .eq('status', 'published')
                    .not('published_at', 'is', null)
                    .order('published_at', { ascending: false })
                    .limit(3);

                console.log('🔥 UI Package LatestPosts: Database response:', { data, error });

                if (error) {
                    console.error('❌ UI Package LatestPosts: Database error:', error);
                    setBlogPosts(fallbackPosts);
                } else if (data && data.length > 0) {
                    console.log(`✅ UI Package LatestPosts: Found ${data.length} real blog posts`);
                    setBlogPosts(data as BlogPost[]);
                } else {
                    console.log('📝 UI Package LatestPosts: No published posts, using fallback');
                    setBlogPosts(fallbackPosts);
                }
            } catch (err) {
                console.error('💥 UI Package LatestPosts: Critical error:', err);
                setBlogPosts(fallbackPosts);
                setError('Using fallback content due to error');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Recent';
        }
    };

    const calculateReadTime = (content: string, reading_time?: number) => {
        if (reading_time) return reading_time;
        const words = content.split(/\s+/).length;
        return Math.max(Math.ceil(words / 200), 1);
    };

    if (loading) {
        return (
            <section className={styles.zrSection}>
                <h2 className={styles.zrH2}>Latest News & Updates</h2>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Latest News & Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => {
                    const excerpt = post.excerpt || (post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content);
                    return (
                        <div key={post.id} className={`${styles.parchmentCard} relative group hover:shadow-xl transition-all duration-300`}>
                            {/* Featured Image */}
                            {post.featured_image && (
                                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                                    <img 
                                        src={post.featured_image} 
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* Latest Badge for first post */}
                            {index === 0 && (
                                <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    ✨ LATEST
                                </div>
                            )}
                            
                            {/* Category */}
                            {post.category && (
                                <div className="mb-2">
                                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                            )}
                            
                            <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">{post.title}</h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: excerpt }}></p>
                            
                            {/* Meta info */}
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <span>By {post.author || 'Zoroasterverse Team'}</span>
                                <span>{formatDate(post.published_at)}</span>
                                <span>{calculateReadTime(post.content, post.reading_time)}m read</span>
                            </div>
                            
                            <Link 
                                to={`/blog/${post.slug}`} 
                                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm group-hover:underline"
                            >
                                Read More 
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    );
                })}
            </div>
            
            {/* Show debug info in development */}
            {process.env.NODE_ENV === 'development' && error && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-sm">
                    <strong>Debug:</strong> {error}
                </div>
            )}
        </section>
    );
};

const LatestReleases: React.FC<{ releases: ReleaseItem[] }> = ({ releases }) => {
    return (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Latest Releases</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {releases.map(release => (
                    <div key={release.id} className={styles.parchmentCard}>
                        <h3>{release.title}</h3>
                        <p className="mt-2">Type: {release.type}</p>
                        <a href={release.link || '#'} className="mt-4 inline-block">View Details / Purchase</a>
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
}

// --- MAIN HOME PAGE COMPONENT ---
export const HomePage: React.FC<HomePageProps> = ({ 
  homepageData = [], 
  latestPosts = [], 
  releaseData = [], 
  spinsLeft = 0,
  isLoading = false,
  isError = false,
  onSpin
}) => {
  const [currentSpinsLeft, setCurrentSpinsLeft] = useState(spinsLeft);

  if (isLoading) return <div className="text-center py-8">Loading homepage content...</div>;
  if (isError) return <div className="text-center py-8 text-red-400">Error loading homepage content.</div>;

  const contentMap = new Map(homepageData?.map(item => [item.section, item]));

  console.log('🏠 UI Package HomePage: Rendering with posts:', latestPosts.length);

  return (
    <div>
      <HeroSection contentMap={contentMap} spinsLeft={currentSpinsLeft} setSpinsLeft={setCurrentSpinsLeft} onSpin={onSpin} />

      {/* Statistics Section */}
      <section className={styles.zrSection}>
          <h2 className={styles.zrH2}>Our Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_words_written')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Words Written</p>
              </div>
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_beta_readers')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Beta Readers</p>
              </div>
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_average_rating')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Average Rating</p>
              </div>
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_books_published')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Books Published</p>
              </div>
          </div>
      </section>
      
      {/* 🔥 This is the ACTUAL "Latest News & Updates" section that shows on your homepage */}
      <LatestPosts posts={latestPosts || []} />
      
      <LatestReleases releases={releaseData || []} />

      <section className={styles.zrSection}>
          <h2 className={styles.zrH2}>Artist Collaboration</h2>
          <div className="relative rounded-lg shadow-lg overflow-hidden w-full">
              <img src="/images/invite_to_Colab_card.png" alt="Artist Collaboration Invitation" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 text-shadow-md">Join Our Creative Team!</h3>
                  <p className="text-white mb-6 text-shadow-sm">We're looking for talented artists to help shape the visual identity of the Zangar/Spandam Series. Explore revenue-share opportunities and bring your vision to life.</p>
                  <Link to="/artist-collaboration" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                      Apply Now
                  </Link>
              </div>
          </div>
      </section>
    </div>
  );
};