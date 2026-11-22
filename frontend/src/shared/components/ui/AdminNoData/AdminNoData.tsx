import React from 'react';

interface AdminNoDataProps {
  title?: string;
  description?: string;
  className?: string;
}

export const AdminNoData: React.FC<AdminNoDataProps> = ({
  title = "No Data Found",
  description = "No data found matching this.",
  className = ""
}) => {
  return (
    <div className={`admin-table-empty-container ${className}`.trim()}>
      <img
        src="/images/admin-no-data.png"
        alt="No data found"
        className="admin-empty-image"
        onError={(e) => {
          e.currentTarget.src = "https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png";
        }}
      />
      <div className="admin-empty-title">{title}</div>
      <div className="admin-empty-desc">{description}</div>
    </div>
  );
};

