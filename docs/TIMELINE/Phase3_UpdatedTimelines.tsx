import React from 'react';
import { CosmicTimeline } from '../components/timeline/CosmicTimeline';
import { TimelineProvider } from '../contexts/TimelineContext';

const TimelinesPage: React.FC = () => {
  return (
    <TimelineProvider>
      <div className="min-h-screen bg-timeline-bg text-timeline-text">
        <CosmicTimeline />
      </div>
    </TimelineProvider>
  );
};

export default TimelinesPage;