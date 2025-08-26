import React, { useState, useEffect } from 'react';
import styles from './Timelines.module.css';
import { fetchTimelineEvents } from '../lib/api';

// Import the type separately
type TimelineEvent = import('../lib/api').TimelineEvent;

interface MilestoneProps {
  date: string;
  title: string;
  description: string;
  details?: string;
  nested_events?: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  background_image?: string;
}

const Milestone: React.FC<MilestoneProps> = ({ 
  date, 
  title, 
  description, 
  details, 
  nested_events = [], 
  background_image 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const milestoneStyle = background_image ? { 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background_image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
  } : {};

  return (
    <div className={styles.milestone} style={milestoneStyle}>
      <div className={styles.dot}></div>
      <div className={styles.content} onClick={toggleExpand}>
        <span className={styles.date}>{date}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        {isExpanded && (
          <div className={styles.expandedContent}>
            {details && <p className={styles.detailsText}>{details}</p>}
            {nested_events && nested_events.length > 0 && (
              <div className={styles.miniTimeline}>
                {nested_events.map((event, index) => (
                  <div key={index} className={styles.miniMilestone}>
                    <div className={styles.miniDot}></div>
                    <div className={styles.miniContent}>
                      <span className={styles.miniDate}>{event.date}</span>
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Timelines: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchTimelineEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load timeline events:', err);
        setError('Failed to load timeline. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Timeline Events Found</h2>
          <p className="text-gray-600">Check back later for updates to the timeline.</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`${styles.timeline} py-12`}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Zoroastrian Timeline</h1>
        {events.map((event) => (
          <Milestone
            key={event.id}
            date={event.date}
            title={event.title}
            description={event.description}
            details={event.details}
            nested_events={event.nested_events}
            background_image={event.background_image}
          />
        ))}
      </div>
    </section>
  );
};

export default Timelines;
