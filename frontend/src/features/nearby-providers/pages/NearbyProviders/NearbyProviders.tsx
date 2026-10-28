import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './NearbyProviders.css';
import { useGetNearbyProviders } from '../../hooks/mutations/useNearbyProviders';
import Skeleton from 'react-loading-skeleton';
import { ProviderCard } from '../../components/ProviderCard';
import { ProviderCardSkeletonGrid } from '../../components/ProviderCardSkeleton';
import { ProviderDetailsModal } from '../../components/ProviderDetailsModal';
import { AdminPagination } from '../../../admin/components/AdminPagination';
import { useAuthStore } from '../../../auth/stores/auth.store';
import type { User, response } from '../../../../shared/types/Dtos';
import type { Address } from '../../../addresses';
import type { NearbyProvidersResponseData } from '../../services/nearbyProviders.service';

export default function NearbyProviders() {
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

    const getProvidersMut = useGetNearbyProviders();

    const fetchProviders = useCallback((currentPage: number, currentSearch: string, radiusFilter?: number) => {
        getProvidersMut.mutate(
            { page: currentPage, limit, search: currentSearch, radius: radiusFilter },
            {
                onSuccess: (res: response<NearbyProvidersResponseData>) => {
                    setProviders(res.data.users);
                    setTotal(res.data.total);
                    setTotalPages(res.data.totalPages);
                    setHasLocation(res.data.hasCustomerLocation);
                    setActiveRadiusKm(res.data.customerRadius);
                }
            }
        );
    }, []);

    useEffect(() => {
        fetchProviders(page, search, appliedRadius);
    }, [page, search, appliedRadius, fetchProviders]);

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
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedProvider(null);
    }, []);

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

                    {getProvidersMut.isPending ? (
                        <ProviderCardSkeletonGrid count={4} />
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
                            </div>

                            <AdminPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        </>
                    ) : (
                        <div className="empty-providers-state">
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'rgba(99,102,241,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.25rem'
                            }}>
                                <i className="fas fa-user-slash text-primary" style={{ fontSize: '1.75rem' }} />
                            </div>
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

            <ProviderDetailsModal
                provider={selectedProvider}
                onClose={handleCloseModal}
            />
        </div>
    );
}
