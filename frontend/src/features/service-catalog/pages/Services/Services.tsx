import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminPageHeader } from "../../../admin/components/AdminPageHeader";
import { AdminTable, type TableColumn } from "../../../admin/components/AdminTable";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import { AddServiceModal } from "../../components/AddServiceModal";
import { useGetCategoriesService } from "../../hooks/useCategory";
import { useGetServices, useAddServiceMut, useUpdateServiceMut, useDeleteServiceMut } from "../../hooks/useService";
import { useServiceFormData } from "../../hooks/useServiceFormData";
import { toast } from 'react-hot-toast';
import { SpinnerOverlay } from "../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay";
import { ConfirmModal } from "../../../../shared/components/ui/ConfirmModal/ConfirmModal";

interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string | null;
  updated_at: string;
  category?: { id: string; name: string };
}

export default function Services() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  const getCategories = useGetCategoriesService();
  const getServicesMut = useGetServices();
  const addService = useAddServiceMut();
  const updateService = useUpdateServiceMut();
  const deleteService = useDeleteServiceMut();
  const getFormData = useServiceFormData();

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getCategories.mutate({ page: 1, limit: 100, search: "", filter: "ACTIVE" }, {
      onSuccess: (res) => {
        if (res?.data?.categories) {
          setCategories(res.data.categories);
        }
      }
    });
  }, []);

  const getServicesFn = useCallback(() => {
    getServicesMut.mutate({ page, limit: 10, search, filter }, {
      onSuccess: (res) => {
        if (res?.data?.services) {
          setServices(res.data.services);
          setTotalPages(res.data.totalPages || 1);
        }
      }
    });
  }, [page, search, filter]);

  useEffect(() => {
    getServicesFn();
  }, [page, search, filter]);

  const handleAddService = useCallback(async (data: { name: string; categoryId: string; categoryName: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => {
    const formData = getFormData(data.name, data.categoryId, data.description, data.status, data.imageFile);
    await addService.mutateAsync(formData, {
      onSuccess: (res) => {
        setServices((prev) => [res.data, ...prev]);
        toast.success(res.message);
        setIsAddModalOpen(false);
      }
    });
  }, [addService, getFormData]);

  const handleEditService = useCallback(async (data: { name: string; categoryId: string; categoryName: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => {
    if (!editingService) return;
    const formData = getFormData(data.name, data.categoryId, data.description, data.status, data.imageFile);
    await updateService.mutateAsync({ id: editingService.id, data: formData }, {
      onSuccess: (res) => {
        setServices(prev => {
          const filtered = prev.filter(s => s.id !== res.data.id);
          return [res.data, ...filtered];
        });
        setIsAddModalOpen(false);
        setEditingService(null);
        toast.success(res.message);
      }
    });
  }, [editingService, getFormData, updateService]);

  const confirmDelete = useCallback(async () => {
    if (!serviceToDelete) return;
    await deleteService.mutateAsync(serviceToDelete.id, {
      onSuccess: (res) => {
        setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));
        setServiceToDelete(null);
        toast.success(res.message || "Service deleted successfully");
        if (services.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          getServicesFn();
        }
      }
    });
  }, [serviceToDelete, deleteService, services.length, page, getServicesFn]);

  const handleReset = useCallback(() => {
    setSearch("");
    setFilter("");
    setPage(1);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setEditingService(null);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setServiceToDelete(null);
  }, []);

  const keyExtractor = useCallback((item: Service) => item.id, []);

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const modalInitialData = useMemo(() => {
    if (!editingService) return null;
    return {
      id: editingService.id,
      categoryId: editingService.category_id,
      name: editingService.name,
      description: editingService.description,
      status: editingService.status,
      image: editingService.image
    };
  }, [editingService]);

  const columns: TableColumn<Service>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Service Name',
      width: '25%',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-tools text-secondary text-lg"></i>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-text">{item.name}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      width: '15%',
      render: (item) => (
        <span className="text-sm">
          {item.category?.name || categoryNameMap.get(item.category_id) || 'Unknown'}
        </span>
      )
    },
    {
      key: 'description',
      header: 'Description',
      width: '20%',
      render: (item) => <div className="truncate max-w-[200px] text-sm">{item.description}</div>
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      render: (item) => (
        <span className={`badge ${item.status === 'ACTIVE' ? 'badge-verified' : 'badge-danger-alert'}`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      width: '15%',
      render: (item) => <div className="text-sm">{new Date(item.updated_at).toLocaleDateString()}</div>
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '10%',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-secondary text-xs py-1 px-2"
            onClick={() => setEditingService(item)}
          >
            Edit
          </button>
          <button 
            className="btn btn-danger text-xs py-1 px-2"
            onClick={() => setServiceToDelete(item)}
          >
            Delete
          </button>
        </div>
      )
    }
  ], [categoryNameMap]);

  return (
    <div className="app-content">
      {addService.isPending || updateService.isPending || deleteService.isPending ? <SpinnerOverlay isLoading={true} /> : null}
      
      <AdminPageHeader 
        title="Service Management" 
        description="Manage individual services offered under each category."
        actionButton={{
          label: "Add Service",
          icon: "fas fa-plus",
          onClick: handleOpenAddModal
        }}
      />

      <div className="admin-filter-bar mb-6">
        <div className="admin-search-input">
          <i className="fas fa-search"></i>
          <input 
            value={search}
            onChange={(e)=>{
              setSearch(e.target.value);
              setPage(1);
            }}
            type="text" 
            placeholder="Search services..." 
          />
        </div>

        <div className="admin-filters-group">
          <select
            value={filter}
            onChange={(e)=>{
              setFilter(e.target.value);
              setPage(1);
            }}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <button className="btn btn-secondary text-xs py-2" onClick={handleReset}>
            <i className="fas fa-undo mr-1"></i>Reset
          </button>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={services}
        isLoading={getServicesMut.isPending}
        loadingMessage="Searching for services..."
        keyExtractor={keyExtractor}
        emptyMessage="No services found."
      />

      <AdminPagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AddServiceModal 
        isOpen={isAddModalOpen || !!editingService} 
        initialData={modalInitialData}
        onClose={handleCloseAddModal} 
        onAdd={editingService ? handleEditService : handleAddService} 
        categories={categories}
      />
      
      {serviceToDelete && (
        <ConfirmModal 
          isOpen={!!serviceToDelete} 
          title="Delete Service" 
          message={`Are you sure you want to delete the service "${serviceToDelete.name}"? This action cannot be undone.`} 
          confirmText="Delete" 
          cancelText="Cancel" 
          onConfirm={confirmDelete} 
          onCancel={handleCancelDelete} 
          isDanger={true}
          isLoading={deleteService.isPending}
        />
      )}
    </div>
  );
}
