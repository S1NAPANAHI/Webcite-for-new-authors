import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  X, 
  Calendar,
  Scroll,
  Crown,
  Sword,
  BookOpen,
  Sparkles,
  Eye,
  Clock,
  Star,
  Globe2,
  Flame
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { LoadingSkeleton } from './LoadingSkeleton';
import './styles/fantasy-timeline.css';

// Enhanced Types with Nested Structure
interface NestedEvent {
  id: string;
  title: string;
  date: string;
  blurb: string;
  children?: NestedEvent[];
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  blurb: string;
  category?: 'political' | 'religious' | 'military' | 'cultural' | 'mystical';
  importance?: 'minor' | 'major' | 'legendary';
  children?: NestedEvent[];
}

interface Era {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  events: TimelineEvent[];
}

// Mock Fantasy Timeline Data
const mockTimelineData: Era[] = [
  {
    id: "era-1",
    title: "Age of Flame",
    start: "Dawn of Time",
    end: "Year 1247",
    description: "When Ahura Mazda first kindled the Sacred Fires and light pierced the primordial darkness. The first temples rose, and prophets walked among mortals.",
    events: [
      {
        id: "af-1",
        title: "The First Sacred Fire",
        date: "Dawn of Time",
        blurb: "Ahura Mazda kindles the eternal flame that shall never be extinguished.",
        category: "mystical",
        importance: "legendary",
        children: [
          {
            id: "af-1-1",
            title: "Gathering of the Magi",
            date: "First Dawn + 7 Days",
            blurb: "Seven wise men witness the divine flame and become its first guardians.",
            children: [
              {
                id: "af-1-1-1",
                title: "The Oath of Eternal Watch",
                date: "First Dawn + 14 Days",
                blurb: "The Magi swear to protect the flame until the end of days."
              }
            ]
          },
          {
            id: "af-1-2",
            title: "First Temple Foundations",
            date: "Year 1",
            blurb: "Stones carved with sacred geometry begin the first fire temple."
          }
        ]
      },
      {
        id: "af-2",
        title: "The Prophet's Revelation",
        date: "Year 628",
        blurb: "Zarathustra receives the divine vision that reshapes understanding of good and evil.",
        category: "religious",
        importance: "legendary",
        children: [
          {
            id: "af-2-1",
            title: "Vision of the Twin Spirits",
            date: "Year 628, Third Moon",
            blurb: "The cosmic battle between Ahura Mazda and Angra Mainyu is revealed."
          },
          {
            id: "af-2-2",
            title: "The Threefold Path",
            date: "Year 629",
            blurb: "Good Thoughts, Good Words, Good Deeds become the foundation of faith."
          }
        ]
      }
    ]
  },
  {
    id: "era-2", 
    title: "The Shadow Wars",
    start: "Year 1248",
    end: "Year 2156",
    description: "When darkness crept across the lands and the Sacred Fires flickered. Demons walked openly, and heroes rose to meet them in battle.",
    events: [
      {
        id: "sw-1",
        title: "The Demon King's Rise",
        date: "Year 1248",
        blurb: "Angra Mainyu's greatest servant breaks free from ancient bindings.",
        category: "military",
        importance: "legendary",
        children: [
          {
            id: "sw-1-1",
            title: "The Seven Seals Break",
            date: "Year 1248, Eclipse Night",
            blurb: "One by one, the ancient wards fail as darkness spreads."
          },
          {
            id: "sw-1-2", 
            title: "First Demon Sighting",
            date: "Year 1249",
            blurb: "A farmer's report of shadow-beasts sparks kingdom-wide panic."
          }
        ]
      },
      {
        id: "sw-2",
        title: "The Hero's Awakening",
        date: "Year 1456",
        blurb: "A humble fire-tender discovers they bear the mark of the ancient warriors.",
        category: "mystical",
        importance: "major",
        children: [
          {
            id: "sw-2-1",
            title: "The Burning Sword",
            date: "Year 1456, Solstice",
            blurb: "The legendary blade chooses its wielder after seven centuries."
          }
        ]
      }
    ]
  },
  {
    id: "era-3",
    title: "Dawn of the Second Sun", 
    start: "Year 2157",
    end: "Present Day",
    description: "The age of renewal, when the Sacred Fires burn brighter than ever and new prophecies unfold across the realm.",
    events: [
      {
        id: "ds-1",
        title: "The Great Rekindling",
        date: "Year 2157",
        blurb: "All Sacred Fires across the realm ignite simultaneously in a display of divine power.",
        category: "mystical", 
        importance: "legendary",
        children: [
          {
            id: "ds-1-1",
            title: "The Phoenix Rises",
            date: "Year 2157, Dawn",
            blurb: "A great phoenix emerges from the central fire temple, herald of the new age."
          }
        ]
      }
    ]
  }
];

const CATEGORY_ICONS = {
  political: Crown,
  religious: Scroll,
  military: Sword,
  cultural: BookOpen,
  mystical: Flame
};

