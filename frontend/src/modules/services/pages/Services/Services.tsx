import { useState } from "react";
import { AdminPageHeader } from "../../../admin/components/AdminPageHeader";
import { AdminTable, type TableColumn } from "../../../admin/components/AdminTable";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import { AddServiceModal } from "../../components/AddServiceModal";

interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string | null;
}

export default function Services() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const totalPages = 1;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dummy data
  const [services, setServices] = useState<Service[]>([
    { id: '1', categoryId: '1', categoryName: 'Plumbing', name: 'Pipe Leak Repair', status: 'ACTIVE', image: null },
    { id: '2', categoryId: '2', categoryName: 'Electrical', name: 'Wiring Installation', status: 'ACTIVE', image: null },
  ]);

  const handleAddService = (data: { name: string; categoryId: string; categoryName: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => {
    const newService: Service = {
      id: Math.random().toString(36).substring(7),
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      name: data.name,
      status: data.status,
      image: data.imageFile ? URL.createObjectURL(data.imageFile) : null,
    };
    setServices([...services, newService]);
  };

  const columns: TableColumn<Service>[] = [
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
              <i className="fas fa-image text-secondary text-lg"></i>
            )}
          </div>
          <div className="font-medium text-text">{item.name}</div>
        </div>
      )
    },
    {
      key: 'categoryName',
      header: 'Category',
      width: '20%',
      render: (item) => <div>{item.categoryName}</div>
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
      render: () => (
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-xs py-1 px-2">Edit</button>
          <button className="btn btn-danger text-xs py-1 px-2">Delete</button>
        </div>
      )
    }
  ];

  const handleReset = () => {
    setSearch("");
    setFilter("");
    setPage(1);
  };

  return (
    <div className="app-content">
      <AdminPageHeader 
        title="Service Management" 
        description="Manage all sub-services offered under categories."
        actionButton={{
          label: "Add Service",
          icon: "fas fa-plus",
          onClick: () => setIsAddModalOpen(true)
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
        isLoading={false}
        keyExtractor={(item) => item.id}
        emptyMessage="No services found."
      />

      <AdminPagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AddServiceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddService} 
      />
    </div>
  );
}
