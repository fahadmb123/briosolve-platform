import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './NearbyProviders.css';
import { useGetNearbyProviders } from '../../hooks/mutations/useNearbyProviders';
import Skeleton from 'react-loading-skeleton';
import { ProviderCard } from '../../components/ProviderCard';
import { ProviderCardSkeleton } from '../../components/ProviderCardSkeleton';
import { ProviderProfileView } from '../../components/ProviderProfileView/ProviderProfileView';
import { useAuthStore } from '../../../auth/stores/auth.store';
import type { User, response } from '../../../../shared/types/Dtos';
import type { Address } from '../../../addresses';
import type { NearbyProvidersResponseData } from '../../services/nearbyProviders.service';

export default function NearbyProviders() {
    const navigate = useNavigate();
    const { providerId } = useParams<{ providerId?: string }>();
    const location = useLocation();

    const user = useAuthStore((s) => s.user);
    const customerAddress = typeof user?.current_address_id === 'object' ? (user.current_address_id as Address | null) : null;

    const [providers, setProviders] = useState<User[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedRadius, setSelectedRadius] = useState<number | undefined>(undefined);
    const [appliedRadius, setAppliedRadius] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState<'default' | 'experience' | 'jobs'>('default');
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasLocation, setHasLocation] = useState(true);
    const [activeRadiusKm, setActiveRadiusKm] = useState(20);
    const limit = 12;
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const isLoadingMoreRef = useRef<boolean>(false);

    const getProvidersMut = useGetNearbyProviders();

    const fetchProviders = useCallback((currentPage: number, currentSearch: string, radiusFilter?: number, isReset: boolean = false) => {
        if (currentPage > 1) {
            isLoadingMoreRef.current = true;
        }
        getProvidersMut.mutate(
            { page: currentPage, limit, search: currentSearch, radius: radiusFilter },
            {
                onSuccess: (res: response<NearbyProvidersResponseData>) => {
                    isLoadingMoreRef.current = false;
                    const incoming = res.data.users || [];
                    setProviders((prev) => {
                        if (isReset || currentPage === 1) return incoming;
                        const existingIds = new Set(prev.map((p) => p.id));
                        const uniqueNew = incoming.filter((p) => !existingIds.has(p.id));
                        return [...prev, ...uniqueNew];
                    });
                    setTotal(res.data.total);
                    setTotalPages(res.data.totalPages);
                    setHasLocation(res.data.hasCustomerLocation);
                    setActiveRadiusKm(res.data.customerRadius);
                },
                onError: () => {
                    isLoadingMoreRef.current = false;
                }
            }
        );
    }, []);

    useEffect(() => {
        setPage(1);
        fetchProviders(1, search, appliedRadius, true);
    }, [search, appliedRadius, fetchProviders]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page < totalPages && !isLoadingMoreRef.current && !getProvidersMut.isPending) {
                    setPage((prev) => {
                        const nextPage = prev + 1;
                        fetchProviders(nextPage, search, appliedRadius, false);
                        return nextPage;
                    });
                }
            },
            { rootMargin: '400px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [page, totalPages, search, appliedRadius, getProvidersMut.isPending, fetchProviders]);

    const activeProvider = useMemo(() => {
        if (selectedProvider && (!providerId || selectedProvider.id === providerId)) {
            return selectedProvider;
        }
        const stateProvider = (location.state as { provider?: User } | null)?.provider;
        if (stateProvider && (!providerId || stateProvider.id === providerId)) {
            return stateProvider;
        }
        if (providerId) {
            return providers.find((p) => p.id === providerId) || null;
        }
        return selectedProvider;
    }, [providerId, selectedProvider, location.state, providers]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
        setAppliedRadius(selectedRadius);
    };

    const handleReset = () => {
        setSearchInput('');
        setSearch('');
        setSelectedRadius(undefined);
        setAppliedRadius(undefined);
        setPage(1);
        setSortBy('default');
    };

    const handleViewDetails = useCallback((provider: User) => {
        setSelectedProvider(provider);
        navigate(`/nearby-providers/${provider.id}`, { state: { provider, from: 'nearby-providers' } });
    }, [navigate]);

    const handleBackFromProfile = useCallback(() => {
        setSelectedProvider(null);
        const state = location.state as { from?: string; returnUrl?: string } | null;
        if (state?.returnUrl) {
            navigate(state.returnUrl);
        } else if (state?.from === 'chat') {
            navigate('/messages');
        } else if (state?.from === 'nearby-providers') {
            navigate('/nearby-providers');
        } else if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate('/nearby-providers');
        }
    }, [navigate, location.state]);

    const displayedProviders = useMemo(() => {
        const list = [...providers];

        if (sortBy === 'jobs') {
            list.sort((a, b) => (b.provider_profile?.completed_jobs ?? 0) - (a.provider_profile?.completed_jobs ?? 0));
        } else if (sortBy === 'experience') {
            list.sort((a, b) => {
                const expA = parseInt(a.provider_profile?.experience || '0', 10) || 0;
                const expB = parseInt(b.provider_profile?.experience || '0', 10) || 0;
                return expB - expA;
            });
        }

        return list;
    }, [providers, sortBy]);

    if (activeProvider || providerId) {
        return (
            <div className="app-content nearby-providers-container">
                <ProviderProfileView
                    providerId={providerId || activeProvider?.id}
                    initialProvider={activeProvider}
                    customerAddress={customerAddress}
                    onBack={handleBackFromProfile}
                />
            </div>
        );
    }

    return (
        <div className="app-content nearby-providers-container">
            <div className="nearby-header-section">
                <div>
                    <h1 className="h2 mb-1">Nearby Providers</h1>
                    <p className="text-secondary text-sm mb-0">
                        Showing verified professionals where both you and the provider are within mutual service coverage ({activeRadiusKm} km radius).
                        {customerAddress?.city && (
                            <span className="text-primary font-medium ml-1">
                                <i className="fas fa-location-dot mr-1" />
                                Near {customerAddress.city}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {!hasLocation ? (
                <div className="empty-providers-state">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(245, 158, 11, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem'
                    }}>
                        <i className="fas fa-map-marker-alt text-warning" style={{ fontSize: '1.75rem' }} />
                    </div>
                    <h3 className="h5 mb-2">Location Required</h3>
                    <p className="text-secondary text-sm max-w-md mx-auto mb-4">
                        Please set your current address in account settings to discover providers who serve your area.
                    </p>
                    <Link to="/settings" className="btn btn-primary btn-sm">
                        <i className="fas fa-cog mr-1" />
                        <span>Manage Address in Settings</span>
                    </Link>
                </div>
            ) : (
                <>
                    <form onSubmit={handleSearchSubmit} className="nearby-search-bar">
                        <div className="search-input-wrapper">
                            <i className="fas fa-search" />
                            <input
                                type="text"
                                className="nearby-search-input"
                                placeholder="Search by business name or provider..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>

                        <div className="nearby-filter-group">
                            <select
                                className="nearby-filter-select"
                                value={selectedRadius ?? ''}
                                onChange={(e) => setSelectedRadius(e.target.value ? Number(e.target.value) : undefined)}
                            >
                                <option value="">Radius: {activeRadiusKm} km (Default)</option>
                                <option value="10">Within 10 km</option>
                                <option value="15">Within 15 km</option>
                                <option value="20">Within 20 km</option>
                                <option value="30">Within 30 km</option>
                                <option value="50">Within 50 km</option>
                            </select>

                            <select
                                className="nearby-filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'default' | 'experience' | 'jobs')}
                            >
                                <option value="default">Nearest First</option>
                                <option value="jobs">Most Jobs Completed</option>
                                <option value="experience">Most Experienced</option>
                            </select>

                            <button type="submit" className="btn btn-primary nearby-search-btn">
                                <i className="fas fa-search" />
                                <span>Search</span>
                            </button>

                            {(search || appliedRadius !== undefined || sortBy !== 'default') && (
                                <button type="button" onClick={handleReset} className="nearby-reset-btn">
                                    <i className="fas fa-undo" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-secondary font-medium">
                            {getProvidersMut.isPending ? (
                                <Skeleton width={180} height={14} />
                            ) : (
                                `Showing ${displayedProviders.length} of ${total} mutual-coverage providers`
                            )}
                        </span>
                    </div>

                    {getProvidersMut.isPending && providers.length === 0 ? (
                        <div className="providers-grid" aria-busy="true" aria-label="Loading providers">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <ProviderCardSkeleton key={idx} />
                            ))}
                        </div>
                    ) : displayedProviders.length > 0 ? (
                        <>
                            <div className="providers-grid">
                                {displayedProviders.map((provider) => (
                                    <ProviderCard
                                        key={provider.id}
                                        provider={provider}
                                        customerAddress={customerAddress}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                                {getProvidersMut.isPending && page > 1 &&
                                    Array.from({ length: 4 }).map((_, idx) => (
                                        <ProviderCardSkeleton key={`skeleton-${idx}`} />
                                    ))}
                            </div>

                            {page < totalPages && <div ref={sentinelRef} className="nearby-sentinel" />}

                            {page >= totalPages && displayedProviders.length > 0 && totalPages > 1 && (
                                <div className="nearby-end-message">
                                    <span>You've reached the end of available providers</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-providers-state">
                            <img
                                src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
                                alt="No data found"
                                className="empty-providers-img"
                            />
                            <h3 className="h5 mb-2">No Providers In Range</h3>
                            <p className="text-secondary text-sm max-w-md mx-auto mb-4">
                                No active service providers match your current radius ({activeRadiusKm} km) and search criteria. Try expanding your search radius.
                            </p>
                            <button type="button" onClick={handleReset} className="btn btn-primary btn-sm">
                                <span>Clear Filters</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
