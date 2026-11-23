import "./Dashboard.css";

export function CustomerDashboardSkeleton() {
  return (
    <div className="app-content customer-dashboard-container">
      <div className="dashboard-hero-card">
        <div className="hero-content-row">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="sk-shimmer" style={{ width: "110px", height: "20px", borderRadius: "9999px" }}></div>
              <div className="sk-shimmer" style={{ width: "120px", height: "20px", borderRadius: "9999px" }}></div>
            </div>
            <div className="sk-shimmer mb-2" style={{ width: "300px", height: "30px", borderRadius: "6px" }}></div>
            <div className="sk-shimmer" style={{ width: "480px", height: "16px", borderRadius: "4px" }}></div>
          </div>
          <div className="hero-actions-group">
            <div className="sk-shimmer" style={{ width: "130px", height: "38px", borderRadius: "8px" }}></div>
            <div className="sk-shimmer" style={{ width: "140px", height: "38px", borderRadius: "8px" }}></div>
          </div>
        </div>
      </div>

      <div className="category-compact-ribbon">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="sk-shimmer"
            style={{ width: "110px", height: "32px", borderRadius: "9999px", flexShrink: 0 }}
          ></div>
        ))}
      </div>

      <div className="compact-stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="compact-stat-card">
            <div className="sk-shimmer" style={{ width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="sk-shimmer mb-2" style={{ width: "60px", height: "26px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer mb-1" style={{ width: "110px", height: "13px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "80px", height: "11px", borderRadius: "4px" }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <div className="flex flex-col gap-5">
          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <div>
                <div className="sk-shimmer mb-1" style={{ width: "200px", height: "20px", borderRadius: "4px" }}></div>
                <div className="sk-shimmer" style={{ width: "320px", height: "13px", borderRadius: "4px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "180px", height: "30px", borderRadius: "8px" }}></div>
            </div>

            <div className="modern-request-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="modern-request-item">
                  <div className="modern-request-main">
                    <div className="sk-shimmer" style={{ width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="sk-shimmer mb-2" style={{ width: "240px", height: "16px", borderRadius: "4px" }}></div>
                      <div className="sk-shimmer" style={{ width: "180px", height: "12px", borderRadius: "4px" }}></div>
                    </div>
                  </div>
                  <div className="sk-shimmer" style={{ width: "130px", height: "32px", borderRadius: "8px" }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <div>
                <div className="sk-shimmer mb-1" style={{ width: "180px", height: "20px", borderRadius: "4px" }}></div>
                <div className="sk-shimmer" style={{ width: "280px", height: "13px", borderRadius: "4px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "90px", height: "20px", borderRadius: "4px" }}></div>
            </div>

            <div className="modern-booking-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="sk-shimmer" style={{ width: "62px", height: "64px", borderRadius: "8px", flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div className="sk-shimmer mb-2" style={{ width: "200px", height: "16px", borderRadius: "4px" }}></div>
                  <div className="sk-shimmer mb-2" style={{ width: "120px", height: "12px", borderRadius: "4px" }}></div>
                  <div className="sk-shimmer" style={{ width: "150px", height: "24px", borderRadius: "9999px" }}></div>
                </div>
              </div>
              <div className="sk-shimmer" style={{ width: "160px", height: "34px", borderRadius: "8px" }}></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <div className="sk-shimmer" style={{ width: "160px", height: "18px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "80px", height: "18px", borderRadius: "9999px" }}></div>
            </div>
            <div className="sk-shimmer mb-4" style={{ width: "100%", height: "110px", borderRadius: "8px" }}></div>
            <div className="sk-shimmer mb-2" style={{ width: "100%", height: "12px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer" style={{ width: "80%", height: "12px", borderRadius: "4px" }}></div>
          </div>

          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <div className="sk-shimmer" style={{ width: "140px", height: "18px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "40px", height: "14px", borderRadius: "4px" }}></div>
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="sk-shimmer" style={{ width: "32px", height: "32px", borderRadius: "9999px", flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="sk-shimmer mb-1" style={{ width: "140px", height: "12px", borderRadius: "4px" }}></div>
                    <div className="sk-shimmer" style={{ width: "90px", height: "10px", borderRadius: "4px" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="guarantee-card">
            <div className="sk-shimmer mb-2" style={{ width: "180px", height: "16px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer mb-3" style={{ width: "100%", height: "28px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer" style={{ width: "120px", height: "28px", borderRadius: "6px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
