import React from 'react';
import { useLocation } from 'wouter';

function AnalyticsLandingPage() {
  const [, navigate] = useLocation();

  const handleGoToDashboard = () => {
    navigate('/analytics/risk');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Analytics</h1>
        <p className="text-xl mb-8">
          Gain valuable insights into your logistics performance with detailed analytics and visualizations.
        </p>
        
        <button 
          onClick={handleGoToDashboard}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium text-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          Go to Analytics Dashboard
        </button>
      </div>
    </div>
  );
}

export default AnalyticsLandingPage; 