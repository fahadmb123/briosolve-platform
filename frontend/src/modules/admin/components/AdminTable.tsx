import React from 'react';
import { SpinnerOverlay } from '../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  render: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
  rowStyle?: (item: T) => React.CSSProperties;
}

export function AdminTable<T>({ 
  columns, 
  data, 
  isLoading, 
  emptyMessage = "No records found.", 
  keyExtractor,
  rowStyle 
}: AdminTableProps<T>) {
  return (
    <div className="admin-table-card relative">
      {isLoading && <SpinnerOverlay isLoading={true} />}
      <div className="table-responsive">
        <table className="admin-table w-full text-left border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }} className="p-4 border-b border-border text-sm font-semibold text-secondary">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!isLoading && data.length > 0 ? (
              data.map((item) => (
                <tr key={keyExtractor(item)} style={rowStyle ? rowStyle(item) : undefined} className="border-b border-border hover:bg-surface-elevated transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 align-middle text-sm">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : !isLoading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-secondary">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="font-medium">Loading results...</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
