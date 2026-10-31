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
        <div className="error-boundary-page-wrapper" role="alert">
          <header className="error-boundary-topbar">
            <a href="/" className="brand-logo-container" aria-label="Briosolve Home">
              <img src="/briosolve-logo.svg" alt="Briosolve" className="brand-emblem-logo" />
              <img src="/briosolve-text-logo.svg" alt="Briosolve" className="brand-text-logo" />
            </a>

            <div className="error-boundary-topbar-actions">
              <button type="button" onClick={this.handleHome} className="error-boundary-home-btn">
                <i className="fas fa-home"></i>
                <span>Homepage</span>
              </button>
            </div>
          </header>

          <main className="error-boundary-main">
            <nav className="error-boundary-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <i className="fas fa-chevron-right"></i>
              <span>Support</span>
              <i className="fas fa-chevron-right"></i>
              <span>System Diagnostics</span>
            </nav>

            <div className="error-boundary-page-header">
              <div className="error-boundary-badge-row">
                <span className="error-boundary-status-badge">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Application Error</span>
                </span>
              </div>
              <h1 className="error-boundary-page-title">An Unexpected Error Occurred</h1>
              <p className="error-boundary-page-desc">
                The application encountered an unhandled exception while rendering this view. You can reload the application, attempt to recover the current state, or return to the homepage.
              </p>
            </div>

            <div className="error-boundary-section">
              <h2 className="error-boundary-section-title">1. Recommended Actions</h2>
              <p className="error-boundary-section-hint">
                Choose an action below to restore application state or navigate safely away.
              </p>

              <div className="error-boundary-actions-bar">
                <button
                  type="button"
                  className="error-boundary-submit-btn"
                  onClick={this.handleReload}
                >
                  <i className="fas fa-redo-alt"></i>
                  <span>Reload Application</span>
                </button>

                <button
                  type="button"
                  className="error-boundary-secondary-btn"
                  onClick={this.handleReset}
                >
                  <i className="fas fa-sync"></i>
                  <span>Try Recovering View</span>
                </button>

                <button
                  type="button"
                  className="error-boundary-cancel-btn"
                  onClick={this.handleHome}
                >
                  Return to Homepage
                </button>
              </div>
            </div>

            <div className="error-boundary-section">
              <h2 className="error-boundary-section-title">2. Technical Diagnostics & Trace</h2>
              <p className="error-boundary-section-hint">
                Inspect the recorded runtime error stack or copy the diagnostic report for developer support.
              </p>

              <button
                type="button"
                className="error-boundary-diagnostic-toggle"
                onClick={this.handleToggleDetails}
                aria-expanded={showDetails}
              >
                <span className="error-boundary-diagnostic-toggle-left">
                  <i className="fas fa-terminal"></i>
                  <span>Diagnostic Stack & Hierarchy</span>
                </span>
                <i className={`fas ${showDetails ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </button>

              {showDetails && (
                <div className="error-boundary-details-box">
                  <div className="error-boundary-details-header">
                    <span className="error-boundary-details-title">Error Details</span>
                    <button
                      type="button"
                      className="error-boundary-copy-btn"
                      onClick={this.handleCopyReport}
                    >
                      <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
                      <span>{copied ? "Copied!" : "Copy Report"}</span>
                    </button>
                  </div>

                  <pre className="error-boundary-code-block">
                    {error?.name}: {error?.message || "Unknown error"}
                    {error?.stack && `\n\n${error.stack}`}
                    {errorInfo?.componentStack && `\n\nComponent Stack:${errorInfo.componentStack}`}
                  </pre>
                </div>
              )}
            </div>

            <div className="error-boundary-footer-help">
              <span>
                If this issue persists across multiple reloads, please contact technical support at{" "}
                <a href="mailto:support@briosolve.com" className="error-boundary-footer-link">
                  support@briosolve.com
                </a>
                .
              </span>
            </div>
          </main>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
