import React, { memo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CategoryBoxSkeletonProps {
  count?: number;
}

export const CategoryBoxSkeleton: React.FC<CategoryBoxSkeletonProps> = memo(
  ({ count = 6 }) => {
    return (
      <div className="request-section-card select-none pointer-events-none" aria-hidden="true">
        <div className="request-section-header">
          <Skeleton circle width={36} height={36} />
          <div className="request-section-title-group">
            <Skeleton width={190} height={20} borderRadius={4} />
            <div style={{ marginTop: 4 }}>
              <Skeleton width={260} height={13} borderRadius={4} />
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Skeleton width={96} height={26} borderRadius={9999} />
          </div>
        </div>

        <div className="request-categories-grid">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={`cat-skel-${idx}`} className="request-category-card">
              <div style={{ marginBottom: "0.75rem" }}>
                <Skeleton width={44} height={44} borderRadius={8} />
              </div>
              <div style={{ width: "100%", marginBottom: "0.35rem" }}>
                <Skeleton width="65%" height={15} borderRadius={4} />
              </div>
              <div style={{ width: "100%" }}>
                <Skeleton width="90%" height={11} borderRadius={4} />
                <div style={{ marginTop: 3 }}>
                  <Skeleton width="60%" height={11} borderRadius={4} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CategoryBoxSkeleton.displayName = "CategoryBoxSkeleton";

interface ServicesBoxSkeletonProps {
  count?: number;
}

export const ServicesBoxSkeleton: React.FC<ServicesBoxSkeletonProps> = memo(
  ({ count = 6 }) => {
    return (
      <div className="request-section-card select-none pointer-events-none" aria-hidden="true">
        <div className="request-section-header">
          <Skeleton circle width={36} height={36} />
          <div className="request-section-title-group">
            <Skeleton width={220} height={20} borderRadius={4} />
            <div style={{ marginTop: 4 }}>
              <Skeleton width={290} height={13} borderRadius={4} />
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Skeleton width={110} height={26} borderRadius={9999} />
          </div>
        </div>

        <div className="request-services-grid">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={`svc-skel-${idx}`} className="request-service-item-card">
              <Skeleton circle width={20} height={20} />
              <div className="request-service-item-content">
                <Skeleton width={120 + (idx % 3) * 20} height={15} borderRadius={4} />
                <div style={{ marginTop: 4 }}>
                  <Skeleton width={80} height={11} borderRadius={4} />
                </div>
              </div>
              <Skeleton width={14} height={14} borderRadius={3} />
            </div>
          ))}
        </div>

        <div className="level-navigation-bar">
          <div className="level-nav-summary">
            <Skeleton width={200} height={14} borderRadius={4} />
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Skeleton width={180} height={42} borderRadius={10} />
          </div>
        </div>
      </div>
    );
  }
);

ServicesBoxSkeleton.displayName = "ServicesBoxSkeleton";

export interface ServiceSelectionSkeletonProps {
  showCategories?: boolean;
  showServices?: boolean;
  categoryCount?: number;
  serviceCount?: number;
}

export const ServiceSelectionSkeleton: React.FC<ServiceSelectionSkeletonProps> = memo(
  ({
    showCategories = true,
    showServices = true,
    categoryCount = 6,
    serviceCount = 6,
  }) => {
    return (
      <SkeletonTheme
        baseColor="var(--surface-elevated)"
        highlightColor="var(--surface-hover)"
        borderRadius="0.375rem"
      >
        <div className="flex flex-col gap-6 w-full">
          {showCategories && <CategoryBoxSkeleton count={categoryCount} />}
          {showServices && <ServicesBoxSkeleton count={serviceCount} />}
        </div>
      </SkeletonTheme>
    );
  }
);

ServiceSelectionSkeleton.displayName = "ServiceSelectionSkeleton";

export default ServiceSelectionSkeleton;

