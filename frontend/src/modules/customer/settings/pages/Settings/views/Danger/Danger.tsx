export const Danger = () => {
    return (
        <div className="card p-6 border-danger fade-in">
            <h2 className="h5 mb-2 text-danger">Danger Zone</h2>
            <p className="text-xs text-secondary mb-4">
                Permanently close your customer account and cancel all active requests. This action cannot be undone.
            </p>
            <button className="btn btn-danger text-xs">
                <i className="fas fa-user-slash mr-1"></i> Deactivate Account
            </button>
        </div>
    );
};
