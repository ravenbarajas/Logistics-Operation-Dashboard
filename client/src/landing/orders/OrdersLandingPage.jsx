import React from 'react';
import { useLocation } from 'wouter';

function OrdersLandingPage() {
  const [, navigate] = useLocation();

  const handleGoToDashboard = () => {
    navigate('/orders/management');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Order Management</h1>
        <p className="text-xl mb-8">
          Track, manage, and optimize your orders with our comprehensive order management system.
        </p>
        
        <button 
          onClick={handleGoToDashboard}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium text-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          Go to Order Dashboard
        </button>
      </div>
    </div>
  );
}

export default OrdersLandingPage; 