import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoriesTab from './CategoriesTab';
import Services from '../Services/Services';
import AdminCategoriesSubnav from '../../components/AdminCategoriesSubnav';
import { useGetCategoriesService } from '../../hooks/useCategory';
import { useGetServices } from '../../hooks/useService';

export default function Categories() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') === 'services' ? 'services' : 'categories';
    const [categoriesCount, setCategoriesCount] = useState<number | undefined>(undefined);
    const [servicesCount, setServicesCount] = useState<number | undefined>(undefined);

    const getCategories = useGetCategoriesService();
    const getServices = useGetServices();

    useEffect(() => {
        getCategories.mutate(
            { page: 1, limit: 1 },
            {
                onSuccess: (res) => {
                    if (typeof res?.data?.total === 'number') {
                        setCategoriesCount(res.data.total);
                    }
                }
            }
        );
        getServices.mutate(
            { page: 1, limit: 1 },
            {
                onSuccess: (res) => {
                    if (typeof res?.data?.total === 'number') {
                        setServicesCount(res.data.total);
                    }
                }
            }
        );
    }, []);

    const handleTabChange = (tab: 'categories' | 'services') => {
        setSearchParams({ tab });
    };

    return (
        <div className="app-content">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <div>
                    <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>Catalog Management</h1>
                    <p className="text-secondary text-sm mb-0">
                        {activeTab === 'categories'
                            ? 'Manage all service categories available on the platform.'
                            : 'Manage individual services offered under each category.'}
                    </p>
                </div>
            </div>

            <AdminCategoriesSubnav
                activeTab={activeTab}
                onTabChange={handleTabChange}
                categoriesCount={categoriesCount}
                servicesCount={servicesCount}
            />

            {activeTab === 'categories' ? (
                <CategoriesTab onTotalChange={setCategoriesCount} />
            ) : (
                <Services onTotalChange={setServicesCount} />
            )}
        </div>
    );
}
