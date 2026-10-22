import { useEffect, useState, useMemo, useCallback } from "react";
import { AdminPageHeader } from "../../../admin/components/AdminPageHeader";
import { AdminTable, type TableColumn } from "../../../admin/components/AdminTable";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import { AddCategoryModal } from "../../components/AddCategoryModal";
import { useAddCategoryService, useGetCategoriesService, useUpdateCategoryService, useDeleteCategoryService } from "../../hooks/useCategory";
import { toast } from "react-toastify";
import { SpinnerOverlay } from "../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay";
import { ConfirmModal } from "../../../../shared/components/ui/ConfirmModal/ConfirmModal";
import { useCategoryFormData } from "../../hooks/useCategoryFormData";


interface Category {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string | null;
  updated_at:string,
  created_at:string,
  services: any[];
}

export default function Categories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const addCategory = useAddCategoryService();
  const updateCategory = useUpdateCategoryService();
  const deleteCategory = useDeleteCategoryService();
  const getCategories = useGetCategoriesService();
  const getFormData = useCategoryFormData();

  const [categories, setCategories] = useState<Category[]>([]);

  const getCategoriesFn = useCallback(() => {
    getCategories.mutate({ page, limit: 10, search, filter }, {
      onSuccess: (res) => {
        if (res?.data?.categories) {
          setCategories(res.data.categories);
          setTotalPages(res.data.totalPages || 1);
        }
      }
    });
  }, [page, search, filter]);
  
  useEffect(() => {
    getCategoriesFn();
  }, [page, search, filter]);

  const handleAddCategory = useCallback(async (data: { name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => {
    const formData = getFormData(data.name, data.description, data.status, data.imageFile);

    await addCategory.mutateAsync(formData, {
      onSuccess: (res) => {
        setCategories((prev) => [res.data, ...prev]);
        toast.success(res.message);
        setIsAddModalOpen(false);
      }
    });
  }, [addCategory, getFormData]);

  const handleEditCategory = useCallback(async (data: { name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => {
    if (!editingCategory) return;
    const formData = getFormData(data.name, data.description, data.status, data.imageFile);

    await updateCategory.mutateAsync({ id: editingCategory.id, formData }, {
      onSuccess: (res) => {
        setCategories((prev) => {
          const filtered = prev.filter((c) => c.id !== res.data.id);
          return [res.data, ...filtered];
        });
        setIsAddModalOpen(false);
        toast.success(res.message);
      }
    });
    setEditingCategory(null);
  }, [editingCategory, getFormData, updateCategory]);

  const confirmDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    await deleteCategory.mutateAsync(categoryToDelete.id, {
      onSuccess: (res) => {
        setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
        setCategoryToDelete(null);
        toast.success(res.message || "Category deleted successfully");
        if (categories.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          getCategoriesFn();
        }
      }
    });
  }, [categoryToDelete, deleteCategory, categories.length, page, getCategoriesFn]);

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
    setEditingCategory(null);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setCategoryToDelete(null);
  }, []);

  const keyExtractor = useCallback((item: Category) => item.id, []);

  const columns: TableColumn<Category>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Category Name',
      width: '25%',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-image text-secondary text-lg"></i>
            )}
          </div>
          <div className="font-medium text-text">{item.name}</div>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      width: '25%',
      render: (item) => <div className="truncate max-w-xs">{item.description}</div>
    },
    {
      key: 'services',
      header: 'Services',
      width: '10%',
      render: (item) => (
        <div>{item.services?.length ? item.services.length : 'N/A'}</div>
      )
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      width: '15%',
      render: (item) => <div>{new Date(item.updated_at).toLocaleDateString()}</div>
    },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      render: (item) => (
        <span className={`badge ${item.status === 'ACTIVE' ? 'badge-verified' : 'badge-danger-alert'}`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '15%',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-secondary text-xs py-1 px-2"
            onClick={() => setEditingCategory(item)}
          >
            Edit
          </button>
          <button 
            className="btn btn-danger text-xs py-1 px-2"
            onClick={() => setCategoryToDelete(item)}
          >
            Delete
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="app-content">
       {addCategory.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
       {updateCategory.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
       {deleteCategory.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
      <AdminPageHeader 
        title="Category Management" 
        description="Manage all service categories available on the platform."
        actionButton={{
          label: "Add Category",
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
            placeholder="Search categories..." 
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
        data={categories}
        isLoading={getCategories.isPending}
        loadingMessage="Searching for categories..."
        keyExtractor={keyExtractor}
        emptyMessage="No categories found."
      />

      <AdminPagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AddCategoryModal 
        isOpen={isAddModalOpen || !!editingCategory} 
        initialData={editingCategory}
        onClose={handleCloseAddModal} 
        onAdd={editingCategory ? handleEditCategory : handleAddCategory} 
      />

      {categoryToDelete && (
        <ConfirmModal 
          isOpen={!!categoryToDelete} 
          title="Delete Category" 
          message={`Are you sure you want to delete the category "${categoryToDelete.name}"? This action cannot be undone.`} 
          confirmText="Delete" 
          cancelText="Cancel" 
          onConfirm={confirmDelete} 
          onCancel={handleCancelDelete} 
          isDanger={true}
          isLoading={deleteCategory.isPending}
        />
      )}
    </div>
  );
}
