import React from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <div className={`loading-container ${!isLoading ? 'loading-exit' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-title">REVERSE SERVICE MARKETPLACE</h1>
      </div>
    </div>
  );
};
