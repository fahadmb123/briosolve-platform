import "./Dashboard.css";

export function CustomerDashboardSkeleton() {
  return (
    <div className="app-content">
      <div className="customer-hero-banner mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="sk-shimmer" style={{ width: "100px", height: "20px", borderRadius: "9999px" }}></div>
              <div className="sk-shimmer" style={{ width: "130px", height: "16px" }}></div>
            </div>
            <div className="sk-shimmer mb-2" style={{ width: "280px", height: "32px" }}></div>
            <div className="sk-shimmer" style={{ width: "450px", height: "16px" }}></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="sk-shimmer" style={{ width: "130px", height: "38px", borderRadius: "6px" }}></div>
            <div className="sk-shimmer" style={{ width: "140px", height: "38px", borderRadius: "6px" }}></div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="sk-shimmer mb-3" style={{ width: "200px", height: "14px" }}></div>
        <div className="modern-category-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="modern-category-card">
              <div className="sk-shimmer mb-2" style={{ width: "44px", height: "44px", borderRadius: "9999px" }}></div>
              <div className="sk-shimmer mb-1" style={{ width: "70px", height: "14px" }}></div>
              <div className="sk-shimmer" style={{ width: "50px", height: "10px" }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-stats-grid mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-widget">
            <div className="sk-shimmer" style={{ width: "52px", height: "52px", borderRadius: "12px", flexShrink: 0 }}></div>
            <div className="stat-body w-full">
              <div className="sk-shimmer mb-2" style={{ width: "50px", height: "28px" }}></div>
              <div className="sk-shimmer mb-1" style={{ width: "120px", height: "14px" }}></div>
              <div className="sk-shimmer" style={{ width: "90px", height: "12px" }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="modern-analytics-card mb-8">
        <div className="analytics-header">
          <div>
            <div className="sk-shimmer mb-1" style={{ width: "260px", height: "22px" }}></div>
            <div className="sk-shimmer" style={{ width: "380px", height: "14px" }}></div>
          </div>
          <div className="sk-shimmer" style={{ width: "180px", height: "48px", borderRadius: "12px" }}></div>
        </div>

        <div className="analytics-body-grid">
          <div className="chart-panel">
            <div className="sk-shimmer mb-4" style={{ width: "180px", height: "14px" }}></div>
            <div className="monthly-bars-chart">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="chart-col">
                  <div
                    className="sk-shimmer chart-bar-fill"
                    style={{ height: `${20 + (i * 15) % 65}%` }}
                  ></div>
                  <div className="sk-shimmer mt-2" style={{ width: "24px", height: "10px" }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-panel flex flex-col justify-between">
            <div className="sk-shimmer mb-3" style={{ width: "140px", height: "14px" }}></div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="sk-shimmer" style={{ width: "90px", height: "12px" }}></div>
                    <div className="sk-shimmer" style={{ width: "60px", height: "12px" }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: "100%", height: "8px", borderRadius: "9999px" }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="grid-left flex flex-col gap-6">
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="sk-shimmer mb-1" style={{ width: "180px", height: "18px" }}></div>
                <div className="sk-shimmer" style={{ width: "240px", height: "12px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "200px", height: "32px", borderRadius: "8px" }}></div>
            </div>
            <div className="modern-request-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="modern-request-item">
                  <div className="modern-request-main">
                    <div className="sk-shimmer" style={{ width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0 }}></div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="sk-shimmer" style={{ width: "60%", height: "16px" }}></div>
                      <div className="sk-shimmer" style={{ width: "40%", height: "12px" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="sk-shimmer" style={{ width: "90px", height: "26px", borderRadius: "9999px" }}></div>
                    <div className="sk-shimmer" style={{ width: "120px", height: "34px", borderRadius: "6px" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="sk-shimmer mb-1" style={{ width: "160px", height: "18px" }}></div>
                <div className="sk-shimmer" style={{ width: "220px", height: "12px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "90px", height: "16px" }}></div>
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="modern-booking-item">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="sk-shimmer" style={{ width: "62px", height: "62px", borderRadius: "8px", flexShrink: 0 }}></div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="sk-shimmer" style={{ width: "50%", height: "16px" }}></div>
                      <div className="sk-shimmer" style={{ width: "35%", height: "12px" }}></div>
                      <div className="flex items-center gap-2">
                        <div className="sk-shimmer" style={{ width: "32px", height: "32px", borderRadius: "9999px" }}></div>
                        <div className="sk-shimmer" style={{ width: "100px", height: "12px" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="sk-shimmer" style={{ width: "80px", height: "28px" }}></div>
                    <div className="sk-shimmer" style={{ width: "70px", height: "32px", borderRadius: "6px" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid-right flex flex-col gap-6">
          <div className="card p-5">
            <div className="sk-shimmer mb-4" style={{ width: "140px", height: "18px" }}></div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="sk-shimmer" style={{ width: "36px", height: "36px", borderRadius: "9999px", flexShrink: 0 }}></div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="sk-shimmer" style={{ width: "70%", height: "14px" }}></div>
                    <div className="sk-shimmer" style={{ width: "90%", height: "12px" }}></div>
                    <div className="sk-shimmer" style={{ width: "40%", height: "10px" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 border-primary">
            <div className="flex items-start gap-3">
              <div className="sk-shimmer" style={{ width: "36px", height: "36px", borderRadius: "9999px", flexShrink: 0 }}></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="sk-shimmer" style={{ width: "65%", height: "16px" }}></div>
                <div className="sk-shimmer" style={{ width: "100%", height: "36px" }}></div>
                <div className="sk-shimmer" style={{ width: "120px", height: "28px", borderRadius: "6px" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
