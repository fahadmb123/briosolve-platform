import React from 'react';
import './SpinnerOverlay.css';

interface SpinnerOverlayProps {
  isLoading: boolean;
}

export const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="spinner-overlay-container">
      <div className="spinner"></div>
    </div>
  );
};
