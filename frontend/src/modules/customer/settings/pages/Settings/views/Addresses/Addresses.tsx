export const Addresses = () => {
    return (
        <div className="card p-6 fade-in">
            <div className="flex justify-between items-center mb-4 border-bottom pb-3 flex-wrap gap-2">
                <div>
                    <h2 className="h5 mb-1">Saved Addresses</h2>
                    <p className="text-xs text-secondary mb-0">Manage delivery or service locations.</p>
                </div>
                <button className="btn btn-primary btn-sm">
                    <i className="fas fa-plus mr-1"></i> Add Address
                </button>
            </div>
            
            <div className="flex flex-col gap-4 mt-4">
                {/* Address 1 - Default */}
                <div className="p-4 bg-surface-elevated rounded border flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-primary transition-colors">
                    <div className="flex items-start gap-3">
                        <div className="mt-1"><i className="fas fa-home text-primary text-xl"></i></div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-text">Home</span>
                                <span className="badge badge-verified text-xs">Default</span>
                            </div>
                            <div className="text-sm text-secondary">Aspin Courtyard, Block A, Flat 3B</div>
                            <div className="text-sm text-secondary">Kodungallur, Thrissur, Kerala</div>
                            <div className="text-xs text-muted mt-1">Contact: +91 9876543210</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-outline btn-xs"><i className="fas fa-edit mr-1"></i> Edit</button>
                    </div>
                </div>

                {/* Address 2 */}
                <div className="p-4 bg-surface-elevated rounded border flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-primary transition-colors">
                    <div className="flex items-start gap-3">
                        <div className="mt-1"><i className="fas fa-building text-text-muted text-xl"></i></div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-text">Office</span>
                            </div>
                            <div className="text-sm text-secondary">TechPark Tower 2, 4th Floor</div>
                            <div className="text-sm text-secondary">Infopark, Kochi, Kerala</div>
                            <div className="text-xs text-muted mt-1">Contact: +91 9876543210</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-outline btn-xs">Set Default</button>
                        <button className="btn btn-outline btn-xs text-danger border-danger hover:bg-danger hover:text-white"><i className="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
