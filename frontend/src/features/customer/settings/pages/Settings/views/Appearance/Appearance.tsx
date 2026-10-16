import { useTheme } from '../../../../../../../shared/hooks/useTheme';

export const Appearance = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="card p-6 fade-in">
            <h2 className="h5 mb-2">Theme & Appearance</h2>
            <p className="text-xs text-secondary mb-4">Choose your preferred visual style across all customer screens.</p>
            <div className="theme-options-grid">
                <div className={theme === "dark" ? "theme-card active" : "theme-card "} onClick={toggleTheme}>
                    <div className="theme-preview dark-preview mb-2"></div>
                    <div className="font-semibold text-xs text-text">Dark Mode (Default)</div>
                    <div className="text-xs text-secondary">Optimal contrast for low-light</div>
                </div>
                <div className={theme === "light" ? "theme-card active" : "theme-card "} onClick={toggleTheme}>
                    <div className="theme-preview light-preview mb-2"></div>
                    <div className="font-semibold text-xs text-text">Light Mode</div>
                    <div className="text-xs text-secondary">Clean neutral surfaces</div>
                </div>
            </div>
        </div>
    );
};
