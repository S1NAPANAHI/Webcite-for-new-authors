import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clock, Calendar } from 'lucide-react';

interface SubEvent {
  id: string;
  label: string;
  content: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  subEvents: SubEvent[];
}

interface AgeData {
  id: string;
  title: string;
  description: string;
  events: Event[];
}

interface Line {
  path: string;
}

const TimelineTree = () => {
  const [expandedNodes, setExpandedNodes] = useState({
    age1: false,
    age2: false,
    age3: false,
    age4: false,
    age5: false,
    age6: false,
    age7: false,
    age8: false,
    age9: false,
  });

  const [expandedEvents, setExpandedEvents] = useState({});
  const [lines, setLines] = useState<Line[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const agesData: AgeData[] = [
    {
      id: 'age1',
      title: 'AGE 1: Dawn of Creation',
      description: 'The genesis of all existence begins',
      events: [
        {
          id: 'age1_event1',
          title: 'The First Light',
          description: 'Primordial illumination pierces the void',
          date: 'Year 1',
          subEvents: [
            { id: 'age1_e1_sub1', label: 'Cosmic Awakening', content: 'The universe stirs from eternal slumber' },
            { id: 'age1_e1_sub2', label: 'Divine Spark', content: 'Sacred fire ignites creation' },
            { id: 'age1_e1_sub3', label: 'Elemental Birth', content: 'Foundation elements take form' }
          ]
        },
        {
          id: 'age1_event2',
          title: 'Formation of Realms',
          description: 'The first domains of existence emerge',
          date: 'Year 50',
          subEvents: [
            { id: 'age1_e2_sub1', label: 'Celestial Domains', content: 'Heavenly realms take shape' },
            { id: 'age1_e2_sub2', label: 'Material Plane', content: 'Physical reality crystallizes' }
          ]
        }
      ]
    },
    {
      id: 'age2',
      title: 'AGE 2: Era of Titans',
      description: 'Ancient beings shape the cosmos',
      events: [
        {
          id: 'age2_event1',
          title: 'Titan Awakening',
          description: 'Primordial giants rise to power',
          date: 'Year 1000',
          subEvents: [
            { id: 'age2_e1_sub1', label: 'Mountain Shapers', content: 'Titans carve the earth' },
            { id: 'age2_e1_sub2', label: 'Sea Binders', content: 'Oceans bow to titan will' }
          ]
        },
        {
          id: 'age2_event2',
          title: 'The Great Ordering',
          description: 'Natural laws are established',
          date: 'Year 2500',
          subEvents: [
            { id: 'age2_e2_sub1', label: 'Cosmic Balance', content: 'Harmony imposed on chaos' },
            { id: 'age2_e2_sub2', label: 'Sacred Geometries', content: 'Divine mathematics emerge' }
          ]
        }
      ]
    },
    {
      id: 'age3',
      title: 'AGE 3: The Ascension',
      description: 'Divine beings transcend mortality',
      events: [
        {
          id: 'age3_event1',
          title: 'Rise of the Yazata',
          description: 'Angelic hierarchies establish order',
          date: 'Year 5000',
          subEvents: [
            { id: 'age3_e1_sub1', label: 'Celestial Courts', content: 'Divine bureaucracy forms' },
            { id: 'age3_e1_sub2', label: 'Sacred Codex', content: 'Laws of righteousness written' },
            { id: 'age3_e1_sub3', label: 'Guardian Orders', content: 'Protective spirits assigned' }
          ]
        },
        {
          id: 'age3_event2',
          title: 'The Corruption',
          description: 'Darkness seeps into creation',
          date: 'Year 7500',
          subEvents: [
            { id: 'age3_e2_sub1', label: 'Shadow Incursion', content: 'Evil finds its foothold' }
          ]
        }
      ]
    },
    {
      id: 'age4',
      title: 'AGE 4: The Great War',
      description: 'Light and darkness clash eternally',
      events: [
        {
          id: 'age4_event1',
          title: 'Battle of Cosmic Forces',
          description: 'The eternal struggle begins in earnest',
          date: 'Year 10000',
          subEvents: [
            { id: 'age4_e1_sub1', label: 'Armies Assembled', content: 'Forces of good and evil gather' },
            { id: 'age4_e1_sub2', label: 'First Casualties', content: 'Heroes and villains fall' }
          ]
        },
        {
          id: 'age4_event2',
          title: 'The Sundering',
          description: 'Reality fractures under the strain',
          date: 'Year 12000',
          subEvents: [
            { id: 'age4_e2_sub1', label: 'Dimensional Rifts', content: 'Barriers between worlds weaken' },
            { id: 'age4_e2_sub2', label: 'Exile of Demons', content: 'Dark forces banished to shadow realms' }
          ]
        }
      ]
    },
    {
      id: 'age5',
      title: 'AGE 5: Age of Heroes',
      description: 'Mortal champions rise to greatness',
      events: [
        {
          id: 'age5_event1',
          title: 'The Chosen Emerge',
          description: 'Legendary figures shape destiny',
          date: 'Year 15000',
          subEvents: [
            { id: 'age5_e1_sub1', label: 'Rostam\'s Deeds', content: 'The greatest hero performs mighty acts' },
            { id: 'age5_e1_sub2', label: 'Kings Crowned', content: 'Just rulers take their thrones' },
            { id: 'age5_e1_sub3', label: 'Wisdom Keepers', content: 'Sages preserve ancient knowledge' }
          ]
        },
        {
          id: 'age5_event2',
          title: 'The Golden Kingdom',
          description: 'Civilization reaches its peak',
          date: 'Year 17500',
          subEvents: [
            { id: 'age5_e2_sub1', label: 'Cultural Renaissance', content: 'Arts and learning flourish' }
          ]
        }
      ]
    },
    {
      id: 'age6',
      title: 'AGE 6: The Testing',
      description: 'Trials that forge the worthy',
      events: [
        {
          id: 'age6_event1',
          title: 'Trials of Fire',
          description: 'The faithful face their greatest test',
          date: 'Year 20000',
          subEvents: [
            { id: 'age6_e1_sub1', label: 'Purifying Flames', content: 'Truth burns away falsehood' },
            { id: 'age6_e1_sub2', label: 'Phoenix Rising', content: 'Renewal through destruction' }
          ]
        },
        {
          id: 'age6_event2',
          title: 'The Revelation',
          description: 'Hidden truths are unveiled',
          date: 'Year 22500',
          subEvents: [
            { id: 'age6_e2_sub1', label: 'Divine Prophecies', content: 'The future is foretold' },
            { id: 'age6_e2_sub2', label: 'Sacred Mysteries', content: 'Ancient secrets revealed' }
          ]
        }
      ]
    },
    {
      id: 'age7',
      title: 'AGE 7: The Gathering Storm',
      description: 'Forces converge for final battle',
      events: [
        {
          id: 'age7_event1',
          title: 'Omens and Portents',
          description: 'Signs herald the coming end',
          date: 'Year 25000',
          subEvents: [
            { id: 'age7_e1_sub1', label: 'Celestial Alignments', content: 'Stars prophesy change' },
            { id: 'age7_e1_sub2', label: 'Dreams of Seers', content: 'Visions plague the gifted' },
            { id: 'age7_e1_sub3', label: 'Ancient Stirrings', content: 'Long-dormant powers wake' }
          ]
        },
        {
          id: 'age7_event2',
          title: 'The Marshaling',
          description: 'All sides prepare for final conflict',
          date: 'Year 27500',
          subEvents: [
            { id: 'age7_e2_sub1', label: 'Alliance Forged', content: 'Unlikely allies unite' }
          ]
        }
      ]
    },
    {
      id: 'age8',
      title: 'AGE 8: The Final Battle',
      description: 'Ultimate confrontation of all time',
      events: [
        {
          id: 'age8_event1',
          title: 'Armageddon Begins',
          description: 'The last war commences',
          date: 'Year 30000',
          subEvents: [
            { id: 'age8_e1_sub1', label: 'Cosmic Battlefield', content: 'Reality itself becomes the arena' },
            { id: 'age8_e1_sub2', label: 'Heroes\' Last Stand', content: 'Champions make ultimate sacrifice' }
          ]
        },
        {
          id: 'age8_event2',
          title: 'Victory of Light',
          description: 'Darkness is finally vanquished',
          date: 'Year 32500',
          subEvents: [
            { id: 'age8_e2_sub1', label: 'Evil Overthrown', content: 'Shadow banished forever' },
            { id: 'age8_e2_sub2', label: 'Restoration Begins', content: 'Healing of all wounds starts' }
          ]
        }
      ]
    },
    {
      id: 'age9',
      title: 'AGE 9: The Eternal Dawn',
      description: 'Perfect world begins anew',
      events: [
        {
          id: 'age9_event1',
          title: 'The Great Renewal',
          description: 'All creation is made perfect',
          date: 'Year 35000',
          subEvents: [
            { id: 'age9_e1_sub1', label: 'Paradise Restored', content: 'Eden blooms eternal' },
            { id: 'age9_e1_sub2', label: 'Immortal Peace', content: 'Death and suffering end' },
            { id: 'age9_e1_sub3', label: 'Divine Harmony', content: 'Perfect balance achieved' }
          ]
        },
        {
          id: 'age9_event2',
          title: 'Eternal Bliss',
          description: 'Infinite happiness for all',
          date: 'Year 40000',
          subEvents: [
            { id: 'age9_e2_sub1', label: 'Endless Joy', content: 'Perpetual celebration begins' },
            { id: 'age9_e2_sub2', label: 'Unity Achieved', content: 'All beings become one' }
          ]
        }
      ]
    }
  ];

  const toggleNode = (node: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [node]: !prev[node as keyof typeof prev]
    }));
  };

  const toggleEvent = (event: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [event]: !prev[event as keyof typeof prev]
    }));
  };

  const getCenter = (id: string) => {
    const ref = refs.current[id];
    if (!ref || !containerRef.current) return null;
    const rect = ref.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
      bottom: rect.bottom - containerRect.top,
      top: rect.top - containerRect.top
    };
  };

  const createRoundedPath = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, radius: number = 15) => {
    if (Math.abs(x2 - x1) < 1) {
      const cornerY1 = y2 - radius;
      const cornerY2 = y2 + radius;
      const xDir = x3 > x1 ? radius : -radius;
      return `M ${x1} ${y1} L ${x1} ${cornerY1} Q ${x1} ${y2} ${x1 + xDir} ${y2} L ${x3 - xDir} ${y2} Q ${x3} ${y2} ${x3} ${cornerY2} L ${x4} ${y4}`;
    }
    return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4}`;
  };

  // New function for gentle T-junction curves
  const createGentleRoundedPath = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, radius: number = 16) => {
    // Create path with gentle curves at T-junctions
    return `M ${x1} ${y1} L ${x1} ${y2 - radius} Q ${x1} ${y2} ${x1 + (x3 > x1 ? radius : -radius)} ${y2} L ${x3 - (x3 > x1 ? radius : -radius)} ${y2} Q ${x3} ${y2} ${x3} ${y2 + radius} L ${x4} ${y4}`;
  };

  useEffect(() => {
    const calculateLines = () => {
      const newLines: Line[] = [];
      const radius = 15;
      
      agesData.forEach((age) => {
        if (expandedNodes[age.id as keyof typeof expandedNodes]) {
          const agePos = getCenter(age.id);
          
          age.events.forEach((event, eventIdx) => {
            const eventPos = getCenter(event.id);
            
            if (agePos && eventPos) {
              const midY = eventIdx === 0 ? agePos.bottom + 50 : eventPos.top - 50;
              const startX = eventIdx === 0 ? agePos.x - 60 : agePos.x + 60;
              newLines.push({
                path: createRoundedPath(startX, agePos.bottom, startX, midY, eventPos.x, midY, eventPos.x, eventPos.top, radius)
              });
            }

            if (expandedEvents[event.id as keyof typeof expandedEvents]) {
              event.subEvents.forEach((subEvent) => {
                const subPos = getCenter(subEvent.id);
                if (eventPos && subPos) {
                  const bendY = eventPos.bottom + 40;
                  // Use gentle rounded path with small radius for elegant T-junctions
                  const gentleRadius = 16; // Small radius for subtle curves
                  newLines.push({
                    path: createGentleRoundedPath(eventPos.x, eventPos.bottom, eventPos.x, bendY, subPos.x, bendY, subPos.x, subPos.top, gentleRadius)
                  });
                }
              });
            }
          });
        }
      });

      setLines(newLines);
    };

    calculateLines();
    const timer = setTimeout(calculateLines, 100);
    const handleResize = () => calculateLines();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [expandedNodes, expandedEvents, agesData]);

  return (
    <div className="min-h-screen relative overflow-auto">
      {/* Clean Dark Background - No Purple */}
      <div className="absolute inset-0 bg-slate-900">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 p-8">
        {/* Vertical 1×9 layout container */}
        <div className="w-full max-w-4xl mx-auto relative" ref={containerRef}>
          {/* Enhanced SVG with glowing effects */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {lines.map((line, index) => (
              <g key={index}>
                {/* Glow effect */}
                <path
                  d={line.path}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.3"
                  filter="url(#glow)"
                />
                {/* Main line */}
                <path
                  d={line.path}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </g>
            ))}
          </svg>

          {/* Vertical Layout: 1 Column, 9 Rows */}
          <div className="flex flex-col gap-8 relative" style={{ zIndex: 10 }}>
            {agesData.map((age, ageIndex) => (
              <div key={age.id} className="w-full">
                {/* Age Card */}
                <div 
                  ref={el => refs.current[age.id] = el}
                  onClick={() => toggleNode(age.id)}
                  className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105 w-full max-w-3xl mx-auto"
                >
                  {/* Card glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-amber-500/30 rounded-2xl shadow-2xl p-6 group-hover:border-amber-400/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-red-500/5 rounded-2xl"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                          {age.title}
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed">{age.description}</p>
                      </div>
                      <div className="ml-6 p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 group-hover:from-amber-400/30 group-hover:to-red-400/30 transition-all duration-300">
                        {expandedNodes[age.id as keyof typeof expandedNodes] ? 
                          <ChevronDown size={24} className="text-amber-400" /> : 
                          <ChevronRight size={24} className="text-amber-400" />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Events */}
                {expandedNodes[age.id as keyof typeof expandedNodes] && (
                  <div className="w-full mt-8 animate-fadeIn">
                    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                      {age.events.map((event, eventIdx) => (
                        <div key={event.id} className="w-full">
                          {/* Event Card */}
                          <div 
                            ref={el => refs.current[event.id] = el}
                            onClick={() => toggleEvent(event.id)}
                            className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105 w-full"
                          >
                            {/* Event card glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                            
                            {/* Main event card */}
                            <div className="relative bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-5 group-hover:border-blue-400/50 transition-all duration-500">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl"></div>
                              
                              <div className="relative flex items-center justify-between">
                                <div className="flex-1">
                                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                    {event.title}
                                  </h2>
                                  <p className="text-slate-300 text-base mb-3 leading-relaxed">{event.description}</p>
                                  
                                  <div className="flex items-center text-slate-400 text-sm">
                                    <Calendar size={16} className="mr-2" />
                                    <span>{event.date}</span>
                                  </div>
                                </div>
                                <div className="ml-4 p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                                  {expandedEvents[event.id as keyof typeof expandedEvents] ? 
                                    <ChevronDown size={20} className="text-blue-400" /> : 
                                    <ChevronRight size={20} className="text-blue-400" />
                                  }
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sub-events */}
                          {expandedEvents[event.id as keyof typeof expandedEvents] && (
                            <div className="mt-6 w-full animate-fadeIn">
                              <div className="flex flex-col gap-4 ml-8">
                                {event.subEvents.map((subEvent, subIdx) => (
                                  <div key={subEvent.id} className="w-full">
                                    <div className="mb-2">
                                      <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                                        {subEvent.label}
                                      </span>
                                    </div>
                                    
                                    <div 
                                      ref={el => refs.current[subEvent.id] = el}
                                      className="group relative w-full cursor-pointer transform transition-all duration-300 hover:scale-105"
                                    >
                                      {/* Sub-event glow */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg blur group-hover:blur-md transition-all duration-300"></div>
                                      
                                      {/* Main sub-event card */}
                                      <div className="relative bg-gradient-to-br from-slate-600/80 to-slate-700/80 backdrop-blur-sm border border-cyan-500/25 rounded-lg shadow-lg p-4 group-hover:border-cyan-400/40 transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-lg"></div>
                                        
                                        <div className="relative flex items-center">
                                          <Clock size={16} className="text-cyan-400 mr-3 flex-shrink-0" />
                                          <p className="text-slate-200 text-base leading-relaxed">{subEvent.content}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* Starfield animation */
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 120%;
          transform: rotate(-45deg);
          background-image: 
            radial-gradient(2px 2px at 20% 30%, #eee, transparent),
            radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90% 40%, #fff, transparent),
            radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.6), transparent);
          background-repeat: repeat;
          background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
          animation: sparkle 10s linear infinite;
        }

        .twinkling {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 120%;
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><radialGradient id="a"><stop offset="0%" stop-color="%23fff" stop-opacity=".8"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="1" fill="url(%23a)"/></svg>') repeat;
          animation: sparkle 8s linear infinite reverse;
          opacity: 0.3;
        }

        @keyframes sparkle {
          from { transform: translateX(0); }
          to { transform: translateX(-550px); }
        }
      `}</style>
    </div>
  );
};

export default TimelineTree;