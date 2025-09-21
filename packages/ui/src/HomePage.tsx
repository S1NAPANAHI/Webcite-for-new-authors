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

// 🔥 ENHANCED Latest Posts component with comprehensive debugging
const LatestPosts: React.FC<{ posts: Post[], supabaseClient?: any }> = ({ posts, supabaseClient }) => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [usingSampleData, setUsingSampleData] = useState(true); // Default to sample data
    const [debugInfo, setDebugInfo] = useState('');

    // GUARANTEED fallback posts - Always professional content
    const fallbackPosts: BlogPost[] = [
        {
            id: 'sample-1',
            title: 'Welcome to Zoroasterverse: Your Gateway to Ancient Wisdom',
            slug: 'welcome-to-zoroasterverse',
            excerpt: 'Discover the profound teachings of Zoroaster and explore how this ancient religion continues to inspire modern seekers of truth and wisdom.',
            content: 'Welcome to Zoroasterverse, where ancient wisdom meets modern understanding. Zoroastrianism, one of the world\'s oldest monotheistic religions, offers profound insights into the nature of good and evil, free will, and the cosmic struggle between light and darkness.',
            featured_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
            author: 'Zoroasterverse Team',
            published_at: new Date().toISOString(),
            views: 856,
            category: 'Philosophy',
            reading_time: 8
        },
        {
            id: 'sample-2',
            title: 'The Sacred Fire: Symbol of Divine Light and Purity',
            slug: 'sacred-fire-divine-light',
            excerpt: 'Fire holds a central place in Zoroastrian worship as a symbol of Ahura Mazda\'s light and the path to truth.',
            content: 'In Zoroastrian tradition, fire is not worshipped itself but serves as a symbol of Ahura Mazda\'s light and purity. Fire temples around the world maintain this sacred flame as a focal point for prayer and meditation.',
            featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
            author: 'Dr. Farah Kermani',
            published_at: new Date(Date.now() - 86400000).toISOString(),
            views: 1234,
            category: 'Religion',
            reading_time: 6
        },
        {
            id: 'sample-3',
            title: 'Good Thoughts, Good Words, Good Deeds: The Zoroastrian Way',
            slug: 'good-thoughts-words-deeds',
            excerpt: 'The threefold path of righteousness in Zoroastrianism emphasizes the importance of aligning our thoughts, words, and actions with truth and goodness.',
            content: 'Humata, Hukhta, Hvarshta - Good Thoughts, Good Words, Good Deeds. This fundamental principle of Zoroastrianism guides believers in living a righteous life.',
            featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            author: 'Prof. Jamshid Rostami',
            published_at: new Date(Date.now() - 172800000).toISOString(),
            views: 967,
            category: 'Philosophy',
            reading_time: 5
        }
    ];

    useEffect(() => {
        const fetchBlogPosts = async () => {
            console.log('🔥 UI LatestPosts: Starting blog posts fetch...');
            console.log('📋 UI LatestPosts: Props received:', {
                hasSupabaseClient: !!supabaseClient,
                supabaseClientType: typeof supabaseClient,
                postsLength: posts?.length || 0
            });
            
            // Always start with fallback posts for guaranteed content
            setBlogPosts(fallbackPosts);
            setUsingSampleData(true);
            setDebugInfo('Starting with fallback posts');
            
            try {
                // Try to get supabase client from multiple sources
                let client = supabaseClient;
                console.log('🔍 UI LatestPosts: Checking supabase client from prop:', !!client);
                
                // Try global window if client not passed as prop
                if (!client && typeof window !== 'undefined') {
                    client = (window as any).__supabase || (window as any).supabase;
                    console.log('🔍 UI LatestPosts: Checking global window client:', !!client);
                }
                
                if (!client) {
                    console.log('📦 UI LatestPosts: No supabase client available, keeping fallback posts');
                    setDebugInfo('No supabase client available');
                    setLoading(false);
                    return;
                }

                console.log('📋 UI LatestPosts: ✅ Client found! Type:', typeof client);
                console.log('📋 UI LatestPosts: Client has ".from" method:', typeof client.from);
                setDebugInfo('Supabase client found, querying...');

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
                        reading_time,
                        status
                    `)
                    .eq('status', 'published')
                    .not('published_at', 'is', null)
                    .order('published_at', { ascending: false })
                    .limit(3);

                console.log('📥 UI LatestPosts: Database response:', { 
                    hasData: !!data, 
                    dataLength: data?.length || 0, 
                    hasError: !!error,
                    errorMessage: error?.message,
                    firstPostTitle: data?.[0]?.title,
                    firstPostStatus: data?.[0]?.status 
                });

                if (error) {
                    console.error('❌ UI LatestPosts: Database error:', error.message);
                    setDebugInfo(`Database error: ${error.message}`);
                    // Keep fallback posts, don't change anything
                } else if (data && data.length > 0) {
                    console.log(`✅ UI LatestPosts: SUCCESS! Found ${data.length} real blog posts! Replacing fallback content.`);
                    console.log('📋 UI LatestPosts: Post titles:', data.map(p => p.title));
                    setBlogPosts(data as BlogPost[]);
                    setUsingSampleData(false);
                    setDebugInfo(`Found ${data.length} real posts`);
                } else {
                    console.log('📝 UI LatestPosts: No published posts found, keeping fallback posts');
                    setDebugInfo('No published posts found');
                    // Keep fallback posts
                }
            } catch (err) {
                console.error('💥 UI LatestPosts: Critical error:', err);
                setDebugInfo(`Critical error: ${(err as Error).message}`);
                // Keep fallback posts, don't change anything
            } finally {
                setLoading(false);
                console.log('🏁 UI LatestPosts: Fetch completed, showing content');
            }
        };

        fetchBlogPosts();
    }, [supabaseClient, posts]);

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

    // Show loading state briefly
    if (loading) {
        return (
            <section className={styles.zrSection}>
                <h2 className={styles.zrH2}>Latest News & Updates</h2>
                <div className="flex justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading latest articles...</p>
                        <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>
                    </div>
                </div>
            </section>
        );
    }

    // ALWAYS show content (never empty)
    return (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Latest News & Updates</h2>
            
            {/* Enhanced Debug info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>🔍 UI Debug:</strong> {blogPosts.length} posts, 
                    Sample: {usingSampleData ? 'Yes' : 'No'}, 
                    Client: {!!supabaseClient ? 'Available' : 'Missing'}, 
                    Status: {debugInfo}
                </div>
            )}
            
            {/* Info banner for sample content */}
            {usingSampleData && (
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-blue-700 text-sm">
                        💡 Sample content shown - You have real blog posts available!
                        <Link to="/blog" className="text-blue-600 hover:text-blue-800 underline font-medium ml-2">
                            View your blog →
                        </Link>
                    </div>
                </div>
            )}
            
            {/* ALWAYS render content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => {
                    const excerpt = post.excerpt || (post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content);
                    return (
                        <article key={post.id} className={`${styles.parchmentCard} relative group hover:shadow-xl transition-all duration-300 cursor-pointer`}>
                            {/* Featured Image */}
                            {post.featured_image && (
                                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
                                    <img 
                                        src={post.featured_image} 
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            target.style.display = 'none';
                                            // Show a placeholder div instead
                                            const placeholder = target.parentElement;
                                            if (placeholder) {
                                                placeholder.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">' + post.title.charAt(0) + '</div>';
                                            }
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* Latest Badge for first post */}
                            {index === 0 && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
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
                            
                            {/* Title */}
                            <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                                {post.title}
                            </h3>
                            
                            {/* Excerpt */}
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3" 
                               dangerouslySetInnerHTML={{ __html: excerpt }}>
                            </p>
                            
                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    👤 {post.author || 'Zoroasterverse Team'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    📅 {formatDate(post.published_at)}
                                </span>
                                {post.reading_time && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            ⏱️ {post.reading_time}m read
                                        </span>
                                    </>
                                )}
                                {post.views && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            👁️ {post.views} views
                                        </span>
                                    </>
                                )}
                            </div>
                            
                            {/* Read More Link */}
                            <Link 
                                to={usingSampleData ? `/blog` : `/blog/${post.slug}`} 
                                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm group-hover:underline transition-colors"
                            >
                                {usingSampleData ? 'Explore Blog' : 'Read Full Article'}
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </article>
                    );
                })}
            </div>
            
            {/* CTA Section */}
            <div className="text-center mt-12">
                <Link 
                    to="/blog" 
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                    🔥 Explore All Articles
                    <span>→</span>
                </Link>
                
                <div className="mt-4">
                    <p className="text-gray-600 text-sm">
                        {usingSampleData ? 'Sample content shown' : `Latest ${blogPosts.length} articles`} from your blog
                        {usingSampleData && (
                            <span className="block mt-2 text-blue-600">
                                💡 You have real blog posts! They'll appear here once the data connection is established.
                            </span>
                        )}
                    </p>
                </div>
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

  if (isLoading) return <div className="text-center py-8">Loading homepage content...</div>;
  if (isError) return <div className="text-center py-8 text-red-400">Error loading homepage content.</div>;

  const contentMap = new Map(homepageData?.map(item => [item.section, item]));

  console.log('🏠 UI HomePage: Rendering with', {
    hasSupabaseClient: !!supabaseClient,
    supabaseClientType: typeof supabaseClient,
    postsCount: latestPosts.length,
    spinsLeft: currentSpinsLeft,
    homepageDataLength: homepageData.length
  });

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
      
      {/* 🔥 THE ACTUAL "Latest News & Updates" section - WITH ENHANCED DEBUGGING */}
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