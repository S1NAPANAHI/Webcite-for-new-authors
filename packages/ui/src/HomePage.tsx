import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

// Import supabase from shared package
try {
  // This will work when the shared package is properly built and available
  var { supabase } = await import('@zoroaster/shared');
} catch (e) {
  console.log('UI Package: Could not import supabase from @zoroaster/shared');
}

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

// 🔥 FIXED: Latest Posts component that shows your blog posts
const LatestPosts: React.FC<{ posts: Post[], supabaseClient?: any }> = ({ posts, supabaseClient }) => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [usingSampleData, setUsingSampleData] = useState(false);

    // Professional fallback posts
    const fallbackPosts: BlogPost[] = [
        {
            id: 'fallback-1',
            title: 'Welcome to Zoroasterverse',
            slug: 'welcome-to-zoroasterverse',
            excerpt: 'Discover the ancient wisdom of Zoroastrianism and its profound impact on modern spirituality and philosophy.',
            content: 'Welcome to Zoroasterverse, your gateway to understanding one of the world\'s oldest monotheistic religions. Here, we explore the rich history, profound philosophy, and enduring wisdom of Zoroastrianism.',
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
            excerpt: 'Fire holds a central place in Zoroastrian worship, representing the light of Ahura Mazda and the path to truth.',
            content: 'In Zoroastrian tradition, fire is not worshipped itself but serves as a symbol of Ahura Mazda\'s light and purity. Fire temples around the world maintain this sacred flame as a focal point for prayer and meditation.',
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
            excerpt: 'The threefold path of righteousness that guides Zoroastrians in living a life aligned with truth and goodness.',
            content: 'Humata, Hukhta, Hvarshta - the foundation of Zoroastrian ethics. This principle emphasizes the importance of righteousness in thought, speech, and action as the path to spiritual fulfillment.',
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
                console.log('🔥 UI LatestPosts: Starting blog posts fetch...');
                
                // Try multiple ways to get supabase client
                let client = supabaseClient;
                
                // Try to import from shared package
                if (!client) {
                    try {
                        const sharedModule = await import('@zoroaster/shared');
                        client = sharedModule.supabase;
                        console.log('✅ UI LatestPosts: Successfully imported supabase from @zoroaster/shared');
                    } catch (importError) {
                        console.log('⚠️ UI LatestPosts: Could not import from @zoroaster/shared:', importError);
                    }
                }
                
                // Try global window as fallback
                if (!client && typeof window !== 'undefined') {
                    client = (window as any).__supabase || (window as any).supabase;
                    if (client) {
                        console.log('✅ UI LatestPosts: Found supabase on window object');
                    }
                }
                
                if (!client) {
                    console.log('📦 UI LatestPosts: No supabase client available, using fallback posts');
                    setBlogPosts(fallbackPosts);
                    setUsingSampleData(true);
                    setLoading(false);
                    return;
                }

                console.log('📋 UI LatestPosts: Querying blog_posts table with client...');
                const { data, error } = await client
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

                console.log('📥 UI LatestPosts: Database response:', { data, error, dataLength: data?.length });

                if (error) {
                    console.error('❌ UI LatestPosts: Database error:', error);
                    setBlogPosts(fallbackPosts);
                    setUsingSampleData(true);
                } else if (data && data.length > 0) {
                    console.log(`✅ UI LatestPosts: Found ${data.length} real blog posts!`);
                    console.log('📋 UI LatestPosts: First post:', { title: data[0]?.title, status: data[0]?.status });
                    setBlogPosts(data as BlogPost[]);
                    setUsingSampleData(false);
                } else {
                    console.log('📝 UI LatestPosts: No published posts found, using fallback');
                    setBlogPosts(fallbackPosts);
                    setUsingSampleData(true);
                }
            } catch (err) {
                console.error('💥 UI LatestPosts: Critical error:', err);
                setBlogPosts(fallbackPosts);
                setUsingSampleData(true);
            } finally {
                setLoading(false);
                console.log('🏁 UI LatestPosts: Fetch completed');
            }
        };

        fetchBlogPosts();
    }, [supabaseClient]);

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

    console.log(`🎨 UI LatestPosts: Rendering ${blogPosts.length} posts (sample: ${usingSampleData}, loading: ${loading})`);

    if (loading) {
        return (
            <section className={styles.zrSection}>
                <h2 className={styles.zrH2}>Latest News & Updates</h2>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <span className="ml-3 text-gray-600">Loading latest articles...</span>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Latest News & Updates</h2>
            
            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-gray-100 border rounded text-sm text-gray-700">
                    <strong>UI Package Debug:</strong> {blogPosts.length} posts loaded, 
                    Using sample data: {usingSampleData ? 'Yes' : 'No'}
                </div>
            )}
            
            {usingSampleData && (
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-blue-700 text-sm">
                        💡 Sample content shown - 
                        <Link to="/admin/content/blog/new" className="text-blue-600 hover:text-blue-800 underline font-medium">
                            Create your first blog post
                        </Link>
                        to see your real content here!
                    </div>
                </div>
            )}
            
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
                                <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                                    ✨ LATEST
                                </div>
                            )}
                            
                            {/* Category */}
                            {post.category && (
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                            )}
                            
                            <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: excerpt }}></p>
                            
                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                                <span>By {post.author || 'Zoroasterverse Team'}</span>
                                <span>•</span>
                                <span>{formatDate(post.published_at)}</span>
                                {post.reading_time && (
                                    <>
                                        <span>•</span>
                                        <span>{post.reading_time}m read</span>
                                    </>
                                )}
                                {post.views && (
                                    <>
                                        <span>•</span>
                                        <span>👁️ {post.views} views</span>
                                    </>
                                )}
                            </div>
                            
                            <Link 
                                to={usingSampleData ? `/blog` : `/blog/${post.slug}`} 
                                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm group-hover:underline transition-colors"
                            >
                                {usingSampleData ? 'Explore Blog' : 'Read More'}
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    );
                })}
            </div>
            
            {/* CTA to blog */}
            <div className="text-center mt-8">
                <Link 
                    to="/blog" 
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                    Explore All Articles
                    <span>→</span>
                </Link>
            </div>
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
  supabaseClient?: any; // Add supabase client as prop
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

  if (isLoading) return <div className="text-center py-8">Loading homepage content...</div>;
  if (isError) return <div className="text-center py-8 text-red-400">Error loading homepage content.</div>;

  const contentMap = new Map(homepageData?.map(item => [item.section, item]));

  console.log('🏠 UI Package HomePage: Rendering, supabase client available:', !!supabaseClient);

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
      
      {/* 🔥 This is the ACTUAL "Latest News & Updates" section - now fixed! */}
      <LatestPosts posts={latestPosts || []} supabaseClient={supabaseClient} />
      
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