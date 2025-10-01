import React, { useEffect, useMemo, useRef, useState } from "react";
import { Age } from '../../../lib/api-timeline';
import { useEventsByAge } from '../hooks/useTimelineData';
import "./expandable-orbital.css";

type Layer = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  // Optional custom content for the expanded view
  content?: React.ReactNode;
  // Optional orbit color; if not provided, gold is used
  color?: string;
  // For integration with existing Age data
  age?: Age;
};

export interface ExpandableOrbitalDialProps {
  ages: Age[];
  selectedAge?: Age | null;
  onAgeSelect: (age: Age) => void;
  className?: string;
}

const DEFAULT_LAYERS: Layer[] = [
  { id: "1", title: "Primordial Age", subtitle: "The Dawn", description: "The first light and ordering of creation." },
  { id: "2", title: "Heroic Age", subtitle: "Champions Rise", description: "Epic deeds and trials across the lands." },
  { id: "3", title: "Dynastic Age", subtitle: "Kingdoms Forge", description: "Thrones rise, empires clash, oaths are sworn." },
];

export const ExpandableOrbitalDial: React.FC<ExpandableOrbitalDialProps> = ({
  ages,
  selectedAge,
  onAgeSelect,
  className = '',
}) => {
  // Convert ages to layers format
  const layers = useMemo(() => {
    if (ages.length === 0) return DEFAULT_LAYERS;
    
    return ages.map((age, index) => ({
      id: age.id,
      title: age.name || age.title || `Age ${age.age_number}` || 'Unknown Age',
      subtitle: `${age.start_year || '∞'} – ${age.end_year || '∞'}`,
      description: age.description || 'No description available for this age.',
      age: age,
    }));
  }, [ages]);

  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Disable body scroll when expanded
  useEffect(() => {
    if (expanded) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [expanded]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && expanded) collapse();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const expand = (idx: number) => {
    setActive(idx);
    // Select the age for parent component
    if (layers[idx].age) {
      onAgeSelect(layers[idx].age!);
    }
    // Small delay lets CSS read initial state before animating
    requestAnimationFrame(() => setExpanded(true));
  };

  const collapse = () => {
    setExpanded(false);
    // Let the collapse animation finish before clearing active
    setTimeout(() => setActive(null), 350);
  };

  const onBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".orbital-expanded-content")) return;
    collapse();
  };

  return (
    <div ref={rootRef} className={`orbital-dial-root ${className}`}>
      {/* Stacked semicircles (compact state) */}
      <div className={`orbital-stack ${expanded ? "is-hidden" : ""}`}>
        {layers.map((layer, i) => (
          <button
            key={layer.id}
            className="orbital-layer"
            style={
              {
                // Control offset and thickness per ring; tweak as needed
                "--layer-index": i,
                "--ring-color": layer.color || "var(--gold-500)",
              } as React.CSSProperties
            }
            onClick={() => expand(i)}
            aria-label={`Open ${layer.title}`}
          >
            <span className="orbital-layer-outline" />
            <span className="orbital-layer-label">
              <span className="label-title">{layer.title}</span>
              {layer.subtitle ? <span className="label-sub">{layer.subtitle}</span> : null}
            </span>
          </button>
        ))}
      </div>

      {/* Full-screen expansion with integrated content (no modal) */}
      {active !== null && (
        <div
          className={`orbital-overlay ${expanded ? "is-expanded" : "is-collapsing"}`}
          onMouseDown={onBackgroundClick}
          role="dialog"
          aria-modal="true"
          aria-label={`${layers[active].title} details`}
        >
          {/* This is the golden background that animates from a left-side semicircle to full-screen */}
          <div
            className="orbital-overlay-fill"
            style={
              {
                "--ring-color": layers[active].color || "var(--gold-500)",
              } as React.CSSProperties
            }
          />

          {/* Integrated content on the golden background */}
          <ExpandedContent 
            layer={layers[active]} 
            onClose={collapse}
            onContentClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

// Separate component for expanded content to keep main component clean
interface ExpandedContentProps {
  layer: Layer;
  onClose: () => void;
  onContentClick: (e: React.MouseEvent) => void;
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({ layer, onClose, onContentClick }) => {
  const { events, loading, error } = useEventsByAge(layer.age?.id || '');

  return (
    <div className="orbital-expanded-content" onMouseDown={onContentClick}>
      <div className="expanded-topbar">
        <div className="title-wrap">
          <h2 className="expanded-title">{layer.title}</h2>
          {layer.subtitle ? <div className="expanded-sub">{layer.subtitle}</div> : null}
        </div>

        <button className="close-btn" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="expanded-body">
        {layer.description ? (
          <p className="expanded-desc">{layer.description}</p>
        ) : null}

        {/* Events section */}
        {layer.age && (
          <div className="age-events-section">
            {loading && (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading events...</p>
              </div>
            )}
            
            {error && (
              <div className="error-state">
                <p className="error-text">Failed to load events</p>
              </div>
            )}
            
            {!loading && !error && events.length > 0 && (
              <>
                <h3 className="events-title">Timeline Events</h3>
                <div className="expanded-grid">
                  {events.slice(0, 6).map((event) => (
                    <div key={event.id} className="grid-item">
                      <div className="item-head">
                        {new Date(event.date).getFullYear()}
                      </div>
                      <div className="item-body">
                        <h4 className="event-title">{event.title}</h4>
                        <p className="event-description">
                          {event.description?.substring(0, 120)}
                          {event.description && event.description.length > 120 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {events.length > 6 && (
                  <p className="more-events-note">
                    +{events.length - 6} more events in this age
                  </p>
                )}
              </>
            )}
            
            {!loading && !error && events.length === 0 && (
              <div className="no-events-state">
                <div className="item-head">No Events</div>
                <div className="item-body">This age has no recorded timeline events yet.</div>
              </div>
            )}
          </div>
        )}

        {/* Example content when no age data */}
        {!layer.age && (
          <div className="expanded-grid">
            <div className="grid-item">
              <div className="item-head">Key Event</div>
              <div className="item-body">Founding of sacred order and covenantal rite.</div>
            </div>
            <div className="grid-item">
              <div className="item-head">Adversary</div>
              <div className="item-body">Serpentine usurper stirs at the edge of empire.</div>
            </div>
            <div className="grid-item">
              <div className="item-head">Relics</div>
              <div className="item-body">Avestan tablets, consecrated flame, seven seals.</div>
            </div>
          </div>
        )}

        {/* If a layer provides custom content, render it after defaults */}
        {layer.content}
      </div>
    </div>
  );
};

export default ExpandableOrbitalDial;