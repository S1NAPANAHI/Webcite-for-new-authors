import React from 'react';

interface AchievementsTabProps {
  userProfile: any; // Replace 'any' with a proper UserProfile type later
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ userProfile }) => {
  return (
    <div>
      <h2 className="section-title text-2xl font-semibold text-secondary mb-4 border-b-2 border-primary-dark pb-2">Achievements</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center transition-all duration-300 hover:scale-105">
          <span className="block text-4xl mb-2">📚</span>
          <div className="font-semibold text-text-light text-sm">First Chapter</div>
        </div>
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center transition-all duration-300 hover:scale-105">
          <span className="block text-4xl mb-2">⭐</span>
          <div className="font-semibold text-text-light text-sm">Book Reviewer</div>
        </div>
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center transition-all duration-300 hover:scale-105">
          <span className="block text-4xl mb-2">🔥</span>
          <div className="font-semibold text-text-light text-sm">Reading Streak</div>
        </div>
        <div className="bg-primary-dark/20 border border-primary-dark rounded-lg p-4 text-center transition-all duration-300 hover:scale-105">
          <span className="block text-4xl mb-2">🏆</span>
          <div className="font-semibold text-text-light text-sm">Beta Reader</div>
        </div>
        <div className="bg-background-dark/50 border border-background-dark rounded-lg p-4 text-center transition-all duration-300 hover:scale-105">
          <span className="block text-4xl mb-2">💎</span>
          <div className="font-semibold text-text-light text-sm">Completionist</div>
        </div>
        <div className="bg-background-dark/50 border border-background-dark rounded-lg p-4 text-center transition-all duration-300 hover:scale-105">
          <span className="block text-4xl mb-2">🌟</span>
          <div className="font-semibold text-text-light text-sm">Super Fan</div>
        </div>
      </div>
    </div>
  );
};


