import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

interface DocumentCardSkeletonProps {
  count?: number;
}

export const DocumentCardSkeleton = memo(({ count = 2 }: DocumentCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`kyc-skeleton-card-${index}`} className="kyc-card">
          <div>
            <div className="kyc-card-top flex justify-between items-center mb-4">
              <Skeleton width={56} height={56} borderRadius={12} />
              <Skeleton width={100} height={26} borderRadius={9999} />
            </div>

            <div className="mb-3">
              <Skeleton width="55%" height={22} borderRadius={4} />
            </div>

            <div className="flex flex-col gap-1.5 mb-6">
              <Skeleton width="95%" height={14} borderRadius={4} />
              <Skeleton width="80%" height={14} borderRadius={4} />
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface-elevated flex flex-col gap-2.5 mb-6">
              <div className="flex justify-between items-center">
                <Skeleton width={70} height={14} borderRadius={4} />
                <Skeleton width={120} height={14} borderRadius={4} />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton width={85} height={14} borderRadius={4} />
                <Skeleton width={50} height={14} borderRadius={4} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Skeleton width="100%" height={40} borderRadius={10} />
          </div>
        </div>
      ))}
    </>
  );
});

DocumentCardSkeleton.displayName = 'DocumentCardSkeleton';
