import "./Dashboard.css";

export function CustomerDashboardSkeleton() {
  return (
    <div className="app-content cust-dashboard-root">
      <header className="cust-dashboard-header">
        <div className="cust-header-left">
          <div className="sk-shimmer mb-2" style={{ width: "110px", height: "18px", borderRadius: "9999px" }}></div>
          <div className="sk-shimmer mb-2" style={{ width: "240px", height: "28px", borderRadius: "6px" }}></div>
          <div className="sk-shimmer" style={{ width: "420px", height: "14px", borderRadius: "4px" }}></div>
        </div>
        <div className="cust-header-actions">
          <div className="sk-shimmer" style={{ width: "130px", height: "36px", borderRadius: "8px" }}></div>
          <div className="sk-shimmer" style={{ width: "130px", height: "36px", borderRadius: "8px" }}></div>
        </div>
      </header>

      <div className="cust-kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="cust-kpi-card">
            <div className="sk-shimmer" style={{ width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="sk-shimmer mb-2" style={{ width: "50px", height: "24px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer mb-1" style={{ width: "110px", height: "12px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "80px", height: "10px", borderRadius: "4px" }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="cust-services-section">
        <div className="sk-shimmer mb-3" style={{ width: "180px", height: "20px", borderRadius: "4px" }}></div>
        <div className="cust-services-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="cust-service-tile">
              <div className="sk-shimmer mb-2" style={{ width: "40px", height: "40px", borderRadius: "9999px" }}></div>
              <div className="sk-shimmer mb-1" style={{ width: "70px", height: "14px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "50px", height: "10px", borderRadius: "4px" }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="cust-main-layout">
        <div className="cust-content-column">
          <div className="cust-card">
            <div className="cust-card-head">
              <div className="sk-shimmer" style={{ width: "180px", height: "20px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "150px", height: "28px", borderRadius: "6px" }}></div>
            </div>
            <div className="cust-req-list">
              {[1, 2].map((i) => (
                <div key={i} className="cust-req-item">
                  <div className="cust-req-info">
                    <div className="sk-shimmer" style={{ width: "40px", height: "40px", borderRadius: "8px", flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="sk-shimmer mb-2" style={{ width: "220px", height: "16px", borderRadius: "4px" }}></div>
                      <div className="sk-shimmer" style={{ width: "160px", height: "12px", borderRadius: "4px" }}></div>
                    </div>
                  </div>
                  <div className="sk-shimmer" style={{ width: "120px", height: "32px", borderRadius: "6px" }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="cust-card">
            <div className="cust-card-head">
              <div className="sk-shimmer" style={{ width: "160px", height: "20px", borderRadius: "4px" }}></div>
              <div className="sk-shimmer" style={{ width: "80px", height: "18px", borderRadius: "4px" }}></div>
            </div>
            <div className="cust-booking-item">
              <div className="sk-shimmer" style={{ width: "58px", height: "60px", borderRadius: "8px", flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div className="sk-shimmer mb-2" style={{ width: "180px", height: "16px", borderRadius: "4px" }}></div>
                <div className="sk-shimmer" style={{ width: "120px", height: "12px", borderRadius: "4px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "140px", height: "32px", borderRadius: "6px" }}></div>
            </div>
          </div>
        </div>

        <aside className="cust-sidebar-column">
          <div className="cust-card">
            <div className="sk-shimmer mb-3" style={{ width: "140px", height: "18px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer mb-2" style={{ width: "100%", height: "14px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer mb-2" style={{ width: "100%", height: "14px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer" style={{ width: "70%", height: "14px", borderRadius: "4px" }}></div>
          </div>

          <div className="cust-card">
            <div className="sk-shimmer mb-3" style={{ width: "120px", height: "18px", borderRadius: "4px" }}></div>
            <div className="sk-shimmer mb-2" style={{ width: "100%", height: "36px", borderRadius: "6px" }}></div>
            <div className="sk-shimmer" style={{ width: "100%", height: "36px", borderRadius: "6px" }}></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
