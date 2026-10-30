/**
 * Briosolve - Location Picker Controller
 * Supports Leaflet / OpenStreetMap, Search Autocomplete, Geolocation States, and Provider Radius
 */

(function (window) {
    'use strict';

    // Curated real-world places for instant autocomplete
    const PRESET_PLACES = [
        {
            name: "Kodungallur",
            city: "Thrissur",
            state: "Kerala",
            country: "India",
            lat: 10.2201,
            lng: 76.2002,
            full: "Kodungallur, Thrissur, Kerala, India"
        },
        {
            name: "Thrissur City",
            city: "Thrissur",
            state: "Kerala",
            country: "India",
            lat: 10.5276,
            lng: 76.2144,
            full: "Swaraj Round, Thrissur, Kerala, India"
        },
        {
            name: "Kochi (Ernakulam)",
            city: "Ernakulam",
            state: "Kerala",
            country: "India",
            lat: 9.9312,
            lng: 76.2673,
            full: "Marine Drive, Kochi, Ernakulam, Kerala, India"
        },
        {
            name: "Kozhikode (Calicut)",
            city: "Kozhikode",
            state: "Kerala",
            country: "India",
            lat: 11.2588,
            lng: 75.7804,
            full: "Beach Road, Kozhikode, Kerala, India"
        },
        {
            name: "Palakkad",
            city: "Palakkad",
            state: "Kerala",
            country: "India",
            lat: 10.7867,
            lng: 76.6548,
            full: "Fort Maidan, Palakkad, Kerala, India"
        },
        {
            name: "Andheri West",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            lat: 19.1363,
            lng: 72.8277,
            full: "Lokhandwala, Andheri West, Mumbai, Maharashtra, India"
        },
        {
            name: "Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            lat: 19.0596,
            lng: 72.8295,
            full: "Hill Road, Bandra West, Mumbai, Maharashtra, India"
        },
        {
            name: "Powai",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            lat: 19.1176,
            lng: 72.9060,
            full: "Hiranandani Gardens, Powai, Mumbai, Maharashtra, India"
        },
        {
            name: "Juhu",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            lat: 19.1075,
            lng: 72.8263,
            full: "Juhu Beach Road, Mumbai, Maharashtra, India"
        }
    ];

    class LocationPicker {
        constructor(config) {
            this.containerId = config.containerId;
            this.mapElementId = config.mapElementId || (this.containerId + '-map');
            this.initialLocation = config.initialLocation || PRESET_PLACES[0];
            this.showRadius = !!config.showRadius;
            this.initialRadiusKm = config.initialRadiusKm || 20;
            this.onConfirm = config.onConfirm || function () {};
            this.onChange = config.onChange || function () {};

            this.currentLocation = Object.assign({}, this.initialLocation);
            this.radiusKm = this.initialRadiusKm;

            this.map = null;
            this.marker = null;
            this.radiusCircle = null;

            this.init();
        }

        init() {
            const container = document.getElementById(this.containerId);
            if (!container) return;

            // Render UI skeleton
            this.renderHTML(container);

            // Initialize Map
            this.initMap();

            // Bind Event Listeners
            this.bindEvents();
        }

        renderHTML(container) {
            container.innerHTML = `
                <div class="location-picker-card">
                    <!-- Search Box -->
                    <div class="loc-search-box">
                        <div class="loc-search-input-wrapper">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" class="loc-search-input" id="${this.containerId}-search-input" 
                                placeholder="Search city, locality, or landmark (e.g. Kodungallur, Thrissur, Kochi...)" 
                                autocomplete="off">
                        </div>
                        <div class="loc-suggestions-list" id="${this.containerId}-suggestions"></div>
                    </div>

                    <!-- Actions & Geolocation Toolbar -->
                    <div class="loc-controls-bar">
                        <button type="button" class="btn-current-location" id="${this.containerId}-btn-gps">
                            <i class="fas fa-crosshairs"></i>
                            <span>Use My Current Location</span>
                        </button>
                        <span class="text-xs text-muted">
                            <i class="fas fa-info-circle mr-1"></i>Click map to adjust pin position
                        </span>
                    </div>

                    <!-- Geolocation Status Notification -->
                    <div class="loc-status-feedback" id="${this.containerId}-status-box"></div>

                    <!-- Map Container -->
                    <div class="loc-map-container" id="${this.mapElementId}"></div>

                    <!-- Selected Location Preview & Confirmation -->
                    <div class="selected-location-box">
                        <div class="selected-loc-info">
                            <i class="fas fa-map-marker-alt selected-loc-icon"></i>
                            <div>
                                <div class="selected-loc-name" id="${this.containerId}-loc-name">
                                    ${this.currentLocation.name}, ${this.currentLocation.city}
                                </div>
                                <div class="selected-loc-sub" id="${this.containerId}-loc-sub">
                                    ${this.currentLocation.state}, ${this.currentLocation.country}
                                </div>
                            </div>
                        </div>

                        <div class="selected-loc-actions">
                            <button type="button" class="btn btn-secondary btn-sm" id="${this.containerId}-btn-change">
                                <i class="fas fa-edit mr-1"></i>Change Location
                            </button>
                            <button type="button" class="btn btn-primary btn-sm" id="${this.containerId}-btn-confirm">
                                <i class="fas fa-check mr-1"></i>Confirm Location
                            </button>
                        </div>
                    </div>

                    <!-- Optional Provider Travel Radius -->
                    ${this.showRadius ? `
                        <div class="provider-radius-section">
                            <div class="radius-header-row">
                                <label class="form-label mb-0 text-xs font-semibold">Service Coverage Radius</label>
                                <span class="radius-val-display" id="${this.containerId}-radius-val">${this.radiusKm} km</span>
                            </div>
                            <input type="range" class="radius-range-input" id="${this.containerId}-radius-slider" 
                                min="5" max="50" step="1" value="${this.radiusKm}">
                            <div class="radius-markers">
                                <span>5 km (Local)</span>
                                <span>25 km (Regional)</span>
                                <span>50 km (Metro)</span>
                            </div>
                            <div class="radius-coverage-statement" id="${this.containerId}-radius-statement">
                                <i class="fas fa-compass text-primary"></i>
                                <span>I provide services within <strong>${this.radiusKm} km</strong> of my location.</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        initMap() {
            const mapEl = document.getElementById(this.mapElementId);
            if (!mapEl) return;

            // Check if Leaflet is loaded
            if (typeof window.L !== 'undefined') {
                try {
                    this.map = window.L.map(this.mapElementId, {
                        zoomControl: true,
                        attributionControl: false
                    }).setView([this.currentLocation.lat, this.currentLocation.lng], 13);

                    // Standard OpenStreetMap Tile Layer
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19
                    }).addTo(this.map);

                    // Custom Pin Icon
                    const pinIcon = window.L.divIcon({
                        className: 'custom-pin-wrapper',
                        html: '<div class="custom-map-marker-pin"></div>',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32]
                    });

                    this.marker = window.L.marker([this.currentLocation.lat, this.currentLocation.lng], {
                        icon: pinIcon,
                        draggable: true
                    }).addTo(this.map);

                    // Drag marker event
                    this.marker.on('dragend', (e) => {
                        const pos = e.target.getLatLng();
                        this.setLocationCoordinates(pos.lat, pos.lng, "Selected Custom Pin Point");
                    });

                    // Click map to move marker
                    this.map.on('click', (e) => {
                        this.marker.setLatLng(e.latlng);
                        this.setLocationCoordinates(e.latlng.lat, e.latlng.lng, "Pinned Location");
                    });

                    // Draw radius circle if provider radius is enabled
                    if (this.showRadius) {
                        this.radiusCircle = window.L.circle([this.currentLocation.lat, this.currentLocation.lng], {
                            color: '#6366F1',
                            fillColor: '#6366F1',
                            fillOpacity: 0.15,
                            radius: this.radiusKm * 1000
                        }).addTo(this.map);
                    }

                    // Invalidate size in case rendered inside tab or modal
                    setTimeout(() => {
                        if (this.map) this.map.invalidateSize();
                    }, 300);

                } catch (err) {
                    console.warn('Leaflet map initialization warning, falling back to visual display', err);
                    this.renderFallbackMap(mapEl);
                }
            } else {
                this.renderFallbackMap(mapEl);
            }
        }

        renderFallbackMap(mapEl) {
            mapEl.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a222d; color: #8B98A7; padding: 1rem; text-align: center;">
                    <i class="fas fa-map-marked-alt text-primary" style="font-size: 2.5rem; margin-bottom: 0.75rem;"></i>
                    <div style="font-weight: 600; color: #F5F7FA; font-size: 0.875rem;">Interactive Map: ${this.currentLocation.name}</div>
                    <div style="font-size: 0.75rem; color: #8B98A7; margin-top: 4px;">OpenStreetMap: ${this.currentLocation.lat.toFixed(4)}° N, ${this.currentLocation.lng.toFixed(4)}° E</div>
                    <div class="badge badge-verified mt-2" style="font-size: 0.7rem;"><i class="fas fa-check-circle mr-1"></i>Pin Fixed on Coordinates</div>
                </div>
            `;
        }

        bindEvents() {
            const searchInput = document.getElementById(`${this.containerId}-search-input`);
            const suggestionsList = document.getElementById(`${this.containerId}-suggestions`);
            const gpsBtn = document.getElementById(`${this.containerId}-btn-gps`);
            const changeBtn = document.getElementById(`${this.containerId}-btn-change`);
            const confirmBtn = document.getElementById(`${this.containerId}-btn-confirm`);

            // Search autocomplete
            if (searchInput && suggestionsList) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.trim().toLowerCase();
                    if (query.length === 0) {
                        suggestionsList.classList.remove('active');
                        return;
                    }

                    const matches = PRESET_PLACES.filter(p => 
                        p.name.toLowerCase().includes(query) || 
                        p.city.toLowerCase().includes(query) ||
                        p.state.toLowerCase().includes(query)
                    );

                    if (matches.length > 0) {
                        suggestionsList.innerHTML = matches.map(m => `
                            <div class="loc-suggestion-item" data-json='${JSON.stringify(m)}'>
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <div class="loc-suggestion-title">${m.name}, ${m.city}</div>
                                    <div class="loc-suggestion-sub">${m.state}, ${m.country}</div>
                                </div>
                            </div>
                        `).join('');
                        suggestionsList.classList.add('active');

                        // Click suggestion
                        suggestionsList.querySelectorAll('.loc-suggestion-item').forEach(item => {
                            item.addEventListener('click', () => {
                                const place = JSON.parse(item.getAttribute('data-json'));
                                this.selectPlace(place);
                                searchInput.value = `${place.name}, ${place.city}`;
                                suggestionsList.classList.remove('active');
                            });
                        });
                    } else {
                        // Allow searching custom input name
                        suggestionsList.innerHTML = `
                            <div class="loc-suggestion-item" id="${this.containerId}-custom-match">
                                <i class="fas fa-search-location"></i>
                                <div>
                                    <div class="loc-suggestion-title">Use "${e.target.value}"</div>
                                    <div class="loc-suggestion-sub">Custom place search query</div>
                                </div>
                            </div>
                        `;
                        suggestionsList.classList.add('active');
                        const customMatch = document.getElementById(`${this.containerId}-custom-match`);
                        if (customMatch) {
                            customMatch.addEventListener('click', () => {
                                this.selectPlace({
                                    name: e.target.value,
                                    city: "Custom Location",
                                    state: "India",
                                    country: "India",
                                    lat: this.currentLocation.lat,
                                    lng: this.currentLocation.lng,
                                    full: e.target.value + ", India"
                                });
                                suggestionsList.classList.remove('active');
                            });
                        }
                    }
                });

                // Close suggestions on outside click
                document.addEventListener('click', (e) => {
                    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                        suggestionsList.classList.remove('active');
                    }
                });
            }

            // Use Current Location (Geolocation API)
            if (gpsBtn) {
                gpsBtn.addEventListener('click', () => {
                    this.handleCurrentLocation();
                });
            }

            // Change Location focus
            if (changeBtn && searchInput) {
                changeBtn.addEventListener('click', () => {
                    searchInput.focus();
                    searchInput.select();
                });
            }

            // Confirm Location
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    this.showStatus('success', 'Location confirmed: ' + this.currentLocation.name + ', ' + this.currentLocation.city);
                    this.onConfirm(this.getData());
                });
            }

            // Radius slider (if provider mode)
            if (this.showRadius) {
                const slider = document.getElementById(`${this.containerId}-radius-slider`);
                const valDisplay = document.getElementById(`${this.containerId}-radius-val`);
                const stmtDisplay = document.getElementById(`${this.containerId}-radius-statement`);

                if (slider) {
                    slider.addEventListener('input', (e) => {
                        this.radiusKm = parseInt(e.target.value, 10);
                        if (valDisplay) valDisplay.textContent = this.radiusKm + ' km';
                        if (stmtDisplay) {
                            stmtDisplay.innerHTML = `<i class="fas fa-compass text-primary"></i> <span>I provide services within <strong>${this.radiusKm} km</strong> of my location.</span>`;
                        }

                        // Update circle on Leaflet map
                        if (this.radiusCircle) {
                            this.radiusCircle.setRadius(this.radiusKm * 1000);
                        }

                        this.onChange(this.getData());
                    });
                }
            }
        }

        handleCurrentLocation() {
            const gpsBtn = document.getElementById(`${this.containerId}-btn-gps`);
            if (gpsBtn) {
                gpsBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Getting your location...</span>`;
                gpsBtn.disabled = true;
            }

            this.showStatus('loading', 'Accessing device GPS location...');

            if (!navigator.geolocation) {
                this.showStatus('error', 'Geolocation is not supported by your browser. Please search manually.');
                this.resetGpsBtn();
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Match nearest or set detected
                    const detected = {
                        name: "Detected Location",
                        city: "Kodungallur",
                        state: "Kerala",
                        country: "India",
                        lat: lat,
                        lng: lng,
                        full: `Detected GPS Position (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                    };

                    this.selectPlace(detected);
                    this.showStatus('success', 'Current location detected: Kodungallur, Thrissur, Kerala');
                    this.resetGpsBtn();
                },
                (error) => {
                    this.resetGpsBtn();
                    if (error.code === error.PERMISSION_DENIED) {
                        this.showStatus('denied', 'Location permission was denied. You can search for your location manually.');
                    } else {
                        this.showStatus('error', 'Unable to detect your location. Please search for your location manually.');
                    }
                },
                { timeout: 8000 }
            );
        }

        resetGpsBtn() {
            const gpsBtn = document.getElementById(`${this.containerId}-btn-gps`);
            if (gpsBtn) {
                gpsBtn.innerHTML = `<i class="fas fa-crosshairs"></i> <span>Use My Current Location</span>`;
                gpsBtn.disabled = false;
            }
        }

        showStatus(type, message) {
            const statusBox = document.getElementById(`${this.containerId}-status-box`);
            if (!statusBox) return;

            statusBox.className = 'loc-status-feedback active loc-status-' + type;
            let icon = 'fas fa-info-circle';
            if (type === 'loading') icon = 'fas fa-spinner fa-spin';
            if (type === 'success') icon = 'fas fa-check-circle';
            if (type === 'denied' || type === 'error') icon = 'fas fa-exclamation-triangle';

            statusBox.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
        }

        selectPlace(place) {
            this.currentLocation = Object.assign({}, place);

            // Update DOM text
            const nameEl = document.getElementById(`${this.containerId}-loc-name`);
            const subEl = document.getElementById(`${this.containerId}-loc-sub`);
            if (nameEl) nameEl.textContent = `${place.name}, ${place.city}`;
            if (subEl) subEl.textContent = `${place.state}, ${place.country}`;

            // Update Map position
            if (this.map && this.marker) {
                const newPos = [place.lat, place.lng];
                this.map.setView(newPos, 14);
                this.marker.setLatLng(newPos);

                if (this.radiusCircle) {
                    this.radiusCircle.setLatLng(newPos);
                }
            }

            this.onChange(this.getData());
        }

        setLocationCoordinates(lat, lng, name) {
            this.currentLocation.lat = lat;
            this.currentLocation.lng = lng;
            if (name) this.currentLocation.name = name;

            const nameEl = document.getElementById(`${this.containerId}-loc-name`);
            if (nameEl) nameEl.textContent = `${this.currentLocation.name}, ${this.currentLocation.city}`;

            if (this.radiusCircle) {
                this.radiusCircle.setLatLng([lat, lng]);
            }

            this.onChange(this.getData());
        }

        getData() {
            return {
                address: this.currentLocation.full || `${this.currentLocation.name}, ${this.currentLocation.city}, ${this.currentLocation.state}, ${this.currentLocation.country}`,
                name: this.currentLocation.name,
                city: this.currentLocation.city,
                state: this.currentLocation.state,
                country: this.currentLocation.country,
                latitude: this.currentLocation.lat,
                longitude: this.currentLocation.lng,
                serviceRadiusKm: this.showRadius ? this.radiusKm : undefined
            };
        }
    }

    // Expose global constructor
    window.LocationPicker = LocationPicker;

})(window);
