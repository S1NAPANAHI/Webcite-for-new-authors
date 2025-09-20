import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import './NewsHeroSlider.css';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  comments: number;
  likes: number;
  category: string;
  readTime: string;
}

interface NewsHeroSliderProps {
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const NewsHeroSlider: React.FC<NewsHeroSliderProps> = ({ 
  className = '', 
  autoPlay = true, 
  interval = 6000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sample news data - replace with actual data from your API
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "The Golden Age: Archaeological Discoveries Reshape Our Understanding",
      date: "March 15, 2024",
      excerpt: "Recent excavations have uncovered artifacts that challenge our perception of the ancient Golden Age, revealing technological marvels thought impossible for their time.",
      image: "/images/golden-age.jpg",
      comments: 24,
      likes: 187,
      category: "Discovery",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Dark Times Return: Cosmic Anomalies Detected",
      date: "April 2, 2024",
      excerpt: "Astronomers report unusual celestial phenomena that mirror ancient prophecies about the return of shadowed times across the realm.",
      image: "/images/dark-times.jpg",
      comments: 67,
      likes: 342,
      category: "Astronomy",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Second Dawn: The Prophecy Awakens",
      date: "May 18, 2024",
      excerpt: "Scholars decode ancient texts revealing the prophesied Second Dawn may be closer than anticipated, as cosmic alignments suggest a new era beginning.",
      image: "/images/second-dawn.jpg",
      comments: 143,
      likes: 521,
      category: "Prophecy",
      readTime: "9 min read"
    },
    {
      id: 4,
      title: "Mystical Energies: The Science Behind Ancient Magic",
      date: "June 5, 2024",
      excerpt: "Breakthrough research reveals the quantum mechanics underlying what ancients called 'magic,' bridging the gap between science and mysticism.",
      image: "/images/mystical-energy.jpg",
      comments: 89,
      likes: 276,
      category: "Science",
      readTime: "6 min read"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPlaying, interval]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentItem = newsItems[currentIndex];

  return (
    <section className={`news-hero-slider ${className}`}>
      <div className="slider-container">
        <div 
          className="slide"
          style={{ backgroundImage: `url(${currentItem.image})` }}
        >
          {/* Persian ornamental overlay */}
          <div className="persian-overlay"></div>
          
          {/* Content overlay */}
          <div className="content-overlay">
            <div className="content-wrapper">
              <div className="category-badge">
                <span>{currentItem.category}</span>
              </div>
              
              <h1 className="news-title">{currentItem.title}</h1>
              
              <div className="meta-info">
                <div className="date-time">
                  <Calendar className="icon" />
                  <span>{currentItem.date}</span>
                  <span className="separator">•</span>
                  <span>{currentItem.readTime}</span>
                </div>
              </div>
              
              <p className="excerpt">{currentItem.excerpt}</p>
              
              <div className="actions">
                <div className="engagement">
                  <button className="engagement-btn likes">
                    <Heart className="icon" />
                    <span>{currentItem.likes}</span>
                  </button>
                  <button className="engagement-btn comments">
                    <MessageCircle className="icon" />
                    <span>{currentItem.comments}</span>
                  </button>
                </div>
                
                <button className="read-more-btn">
                  <span>Read Full Story</span>
                  <ArrowRight className="icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="navigation">
          <button 
            className="nav-btn prev" 
            onClick={handlePrevious}
            disabled={isTransitioning}
            aria-label="Previous news"
          >
            <ChevronLeft className="icon" />
          </button>
          
          <button 
            className="nav-btn next" 
            onClick={handleNext}
            disabled={isTransitioning}
            aria-label="Next news"
          >
            <ChevronRight className="icon" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="dots-container">
          {newsItems.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause button */}
        <button 
          className="play-pause-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
    </section>
  );
};

export default NewsHeroSlider;