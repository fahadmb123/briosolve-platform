
export interface Service {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  services: Service[];
}

interface ServiceSelectionProps {
  categories: Category[];
  selectedServices: string[];
  toggleService: (id: string) => void;
  serviceError?: string;
}

export default function ServiceSelection({
  categories,
  selectedServices,
  toggleService,
  serviceError,
}: ServiceSelectionProps) {
  return (
    <div className="space-y-6">
      {serviceError && (
        <p className="text-sm text-red-600 font-medium">{serviceError}</p>
      )}
      {categories
        .filter((c) => c.services?.length > 0)
        .map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div
              className="px-4 py-3 border-b border-gray-200 flex items-center gap-2"
              style={{ background: 'var(--surface)' }}
            >
              <i className="fas fa-layer-group text-primary text-sm" />
              <span className="text-sm font-semibold capitalize">{category.name}</span>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {category.services.map((service) => {
                  const selected = selectedServices.includes(service.id);
                  return (
                    <label
                      key={service.id}
                      className={`inline-flex items-center cursor-pointer px-3 py-1.5 rounded-full border transition-colors ${
                        selected
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleService(service.id)}
                    >
                      {selected && (
                        <i className="fas fa-check mr-1 text-xs" aria-hidden="true"></i>
                      )}
                      <span className="text-sm">{service.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
