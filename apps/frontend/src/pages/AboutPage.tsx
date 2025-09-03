import React from 'react';
import { 
  Layout,
  GlowButton,
  OrnateDivider,
  MagicalParticles 
} from '@zoroaster/ui';

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <MagicalParticles />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 bg-clip-text text-transparent mb-6">
            The Author & Architect
          </h1>
          <div className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A journey through the cosmic realms of imagination and code
          </div>
          <OrnateDivider />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Personal Introduction */}
          <section className="mb-16 bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
            <h2 className="text-3xl font-semibold text-gold-400 mb-6 flex items-center">
              <span className="mr-3">✨</span>
              The Chronicler
            </h2>
            <div className="text-slate-200 leading-relaxed space-y-4">
              <p>
                Greetings, fellow travelers of the digital cosmos. I am the architect behind the 
                <span className="text-purple-400 font-semibold"> Zoroasterverse</span>, a realm where 
                ancient wisdom meets modern technology, and where stories unfold across dimensions 
                of imagination and code.
              </p>
              <p>
                My journey began in the intersection of literature and technology, where I discovered 
                that the most powerful magic lies in the ability to weave narratives that transcend 
                the boundaries between the mystical and the digital. Here, in this sacred space of 
                creation, worlds are born through lines of code and crystallized in stories that 
                echo through eternity.
              </p>
            </div>
          </section>

          {/* Development Journey */}
          <section className="mb-16 bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20">
            <h2 className="text-3xl font-semibold text-blue-400 mb-6 flex items-center">
              <span className="mr-3">⚡</span>
              The Digital Alchemist
            </h2>
            <div className="text-slate-200 leading-relaxed space-y-4">
              <p>
                As a developer, I practice the ancient art of digital alchemy—transforming ideas 
                into living, breathing applications that serve as gateways to other worlds. My 
                expertise spans the full spectrum of modern web development:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li><strong className="text-cyan-400">Frontend Mastery:</strong> React, TypeScript, Next.js - Crafting immersive user experiences</li>
                <li><strong className="text-green-400">Backend Architecture:</strong> Node.js, Supabase, PostgreSQL - Building the foundations of digital realms</li>
                <li><strong className="text-purple-400">Cloud & Infrastructure:</strong> AWS, Vercel, Docker - Ensuring our worlds remain accessible across the cosmic web</li>
                <li><strong className="text-gold-400">Machine Learning:</strong> AI/ML integration for dynamic content generation and user personalization</li>
              </ul>
            </div>
          </section>

          {/* The Zoroasterverse Project */}
          <section className="mb-16 bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-gold-500/20">
            <h2 className="text-3xl font-semibold text-gold-400 mb-6 flex items-center">
              <span className="mr-3">🌌</span>
              The Zoroasterverse Chronicles
            </h2>
            <div className="text-slate-200 leading-relaxed space-y-4">
              <p>
                The <strong className="text-purple-400">Zoroasterverse</strong> represents the culmination 
                of my vision: a digital sanctuary where ancient Zoroastrian wisdom, cosmic philosophy, 
                and cutting-edge technology converge to create something entirely new.
              </p>
              <p>
                This platform serves multiple purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li><strong className="text-cyan-400">Literary Universe:</strong> A collection of interconnected stories, characters, and worlds</li>
                <li><strong className="text-green-400">Knowledge Repository:</strong> Insights into ancient wisdom, modern philosophy, and their synthesis</li>
                <li><strong className="text-purple-400">Interactive Experience:</strong> Beta reading programs, community engagement, and collaborative worldbuilding</li>
                <li><strong className="text-gold-400">Educational Platform:</strong> Resources for understanding both ancient teachings and modern technology</li>
              </ul>
            </div>
          </section>

          {/* Philosophy & Approach */}
          <section className="mb-16 bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
            <h2 className="text-3xl font-semibold text-purple-400 mb-6 flex items-center">
              <span className="mr-3">🔮</span>
              Philosophy & Vision
            </h2>
            <div className="text-slate-200 leading-relaxed space-y-4">
              <blockquote className="border-l-4 border-gold-400 pl-6 italic text-gold-200 text-lg">
                "In the beginning was the Word, and the Word was Code, and the Code was with the Creator."
              </blockquote>
              <p>
                My approach to both development and storytelling is rooted in the belief that 
                technology should serve humanity's highest aspirations. Every line of code I write, 
                every story I craft, is infused with the intention to elevate, inspire, and connect 
                souls across the digital divide.
              </p>
              <p>
                The Zoroastrian principles of <em className="text-gold-400">Good Thoughts, Good Words, 
                and Good Deeds</em> guide not only the ethical framework of my work but also the 
                technical excellence I strive for in every project.
              </p>
            </div>
          </section>

          {/* Technical Achievements */}
          <section className="mb-16 bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-cyan-500/20">
            <h2 className="text-3xl font-semibold text-cyan-400 mb-6 flex items-center">
              <span className="mr-3">⚙️</span>
              Technical Achievements
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-400 mb-3">Architecture Excellence</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Built a scalable monorepo architecture using modern tools like Turbo, 
                  pnpm workspaces, and modular design patterns for maximum maintainability.
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-400 mb-3">User Experience</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Crafted immersive, accessible interfaces with advanced animations, 
                  responsive design, and intuitive navigation systems.
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gold-400 mb-3">Content Management</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Developed sophisticated content management systems with support for 
                  rich text editing, media handling, and collaborative workflows.
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Performance</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Optimized for speed and scalability with advanced caching strategies, 
                  lazy loading, and efficient database queries.
                </p>
              </div>
            </div>
          </section>

          {/* Contact & Collaboration */}
          <section className="mb-16 bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-green-500/20">
            <h2 className="text-3xl font-semibold text-green-400 mb-6 flex items-center">
              <span className="mr-3">🤝</span>
              Collaboration & Contact
            </h2>
            <div className="text-slate-200 leading-relaxed space-y-4">
              <p>
                The Zoroasterverse thrives on collaboration and community. Whether you're interested 
                in contributing to the codebase, participating in beta reading programs, or simply 
                exploring the depths of this digital cosmos, your journey is welcome here.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h4 className="text-purple-400 font-semibold">Beta Readers</h4>
                  <p className="text-slate-400 text-sm">Join our exclusive beta reading community</p>
                </div>
                <div className="text-center">
                  <div className="bg-cyan-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h4 className="text-cyan-400 font-semibold">Developers</h4>
                  <p className="text-slate-400 text-sm">Contribute to the technical evolution</p>
                </div>
                <div className="text-center">
                  <div className="bg-gold-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h4 className="text-gold-400 font-semibold">Creators</h4>
                  <p className="text-slate-400 text-sm">Artists, writers, and world-builders</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="text-center bg-gradient-to-r from-purple-800/20 via-blue-800/20 to-purple-800/20 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-gold-400 mb-4">
              The Journey Continues...
            </h3>
            <p className="text-slate-200 leading-relaxed max-w-2xl mx-auto">
              Every day brings new discoveries, new challenges, and new opportunities to push 
              the boundaries of what's possible when technology serves the highest good. 
              The Zoroasterverse is not just a project—it's a living testament to the power 
              of combining ancient wisdom with modern innovation.
            </p>
            <div className="mt-8">
              <GlowButton 
                variant="primary" 
                className="text-lg px-8 py-3"
                onClick={() => window.location.href = '/beta/application'}
              >
                Begin Your Journey
              </GlowButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
