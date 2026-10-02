export const Security = () => {
    return (
        <div className="card p-6 fade-in">
            <h2 className="h5 mb-4 border-bottom pb-3">Password & Security</h2>
            <p className="text-xs text-secondary mb-4">Update your sign-in credentials to protect your marketplace account.</p>
            <form action="#" className="flex flex-col gap-4">
                <div className="form-row-2">
                    <div className="form-group mb-0">
                        <label className="form-label text-xs" htmlFor="curr-pass">Current Password</label>
                        <input type="password" id="curr-pass" className="form-control" placeholder="••••••••" />
                    </div>
                    <div className="form-group mb-0">
                        <label className="form-label text-xs" htmlFor="new-pass">New Password</label>
                        <input type="password" id="new-pass" className="form-control" placeholder="At least 8 characters" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="button" className="btn btn-primary btn-sm">Update Password</button>
                </div>
            </form>
        </div>
    );
};
