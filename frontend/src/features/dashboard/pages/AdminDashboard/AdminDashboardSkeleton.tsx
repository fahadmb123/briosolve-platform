import './Dashboard.css';

export function AdminDashboardSkeleton() {
  return (
    <div className="app-content admin-dash-root">
      <header className="admin-header-hero">
        <div className="admin-hero-left">
          <div className="admin-hero-tags mb-2">
            <div className="sk-shimmer" style={{ width: '130px', height: '22px', borderRadius: '9999px' }}></div>
            <div className="sk-shimmer" style={{ width: '150px', height: '22px', borderRadius: '9999px' }}></div>
          </div>
          <div className="sk-shimmer mb-2" style={{ width: '280px', height: '34px', borderRadius: '8px' }}></div>
          <div className="sk-shimmer" style={{ width: '520px', height: '16px', borderRadius: '4px' }}></div>
        </div>
        <div className="admin-hero-actions">
          <div className="sk-shimmer" style={{ width: '140px', height: '38px', borderRadius: '8px' }}></div>
          <div className="sk-shimmer" style={{ width: '140px', height: '38px', borderRadius: '8px' }}></div>
        </div>
      </header>

      <section className="admin-hero-kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="admin-kpi-tile">
            <div className="admin-kpi-tile-top">
              <div className="sk-shimmer" style={{ width: '44px', height: '44px', borderRadius: '12px' }}></div>
              <div className="sk-shimmer" style={{ width: '80px', height: '22px', borderRadius: '9999px' }}></div>
            </div>
            <div className="admin-kpi-main">
              <div className="sk-shimmer mb-2" style={{ width: '100px', height: '34px', borderRadius: '6px' }}></div>
              <div className="sk-shimmer mb-1" style={{ width: '130px', height: '16px', borderRadius: '4px' }}></div>
              <div className="sk-shimmer" style={{ width: '180px', height: '12px', borderRadius: '4px' }}></div>
            </div>
            <div className="admin-kpi-footer">
              <div className="sk-shimmer" style={{ width: '90px', height: '14px', borderRadius: '4px' }}></div>
              <div className="sk-shimmer" style={{ width: '16px', height: '14px', borderRadius: '4px' }}></div>
            </div>
          </div>
        ))}
      </section>

      <div className="admin-dashboard-split">
        <div className="admin-main-stack">
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="sk-shimmer" style={{ width: '220px', height: '20px', borderRadius: '6px' }}></div>
              <div className="sk-shimmer" style={{ width: '110px', height: '22px', borderRadius: '9999px' }}></div>
            </div>
            <div className="admin-urgency-list">
              {[1, 2].map((i) => (
                <div key={i} className="admin-urgency-card">
                  <div className="admin-urgency-left">
                    <div className="sk-shimmer" style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="sk-shimmer" style={{ width: '220px', height: '16px', borderRadius: '4px' }}></div>
                      <div className="sk-shimmer" style={{ width: '320px', height: '12px', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div className="sk-shimmer" style={{ width: '110px', height: '34px', borderRadius: '8px' }}></div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="sk-shimmer" style={{ width: '240px', height: '20px', borderRadius: '6px' }}></div>
            </div>
            <div className="admin-ratios-container">
              {[1, 2].map((i) => (
                <div key={i} className="admin-ratio-card">
                  <div className="admin-ratio-header">
                    <div className="sk-shimmer" style={{ width: '140px', height: '14px', borderRadius: '4px' }}></div>
                    <div className="sk-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: '100%', height: '8px', borderRadius: '9999px' }}></div>
                  <div className="admin-ratio-legend">
                    <div className="sk-shimmer" style={{ width: '100px', height: '12px', borderRadius: '4px' }}></div>
                    <div className="sk-shimmer" style={{ width: '100px', height: '12px', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="sk-shimmer" style={{ width: '200px', height: '20px', borderRadius: '6px' }}></div>
              <div className="sk-shimmer" style={{ width: '180px', height: '30px', borderRadius: '8px' }}></div>
            </div>
            <div className="admin-stream-list">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="admin-stream-row">
                  <div className="sk-shimmer" style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="sk-shimmer" style={{ width: '160px', height: '14px', borderRadius: '4px' }}></div>
                      <div className="sk-shimmer" style={{ width: '60px', height: '12px', borderRadius: '4px' }}></div>
                    </div>
                    <div className="sk-shimmer" style={{ width: '300px', height: '12px', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="admin-side-stack">
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="sk-shimmer" style={{ width: '170px', height: '20px', borderRadius: '6px' }}></div>
            </div>
            <div className="admin-infra-stack">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="admin-infra-row">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="sk-shimmer" style={{ width: '80px', height: '10px', borderRadius: '4px' }}></div>
                    <div className="sk-shimmer" style={{ width: '130px', height: '14px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: '70px', height: '22px', borderRadius: '9999px' }}></div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="sk-shimmer" style={{ width: '160px', height: '20px', borderRadius: '6px' }}></div>
            </div>
            <div className="admin-nav-tiles-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="admin-nav-tile">
                  <div className="sk-shimmer" style={{ width: '38px', height: '38px', borderRadius: '10px' }}></div>
                  <div className="sk-shimmer" style={{ width: '90px', height: '14px', borderRadius: '4px' }}></div>
                  <div className="sk-shimmer" style={{ width: '120px', height: '10px', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          </section>

          <div className="admin-security-cert-card">
            <div className="sk-shimmer" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div className="sk-shimmer" style={{ width: '140px', height: '14px', borderRadius: '4px' }}></div>
              <div className="sk-shimmer" style={{ width: '220px', height: '10px', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboardSkeleton;
