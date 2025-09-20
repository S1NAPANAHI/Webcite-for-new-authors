import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12">
      {/* Hero section */}
      <div className="card max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to the Zoroasterverse
        </h1>
        
        <p className="text-lg md:text-xl mb-8 text-secondary max-w-3xl mx-auto">
          Journey through ancient wisdom and cosmic mysteries in this epic blend of 
          science fiction and fantasy, where Zoroastrian mythology meets interstellar adventure.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/library" 
            className="btn px-8 py-4 text-lg font-semibold shadow-lg"
          >
            Explore the Universe
          </Link>
          
          <Link 
            to="/wiki" 
            className="btn-outline px-8 py-4 text-lg font-semibold"
          >
            Learn the Lore
          </Link>
        </div>
      </div>
      
      {/* Features grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
        <div className="card text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-4">Epic Chronicles</h3>
          <p className="text-secondary">
            Immerse yourself in sweeping tales that span millennia, 
            from the ancient Golden Age to the cosmic Second Dawn.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">🌌</div>
          <h3 className="text-xl font-semibold mb-4">Rich Worldbuilding</h3>
          <p className="text-secondary">
            Discover detailed timelines, character histories, and 
            the intricate mythology that drives this universe.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-4">Ancient Wisdom</h3>
          <p className="text-secondary">
            Experience the timeless teachings of Zarathustra woven 
            into a narrative of cosmic significance.
          </p>
        </div>
      </div>
      
      {/* Quote section */}
      <div className="card text-center mb-16 max-w-4xl mx-auto">
        <blockquote className="text-2xl md:text-3xl italic mb-6">
          “Happiness comes to them who bring happiness to others.”
        </blockquote>
        <cite className="text-lg text-muted">— Prophet Zarathustra</cite>
      </div>
      
      {/* Navigation links */}
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
        <Link 
          to="/timelines" 
          className="card px-6 py-3 hover:scale-105 transition-all duration-300 inline-block"
        >
          Explore Timelines
        </Link>
        
        <Link 
          to="/blog" 
          className="card px-6 py-3 hover:scale-105 transition-all duration-300 inline-block"
        >
          Read the Blog
        </Link>
        
        <Link 
          to="/about" 
          className="card px-6 py-3 hover:scale-105 transition-all duration-300 inline-block"
        >
          About the Author
        </Link>
        
        <Link 
          to="/beta/application" 
          className="btn-outline px-6 py-3 hover:scale-105 transition-all duration-300 inline-block"
        >
          Join Beta Program
        </Link>
      </div>
    </div>
  );
};

export default HomePage;