import { Component, type ErrorInfo, type ReactNode } from "react";
import "./ErrorBoundary.css";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; resetError: () => void }) => ReactNode);
  onError?: (error: Error, info: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an unhandled application error:", error, info);
    this.setState({ errorInfo: info });
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
  };

  handleToggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  handleCopyReport = async () => {
    const { error, errorInfo } = this.state;
    const report = [
      `--- Application Error Report ---`,
      `Timestamp: ${new Date().toISOString()}`,
      `URL: ${window.location.href}`,
      `User Agent: ${navigator.userAgent}`,
      `Error Message: ${error?.message || "Unknown error"}`,
      `Stack Trace:\n${error?.stack || "No stack available"}`,
      `Component Stack:\n${errorInfo?.componentStack || "No component stack available"}`,
    ].join("\n\n");

    try {
      await navigator.clipboard.writeText(report);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error("Failed to copy error report to clipboard", err);
    }
  };

  render() {
    const { hasError, error, errorInfo, showDetails, copied } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (typeof fallback === "function") {
        return fallback({ error, resetError: this.handleReset });
      }
      if (fallback) {
        return fallback;
      }

      return (
        <div className="error-boundary-wrapper" role="alert">
          <div className="error-boundary-bg-watermark">ERROR</div>

          <div className="error-boundary-card">
            {/* Glowing Icon */}
            <div className="error-icon-container">
              <span className="error-icon-pulse"></span>
              <i className="fas fa-exclamation-triangle"></i>
            </div>

            {/* Badge & Title */}
            <div>
              <span className="error-badge">
                <i className="fas fa-shield-alt"></i> Application Error
              </span>
            </div>

            <h1 className="error-title">Something Went Wrong</h1>
            <p className="error-subtitle">
              An unexpected client-side error occurred while rendering this view.
              You can reload the page or return to the homepage to continue.
            </p>

            {/* Primary Action Buttons */}
            <div className="error-actions">
              <button
                type="button"
                className="error-btn error-btn-primary"
                onClick={this.handleReload}
              >
                <i className="fas fa-redo-alt"></i>
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                className="error-btn error-btn-secondary"
                onClick={this.handleHome}
              >
                <i className="fas fa-home"></i>
                <span>Go to Homepage</span>
              </button>

              <button
                type="button"
                className="error-btn error-btn-subtle"
                onClick={this.handleReset}
                title="Attempt to recover without full reload"
              >
                <i className="fas fa-sync"></i>
                <span>Try Recovering</span>
              </button>
            </div>

            {/* Diagnostic Details Accordion */}
            <div className="error-diagnostic-section">
              <button
                type="button"
                className="error-diagnostic-toggle"
                onClick={this.handleToggleDetails}
                aria-expanded={showDetails}
              >
                <span className="error-diagnostic-toggle-left">
                  <i className="fas fa-terminal"></i>
                  <span>Technical Diagnostics & Stack</span>
                </span>
                <i
                  className={`fas ${
                    showDetails ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                ></i>
              </button>

              {showDetails && (
                <div className="error-details-box">
                  <div className="error-details-header">
                    <span className="error-details-title">Error Details</span>
                    <button
                      type="button"
                      className="error-copy-btn"
                      onClick={this.handleCopyReport}
                      title="Copy diagnostic report to clipboard"
                    >
                      <i
                        className={`fas ${copied ? "fa-check" : "fa-copy"}`}
                      ></i>
                      <span>{copied ? "Copied!" : "Copy Report"}</span>
                    </button>
                  </div>

                  <pre className="error-code-block">
                    {error?.name}: {error?.message || "Unknown error"}
                    {error?.stack && `\n\n${error.stack}`}
                    {errorInfo?.componentStack && (
                      <div className="error-stack-trace">
                        Component Stack:
                        {errorInfo.componentStack}
                      </div>
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;