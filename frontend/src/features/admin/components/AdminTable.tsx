import React from 'react';
import Skeleton from 'react-loading-skeleton';

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
  loadingMessage?: string;
  keyExtractor: (item: T) => string;
  rowStyle?: (item: T) => React.CSSProperties;
  skeletonRowCount?: number;
}

function AdminTableComponent<T>({ 
  columns, 
  data, 
  isLoading, 
  emptyMessage = "No records found.", 
  keyExtractor,
  rowStyle,
  skeletonRowCount = 5
}: AdminTableProps<T>) {
  return (
    <div className="admin-table-card relative">
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
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`} className="border-b border-border">
                  {columns.map((col, colIndex) => (
                    <td key={`skeleton-cell-${rowIndex}-${col.key || colIndex}`} className="p-4 align-middle">
                      <Skeleton
                        height={18}
                        width={colIndex === 0 ? '75%' : colIndex === columns.length - 1 ? '45%' : '85%'}
                        borderRadius={6}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const AdminTable = React.memo(AdminTableComponent) as typeof AdminTableComponent;
