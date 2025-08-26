import React from 'react';
import BetaFeedbackForm from '../components/BetaFeedbackForm';

const BetaFeedbackPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Submit Your Feedback</h1>
      <BetaFeedbackForm />
    </div>
  );
};

export default BetaFeedbackPage;