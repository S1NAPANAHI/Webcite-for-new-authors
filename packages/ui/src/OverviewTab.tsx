import React from 'react';

interface OverviewTabProps {
  userProfile: any; // Replace 'any' with a proper UserProfile type later
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ userProfile }) => {
  return (
    <div>
      <h2 className="section-title text-2xl font-semibold text-secondary mb-4 border-b-2 border-primary-dark pb-2">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center">
          <span className="block text-3xl font-bold text-secondary">{userProfile.books_read}</span>
          <div className="text-sm text-primary-light mt-1">Books Read</div>
        </div>
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center">
          <span className="block text-3xl font-bold text-secondary">{userProfile.currently_reading}</span>
          <div className="text-sm text-primary-light mt-1">Currently Reading</div>
        </div>
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center">
          <span className="block text-3xl font-bold text-secondary">{userProfile.reading_hours}</span>
          <div className="text-sm text-primary-light mt-1">Reading Hours</div>
        </div>
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center">
          <span className="block text-3xl font-bold text-secondary">{userProfile.achievements_count}</span>
          <div className="text-sm text-primary-light mt-1">Achievements</div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-secondary mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {/* Placeholder for recent activity items */}
        <div className="bg-background-dark/50 border border-background-dark rounded-lg p-4 flex items-center gap-4">
          <div className="w-16 h-20 bg-primary-dark flex items-center justify-center text-lg font-bold rounded-md">V1</div>
          <div>
            <div className="font-semibold text-text-light">Volume 1: Foundations of Ruin</div>
            <div className="text-sm text-primary-light">Completed • Read 3 days ago</div>
          </div>
        </div>
        <div className="bg-background-dark/50 border border-background-dark rounded-lg p-4 flex items-center gap-4">
          <div className="w-16 h-20 bg-primary-dark flex items-center justify-center text-lg font-bold rounded-md">A3</div>
          <div>
            <div className="font-semibold text-text-light">Arc 3: The Silent Accord</div>
            <div className="text-sm text-primary-light">Chapter 5 of 8</div>
            <div className="w-full bg-primary-dark/30 rounded-full h-1.5 mt-1">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '62.5%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
