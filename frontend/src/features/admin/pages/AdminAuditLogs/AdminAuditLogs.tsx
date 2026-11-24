import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuditLogs } from '../../../dashboard/hooks/useDashboard';
import type { AdminAuditLogItem } from '../../../dashboard/services/dashboard.service';
import './AdminAuditLogs.css';

const FILTER_TABS = [
  { id: 'ALL', label: 'All Events' },
  { id: 'BOOKING', label: 'Bookings' },
  { id: 'QUOTATION', label: 'Quotations' },
  { id: 'REQUEST', label: 'Requests' },
  { id: 'KYC', label: 'KYC & Audit' },
  { id: 'DISPUTE', label: 'Disputes' },
  { id: 'SYSTEM', label: 'System' },
] as const;

const SEVERITY_FILTERS = ['ALL', 'INFO', 'WARNING', 'CRITICAL'] as const;

export default function AdminAuditLogs() {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [inspectedEvent, setInspectedEvent] = useState<AdminAuditLogItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminAuditLogs({
    page,
    limit: 10,
    type: selectedType,
    search: searchQuery,
  });

  const rawLogs = data?.logs || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const logs = useMemo(() => {
    if (selectedSeverity === 'ALL') return rawLogs;
    return rawLogs.filter((l) => (l.severity || 'INFO').toUpperCase() === selectedSeverity);
  }, [rawLogs, selectedSeverity]);

  const formatTimeAgo = (isoDate: string): string => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const diffSec = Math.max(0, Math.floor(diffMs / 1000));
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} Mins Ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours} Hour${diffHours > 1 ? 's' : ''} Ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays} Day${diffDays > 1 ? 's' : ''} Ago`;
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} Month${diffMonths > 1 ? 's' : ''} Ago`;
    } catch {
      return 'Recently';
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'BOOKING': return 'booking';
      case 'QUOTATION': return 'quotation';
      case 'REQUEST': return 'request';
      case 'KYC': return 'kyc';
      case 'DISPUTE': return 'dispute';
      default: return 'system';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BOOKING': return 'fa-calendar-check';
      case 'QUOTATION': return 'fa-file-invoice-dollar';
      case 'REQUEST': return 'fa-clipboard-list';
      case 'KYC': return 'fa-shield-alt';
      case 'DISPUTE': return 'fa-gavel';
      default: return 'fa-server';
    }
  };

  const paginationRange = useMemo(() => {
    const range: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [page, totalPages]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportCsv = () => {
    if (logs.length === 0) {
      alert('No audit logs available to export.');
      return;
    }
    const headers = ['ID', 'Type', 'Title', 'Message', 'Actor', 'Severity', 'Timestamp'];
    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.type}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${l.actor || 'Platform'}"`,
      `"${l.severity || 'INFO'}"`,
      `"${l.createdAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-audit-logs-page">
      <div className="aal-header-row">
        <div className="aal-header-left">
          <h1 className="aal-page-title">Platform Audit Logs</h1>
          <p className="aal-page-subtitle">
            Immutable platform telemetry, compliance verification records, and real-time security events.
          </p>
        </div>

        <div className="aal-header-actions">
          <div className="aal-live-indicator">
            <span className="aal-pulse-dot"></span>
            <span>Live Stream Active</span>
          </div>

          <div className="aal-stat-badge">
            <i className="fas fa-database"></i>
            {isLoading ? (
              <div className="aal-sk-shimmer" style={{ width: '85px', height: '14px', borderRadius: '4px' }}></div>
            ) : (
              <span>{total} Total Events</span>
            )}
          </div>

          <button
            type="button"
            className="aal-btn-export"
            onClick={handleExportCsv}
            title="Export CSV audit records"
          >
            <i className="fas fa-file-csv"></i> Export CSV
          </button>

          <button onClick={() => refetch()} className="aal-btn-refresh" title="Refresh Live Audit Stream">
            <i className="fas fa-sync-alt"></i> Refresh Stream
          </button>
        </div>
      </div>

      <div className="aal-controls-card">
        <div className="aal-search-row">
          <div className="aal-search-box">
            <i className="fas fa-search" style={{ color: 'var(--text-secondary)' }}></i>
            <input
              type="text"
              className="aal-search-input"
              placeholder="Filter by action, entity ID, actor or detail..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="aal-search-clear"
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          <div className="aal-filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`aal-filter-pill ${selectedType === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedType(tab.id);
                  setPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="aal-severity-pills">
          <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-secondary)', marginRight: '0.4rem' }}>
            Severity:
          </span>
          {SEVERITY_FILTERS.map((sev) => (
            <button
              key={sev}
              type="button"
              className={`aal-severity-pill ${selectedSeverity === sev ? 'active' : ''}`}
              onClick={() => setSelectedSeverity(sev)}
            >
              {sev === 'ALL' ? 'All Severities' : sev}
            </button>
          ))}
        </div>
      </div>

      <div className="aal-table-card">
        <div className="aal-table-responsive">
          <table className="aal-audit-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>TYPE</th>
                <th>ACTION &amp; EVENT SUMMARY</th>
                <th>ACTOR</th>
                <th>SEVERITY</th>
                <th>FORENSICS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={`aal-sk-${idx}`} className="aal-skeleton-row">
                    <td>
                      <div className="aal-time-cell">
                        <div className="aal-sk-shimmer aal-sk-time-primary"></div>
                        <div className="aal-sk-shimmer aal-sk-time-sub"></div>
                      </div>
                    </td>
                    <td>
                      <div className="aal-sk-shimmer aal-sk-badge"></div>
                    </td>
                    <td>
                      <div className="aal-event-cell">
                        <div
                          className="aal-sk-shimmer aal-sk-title"
                          style={{ width: idx % 3 === 0 ? '55%' : idx % 3 === 1 ? '78%' : '65%' }}
                        ></div>
                        <div
                          className="aal-sk-shimmer aal-sk-desc"
                          style={{ width: idx % 2 === 0 ? '92%' : '82%' }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <div className="aal-sk-shimmer aal-sk-actor"></div>
                    </td>
                    <td>
                      <div className="aal-sk-shimmer aal-sk-severity"></div>
                    </td>
                    <td>
                      <div className="aal-sk-shimmer aal-sk-btn"></div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#e91e63' }}>
                    <i className="fas fa-exclamation-triangle mr-2"></i> Error retrieving audit trail. Check database connection.
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
                    No audit records match the selected filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const typeClass = getBadgeClass(log.type);
                  const icon = getTypeIcon(log.type);
                  const timeAgo = formatTimeAgo(log.createdAt);
                  const formattedDate = new Date(log.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setInspectedEvent(log)}
                      title="Click row to inspect record"
                    >
                      <td>
                        <div className="aal-time-cell">
                          <span className="aal-time-primary">{formattedDate}</span>
                          <span className="aal-time-relative">{timeAgo}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`aal-badge-type ${typeClass}`}>
                          <i className={`fas ${icon}`}></i>
                          <span>{log.type}</span>
                        </span>
                      </td>

                      <td>
                        <div className="aal-event-cell">
                          <h4 className="aal-event-title">{log.title}</h4>
                          <p className="aal-event-desc">{log.message}</p>
                        </div>
                      </td>

                      <td>
                        <div className="aal-actor-pill">
                          <i className="fas fa-user-shield" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}></i>
                          <span>{log.actor || 'Platform Engine'}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`aal-severity-badge ${(log.severity || 'INFO').toLowerCase()}`}>
                          {log.severity || 'INFO'}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="aal-btn-inspect"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedEvent(log);
                          }}
                        >
                          <i className="fas fa-search-plus"></i> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="aal-table-footer">
          {isLoading ? (
            <div className="aal-sk-shimmer" style={{ width: '160px', height: '14px', borderRadius: '4px' }}></div>
          ) : (
            <span>
              Showing {total > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, total)} of {total} events
            </span>
          )}

          {totalPages > 1 && (
            <div className="aal-pagination">
              <button
                type="button"
                className="aal-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>

              {paginationRange.map((pg) => (
                <button
                  key={pg}
                  type="button"
                  className={`aal-page-btn ${page === pg ? 'active' : ''}`}
                  onClick={() => setPage(pg)}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                className="aal-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {inspectedEvent && (
        <div className="aal-modal-overlay" onClick={() => setInspectedEvent(null)}>
          <div className="aal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="aal-modal-header">
              <h3 className="aal-modal-title">Audit Record Inspection</h3>
              <button
                type="button"
                className="aal-btn-close"
                onClick={() => setInspectedEvent(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="aal-modal-body">
              <div className="aal-modal-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="aal-modal-lbl">Audit Event ID</span>
                  <button
                    type="button"
                    className="aal-copy-btn"
                    onClick={() => handleCopy(inspectedEvent.id, 'id')}
                  >
                    <i className={copiedField === 'id' ? 'fas fa-check' : 'fas fa-copy'}></i>
                    <span>{copiedField === 'id' ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>
                <span className="aal-modal-val" style={{ fontFamily: 'monospace' }}>{inspectedEvent.id}</span>
              </div>

              <div className="aal-modal-row">
                <span className="aal-modal-lbl">Event Action &amp; Type</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className={`aal-badge-type ${getBadgeClass(inspectedEvent.type)}`}>
                    {inspectedEvent.type}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--text)' }}>{inspectedEvent.title}</span>
                </div>
              </div>

              <div className="aal-modal-row">
                <span className="aal-modal-lbl">Event Summary</span>
                <span className="aal-modal-val">{inspectedEvent.message}</span>
              </div>

              <div className="aal-modal-row">
                <span className="aal-modal-lbl">Actor / Principal</span>
                <span className="aal-modal-val">{inspectedEvent.actor || 'Platform Daemon'}</span>
              </div>

              <div className="aal-modal-row">
                <span className="aal-modal-lbl">ISO Timestamp</span>
                <span className="aal-modal-val" style={{ fontSize: '0.875rem' }}>{inspectedEvent.createdAt}</span>
              </div>

              {inspectedEvent.metadata && (
                <div className="aal-modal-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="aal-modal-lbl">Forensic Metadata Payload</span>
                    <button
                      type="button"
                      className="aal-copy-btn"
                      onClick={() => handleCopy(JSON.stringify(inspectedEvent.metadata, null, 2), 'payload')}
                    >
                      <i className={copiedField === 'payload' ? 'fas fa-check' : 'fas fa-copy'}></i>
                      <span>{copiedField === 'payload' ? 'Copied JSON!' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="aal-json-pre">
                    {JSON.stringify(inspectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                {inspectedEvent.type === 'BOOKING' && (
                  <Link to="/admin/bookings" className="aal-btn-inspect" style={{ textDecoration: 'none' }}>
                    <i className="fas fa-calendar-check mr-1"></i> Open Bookings
                  </Link>
                )}
                {inspectedEvent.type === 'KYC' && (
                  <Link to="/admin/verification" className="aal-btn-inspect" style={{ textDecoration: 'none' }}>
                    <i className="fas fa-shield-alt mr-1"></i> Verification Desk
                  </Link>
                )}
                {inspectedEvent.type === 'DISPUTE' && (
                  <Link to="/admin/support" className="aal-btn-inspect" style={{ textDecoration: 'none' }}>
                    <i className="fas fa-gavel mr-1"></i> Disputes Console
                  </Link>
                )}
                <button
                  type="button"
                  className="aal-btn-refresh"
                  onClick={() => setInspectedEvent(null)}
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
