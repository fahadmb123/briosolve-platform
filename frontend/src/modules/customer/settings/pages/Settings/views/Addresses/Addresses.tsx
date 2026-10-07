import { useEffect, useState } from 'react';
import { AddAddressModal } from '../../../../components/Addresses/AddAddressModal';

import { type AddressPayload } from '../../../../schemas/validation';
import { useAddAddress, useGetAddresses } from '../../../../hooks/mutations/address';
import { toast } from 'react-toastify';

export const Addresses = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addresses, setAddresses] = useState<AddressPayload[]>([])
  const addAddress = useAddAddress()
  const getAddresses = useGetAddresses()


  useEffect(()=>{
    (()=>{
      getAddresses.mutate(undefined,{
        onSuccess:(response)=>{
          setAddresses(response.data.addresses as [])
        }
      })
    })()
  }, [])

  const handleSaveAddress = async (payload: AddressPayload) => {
    await addAddress.mutate(payload,{
      onSuccess:(response)=>{
        toast.success(response.message)
      }
    })
    
    
  };

  const getIconForType = (type: string) => {
    if (type.toLowerCase() === 'home') return 'home';
    if (type.toLowerCase() === 'work') return 'corporate_fare';
    return 'location_on';
  };

  return (
    <>
      <div className="bg-surface-container-low border border-surface-variant rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
        {/* Header & Top Action */}
        <div className="flex flex-row items-center justify-between w-full text-left border-b border-surface-variant pb-6">
          <div className="text-left">
            <h2 className="font-headline-lg text-headline-lg text-on-surface m-0 text-left">Addresses</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 mb-0 text-left">Manage your shipping and billing locations for timely deliveries and dispatches.</p>
          </div>
          <div className="flex items-center shrink-0 ml-4">
            <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm border border-surface-variant whitespace-nowrap">
              {addresses.length} Saved Location{addresses.length !== 1 && 's'}
            </span>
          </div>
        </div>

        {/* Search & Actions Ribbon */}
        <div className="flex flex-row items-center justify-between w-full gap-4 pt-2">
          {/* Quick Search Field (Left) */}
          <div className="relative w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
            <input className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Search saved addresses..." type="text"/>
          </div>

          {/* Add New Address Button (Right) */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-6 rounded-xl bg-primary hover:opacity-90 text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer shrink-0 border-none"
          >
            <span className="material-symbols-outlined text-lg font-bold">add</span>
            <span>Add New Address</span>
          </button>
        </div>

        {/* Address Cards List */}
        <div className="flex flex-col gap-4">
          
          {getAddresses.isPending ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-3 border-2 border-dashed border-surface-variant rounded-xl">
              <p className="font-body-md m-0">Searching for address...</p>
            </div>
          ) : (
            <>
              {addresses.map((address) => (
                <div key={address.id} className={`bg-surface-container rounded-xl border ${address.isDefault ? 'border-primary/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.45)]' : 'border-surface-variant shadow-md'} p-5 relative overflow-hidden transition-all hover:border-primary/60 flex flex-col justify-between gap-4`}>
              {address.isDefault && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>}
              
              {/* Top Row: Info & Top Actions */}
              <div className="flex items-start justify-between w-full pl-2 gap-4">
                <div className="flex items-start gap-4 w-full">
                  <div className={`w-10 h-10 rounded-lg ${address.isDefault ? 'bg-primary/10 border border-primary/30 text-primary' : 'bg-surface-container-high border border-surface-variant text-on-surface-variant'} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-xl" style={address.isDefault ? { fontVariationSettings: "'FILL' 1" } : {}}>{getIconForType(address.type)}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight m-0">{address.type}</h3>
                      {address.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/40 text-primary font-label-sm text-[11px] font-bold tracking-wide uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface font-medium m-0">{address.houseNo}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant m-0">{[address.area, address.city, address.district, address.state, address.country].filter(Boolean).join(", ")} — {address.pincode}</p>
                    
                    {address.landmark && (
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1">
                        <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">info</span>
                          <span className="text-on-surface-variant/80">{address.landmark}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Top Right Edit Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-surface-variant text-primary font-label-sm text-label-sm font-medium transition-colors flex items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  {!address.isDefault && (
                    <button className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-surface-variant text-error transition-colors cursor-pointer flex items-center" title="Delete Address">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-end justify-between w-full pl-2 mt-2">
                {address.isDefault ? (
                  <span className="text-[11px] text-primary font-medium">Primary shipping destination</span>
                ) : (
                  <span className="text-[11px] text-on-surface-variant"></span>
                )}
                {!address.isDefault ? (
                  <button className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm transition-colors cursor-pointer bg-transparent">
                    Set as Default
                  </button>
                ) : (
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-surface-variant text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer">
                    Preferences
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Dashed Interactive Add Slot */}
          <div 
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-surface-variant hover:border-primary/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-surface-container/30 group mt-2"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-highest group-hover:bg-primary/20 text-on-surface-variant group-hover:text-primary flex items-center justify-center transition-colors mb-3">
              <span className="material-symbols-outlined text-2xl">add_location_alt</span>
            </div>
            <h4 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors m-0">Add New Address</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm m-0">Set up a new location for instant delivery, bulk dispatches, or regional pickup centers.</p>
          </div>
          </>
          )}

          {/* Pagination Container (Bottom Right) */}
          <div className="flex justify-end pt-4 mt-2 border-t border-surface-variant">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center border border-surface-variant transition-colors cursor-not-allowed opacity-50" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-label-md font-semibold cursor-pointer border-none">
                1
              </button>
              <button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center border border-surface-variant transition-colors cursor-not-allowed opacity-50" disabled>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddAddressModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveAddress}
      />
    </>
  );
};
