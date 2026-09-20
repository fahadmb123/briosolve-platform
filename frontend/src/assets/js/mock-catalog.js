const MOCK_CATALOG = {
    categories: [
        { id: 'cat_electronics', name: 'Electronics', icon: 'fas fa-tv' },
        { id: 'cat_plumbing', name: 'Plumbing', icon: 'fas fa-faucet' },
        { id: 'cat_electrical', name: 'Electrical', icon: 'fas fa-bolt' }
    ],
    services: [
        // Electronics
        { id: 'srv_tv_install', categoryId: 'cat_electronics', name: 'TV Installation', startingPaymentType: 'percentage', startingPaymentValue: 20, defaultDuration: 60, defaultDurationUnit: 'minutes' },
        { id: 'srv_tv_wall_mount', categoryId: 'cat_electronics', name: 'TV Wall Mounting', startingPaymentType: 'percentage', startingPaymentValue: 20, defaultDuration: 60, defaultDurationUnit: 'minutes' },
        { id: 'srv_tv_display', categoryId: 'cat_electronics', name: 'TV Display Problem', startingPaymentType: 'fixed', startingPaymentValue: 500, defaultDuration: 60, defaultDurationUnit: 'minutes' },
        { id: 'srv_tv_power', categoryId: 'cat_electronics', name: 'TV Not Turning On', startingPaymentType: 'fixed', startingPaymentValue: 500, defaultDuration: 60, defaultDurationUnit: 'minutes' },
        
        // Plumbing
        { id: 'srv_tap_replace', categoryId: 'cat_plumbing', name: 'Tap Replacement', startingPaymentType: 'percentage', startingPaymentValue: 20, defaultDuration: 45, defaultDurationUnit: 'minutes' },
        { id: 'srv_faucet_install', categoryId: 'cat_plumbing', name: 'Faucet Installation', startingPaymentType: 'percentage', startingPaymentValue: 20, defaultDuration: 60, defaultDurationUnit: 'minutes' },
        { id: 'srv_water_leak', categoryId: 'cat_plumbing', name: 'Water Leakage Problem', startingPaymentType: 'fixed', startingPaymentValue: 300, defaultDuration: 90, defaultDurationUnit: 'minutes' },
        { id: 'srv_pipeline_leak', categoryId: 'cat_plumbing', name: 'Pipeline Leakage', startingPaymentType: 'fixed', startingPaymentValue: 300, defaultDuration: 120, defaultDurationUnit: 'minutes' },

        // Electrical
        { id: 'srv_fan_install', categoryId: 'cat_electrical', name: 'Fan Installation', startingPaymentType: 'percentage', startingPaymentValue: 20, defaultDuration: 45, defaultDurationUnit: 'minutes' },
        { id: 'srv_switch_replace', categoryId: 'cat_electrical', name: 'Switch Replacement', startingPaymentType: 'percentage', startingPaymentValue: 20, defaultDuration: 30, defaultDurationUnit: 'minutes' },
        { id: 'srv_power_fail', categoryId: 'cat_electrical', name: 'Power Failure Problem', startingPaymentType: 'fixed', startingPaymentValue: 400, defaultDuration: 60, defaultDurationUnit: 'minutes' },
        { id: 'srv_short_circuit', categoryId: 'cat_electrical', name: 'Short Circuit', startingPaymentType: 'fixed', startingPaymentValue: 400, defaultDuration: 90, defaultDurationUnit: 'minutes' }
    ]
};

window.MOCK_CATALOG = MOCK_CATALOG;
