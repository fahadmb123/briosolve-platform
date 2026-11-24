import './Dashboard.css';

export function AdminDashboardSkeleton() {
  return (
    <div className="app-content modern-admin-dashboard">
      <div className="mad-header-row">
        <div className="mad-header-left">
          <div className="sk-shimmer mb-2" style={{ width: '180px', height: '28px', borderRadius: '6px' }}></div>
          <div className="sk-shimmer" style={{ width: '380px', height: '14px', borderRadius: '4px' }}></div>
        </div>
        <div className="mad-header-actions">
          <div className="sk-shimmer" style={{ width: '120px', height: '34px', borderRadius: '8px' }}></div>
          <div className="sk-shimmer" style={{ width: '100px', height: '34px', borderRadius: '8px' }}></div>
        </div>
      </div>

      <div className="mad-top-grid">
        <div className="mad-card mad-summary-card">
          <div className="mad-card-title-block mb-3">
            <div className="sk-shimmer mb-2" style={{ width: '100px', height: '18px', borderRadius: '4px' }}></div>
            <div className="sk-shimmer" style={{ width: '140px', height: '12px', borderRadius: '4px' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div className="sk-shimmer mb-2" style={{ width: '130px', height: '32px', borderRadius: '6px' }}></div>
              <div className="sk-shimmer" style={{ width: '110px', height: '12px', borderRadius: '4px' }}></div>
            </div>
            <div>
              <div className="sk-shimmer mb-2" style={{ width: '70px', height: '26px', borderRadius: '6px' }}></div>
              <div className="sk-shimmer" style={{ width: '100px', height: '12px', borderRadius: '4px' }}></div>
            </div>
            <div className="sk-shimmer" style={{ width: '140px', height: '34px', borderRadius: '8px' }}></div>
          </div>
          <div className="mad-summary-divider"></div>
          <div className="mad-summary-quick-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="sk-shimmer" style={{ height: '42px', borderRadius: '10px' }}></div>
            ))}
          </div>
        </div>

        <div className="mad-card mad-chart-card">
          <div className="mad-chart-card-header">
            <div className="mad-card-title-block">
              <div className="sk-shimmer mb-2" style={{ width: '130px', height: '18px', borderRadius: '4px' }}></div>
              <div className="sk-shimmer" style={{ width: '160px', height: '12px', borderRadius: '4px' }}></div>
            </div>
            <div className="mad-tabs-legend-row">
              <div className="sk-shimmer" style={{ width: '220px', height: '22px', borderRadius: '6px' }}></div>
              <div className="sk-shimmer" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
            </div>
          </div>
          <div className="mad-svg-chart-container">
            <div className="sk-shimmer" style={{ width: '100%', height: '100%', borderRadius: '10px' }}></div>
          </div>
        </div>

        <div className="mad-card">
          <div className="mad-card-title-block mb-3">
            <div className="sk-shimmer mb-2" style={{ width: '140px', height: '18px', borderRadius: '4px' }}></div>
            <div className="sk-shimmer" style={{ width: '160px', height: '12px', borderRadius: '4px' }}></div>
          </div>
          <div className="mad-donut-wrap">
            <div className="sk-shimmer" style={{ width: '150px', height: '150px', borderRadius: '50%' }}></div>
            <div className="mad-donut-legend-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="mad-donut-legend-col">
                  <div className="sk-shimmer mb-1" style={{ width: '36px', height: '18px', borderRadius: '4px' }}></div>
                  <div className="sk-shimmer" style={{ width: '60px', height: '10px', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mad-kpi-quad-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="mad-card" style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="sk-shimmer" style={{ width: '90px', height: '14px', borderRadius: '4px' }}></div>
              <div className="sk-shimmer" style={{ width: '40px', height: '18px', borderRadius: '9999px' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div className="sk-shimmer" style={{ width: '60px', height: '30px', borderRadius: '6px' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <div className="sk-shimmer" style={{ width: '70px', height: '28px', borderRadius: '6px' }}></div>
                <div className="sk-shimmer" style={{ width: '90px', height: '10px', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mad-bottom-grid">
        <div className="mad-card">
          <div className="mad-card-title-block mb-3">
            <div className="sk-shimmer mb-2" style={{ width: '130px', height: '18px', borderRadius: '4px' }}></div>
            <div className="sk-shimmer" style={{ width: '180px', height: '12px', borderRadius: '4px' }}></div>
          </div>
          <div className="mad-timeline-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mad-timeline-item">
                <div className="sk-shimmer" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }}></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="sk-shimmer" style={{ width: '110px', height: '14px', borderRadius: '4px' }}></div>
                    <div className="sk-shimmer" style={{ width: '60px', height: '10px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: '180px', height: '12px', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mad-card">
          <div className="mad-card-title-block mb-3">
            <div className="sk-shimmer mb-2" style={{ width: '120px', height: '18px', borderRadius: '4px' }}></div>
            <div className="sk-shimmer" style={{ width: '160px', height: '12px', borderRadius: '4px' }}></div>
          </div>
          <div className="mad-table-toolbar">
            <div className="sk-shimmer" style={{ width: '140px', height: '30px', borderRadius: '6px' }}></div>
            <div className="sk-shimmer" style={{ width: '160px', height: '30px', borderRadius: '6px' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="sk-shimmer" style={{ width: '100%', height: '36px', borderRadius: '8px' }}></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="sk-shimmer" style={{ width: '100%', height: '42px', borderRadius: '6px' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboardSkeleton;
