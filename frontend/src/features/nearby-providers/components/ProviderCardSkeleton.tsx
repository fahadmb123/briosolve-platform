import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ProviderCardSkeleton: React.FC = React.memo(() => {
    return (
        <div className="card provider-clean-card provider-clean-card-skeleton" aria-hidden="true">
            <div className="provider-clean-avatar-wrap">
                <Skeleton circle width={110} height={110} className="provider-clean-avatar-skeleton" />
            </div>

            <div className="provider-clean-info">
                <Skeleton width="65%" height={24} style={{ marginBottom: 8 }} />
                <Skeleton width="50%" height={16} style={{ marginBottom: 14 }} />
                <Skeleton width="60%" height={28} borderRadius={9999} />
            </div>

            <div className="provider-clean-footer">
                <Skeleton height={42} borderRadius={12} />
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
