import './Dashboard.css';

export function AdminDashboardSkeleton() {
  return (
    <div className="app-content admin-dash-root">
      <header className="admin-dash-header">
        <div className="admin-dash-title-wrap">
          <div className="admin-dash-badge-row mb-2">
            <div className="sk-shimmer" style={{ width: '130px', height: '20px', borderRadius: '9999px' }}></div>
            <div className="sk-shimmer" style={{ width: '140px', height: '20px', borderRadius: '9999px' }}></div>
          </div>
          <div className="sk-shimmer mb-2" style={{ width: '260px', height: '30px', borderRadius: '6px' }}></div>
          <div className="sk-shimmer" style={{ width: '450px', height: '14px', borderRadius: '4px' }}></div>
        </div>
        <div className="admin-dash-actions">
          <div className="sk-shimmer" style={{ width: '180px', height: '38px', borderRadius: '8px' }}></div>
          <div className="sk-shimmer" style={{ width: '180px', height: '38px', borderRadius: '8px' }}></div>
        </div>
      </header>

      <div className="admin-metrics-section">
        <div className="sk-shimmer" style={{ width: '160px', height: '14px', borderRadius: '4px' }}></div>
        <div className="admin-kpi-grid-modern">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="admin-stat-card">
              <div className="admin-stat-card-top">
                <div className="sk-shimmer" style={{ width: '42px', height: '42px', borderRadius: '10px' }}></div>
                <div className="sk-shimmer" style={{ width: '60px', height: '18px', borderRadius: '9999px' }}></div>
              </div>
              <div className="admin-stat-body">
                <div className="sk-shimmer mb-2" style={{ width: '80px', height: '28px', borderRadius: '4px' }}></div>
                <div className="sk-shimmer mb-1" style={{ width: '120px', height: '14px', borderRadius: '4px' }}></div>
                <div className="sk-shimmer" style={{ width: '150px', height: '12px', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-main-grid">
        <div className="admin-feed-column">
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="sk-shimmer" style={{ width: '190px', height: '18px', borderRadius: '4px' }}></div>
              <div className="sk-shimmer" style={{ width: '70px', height: '18px', borderRadius: '9999px' }}></div>
            </div>
            <div className="admin-queue-list">
              {[1, 2].map((i) => (
                <div key={i} className="admin-queue-item">
                  <div className="admin-queue-item-left">
                    <div className="sk-shimmer" style={{ width: '38px', height: '38px', borderRadius: '50%' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div className="sk-shimmer" style={{ width: '160px', height: '16px', borderRadius: '4px' }}></div>
                      <div className="sk-shimmer" style={{ width: '220px', height: '12px', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div className="sk-shimmer" style={{ width: '80px', height: '32px', borderRadius: '6px' }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="sk-shimmer" style={{ width: '200px', height: '18px', borderRadius: '4px' }}></div>
              <div className="sk-shimmer" style={{ width: '90px', height: '14px', borderRadius: '4px' }}></div>
            </div>
            <div className="admin-activity-stream">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="admin-activity-row">
                  <div className="sk-shimmer" style={{ width: '34px', height: '34px', borderRadius: '8px' }}></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="sk-shimmer" style={{ width: '140px', height: '14px', borderRadius: '4px' }}></div>
                      <div className="sk-shimmer" style={{ width: '60px', height: '12px', borderRadius: '4px' }}></div>
                    </div>
                    <div className="sk-shimmer" style={{ width: '280px', height: '12px', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-side-column">
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="sk-shimmer" style={{ width: '170px', height: '18px', borderRadius: '4px' }}></div>
            </div>
            <div className="admin-infra-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="admin-infra-cell">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="sk-shimmer" style={{ width: '90px', height: '10px', borderRadius: '4px' }}></div>
                    <div className="sk-shimmer" style={{ width: '130px', height: '14px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: '70px', height: '20px', borderRadius: '9999px' }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="sk-shimmer" style={{ width: '150px', height: '18px', borderRadius: '4px' }}></div>
            </div>
            <div className="admin-shortcuts-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="admin-shortcut-tile">
                  <div className="sk-shimmer" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
                  <div className="sk-shimmer" style={{ width: '70px', height: '12px', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboardSkeleton;
