import React from 'react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;
  
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

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`page-btn flex items-center justify-center w-8 h-8 rounded border text-sm transition-colors ${
              currentPage === pageNumber 
                ? "bg-primary text-on-primary border-primary" 
                : "border-border bg-surface hover:bg-surface-elevated text-text"
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
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
