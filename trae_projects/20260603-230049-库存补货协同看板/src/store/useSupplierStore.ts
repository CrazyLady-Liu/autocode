import { create } from 'zustand';
import type { Supplier, DeliveryRecord } from '@/types';
import { mockSuppliers, mockDeliveryRecords } from '@/data/mockSuppliers';

interface SupplierState {
  suppliers: Supplier[];
  deliveryRecords: DeliveryRecord[];
  selectedSupplierId: string | null;
  isLoading: boolean;
  
  loadData: () => void;
  setSelectedSupplier: (id: string | null) => void;
  getSupplierById: (id: string) => Supplier | undefined;
  getRecordsBySupplier: (supplierId: string) => DeliveryRecord[];
  getTopSuppliers: (limit: number) => Supplier[];
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  deliveryRecords: [],
  selectedSupplierId: null,
  isLoading: true,

  loadData: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        suppliers: mockSuppliers,
        deliveryRecords: mockDeliveryRecords,
        isLoading: false,
      });
    }, 300);
  },

  setSelectedSupplier: (id) => set({ selectedSupplierId: id }),

  getSupplierById: (id) => {
    return get().suppliers.find(s => s.id === id);
  },

  getRecordsBySupplier: (supplierId) => {
    return get().deliveryRecords.filter(r => r.supplierId === supplierId);
  },

  getTopSuppliers: (limit = 5) => {
    return [...get().suppliers]
      .filter(s => s.status === 'active')
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.onTimeRate - a.onTimeRate;
      })
      .slice(0, limit);
  },
}));
