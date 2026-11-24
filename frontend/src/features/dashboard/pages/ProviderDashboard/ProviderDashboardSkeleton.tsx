import "./Dashboard.css";

export function ProviderDashboardSkeleton() {
  return (
    <div className="app-content pro-dashboard-root">
      <header className="pro-dashboard-header">
        <div className="pro-header-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="sk-shimmer" style={{ width: "110px", height: "18px", borderRadius: "9999px" }}></div>
            <div className="sk-shimmer" style={{ width: "160px", height: "18px", borderRadius: "9999px" }}></div>
          </div>
          <div className="sk-shimmer mb-2" style={{ width: "260px", height: "28px", borderRadius: "6px" }}></div>
          <div className="sk-shimmer" style={{ width: "450px", height: "14px", borderRadius: "4px" }}></div>
        </div>
        <div className="pro-header-actions">
          <div className="sk-shimmer" style={{ width: "140px", height: "36px", borderRadius: "8px" }}></div>
          <div className="sk-shimmer" style={{ width: "120px", height: "36px", borderRadius: "8px" }}></div>
        </div>
      </header>

      <div className="pro-kpi-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="pro-kpi-card">
            <div className="sk-shimmer" style={{ width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="sk-shimmer mb-2" style={{ width: "50px", height: "24px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer mb-1" style={{ width: "100px", height: "12px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "70px", height: "10px", borderRadius: "4px" }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="pro-main-layout">
        <div className="pro-content-column">
          <div className="pro-card">
            <div className="pro-card-head">
              <div className="sk-shimmer" style={{ width: "180px", height: "20px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "80px", height: "18px", borderRadius: "4px" }}></div>
            </div>
            <div className="pro-booking-item">
              <div className="sk-shimmer" style={{ width: "58px", height: "60px", borderRadius: "8px", flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div className="sk-shimmer mb-2" style={{ width: "220px", height: "16px", borderRadius: "4px" }}></div>
                <div className="sk-shimmer mb-2" style={{ width: "140px", height: "12px", borderRadius: "4px" }}></div>
                <div className="sk-shimmer" style={{ width: "100px", height: "12px", borderRadius: "4px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "140px", height: "32px", borderRadius: "6px" }}></div>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-head">
              <div className="sk-shimmer" style={{ width: "200px", height: "20px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "160px", height: "28px", borderRadius: "6px" }}></div>
            </div>
            <div className="pro-item-list">
              {[1, 2].map((i) => (
                <div key={i} className="pro-lead-item">
                  <div className="pro-lead-main">
                    <div className="sk-shimmer mb-2" style={{ width: "180px", height: "16px", borderRadius: "4px" }}></div>
                    <div className="sk-shimmer mb-2" style={{ width: "260px", height: "18px", borderRadius: "4px" }}></div>
                    <div className="sk-shimmer mb-2" style={{ width: "90%", height: "12px", borderRadius: "4px" }}></div>
                    <div className="sk-shimmer" style={{ width: "200px", height: "12px", borderRadius: "4px" }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: "110px", height: "32px", borderRadius: "6px" }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="pro-sidebar-column">
          <div className="pro-card">
            <div className="sk-shimmer mb-3" style={{ width: "140px", height: "18px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer mb-3" style={{ width: "100%", height: "64px", borderRadius: "8px" }}></div>
            <div className="sk-shimmer" style={{ width: "120px", height: "24px", borderRadius: "4px" }}></div>
          </div>

          <div className="pro-card">
            <div className="sk-shimmer mb-3" style={{ width: "120px", height: "18px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer mb-2" style={{ width: "100%", height: "36px", borderRadius: "6px" }}></div>
            <div className="sk-shimmer" style={{ width: "100%", height: "36px", borderRadius: "6px" }}></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
