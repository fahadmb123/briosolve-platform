import "./Dashboard.css";

export function CustomerDashboardSkeleton() {
  return (
    <div className="app-content">
      <div className="welcome-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <div className="sk-shimmer mb-2" style={{ width: "240px", height: "32px" }}></div>
          <div className="sk-shimmer" style={{ width: "360px", height: "16px" }}></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="sk-shimmer" style={{ width: "120px", height: "36px", borderRadius: "9999px" }}></div>
          <div className="sk-shimmer" style={{ width: "140px", height: "36px", borderRadius: "6px" }}></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="sk-shimmer mb-2" style={{ width: "160px", height: "12px" }}></div>
        <div className="category-quick-bar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="sk-shimmer"
              style={{ width: "110px", height: "34px", borderRadius: "9999px", flexShrink: 0 }}
            ></div>
          ))}
        </div>
      </div>

      <div className="dashboard-stats-grid mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card stat-widget">
            <div className="sk-shimmer" style={{ width: "52px", height: "52px", borderRadius: "8px", flexShrink: 0 }}></div>
            <div className="stat-body w-full">
              <div className="sk-shimmer mb-2" style={{ width: "45px", height: "28px" }}></div>
              <div className="sk-shimmer mb-1" style={{ width: "110px", height: "14px" }}></div>
              <div className="sk-shimmer" style={{ width: "80px", height: "12px" }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="sk-shimmer" style={{ width: "220px", height: "20px" }}></div>
          <div className="sk-shimmer" style={{ width: "140px", height: "24px", borderRadius: "9999px" }}></div>
        </div>
        <div className="analytics-card-grid">
          <div className="p-4 bg-surface-elevated rounded border">
            <div className="sk-shimmer mb-4" style={{ width: "160px", height: "14px" }}></div>
            <div className="monthly-bars-chart">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="chart-col">
                  <div
                    className="sk-shimmer chart-bar-fill"
                    style={{ height: `${25 + (i * 12) % 65}%` }}
                  ></div>
                  <div className="sk-shimmer mt-2" style={{ width: "24px", height: "10px" }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-surface-elevated rounded border flex flex-col justify-between">
            <div className="sk-shimmer mb-3" style={{ width: "130px", height: "14px" }}></div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="sk-shimmer" style={{ width: "90px", height: "12px" }}></div>
                    <div className="sk-shimmer" style={{ width: "60px", height: "12px" }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: "100%", height: "6px", borderRadius: "9999px" }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="grid-left flex flex-col gap-6">
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <div>
                <div className="sk-shimmer mb-1" style={{ width: "180px", height: "18px" }}></div>
                <div className="sk-shimmer" style={{ width: "240px", height: "12px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "180px", height: "30px", borderRadius: "6px" }}></div>
            </div>
            <div className="p-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-bottom"
                >
                  <div className="flex flex-col gap-2">
                    <div className="sk-shimmer" style={{ width: "200px", height: "16px" }}></div>
                    <div className="sk-shimmer" style={{ width: "120px", height: "12px" }}></div>
                  </div>
                  <div className="sk-shimmer" style={{ width: "80px", height: "24px", borderRadius: "9999px" }}></div>
                  <div className="sk-shimmer" style={{ width: "70px", height: "14px" }}></div>
                  <div className="sk-shimmer" style={{ width: "90px", height: "28px", borderRadius: "4px" }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <div>
                <div className="sk-shimmer mb-1" style={{ width: "160px", height: "18px" }}></div>
                <div className="sk-shimmer" style={{ width: "220px", height: "12px" }}></div>
              </div>
              <div className="sk-shimmer" style={{ width: "80px", height: "14px" }}></div>
            </div>
            <div className="card-body flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-surface-elevated rounded border flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="sk-shimmer" style={{ width: "48px", height: "48px", borderRadius: "6px" }}></div>
                    <div className="flex flex-col gap-2">
                      <div className="sk-shimmer" style={{ width: "180px", height: "16px" }}></div>
                      <div className="sk-shimmer" style={{ width: "130px", height: "12px" }}></div>
                      <div className="flex items-center gap-2">
                        <div className="sk-shimmer" style={{ width: "24px", height: "24px", borderRadius: "9999px" }}></div>
                        <div className="sk-shimmer" style={{ width: "90px", height: "12px" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="sk-shimmer" style={{ width: "70px", height: "24px" }}></div>
                    <div className="sk-shimmer" style={{ width: "65px", height: "30px", borderRadius: "4px" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid-right flex flex-col gap-6">
          <div className="card">
            <div className="card-header">
              <div className="sk-shimmer" style={{ width: "140px", height: "18px" }}></div>
            </div>
            <div className="card-body flex flex-col gap-4 p-4">
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
              <div className="sk-shimmer" style={{ width: "32px", height: "32px", borderRadius: "9999px", flexShrink: 0 }}></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="sk-shimmer" style={{ width: "60%", height: "16px" }}></div>
                <div className="sk-shimmer" style={{ width: "100%", height: "36px" }}></div>
                <div className="sk-shimmer" style={{ width: "110px", height: "26px", borderRadius: "4px" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
