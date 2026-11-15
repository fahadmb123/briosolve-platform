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

  handleToggleTheme = () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || localStorage.getItem("theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    this.forceUpdate();
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
          <div className="error-boundary-header">
            <a href="/" className="error-boundary-brand-link" aria-label="Briosolve Home">
              <img src="/briosolve-text-logo.svg" alt="Briosolve" className="error-boundary-brand-text-logo" />
            </a>

            <button
              onClick={this.handleToggleTheme}
              className="error-boundary-logo-btn"
              aria-label="Toggle Theme"
              title="Toggle Theme"
              type="button"
            >
              <img src="/briosolve-logo.svg" alt="Briosolve" className="error-boundary-brand-logo-img" />
            </button>
          </div>

          <div className="error-boundary-content">
            <div className="error-boundary-image-container">
              <img
                src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794745721/error-boundary-logo.png"
                alt="Application Error"
                className="error-boundary-image"
              />
            </div>

            <h1 className="error-boundary-title">Oops! Something went wrong...</h1>
            <p className="error-boundary-desc">
              The application encountered an unexpected error while loading this view. You can reload the page or return to the homepage.
            </p>

            <div className="error-boundary-actions">
              <button
                type="button"
                className="error-boundary-primary-btn"
                onClick={this.handleReload}
              >
                <i className="fas fa-redo-alt mr-2"></i>
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="error-boundary-secondary-btn"
              >
                <i className="fas fa-home mr-2"></i>
                <span>Go back home</span>
              </a>
            </div>

            <div className="error-boundary-diagnostics-section">
              <button
                type="button"
                className="error-boundary-details-toggle"
                onClick={this.handleToggleDetails}
                aria-expanded={showDetails}
              >
                <i className="fas fa-terminal mr-2"></i>
                <span>Technical Diagnostics</span>
                <i className={`fas ${showDetails ? "fa-chevron-up" : "fa-chevron-down"} ml-2`}></i>
              </button>

              {showDetails && (
                <div className="error-boundary-details-box">
                  <div className="error-boundary-details-header">
                    <span className="error-boundary-details-title">Error Details</span>
                    <div className="error-boundary-details-actions">
                      <button
                        type="button"
                        className="error-boundary-recover-btn"
                        onClick={this.handleReset}
                      >
                        <i className="fas fa-sync mr-1"></i>
                        <span>Recover View</span>
                      </button>
                      <button
                        type="button"
                        className="error-boundary-copy-btn"
                        onClick={this.handleCopyReport}
                      >
                        <i className={`fas ${copied ? "fa-check" : "fa-copy"} mr-1`}></i>
                        <span>{copied ? "Copied!" : "Copy Report"}</span>
                      </button>
                    </div>
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
                Need help? Contact support at{" "}
                <a href="mailto:support@briosolve.com" className="error-boundary-footer-link">
                  support@briosolve.com
                </a>
              </span>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
