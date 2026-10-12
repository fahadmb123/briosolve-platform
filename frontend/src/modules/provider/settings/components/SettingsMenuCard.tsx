import React from 'react';

interface SettingsMenuCardProps {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    danger?: boolean;
    badge?: { text: string; type: 'success' | 'warning' | 'danger' | 'info' };
}

const SettingsMenuCardComponent: React.FC<SettingsMenuCardProps> = ({ icon, title, description, onClick, danger = false, badge }) => {
    return (
        <div 
            className="settings-glass-card relative" 
            onClick={onClick}
            style={danger ? { borderColor: 'rgba(239, 68, 68, 0.2)' } : undefined}
        >
            {badge && (
                <div className="absolute top-4 right-4">
                    <span className={`badge badge-${badge.type} text-xs px-2 py-1`}>{badge.text}</span>
                </div>
            )}
            <div 
                className="settings-glass-icon"
                style={danger ? { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' } : undefined}
            >
                <i className={icon}></i>
            </div>
            <h3 
                className="settings-glass-title"
                style={danger ? { color: '#ef4444' } : undefined}
            >
                {title}
            </h3>
            <p className="settings-glass-desc">{description}</p>
            <i 
                className="fas fa-chevron-right settings-glass-arrow"
                style={danger ? { color: '#ef4444' } : undefined}
            ></i>
        </div>
    );
};

export const SettingsMenuCard = React.memo(SettingsMenuCardComponent);
