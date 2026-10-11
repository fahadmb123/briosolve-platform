import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useGetCategoriesService } from '../../../categories/hooks/mutations/useCategory';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';

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

interface ProviderServiceItem {
    id: string;
    name: string;
}

interface ProviderCategoryItem {
    id: string;
    name: string;
    services: ProviderServiceItem[];
}

export const TradeServices: React.FC = () => {
    const getCategories = useGetCategoriesService();
    const [catalogCategories, setCatalogCategories] = useState<CatalogCategory[]>([]);
    const [myCategories, setMyCategories] = useState<ProviderCategoryItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [selectedServiceIdsByCat, setSelectedServiceIdsByCat] = useState<Record<string, string[]>>({});

    const [serviceModalCategory, setServiceModalCategory] = useState<ProviderCategoryItem | null>(null);
    const [selectedServiceIdsToAdd, setSelectedServiceIdsToAdd] = useState<string[]>([]);

    const [categoryToDelete, setCategoryToDelete] = useState<ProviderCategoryItem | null>(null);

    useEffect(() => {
        getCategories.mutate(
            { page: 1, limit: 100, filter: 'ACTIVE' },
            {
                onSuccess: (res) => {
                    const fetched = (res.data?.categories || []) as CatalogCategory[];
                    setCatalogCategories(fetched);

                    if (fetched.length > 0) {
                        const firstCat = fetched[0];
                        const initialServices: ProviderServiceItem[] = (firstCat.services || []).slice(0, 2).map((s) => ({
                            id: s.id,
                            name: s.name
                        }));

                        setMyCategories([
                            {
                                id: firstCat.id,
                                name: firstCat.name,
                                services: initialServices
                            }
                        ]);
                    }
                }
            }
        );
    }, []);

    const availableCatalogCategories = useMemo(() => {
        const existingCatIds = new Set(myCategories.map((c) => c.id));
        return catalogCategories.filter(
            (c) => !existingCatIds.has(c.id) && c.services && c.services.length > 0
        );
    }, [catalogCategories, myCategories]);

    const totalSelectedServicesToAdd = useMemo(() => {
        return Object.values(selectedServiceIdsByCat).reduce((acc, list) => acc + list.length, 0);
    }, [selectedServiceIdsByCat]);

    const availableServicesForCurrentCat = useMemo(() => {
        if (!serviceModalCategory) return [];
        const catalogCat = catalogCategories.find((c) => c.id === serviceModalCategory.id);
        if (!catalogCat) return [];

        const existingServiceIds = new Set(serviceModalCategory.services.map((s) => s.id));
        return (catalogCat.services || []).filter((s) => !existingServiceIds.has(s.id));
    }, [serviceModalCategory, catalogCategories]);

    const handleOpenAddCategoryModal = () => {
        setSelectedServiceIdsByCat({});
        setIsAddCategoryModalOpen(true);
    };

    const toggleServiceInModal = (categoryId: string, serviceId: string) => {
        setSelectedServiceIdsByCat((prev) => {
            const current = prev[categoryId] || [];
            const next = current.includes(serviceId)
                ? current.filter((id) => id !== serviceId)
                : [...current, serviceId];
            return {
                ...prev,
                [categoryId]: next
            };
        });
    };

    const toggleAllForCategory = (cat: CatalogCategory) => {
        const allIds = (cat.services || []).map((s) => s.id);
        setSelectedServiceIdsByCat((prev) => {
            const current = prev[cat.id] || [];
            const isAll = current.length === allIds.length && allIds.length > 0;
            return {
                ...prev,
                [cat.id]: isAll ? [] : allIds
            };
        });
    };

    const handleConfirmAddCategories = () => {
        const categoriesToAdd: ProviderCategoryItem[] = [];

        availableCatalogCategories.forEach((cat) => {
            const selectedIds = selectedServiceIdsByCat[cat.id] || [];
            if (selectedIds.length > 0) {
                const servicesToAdd: ProviderServiceItem[] = (cat.services || [])
                    .filter((s) => selectedIds.includes(s.id))
                    .map((s) => ({ id: s.id, name: s.name }));

                if (servicesToAdd.length > 0) {
                    categoriesToAdd.push({
                        id: cat.id,
                        name: cat.name,
                        services: servicesToAdd
                    });
                }
            }
        });

        if (categoriesToAdd.length === 0) {
            toast.warning('Please select at least one service');
            return;
        }

        setMyCategories((prev) => [...prev, ...categoriesToAdd]);
        setIsAddCategoryModalOpen(false);
        setSelectedServiceIdsByCat({});
        toast.success(`Added ${categoriesToAdd.length} trade category${categoriesToAdd.length > 1 ? 'ies' : ''}`);
    };

    const handleOpenAddServiceModal = (cat: ProviderCategoryItem) => {
        setServiceModalCategory(cat);
        setSelectedServiceIdsToAdd([]);
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

        const newServices: ProviderServiceItem[] = [];

        availableServicesForCurrentCat.forEach((s) => {
            if (selectedServiceIdsToAdd.includes(s.id)) {
                newServices.push({ id: s.id, name: s.name });
            }
        });

        if (newServices.length === 0) {
            toast.warning('Please select at least one service');
            return;
        }

        setMyCategories((prev) =>
            prev.map((c) =>
                c.id === serviceModalCategory.id
                    ? { ...c, services: [...c.services, ...newServices] }
                    : c
            )
        );

        setServiceModalCategory(null);
        setSelectedServiceIdsToAdd([]);
        toast.success('Services added successfully');
    };

    const handleRemoveService = (categoryId: string, serviceId: string) => {
        setMyCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? { ...c, services: c.services.filter((s) => s.id !== serviceId) }
                    : c
            )
        );
        toast.info('Service removed');
    };

    const handleConfirmRemoveCategory = () => {
        if (!categoryToDelete) return;

        setMyCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
        toast.info(`Removed ${categoryToDelete.name} category`);
        setCategoryToDelete(null);
    };

    const handleSave = () => {
        const totalServices = myCategories.reduce((acc, c) => acc + c.services.length, 0);
        if (myCategories.length === 0 || totalServices === 0) {
            toast.warning('Please add at least one category and service');
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Trade and services saved successfully');
        }, 500);
    };

    return (
        <>
            <SpinnerOverlay isLoading={getCategories.isPending || isSaving} />

            <div className="card p-6 fade-in">
                <div className="flex justify-between items-center mb-6 pb-4 border-bottom flex-wrap gap-3">
                    <div>
                        <h2 className="h5 mb-1 font-bold">My Trade &amp; Services</h2>
                        <p className="text-xs text-secondary mb-0">
                            Customize your specialized trade categories and the services you provide.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenAddCategoryModal}
                        disabled={availableCatalogCategories.length === 0}
                        className="btn btn-primary btn-sm"
                    >
                        <i className="fas fa-plus mr-1.5"></i> Add Trade Category
                    </button>
                </div>

                {myCategories.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-xl my-4" style={{ borderColor: 'var(--border)' }}>
                        <i className="fas fa-tools text-2xl text-secondary mb-2 opacity-50 block"></i>
                        <p className="font-semibold text-text text-sm mb-1">No Trade Categories Added</p>
                        <p className="text-xs text-secondary mb-4">
                            You have not selected any trade categories yet.
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenAddCategoryModal}
                            disabled={availableCatalogCategories.length === 0}
                            className="btn btn-outline btn-xs"
                        >
                            <i className="fas fa-plus mr-1"></i> Add Category
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 my-2">
                        {myCategories.map((category) => (
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
                                            <span className="font-bold text-sm text-text capitalize">
                                                {category.name}
                                            </span>
                                            <span className="text-xs text-secondary ml-2">
                                                ({category.services.length} services)
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
                                            className="btn btn-outline text-danger btn-xs"
                                            title="Remove Category"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-0">
                                    {category.services.length === 0 ? (
                                        <div className="text-center py-6 text-xs text-secondary">
                                            No services added to this category yet. Click &quot;+ Add Service&quot; above.
                                        </div>
                                    ) : (
                                        <div className="divide-y" style={{ borderColor: 'var(--border-light, var(--border))' }}>
                                            {category.services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    className="flex justify-between items-center px-5 py-3 hover:bg-surface-elevated transition-colors"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <i className="fas fa-check-circle text-xs text-primary"></i>
                                                        <span className="font-medium text-xs text-text">
                                                            {service.name}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveService(category.id, service.id)}
                                                        className="text-secondary hover:text-danger text-xs p-1 transition-colors cursor-pointer"
                                                        title="Remove Service"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end pt-5 mt-4 border-top">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary btn-sm"
                    >
                        {isSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-1"></i> Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-1"></i> Save Changes
                            </>
                        )}
                    </button>
                </div>
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
                            {availableCatalogCategories.length === 0 ? (
                                <div className="text-center py-8 text-xs text-secondary">
                                    <i className="fas fa-check-circle text-2xl text-primary mb-2 block opacity-70"></i>
                                    All available trade categories are already added to your profile.
                                </div>
                            ) : (
                                availableCatalogCategories.map((category) => {
                                    const selectedForThisCat = selectedServiceIdsByCat[category.id] || [];
                                    const allCategoryServices = category.services || [];
                                    const isAllSelected =
                                        allCategoryServices.length > 0 &&
                                        selectedForThisCat.length === allCategoryServices.length;

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
                                                    {selectedForThisCat.length > 0 && (
                                                        <span className="text-xs text-primary font-semibold">
                                                            ({selectedForThisCat.length} selected)
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleAllForCategory(category)}
                                                    className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-0 p-0 font-medium"
                                                >
                                                    {isAllSelected ? 'Deselect All' : 'Select All'}
                                                </button>
                                            </div>

                                            <div className="p-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                                                <div className="modern-chips-wrapper" style={{ justifyContent: 'flex-start' }}>
                                                    {allCategoryServices.map((service) => {
                                                        const isChecked = selectedForThisCat.includes(service.id);
                                                        return (
                                                            <label key={service.id} className="modern-service-chip">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleServiceInModal(category.id, service.id)}
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
                                {totalSelectedServicesToAdd} service{totalSelectedServicesToAdd !== 1 ? 's' : ''} selected
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
                                    disabled={totalSelectedServicesToAdd === 0}
                                    className="btn btn-primary btn-sm"
                                >
                                    Add Categories
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
                                disabled={selectedServiceIdsToAdd.length === 0}
                                className="btn btn-primary btn-sm"
                            >
                                Add Services
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
                                className="btn btn-outline btn-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRemoveCategory}
                                className="btn btn-danger btn-sm"
                                style={{ backgroundColor: '#ef4444', color: '#ffffff', borderColor: '#ef4444' }}
                            >
                                Remove Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
