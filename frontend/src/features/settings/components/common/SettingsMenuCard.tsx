import React from 'react';

interface SettingsMenuCardProps {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    danger?: boolean;
    badge?: { text: string; type: 'success' | 'warning' | 'danger' | 'info' };
}

const SettingsMenuCardComponent: React.FC<SettingsMenuCardProps> = ({
    icon,
    title,
    description,
    onClick,
    danger = false,
    badge,
}) => {
    return (
        <div
            className={`settings-win-card group ${danger ? 'settings-win-card-danger' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="settings-win-left">
                <div
                    className={`settings-win-icon ${danger ? 'settings-win-icon-danger' : ''}`}
                >
                    <i className={icon}></i>
                </div>
                <div className="settings-win-text">
                    <div className="settings-win-title-row">
                        <span className={`settings-win-title ${danger ? 'text-danger' : ''}`}>
                            {title}
                        </span>
                    </div>
                    <p className="settings-win-desc">{description}</p>
                </div>
            </div>

            <div className="settings-win-right">
                {badge && (
                    <span className={`badge badge-${badge.type} text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0`}>
                        {badge.text}
                    </span>
                )}
                <div className="settings-win-arrow">
                    <i className="fas fa-chevron-right text-xs"></i>
                </div>
            </div>
        </div>
    );
};

export const SettingsMenuCard = React.memo(SettingsMenuCardComponent);
