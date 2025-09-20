import React from 'react';
import { Link } from 'react-router-dom';
import PersianBackground from './PersianBackground';
import ThemeToggle from './ThemeToggle';

const HomePage: React.FC = () => {
  return (
    <PersianBackground>
      {/* Theme toggle in top-right corner */}
      <ThemeToggle variant="elegant" className="fixed top-4 right-4 z-50" />
      
      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        {/* Hero section */}
        <div className="hero-section text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Welcome to the Zoroasterverse
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Journey through ancient wisdom and cosmic mysteries in this epic blend of 
            science fiction and fantasy, where Zoroastrian mythology meets interstellar adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/library" 
              className="card-sci-fi px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-full border-2 border-yellow-400 hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-400/25"
            >
              Explore the Universe
            </Link>
            
            <Link 
              to="/wiki" 
              className="card-sci-fi px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 border-2 border-current rounded-full hover:bg-current hover:text-black"
            >
              Learn the Lore
            </Link>
          </div>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-sci-fi text-center p-8">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-4">Epic Chronicles</h3>
            <p className="opacity-80">
              Immerse yourself in sweeping tales that span millennia, 
              from the ancient Golden Age to the cosmic Second Dawn.
            </p>
          </div>
          
          <div className="card-sci-fi text-center p-8">
            <div className="text-4xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold mb-4">Rich Worldbuilding</h3>
            <p className="opacity-80">
              Discover detailed timelines, character histories, and 
              the intricate mythology that drives this universe.
            </p>
          </div>
          
          <div className="card-sci-fi text-center p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-4">Ancient Wisdom</h3>
            <p className="opacity-80">
              Experience the timeless teachings of Zarathustra woven 
              into a narrative of cosmic significance.
            </p>
          </div>
        </div>
        
        {/* Quote section */}
        <div className="text-center mb-16">
          <blockquote className="text-2xl md:text-3xl italic mb-6 max-w-3xl mx-auto opacity-90">
            "Happiness comes to them who bring happiness to others."
          </blockquote>
          <cite className="text-lg opacity-75">— Prophet Zarathustra</cite>
        </div>
        
        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            to="/timelines" 
            className="container-elegant px-6 py-3 hover:scale-105 transition-all duration-300 border border-current rounded-lg hover:bg-current/10"
          >
            Explore Timelines
          </Link>
          
          <Link 
            to="/blog" 
            className="container-elegant px-6 py-3 hover:scale-105 transition-all duration-300 border border-current rounded-lg hover:bg-current/10"
          >
            Read the Blog
          </Link>
          
          <Link 
            to="/about" 
            className="container-elegant px-6 py-3 hover:scale-105 transition-all duration-300 border border-current rounded-lg hover:bg-current/10"
          >
            About the Author
          </Link>
          
          <Link 
            to="/beta/application" 
            className="container-elegant px-6 py-3 hover:scale-105 transition-all duration-300 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10 hover:shadow-lg hover:shadow-yellow-400/25"
          >
            Join Beta Program
          </Link>
        </div>
      </div>
    </PersianBackground>
  );
};

export default HomePage;