// Fantasy Event Component
const FantasyEvent: React.FC<{ 
  event: TimelineEvent | NestedEvent; 
  depth: number;
}> = ({ event, depth }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const hasChildren = event.children && event.children.length > 0;
  const Icon = CATEGORY_ICONS[(event as TimelineEvent).category || 'mystical'];
  const importance = (event as TimelineEvent).importance || 'minor';

  return (
    <div className="event" style={{ '--depth': depth } as React.CSSProperties}>
      <div className="event-row">
        <span className="event-connector" aria-hidden="true" />
        
        <div className={`event-node ${importance === 'legendary' ? 'legendary-glow' : ''}`}>
          <div className="relative">
            {importance === 'legendary' && (
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-75 animate-pulse" />
            )}
            <div className="relative w-3 h-3 bg-gradient-to-br from-purple-400 to-yellow-500 rounded-full border border-white/30">
              {importance === 'legendary' && (
                <div className="absolute inset-0.5 bg-white rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>
        
        <div className={`event-content ${importance === 'legendary' ? 'legendary-glow' : ''}`}>
          <div className="event-head">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-yellow-400" />
              <h3 className="event-title">{event.title}</h3>
            </div>
            {event.date && (
              <span className="event-date">{event.date}</span>
            )}
          </div>
          
          <p className="event-blurb">{event.blurb}</p>
          
          {(event as TimelineEvent).importance === 'legendary' && (
            <Badge className="mt-2 bg-gradient-to-r from-yellow-600 to-orange-500 text-yellow-100 border-none text-xs">
              <Star className="w-3 h-3 mr-1" />
              Legendary Chronicle
            </Badge>
          )}
          
          {hasChildren && (
            <button
              className="event-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              {isOpen ? 'Hide tales' : `Show ${event.children!.length} tales`}
            </button>
          )}
        </div>
      </div>

      {hasChildren && isOpen && (
        <AnimatePresence>
          <motion.ol
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="event-children"
          >
            {event.children!.map((child) => (
              <li key={child.id}>
                <FantasyEvent event={child} depth={depth + 1} />
              </li>
            ))}
          </motion.ol>
        </AnimatePresence>
      )}
    </div>
  );
};

// Fantasy Era Component  
const FantasyEra: React.FC<{ era: Era; position: number }> = ({ era, position }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <section className="era" aria-labelledby={`${era.id}-title`}>
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: position * 0.2 }}
        className="era-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${era.id}-panel`}
      >
        <span className="era-marker" />
        
        <div className="era-text">
          <h2 id={`${era.id}-title`} className="era-title">
            {era.title}
          </h2>
          <p className="era-meta">
            {era.start} — {era.end}
          </p>
          {era.description && (
            <p className="era-desc">{era.description}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="bg-black/20 border-white/10 text-gray-300 text-xs">
              <Scroll className="w-3 h-3 mr-1" />
              {era.events.length} chronicles
            </Badge>
            <Badge variant="outline" className="bg-black/20 border-yellow-500/20 text-yellow-300 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              {era.events.reduce((sum, event) => sum + (event.children?.length || 0), 0)} tales
            </Badge>
          </div>
        </div>
        
        <span className="chevron">
          <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            id={`${era.id}-panel`} 
            className="era-panel"
            hidden={!isOpen}
          >
            {era.events?.length ? (
              <ol className="event-list">
                {era.events.map((event) => (
                  <li key={event.id}>
                    <FantasyEvent event={event} depth={0} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">The scribes have recorded no events from this age...</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Main Timeline Component
export const TimelinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock API call - replace with actual implementation
  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ['timelineEvents'],
    queryFn: () => Promise.resolve(mockTimelineData),
  });

  const filteredEras = useMemo(() => {
    if (!timelineData) return [];
    
    if (!searchTerm && selectedCategory === 'all') return timelineData;
    
    return timelineData.map(era => ({
      ...era,
      events: era.events.filter(event => {
        const matchesSearch = searchTerm === '' || 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.blurb.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.children && event.children.some(child => 
            child.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.blurb.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
    })).filter(era => era.events.length > 0);
  }, [timelineData, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="page">
        <header className="page-header">
          <LoadingSkeleton className="h-12 w-64 mx-auto mb-4" />
          <LoadingSkeleton className="h-6 w-96 mx-auto" />
        </header>
        <main>
          <div className="timeline">
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <LoadingSkeleton className="h-20 w-full mb-4" />
                  <div className="ml-12 space-y-3">
                    {[...Array(2)].map((_, j) => (
                      <LoadingSkeleton key={j} className="h-16 w-3/4" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30">
            <X className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">The Chronicles Are Lost</h1>
          <p className="text-gray-400 mb-6 max-w-md">
            The ancient scrolls cannot be read at this time. Perhaps the Sacred Fires need tending...
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border border-red-400/30"
          >
            Rekindle the Flames
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Mystical Header */}
      <header className="page-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Flame className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <h1>Chronicle of Ages</h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
          <p className="subtitle">
            Wherein the great deeds of mortals and immortals are set down for posterity, 
            that none may forget the turning of the ages.
          </p>
        </motion.div>
      </header>

      {/* Mystical Controls */}
      <div className="controls-section">
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
          {/* Enchanted Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Input
              placeholder="Search the chronicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-12 bg-black/40 border-purple-500/30 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/50"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-purple-400 hover:text-white hover:bg-purple-500/20"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
          >
            <option value="all">All Chronicles</option>
            <option value="mystical">🔥 Mystical</option>
            <option value="religious">📜 Religious</option>
            <option value="political">👑 Political</option>
            <option value="military">⚔️ Military</option>
            <option value="cultural">📚 Cultural</option>
          </select>
        </div>
      </div>

      {/* Timeline Content */}
      <main>
        {filteredEras.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Chronicles Found</h3>
              <p className="text-gray-400 mb-8">
                The scribes have found no records matching thy search. Perhaps try different terms, 
                or clear the filters to see all recorded history.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border border-purple-400/30"
              >
                <X className="w-4 h-4 mr-2" />
                Clear the Binding Runes
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="timeline">
            <div className="timeline-rail" aria-hidden="true" />
            <ol className="era-list">
              {filteredEras.map((era, idx) => (
                <li key={era.id} className="era-item">
                  <FantasyEra era={era} position={idx} />
                </li>
              ))}
            </ol>
          </div>
        )}
      </main>
    </div>
  );
};