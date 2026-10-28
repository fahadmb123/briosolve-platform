import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const AddressCardSkeleton: React.FC = React.memo(() => {
    return (
        <div 
            className="bg-surface-container rounded-xl border border-surface-variant shadow-md p-5 relative overflow-hidden flex flex-col justify-between gap-4 pointer-events-none select-none opacity-90"
            aria-hidden="true"
        >
            {/* Top Row: Info & Top Actions */}
            <div className="flex items-start justify-between w-full pl-2 gap-4">
                <div className="flex items-start gap-4 w-full">
                    {/* Icon container skeleton */}
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-surface-variant flex items-center justify-center shrink-0">
                        <Skeleton width={20} height={20} borderRadius={4} />
                    </div>

                    {/* Address details */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        {/* Title & Badge */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <Skeleton width={90} height={20} borderRadius={4} />
                            <Skeleton width={55} height={18} borderRadius={9999} />
                        </div>

                        {/* Address lines */}
                        <div className="flex flex-col gap-1 mt-0.5 w-full">
                            <Skeleton width="45%" height={15} borderRadius={4} />
                            <Skeleton width="75%" height={14} borderRadius={4} />
                            <Skeleton width="60%" height={14} borderRadius={4} />
                        </div>

                        {/* Landmark pill */}
                        <div className="pt-1.5">
                            <Skeleton width={150} height={28} borderRadius={8} />
                        </div>
                    </div>
                </div>

                {/* Top Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    <Skeleton width={64} height={32} borderRadius={8} />
                    <Skeleton width={32} height={32} borderRadius={8} />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-end justify-between w-full pl-2 mt-2">
                <Skeleton width={130} height={12} borderRadius={4} />
                <Skeleton width={110} height={32} borderRadius={8} />
            </div>
        </div>
    );
});

interface AddressCardSkeletonGridProps {
    count?: number;
}

export const AddressCardSkeletonGrid: React.FC<AddressCardSkeletonGridProps> = ({ count = 3 }) => {
    return (
        <SkeletonTheme
            baseColor="var(--surface-elevated)"
            highlightColor="var(--surface-hover)"
            borderRadius="0.375rem"
            duration={1.5}
        >
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading saved addresses">
                {Array.from({ length: count }).map((_, index) => (
                    <AddressCardSkeleton key={index} />
                ))}
            </div>
        </SkeletonTheme>
    );
};
