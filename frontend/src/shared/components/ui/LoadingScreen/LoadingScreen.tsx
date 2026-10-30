import React from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <div className={`loading-container ${!isLoading ? 'loading-exit' : ''}`}>
      <div className="loading-content">
        <img src="/briosolve-logo.svg" alt="Briosolve" className="loading-emblem" />
        <img src="/briosolve-text-logo.svg" alt="Briosolve" className="loading-text-logo" />
      </div>
    </div>
  );
};
