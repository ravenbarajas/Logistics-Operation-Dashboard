import React from 'react';
import { useLocation } from 'wouter';

function VehiclesLandingPage() {
  const [, navigate] = useLocation();

  const handleGoToDashboard = () => {
    navigate('/vehicles/inventory');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Vehicle Management</h1>
        <p className="text-xl mb-8">
          Manage your fleet, track maintenance, and monitor fuel efficiency with our vehicle management system.
        </p>
        
        <button 
          onClick={handleGoToDashboard}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium text-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          Go to Vehicle Dashboard
        </button>
      </div>
    </div>
  );
}

export default VehiclesLandingPage; 