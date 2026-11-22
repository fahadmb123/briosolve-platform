import { useEffect, useState, useRef, useCallback } from 'react';
import { AddAddressModal, AddressCardSkeleton, AddressCardSkeletonGrid, type AddressPayload, useAddAddress, useDeleteAddress, useEditAddress, useGetAddresses, useSetDefaultAddress } from '../../../../../addresses';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../../../auth/stores/auth.store';
import { ConfirmModal } from '../../../../../../shared/components/ui/ConfirmModal/ConfirmModal';


export const Addresses = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addressToEdit, setAddressToEdit] = useState<AddressPayload | null>(null)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<AddressPayload[]>([])
  const deleteAddress = useDeleteAddress()
  const addAddress = useAddAddress()
  const setDefaultAddress = useSetDefaultAddress()
  const editAddress = useEditAddress()
  const user = useAuthStore.getState().user
  const fetchUser = useAuthStore.getState().fetchUser

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [limit] = useState(5)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const isLoadingMoreRef = useRef(false)
  const fetchStartTimeRef = useRef(0)

  const { data: addressesRes, isLoading, isFetching } = useGetAddresses({
    page,
    search: search.trim(),
    limit,
  })

  const isFetchingRef = useRef(isFetching)
  isFetchingRef.current = isFetching
  const hasMore = page < totalPages
  const hasMoreRef = useRef(hasMore)
  hasMoreRef.current = hasMore
  const cooldownUntilRef = useRef<number>(0)
  const lastScrollYRef = useRef<number>(0)

  const triggerLoadMore = useCallback(() => {
    if (
      !hasMoreRef.current ||
      isFetchingRef.current ||
      isLoadingMoreRef.current ||
      Date.now() < cooldownUntilRef.current
    ) {
      return
    }

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const rect = sentinel.getBoundingClientRect()
    if (rect.top <= window.innerHeight + 150) {
      isLoadingMoreRef.current = true
      setIsLoadingMore(true)
      fetchStartTimeRef.current = Date.now()
      setPage((prev) => prev + 1)
    }
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 5) {
        triggerLoadMore()
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY - e.touches[0].clientY > 10) {
        triggerLoadMore()
      }
    }

    const handleScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop
      if (currentY > lastScrollYRef.current + 15) {
        triggerLoadMore()
      }
      lastScrollYRef.current = currentY
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [triggerLoadMore])

  useEffect(() => {
    if (addressesRes?.data) {
      const data = addressesRes.data
      isLoadingMoreRef.current = false
      setIsLoadingMore(false)
      lastScrollYRef.current = window.scrollY || document.documentElement.scrollTop
      cooldownUntilRef.current = Date.now() + 300
      const incoming = (data.addresses as AddressPayload[]) || []
      setAddresses((prev) => {
        if (page === 1) return incoming
        const existingIds = new Set(prev.map((a) => a.id))
        const uniqueNew = incoming.filter((a) => !existingIds.has(a.id))
        return [...prev, ...uniqueNew]
      })
      setTotal(data.total)
      setTotalPages(data.totalPages)
    }
  }, [addressesRes, page])

  useEffect(() => {
    setPage(1)
    setIsLoadingMore(false)
    isLoadingMoreRef.current = false
  }, [search])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerLoadMore()
        }
      },
      { rootMargin: '150px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [triggerLoadMore])

  const handleDelete = async () => {
    if (!addressToDelete) return;
    await deleteAddress.mutate(addressToDelete, {
      onSuccess: (res) => {
        setAddresses((prev) => prev.filter((address) => address.id !== addressToDelete))
        setAddressToDelete(null)
        fetchUser()
        toast.success(res.message)
      },
      onError: () => setAddressToDelete(null)
    })
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress.mutate(id, {
      onSuccess: (res) => {
        fetchUser()
        toast.success(res.message)
      }
    })
  }


  const handleSaveAddress = async (payload: AddressPayload) => {
    if (addressToEdit) {
      await editAddress.mutate({ id: addressToEdit.id!, data: payload }, {
        onSuccess: (res) => {
          setAddresses((prev) =>
            prev.map((address) =>
              address.id === res.data.id ? res.data as unknown as AddressPayload : address as unknown as AddressPayload
            )
          )
          toast.success(res.message);
          setIsAddModalOpen(false);
          setAddressToEdit(null);
        }
      })
    } else {
      await addAddress.mutate(payload, {
        onSuccess: (response) => {
          setAddresses((prev) => [response.data as unknown as AddressPayload, ...prev])
          fetchUser()
          toast.success(response.message);
          setIsAddModalOpen(false);
          setAddressToEdit(null);
        }
      })
    }
  };

  const getIconForType = (type: string) => {
    if (type.toLowerCase() === 'home') return 'home';
    if (type.toLowerCase() === 'work') return 'corporate_fare';
    return 'location_on';
  };

  return (
    <>
      <div className="bg-surface-container-low border border-surface-variant rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-row items-center justify-between w-full text-left border-b border-surface-variant pb-6">
          <div className="text-left">
            <h2 className="font-headline-lg text-headline-lg text-on-surface m-0 text-left">Addresses</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 mb-0 text-left">Manage your shipping and billing locations for timely deliveries and dispatches.</p>
          </div>
          <div className="flex items-center shrink-0 ml-4">
            <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm border border-surface-variant whitespace-nowrap min-w-[120px] text-center">
              {isLoading && page === 1 ? (
                <Skeleton width={90} height={14} inline />
              ) : (
                `${addresses.length} Saved Location${total !== 1 ? 's' : ''}`
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between w-full gap-4 pt-2">
          <div className="relative w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
            <input className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              type="text" placeholder="Search for landmark" id="userSearchInput"
            />
          </div>

          <button
            onClick={() => {
              setAddressToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="py-2.5 px-6 rounded-xl bg-primary hover:opacity-90 text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer shrink-0 border-none"
          >
            <span className="material-symbols-outlined text-lg font-bold">add</span>
            <span>Add New Address</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">

          {isLoading && page === 1 ? (
            <AddressCardSkeletonGrid count={3} />
          ) : (
            <>
              {addresses.map((address) => {
                const isDefault = user?.current_address_id?.id === address.id;
                return (
                  <div key={address.id} className={`bg-surface-container rounded-xl border ${isDefault ? 'border-primary/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.45)]' : 'border-surface-variant shadow-md'} p-5 relative overflow-hidden transition-all hover:border-primary/60 flex flex-col justify-between gap-4`}>
                    {isDefault && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>}

                    <div className="flex items-start justify-between w-full pl-2 gap-4">
                      <div className="flex items-start gap-4 w-full">
                        <div className={`w-10 h-10 rounded-lg ${isDefault ? 'bg-primary/10 border border-primary/30 text-primary' : 'bg-surface-container-high border border-surface-variant text-on-surface-variant'} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-xl" style={isDefault ? { fontVariationSettings: "'FILL' 1" } : {}}>{getIconForType(address.type)}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight m-0">{address.type}</h3>
                            {isDefault && (
                              <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/40 text-primary font-label-sm text-[11px] font-bold tracking-wide uppercase">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 mt-0.5">
                            <p className="font-body-md text-body-md text-on-surface m-0">
                              <span className="font-semibold">House No:</span> {address.house_no}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant m-0 leading-relaxed">
                              {address.area && <><span className="font-medium text-on-surface">Area:</span> {address.area}, </>}
                              {address.city && <><span className="font-medium text-on-surface">City:</span> {address.city}, </>}
                              {address.district && <><span className="font-medium text-on-surface">District:</span> {address.district}</>}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant m-0 leading-relaxed">
                              {address.state && <><span className="font-medium text-on-surface">State:</span> {address.state}, </>}
                              {address.country && <><span className="font-medium text-on-surface">Country:</span> {address.country}, </>}
                              <span className="font-medium text-on-surface">Pincode:</span> {address.pincode}
                            </p>
                          </div>

                          {address.landmark && (
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2">
                              <div className="flex items-center gap-2 text-on-surface font-title-sm text-title-sm font-semibold bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                                <span className="material-symbols-outlined text-lg text-primary">flag</span>
                                <span>Landmark: {address.landmark}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setAddressToEdit(address);
                            setIsAddModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-surface-variant text-primary font-label-sm text-label-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Edit</span>
                        </button>
                        {!isDefault && (
                          <button
                            onClick={() => setAddressToDelete(address.id!)}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-surface-variant text-error transition-colors cursor-pointer flex items-center"
                            title="Delete Address"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-between w-full pl-2 mt-2">
                      {isDefault ? (
                        <span className="text-[11px] text-primary font-medium">Primary shipping destination</span>
                      ) : (
                        <span className="text-[11px] text-on-surface-variant"></span>
                      )}
                      {!isDefault ? (
                        <button
                          onClick={() => handleSetDefault(address.id!)}
                          disabled={setDefaultAddress.isPending}
                          className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm transition-colors cursor-pointer bg-transparent disabled:opacity-50"
                        >
                          {setDefaultAddress.isPending ? (
                            <span className="flex items-center gap-1.5">
                              <i className="fas fa-spinner fa-spin text-xs"></i>
                              <span>Setting...</span>
                            </span>
                          ) : (
                            'Set as Default'
                          )}
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-surface-variant text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer">
                          Preferences
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {isLoadingMore &&
                Array.from({ length: 2 }).map((_, idx) => (
                  <AddressCardSkeleton key={`skeleton-${idx}`} />
                ))}

              <div ref={sentinelRef} className="w-full h-5 pointer-events-none opacity-0" />

              {page >= totalPages && addresses.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center py-6 text-center">
                  <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-4 py-2 rounded-full border border-dashed border-surface-variant">
                    You've reached the end of your saved addresses
                  </span>
                </div>
              )}

              {addresses.length === 0 && search !== '' && (
                <div className="text-center py-10 px-4 bg-surface-container rounded-xl border border-surface-variant flex flex-col items-center justify-center">
                  <img
                    src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
                    alt="No data found"
                    style={{ width: '100%', maxWidth: '220px', maxHeight: '150px', objectFit: 'contain', marginBottom: '1rem', filter: 'drop-shadow(0 10px 24px rgba(0, 0, 0, 0.1))' }}
                  />
                  <h4 className="font-title-md text-on-surface font-semibold m-0">No matching addresses found</h4>
                  <p className="font-body-sm text-on-surface-variant mt-1 mb-0 max-w-sm">No saved locations match &ldquo;{search}&rdquo;. Try another search term.</p>
                </div>
              )}

              <div
                onClick={() => {
                  setAddressToEdit(null);
                  setIsAddModalOpen(true);
                }}
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
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddressToEdit(null);
        }}
        onSave={handleSaveAddress}
        initialData={addressToEdit}
        isLoading={addAddress.isPending || editAddress.isPending}
      />
      <ConfirmModal
        isOpen={!!addressToDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleteAddress.isPending}
        onConfirm={handleDelete}
        onCancel={() => setAddressToDelete(null)}
      />
    </>
  );
};
