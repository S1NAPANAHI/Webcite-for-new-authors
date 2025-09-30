import React from 'react';
import { EnhancedCosmicTimeline } from '../components/timeline/EnhancedCosmicTimeline';
import { TimelineProvider, useTimelineKeyboardShortcuts } from '../contexts/TimelineContext';

const TimelinePageContent: React.FC = () => {
  // Enable keyboard shortcuts for navigation
  useTimelineKeyboardShortcuts();
  
  return (
    <div className="min-h-screen bg-timeline-bg text-timeline-text">
      <EnhancedCosmicTimeline />
    </div>
  );
};

const TimelinesPage: React.FC = () => {
  return (
    <TimelineProvider>
      <TimelinePageContent />
    </TimelineProvider>
  );
};

export default TimelinesPage;