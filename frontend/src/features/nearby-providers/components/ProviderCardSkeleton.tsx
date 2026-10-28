import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ProviderCardSkeleton: React.FC = React.memo(() => {
    return (
        <div className="card provider-card provider-card-skeleton" aria-hidden="true">
            {/* Card Cover */}
            <div className="provider-card-cover">
                <div className="provider-cover-top">
                    <Skeleton width={96} height={22} borderRadius={9999} />
                </div>
            </div>

            {/* Avatar & Title Row */}
            <div className="provider-avatar-row">
                <div className="provider-avatar-wrapper">
                    <Skeleton circle width={78} height={78} className="provider-avatar-skeleton" />
                </div>

                <div className="provider-header-meta">
                    <Skeleton width="70%" height={18} style={{ marginBottom: 6 }} />
                    <Skeleton width="45%" height={14} />
                </div>
            </div>

            {/* Card Body */}
            <div className="provider-card-body">
                {/* Location & Radius Meta */}
                <div className="provider-location-meta">
                    <Skeleton width={110} height={26} borderRadius={6} />
                    <Skeleton width={90} height={26} borderRadius={6} />
                </div>

                {/* Stats Bar */}
                <div className="provider-stats-bar">
                    <div className="skeleton-stat-box">
                        <Skeleton width={38} height={16} />
                        <Skeleton width={48} height={10} style={{ marginTop: 2 }} />
                    </div>
                    <div className="provider-stat-divider" />
                    <div className="skeleton-stat-box">
                        <Skeleton width={38} height={16} />
                        <Skeleton width={48} height={10} style={{ marginTop: 2 }} />
                    </div>
                    <div className="provider-stat-divider" />
                    <div className="skeleton-stat-box">
                        <Skeleton width={38} height={16} />
                        <Skeleton width={48} height={10} style={{ marginTop: 2 }} />
                    </div>
                </div>

                {/* Bio text lines */}
                <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Skeleton count={2} height={12} />
                </div>

                {/* Skills tags */}
                <div className="provider-skills-list" style={{ marginTop: 4 }}>
                    <Skeleton width={60} height={22} borderRadius={4} />
                    <Skeleton width={75} height={22} borderRadius={4} />
                    <Skeleton width={55} height={22} borderRadius={4} />
                </div>
            </div>

            {/* Footer Action Button */}
            <div className="provider-card-footer">
                <Skeleton height={40} borderRadius={8} />
            </div>
        </div>
    );
});

interface ProviderCardSkeletonGridProps {
    count?: number;
}

export const ProviderCardSkeletonGrid: React.FC<ProviderCardSkeletonGridProps> = ({ count = 4 }) => {
    return (
        <SkeletonTheme
            baseColor="var(--surface-elevated)"
            highlightColor="var(--surface-hover)"
            borderRadius="0.375rem"
            duration={1.5}
        >
            <div className="providers-grid" aria-busy="true" aria-label="Loading providers">
                {Array.from({ length: count }).map((_, index) => (
                    <ProviderCardSkeleton key={index} />
                ))}
            </div>
        </SkeletonTheme>
    );
};
