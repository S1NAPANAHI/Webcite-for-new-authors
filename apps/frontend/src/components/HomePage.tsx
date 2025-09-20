import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        {/* Hero section */}
        <div className="glass-effect p-8 md:p-12 text-center mb-16 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Welcome to the Zoroasterverse
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Journey through ancient wisdom and cosmic mysteries in this epic blend of 
            science fiction and fantasy, where Zoroastrian mythology meets interstellar adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/library" 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore the Universe
            </Link>
            
            <Link 
              to="/wiki" 
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              Learn the Lore
            </Link>
          </div>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="card-elegant p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Epic Chronicles</h3>
            <p className="text-muted-foreground">
              Immerse yourself in sweeping tales that span millennia, 
              from the ancient Golden Age to the cosmic Second Dawn.
            </p>
          </div>
          
          <div className="card-elegant p-8 text-center">
            <div className="text-4xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Rich Worldbuilding</h3>
            <p className="text-muted-foreground">
              Discover detailed timelines, character histories, and 
              the intricate mythology that drives this universe.
            </p>
          </div>
          
          <div className="card-elegant p-8 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Ancient Wisdom</h3>
            <p className="text-muted-foreground">
              Experience the timeless teachings of Zarathustra woven 
              into a narrative of cosmic significance.
            </p>
          </div>
        </div>
        
        {/* Quote section */}
        <div className="glass-effect p-8 text-center mb-16 max-w-4xl mx-auto">
          <blockquote className="text-2xl md:text-3xl italic mb-6 text-foreground">
            “Happiness comes to them who bring happiness to others.”
          </blockquote>
          <cite className="text-lg text-muted-foreground">— Prophet Zarathustra</cite>
        </div>
        
        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          <Link 
            to="/timelines" 
            className="glass-effect px-6 py-3 hover:scale-105 transition-all duration-300 text-foreground hover:bg-primary/10 rounded-lg"
          >
            Explore Timelines
          </Link>
          
          <Link 
            to="/blog" 
            className="glass-effect px-6 py-3 hover:scale-105 transition-all duration-300 text-foreground hover:bg-primary/10 rounded-lg"
          >
            Read the Blog
          </Link>
          
          <Link 
            to="/about" 
            className="glass-effect px-6 py-3 hover:scale-105 transition-all duration-300 text-foreground hover:bg-primary/10 rounded-lg"
          >
            About the Author
          </Link>
          
          <Link 
            to="/beta/application" 
            className="glass-effect px-6 py-3 hover:scale-105 transition-all duration-300 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg"
          >
            Join Beta Program
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;