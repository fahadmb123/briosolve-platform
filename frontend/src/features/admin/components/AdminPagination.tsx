import React, { useMemo } from 'react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminPaginationComponent: React.FC<AdminPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;
  
  const paginationItems = useMemo(() => {
    const cleanItems: (number | string)[] = [];
    let last = 0;
    
    for (let i = 1; i <= totalPages; i++) {
        let shouldInclude = false;
        if (i === 1 || i === totalPages) shouldInclude = true;
        else if (currentPage <= 2 && i <= 3) shouldInclude = true;
        else if (currentPage >= totalPages - 1 && i >= totalPages - 2) shouldInclude = true;
        else if (i >= currentPage - 1 && i <= currentPage + 1) shouldInclude = true;
        
        if (shouldInclude) {
            if (last && i - last > 1) {
                cleanItems.push('...');
            }
            cleanItems.push(i);
            last = i;
        }
    }
    return cleanItems;
  }, [currentPage, totalPages]);

  return (
    <div className="admin-pagination mt-6 flex justify-between items-center">
      <div className="text-sm text-secondary">
        Showing <strong>{currentPage}</strong> of <strong>{totalPages}</strong> pages
      </div>

      <div className="pagination-controls flex gap-1">
        <button
          className="page-btn flex items-center justify-center w-8 h-8 rounded border border-border bg-surface hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <i className="fas fa-chevron-left text-xs"></i>
        </button>

        {paginationItems.map((item, idx) => (
          item === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-secondary font-medium">...</span>
          ) : (
            <button
              key={item}
              className={`page-btn flex items-center justify-center w-8 h-8 rounded border text-sm transition-colors ${
                currentPage === item 
                  ? "bg-primary text-on-primary border-primary" 
                  : "border-border bg-surface hover:bg-surface-elevated text-text"
              }`}
              onClick={() => onPageChange(item as number)}
            >
              {item}
            </button>
          )
        ))}

        <button
          className="page-btn flex items-center justify-center w-8 h-8 rounded border border-border bg-surface hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <i className="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export const AdminPagination = React.memo(AdminPaginationComponent);
