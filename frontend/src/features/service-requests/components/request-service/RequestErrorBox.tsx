import type { FC } from "react";

interface RequestErrorBoxProps {
  errors: string[];
  title?: string;
  onDismiss?: () => void;
}

export const RequestErrorBox: FC<RequestErrorBoxProps> = ({
  errors,
  title = "Please resolve the following before proceeding",
  onDismiss,
}) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="request-error-box" role="alert">
      <div className="request-error-box-icon">
        <i className="fas fa-exclamation-circle"></i>
      </div>
      <div className="request-error-box-content">
        <div className="request-error-box-header">
          <span className="request-error-box-title">{title}</span>
          {onDismiss && (
            <button
              type="button"
              className="request-error-box-close"
              onClick={onDismiss}
              aria-label="Dismiss errors"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        {errors.length === 1 ? (
          <div className="request-error-box-single">{errors[0]}</div>
        ) : (
          <ul className="request-error-box-list">
            {errors.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

