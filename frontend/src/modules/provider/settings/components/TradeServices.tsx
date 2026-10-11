import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useGetCategoriesService } from '../../../categories/hooks/mutations/useCategory';
import {
    useGetProviderServices,
    useAddProviderServices,
    useDeleteProviderService,
    useDeleteProviderCategory
} from '../hooks/mutations/useTradeService';
import type { PopulatedProviderService } from '../services/settings.service';

interface CatalogService {
    id: string;
    name: string;
    description?: string | null;
    status: string;
}

interface CatalogCategory {
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
    status: string;
    services?: CatalogService[];
}

interface CategoryGroup {
    category: {
        id: string;
        name: string;
        status?: string;
    };
    services: PopulatedProviderService[];
}

interface TradeServicesProps {
    onServicesChange?: (info: { total: number; active: number }) => void;
}

export const TradeServices: React.FC<TradeServicesProps> = ({ onServicesChange }) => {
    const getCategories = useGetCategoriesService();
    const getProviderServices = useGetProviderServices();
    const addProviderServices = useAddProviderServices();
    const deleteProviderService = useDeleteProviderService();
    const deleteProviderCategory = useDeleteProviderCategory();
    const [catalogCategories, setCatalogCategories] = useState<CatalogCategory[]>([]);
    const [providerServices, setProviderServices] = useState<PopulatedProviderService[]>([]);

    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

    const [serviceModalCategory, setServiceModalCategory] = useState<{ id: string; name: string } | null>(null);
    const [selectedServiceIdsToAdd, setSelectedServiceIdsToAdd] = useState<string[]>([]);

    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        getProviderServices.mutate(undefined, {
            onSuccess: (res) => {
                setProviderServices(res.data || []);
            }
        });
    }, []);

    const activeServicesCount = useMemo(() => {
        return providerServices.filter(
            (item) => item.service?.status === 'ACTIVE' && item.service?.category?.status === 'ACTIVE'
        ).length;
    }, [providerServices]);

    useEffect(() => {
        onServicesChange?.({ total: providerServices.length, active: activeServicesCount });
    }, [providerServices, activeServicesCount, onServicesChange]);

    const groupedCategories = useMemo(() => {
        const groups: Record<string, CategoryGroup> = {};

        providerServices.forEach((item) => {
            const cat = item.service?.category;
            if (!cat) return;

            if (!groups[cat.id]) {
                groups[cat.id] = {
                    category: { id: cat.id, name: cat.name, status: cat.status },
                    services: []
                };
            }

            groups[cat.id].services.push(item);
        });

        return Object.values(groups);
    }, [providerServices]);

    const availableCategoriesForAdd = useMemo(() => {
        const existingServiceIds = new Set(
            providerServices.map((ps) => ps.service_id || ps.service?.id).filter(Boolean)
        );

        return catalogCategories
            .filter((cat) => cat.status === 'ACTIVE')
            .map((cat) => ({
                ...cat,
                services: (cat.services || []).filter(
                    (s) => s.status === 'ACTIVE' && !existingServiceIds.has(s.id)
                )
            }))
            .filter((cat) => cat.services.length > 0);
    }, [catalogCategories, providerServices]);

    const availableServicesForCurrentCat = useMemo(() => {
        if (!serviceModalCategory) return [];
        const catalogCat = catalogCategories.find(
            (c) => c.id === serviceModalCategory.id && c.status === 'ACTIVE'
        );
        if (!catalogCat) return [];

        const existingServiceIds = new Set(
            providerServices
                .filter((ps) => ps.service?.category?.id === serviceModalCategory.id)
                .map((ps) => ps.service_id || ps.service?.id)
                .filter(Boolean)
        );
        return (catalogCat.services || []).filter(
            (s) => s.status === 'ACTIVE' && !existingServiceIds.has(s.id)
        );
    }, [serviceModalCategory, catalogCategories, providerServices]);

    const handleOpenAddCategoryModal = () => {
        setSelectedServiceIds([]);
        setIsAddCategoryModalOpen(true);
        getCategories.mutate(
            { page: 1, limit: 100, filter: 'ACTIVE' },
            {
                onSuccess: (res) => {
                    setCatalogCategories((res.data?.categories || []) as CatalogCategory[]);
                }
            }
        );
    };

    const toggleService = (serviceId: string) => {
        setSelectedServiceIds((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const toggleAllForCategory = (catServices: CatalogService[]) => {
        const ids = catServices.map((s) => s.id);
        const allSelected = ids.length > 0 && ids.every((id) => selectedServiceIds.includes(id));
        setSelectedServiceIds((prev) =>
            allSelected
                ? prev.filter((id) => !ids.includes(id))
                : Array.from(new Set([...prev, ...ids]))
        );
    };

    const handleConfirmAddCategories = () => {
        if (selectedServiceIds.length === 0) {
            toast.warning('Please select at least one service');
            return;
        }

        addProviderServices.mutate(selectedServiceIds, {
            onSuccess: (res) => {
                setProviderServices(res.data || []);
                setIsAddCategoryModalOpen(false);
                setSelectedServiceIds([]);
                toast.success('Categories and services added successfully');
            }
        });
    };

    const handleOpenAddServiceModal = (cat: { id: string; name: string }) => {
        setServiceModalCategory(cat);
        setSelectedServiceIdsToAdd([]);
        if (catalogCategories.length === 0) {
            getCategories.mutate(
                { page: 1, limit: 100, filter: 'ACTIVE' },
                {
                    onSuccess: (res) => {
                        setCatalogCategories((res.data?.categories || []) as CatalogCategory[]);
                    }
                }
            );
        }
    };

    const toggleServiceCheckboxToAdd = (serviceId: string) => {
        setSelectedServiceIdsToAdd((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleConfirmAddServices = () => {
        if (!serviceModalCategory) return;
        if (selectedServiceIdsToAdd.length === 0) {
            toast.warning('Please select at least one service');
            return;
        }

        addProviderServices.mutate(selectedServiceIdsToAdd, {
            onSuccess: (res) => {
                setProviderServices(res.data || []);
                setServiceModalCategory(null);
                setSelectedServiceIdsToAdd([]);
                toast.success('Services added successfully');
            }
        });
    };

    const handleConfirmDeleteService = () => {
        if (!serviceToDelete) return;
        deleteProviderService.mutate(serviceToDelete.id, {
            onSuccess: (res) => {
                setProviderServices(res.data || []);
                setServiceToDelete(null);
                toast.success('Service removed successfully');
            }
        });
    };

    const handleConfirmRemoveCategory = () => {
        if (!categoryToDelete) return;

        deleteProviderCategory.mutate(categoryToDelete.id, {
            onSuccess: (res) => {
                setProviderServices(res.data || []);
                toast.success(`Removed ${categoryToDelete.name} category`);
                setCategoryToDelete(null);
            }
        });
    };

    return (
        <>
            <div className="card p-6 fade-in">
                <div className="flex justify-between items-center mb-6 pb-4 border-bottom flex-wrap gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="h5 mb-0 font-bold">My Trade &amp; Services</h2>
                            {!getProviderServices.isPending && (
                                <span className={`badge badge-${activeServicesCount > 0 ? 'success' : 'warning'} text-xs font-semibold px-2 py-0.5`}>
                                    {activeServicesCount > 0
                                        ? `${activeServicesCount} Active`
                                        : (providerServices.length > 0 ? 'Inactive' : 'Action Required')}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-secondary mb-0">
                            Customize your specialized trade categories and the services you provide.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenAddCategoryModal}
                        disabled={getCategories.isPending}
                        className="btn btn-primary btn-sm"
                    >
                        <i className="fas fa-plus mr-1.5"></i> Add Trade Category
                    </button>
                </div>

                {getProviderServices.isPending ? (
                    <div className="text-center py-14 my-4 border border-dashed rounded-xl" style={{ borderColor: 'var(--border)' }}>
                        <i className="fas fa-spinner fa-spin text-2xl text-primary mb-2.5 block"></i>
                        <p className="font-semibold text-text text-sm mb-1">Loading Trade &amp; Services</p>
                        <p className="text-xs text-secondary mb-0">Fetching your assigned trade categories and services...</p>
                    </div>
                ) : groupedCategories.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-xl my-4" style={{ borderColor: 'var(--border)' }}>
                        <i className="fas fa-tools text-2xl text-secondary mb-2 opacity-50 block"></i>
                        <p className="font-semibold text-text text-sm mb-1">No Trade Categories Added</p>
                        <p className="text-xs text-secondary mb-4">
                            You have not selected any trade categories yet.
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenAddCategoryModal}
                            disabled={getCategories.isPending}
                            className="btn btn-outline btn-xs"
                        >
                            <i className="fas fa-plus mr-1"></i> Add Category
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 my-2">
                        {groupedCategories.map(({ category, services }) => (
                            <div
                                key={category.id}
                                className="border rounded-xl overflow-hidden"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                            >
                                <div
                                    className="px-5 py-3.5 flex justify-between items-center border-bottom flex-wrap gap-2"
                                    style={{ backgroundColor: 'var(--surface-elevated)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary"
                                            style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                                        >
                                            <i className="fas fa-wrench text-xs"></i>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-text capitalize">
                                                    {category.name}
                                                </span>
                                                {category.status !== 'ACTIVE' && (
                                                    <span className="badge badge-warning text-xs px-2 py-0.5 font-medium">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-secondary">
                                                ({services.length} services)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenAddServiceModal(category)}
                                            className="btn btn-outline btn-xs"
                                        >
                                            <i className="fas fa-plus mr-1"></i> Add Service
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCategoryToDelete(category)}
                                            disabled={deleteProviderCategory.isPending}
                                            className="btn btn-outline text-danger btn-xs"
                                            title="Remove Category"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-0">
                                    {services.length === 0 ? (
                                        <div className="text-center py-6 text-xs text-secondary">
                                            No services added to this category yet. Click &quot;+ Add Service&quot; above.
                                        </div>
                                    ) : (
                                        <div className="divide-y" style={{ borderColor: 'var(--border-light, var(--border))' }}>
                                            {services.map((item) => {
                                                const isServiceInactive = item.service?.status !== 'ACTIVE';
                                                const isCategoryInactive = item.service?.category?.status !== 'ACTIVE';
                                                const isInactive = isServiceInactive || isCategoryInactive;

                                                return (
                                                    <div
                                                        key={item.id || item.service_id}
                                                        className="flex justify-between items-center px-5 py-3 hover:bg-surface-elevated transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <i className={`fas fa-check-circle text-xs ${isInactive ? 'text-secondary opacity-40' : 'text-primary'}`}></i>
                                                            <span className={`font-medium text-xs ${isInactive ? 'text-secondary opacity-75' : 'text-text'}`}>
                                                                {item.service?.name}
                                                            </span>
                                                            {isInactive && (
                                                                <span className="badge badge-warning text-xs px-2 py-0.5 ml-2 font-medium">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => setServiceToDelete({ id: item.id || item.service_id, name: item.service?.name || 'this service' })}
                                                            disabled={deleteProviderService.isPending}
                                                            className="text-secondary hover:text-danger text-xs p-1.5 transition-colors cursor-pointer bg-transparent border-0"
                                                            title="Delete Service"
                                                        >
                                                            <i className="fas fa-trash-alt text-xs"></i>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isAddCategoryModalOpen && (
                <div className="confirm-modal-overlay">
                    <div
                        className="confirm-modal-content"
                        style={{ maxWidth: '640px', width: '92%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
                    >
                        <div className="flex justify-between items-center mb-3 pb-3 border-bottom">
                            <div>
                                <h3 className="h6 mb-1 font-bold">Add Trade Categories</h3>
                                <p className="text-xs text-secondary mb-0">
                                    Select the trade categories and specific services you want to offer
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddCategoryModalOpen(false)}
                                className="text-secondary hover:text-text cursor-pointer bg-transparent border-0 p-1"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-1 flex flex-col gap-4 mb-3" style={{ maxHeight: '55vh' }}>
                            {getCategories.isPending ? (
                                <div className="text-center py-8 text-secondary text-sm">
                                    <i className="fas fa-spinner fa-spin mr-2 text-primary text-xl mb-2"></i>
                                    <p>Loading services...</p>
                                </div>
                            ) : availableCategoriesForAdd.length === 0 ? (
                                <div className="text-center py-8 text-xs text-secondary">
                                    <i className="fas fa-check-circle text-2xl text-primary mb-2 block opacity-70"></i>
                                    All available services are already added to your profile.
                                </div>
                            ) : (
                                availableCategoriesForAdd.map((category) => {
                                    const isAllSelected =
                                        category.services.length > 0 &&
                                        category.services.every((s) => selectedServiceIds.includes(s.id));

                                    return (
                                        <div
                                            key={category.id}
                                            className="border rounded-xl overflow-hidden shadow-sm"
                                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}
                                        >
                                            <div
                                                className="px-4 py-3 border-bottom flex items-center justify-between"
                                                style={{ backgroundColor: 'var(--surface)' }}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-primary"
                                                        style={{ backgroundColor: 'rgba(212, 172, 119, 0.15)' }}
                                                    >
                                                        <i className="fas fa-layer-group text-xs"></i>
                                                    </div>
                                                    <span className="text-sm font-bold capitalize text-text">
                                                        {category.name}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleAllForCategory(category.services)}
                                                    className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-0 p-0 font-medium"
                                                >
                                                    {isAllSelected ? 'Deselect All' : 'Select All'}
                                                </button>
                                            </div>

                                            <div className="p-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                                                <div className="modern-chips-wrapper" style={{ justifyContent: 'flex-start' }}>
                                                    {category.services.map((service) => {
                                                        const isChecked = selectedServiceIds.includes(service.id);
                                                        return (
                                                            <label key={service.id} className="modern-service-chip">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleService(service.id)}
                                                                    className="hidden-checkbox"
                                                                />
                                                                <span className="chip-content">
                                                                    <span className="check-box-icon">
                                                                        <i className="fas fa-check"></i>
                                                                    </span>
                                                                    <span className="service-name">{service.name}</span>
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-top gap-2">
                            <span className="text-xs text-secondary">
                                {selectedServiceIds.length} service{selectedServiceIds.length !== 1 ? 's' : ''} selected
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddCategoryModalOpen(false)}
                                    className="btn btn-outline btn-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmAddCategories}
                                    disabled={selectedServiceIds.length === 0 || addProviderServices.isPending}
                                    className="btn btn-primary btn-sm flex items-center gap-1.5"
                                >
                                    {addProviderServices.isPending && (
                                        <i className="fas fa-spinner fa-spin text-xs"></i>
                                    )}
                                    <span>Add Categories</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {serviceModalCategory && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content" style={{ maxWidth: '520px', width: '92%' }}>
                        <div className="flex justify-between items-center mb-4 pb-2 border-bottom">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-primary"
                                    style={{ backgroundColor: 'rgba(212, 172, 119, 0.15)' }}
                                >
                                    <i className="fas fa-layer-group text-xs"></i>
                                </div>
                                <h3 className="h6 mb-0 font-bold capitalize">
                                    Add Services to {serviceModalCategory.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setServiceModalCategory(null)}
                                className="text-secondary hover:text-text cursor-pointer bg-transparent border-0"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {availableServicesForCurrentCat.length === 0 ? (
                            <div className="text-center py-6 text-xs text-secondary">
                                All available services in this category are already added.
                            </div>
                        ) : (
                            <div className="form-group mb-5">
                                <label className="form-label text-xs block mb-3 font-semibold text-secondary">
                                    Choose from Available Services
                                </label>
                                <div className="modern-chips-wrapper" style={{ justifyContent: 'flex-start' }}>
                                    {availableServicesForCurrentCat.map((s) => {
                                        const isChecked = selectedServiceIdsToAdd.includes(s.id);
                                        return (
                                            <label key={s.id} className="modern-service-chip">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleServiceCheckboxToAdd(s.id)}
                                                    className="hidden-checkbox"
                                                />
                                                <span className="chip-content">
                                                    <span className="check-box-icon">
                                                        <i className="fas fa-check"></i>
                                                    </span>
                                                    <span className="service-name">{s.name}</span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-3 border-top">
                            <button
                                type="button"
                                onClick={() => setServiceModalCategory(null)}
                                className="btn btn-outline btn-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAddServices}
                                disabled={selectedServiceIdsToAdd.length === 0 || addProviderServices.isPending}
                                className="btn btn-primary btn-sm flex items-center gap-1.5"
                            >
                                {addProviderServices.isPending && (
                                    <i className="fas fa-spinner fa-spin text-xs"></i>
                                )}
                                <span>Add Services</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {categoryToDelete && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content">
                        <h3 className="h6 mb-2 font-bold text-danger">Remove Trade Category?</h3>
                        <p className="text-xs text-secondary mb-4 leading-relaxed">
                            Are you sure you want to remove <strong className="text-text capitalize">{categoryToDelete.name}</strong> and all its services from your profile?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setCategoryToDelete(null)}
                                disabled={deleteProviderCategory.isPending}
                                className="btn btn-outline btn-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRemoveCategory}
                                disabled={deleteProviderCategory.isPending}
                                className="btn btn-danger btn-sm flex items-center gap-1.5"
                                style={{ backgroundColor: '#ef4444', color: '#ffffff', borderColor: '#ef4444' }}
                            >
                                {deleteProviderCategory.isPending && (
                                    <i className="fas fa-spinner fa-spin text-xs"></i>
                                )}
                                <span>Remove Category</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {serviceToDelete && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content">
                        <h3 className="h6 mb-2 font-bold text-danger">Remove Service?</h3>
                        <p className="text-xs text-secondary mb-4 leading-relaxed">
                            Are you sure you want to remove <strong className="text-text">{serviceToDelete.name}</strong> from your profile?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setServiceToDelete(null)}
                                disabled={deleteProviderService.isPending}
                                className="btn btn-outline btn-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteService}
                                disabled={deleteProviderService.isPending}
                                className="btn btn-danger btn-sm flex items-center gap-1.5"
                                style={{ backgroundColor: '#ef4444', color: '#ffffff', borderColor: '#ef4444' }}
                            >
                                {deleteProviderService.isPending && (
                                    <i className="fas fa-spinner fa-spin text-xs"></i>
                                )}
                                <span>Remove Service</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
