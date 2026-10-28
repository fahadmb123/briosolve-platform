import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

interface TradeServicesSkeletonProps {
  count?: number;
}

export const TradeServicesSkeleton = memo(({ count = 2 }: TradeServicesSkeletonProps) => {
  return (
    <div className="flex flex-col gap-5 my-2">
      {Array.from({ length: count }).map((_, catIndex) => (
        <div
          key={`trade-skel-${catIndex}`}
          className="border rounded-xl overflow-hidden"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          {/* Category Header */}
          <div
            className="px-5 py-3.5 flex justify-between items-center border-b flex-wrap gap-2"
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <Skeleton width={32} height={32} borderRadius={8} />
              <div>
                <Skeleton width={120} height={16} borderRadius={4} />
                <Skeleton width={70} height={12} borderRadius={4} style={{ marginTop: 4 }} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton width={90} height={24} borderRadius={6} />
              <Skeleton width={28} height={24} borderRadius={6} />
            </div>
          </div>

          {/* Service items */}
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {Array.from({ length: 3 }).map((_, svcIndex) => (
              <div
                key={`trade-skel-${catIndex}-svc-${svcIndex}`}
                className="flex justify-between items-center px-5 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton circle width={14} height={14} />
                  <Skeleton width={130 + (svcIndex * 25)} height={14} borderRadius={4} />
                </div>
                <Skeleton width={24} height={24} borderRadius={6} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

TradeServicesSkeleton.displayName = 'TradeServicesSkeleton';
