import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Customers from '../AdminCustomers/Customers';
import Providers from '../AdminProviders/Providers';
import AdminUsersSubnav from '../../../admin/components/AdminUsersSubnav';
import { useGetCustomers } from '../../hooks/admin/useAdminCustomers';
import { useGetProviders } from '../../hooks/admin/useAdminProviders';

export default function Users() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') === 'providers' ? 'providers' : 'customers';
    const [customersCount, setCustomersCount] = useState<number | undefined>(undefined);
    const [providersCount, setProvidersCount] = useState<number | undefined>(undefined);

    const getCustomers = useGetCustomers();
    const getProviders = useGetProviders();

    useEffect(() => {
        getCustomers.mutate(
            { page: 1, limit: 1, search: "", filter: "" },
            {
                onSuccess: (res) => {
                    setCustomersCount(res.data.total);
                },
            }
        );
        getProviders.mutate(
            { page: 1, limit: 1, search: "", filter: "" },
            {
                onSuccess: (res) => {
                    setProvidersCount(res.data.total);
                },
            }
        );
    }, []);

    const handleTabChange = (tab: 'customers' | 'providers') => {
        setSearchParams({ tab });
    };

    return (
        <div className="app-content">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <div>
                    <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>User Management</h1>
                    <p className="text-secondary text-sm mb-0">
                        {activeTab === 'customers'
                            ? 'Total platform accounts registered across Customer roles.'
                            : 'Track credentialed professionals, verification status, service capacities, and account governance.'}
                    </p>
                </div>
                {activeTab === 'providers' && (
                    <div className="flex items-center gap-2">
                        <Link to="/admin/requests?tab=verifications" className="btn btn-warning text-xs">
                            <i className="fas fa-user-check mr-1"></i>Review Verification Queue
                        </Link>
                    </div>
                )}
            </div>

            <AdminUsersSubnav
                activeTab={activeTab}
                onTabChange={handleTabChange}
                customersCount={customersCount}
                providersCount={providersCount}
            />

            {activeTab === 'customers' ? (
                <Customers onTotalChange={setCustomersCount} />
            ) : (
                <Providers onTotalChange={setProvidersCount} />
            )}
        </div>
    );
}

