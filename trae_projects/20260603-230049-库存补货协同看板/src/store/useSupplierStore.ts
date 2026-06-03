import { create } from 'zustand';
import type { Supplier, DeliveryRecord, CommunicationRecord, ExpectedArrival } from '@/types';
import { mockSuppliers, mockDeliveryRecords } from '@/data/mockSuppliers';
import { mockCommunications, mockExpectedArrivals } from '@/data/mockSupplierCollab';

interface SupplierState {
  suppliers: Supplier[];
  deliveryRecords: DeliveryRecord[];
  communications: CommunicationRecord[];
  expectedArrivals: ExpectedArrival[];
  selectedSupplierId: string | null;
  isLoading: boolean;
  
  loadData: () => void;
  setSelectedSupplier: (id: string | null) => void;
  getSupplierById: (id: string) => Supplier | undefined;
  getRecordsBySupplier: (supplierId: string) => DeliveryRecord[];
  getTopSuppliers: (limit: number) => Supplier[];
  getCommunicationsBySupplier: (supplierId: string) => CommunicationRecord[];
  getPendingCommunications: () => CommunicationRecord[];
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  deliveryRecords: [],
  communications: [],
  expectedArrivals: [],
  selectedSupplierId: null,
  isLoading: true,

  loadData: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        suppliers: mockSuppliers,
        deliveryRecords: mockDeliveryRecords,
        communications: mockCommunications,
        expectedArrivals: mockExpectedArrivals,
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

  getCommunicationsBySupplier: (supplierId) => {
    return get().communications.filter(c => c.supplierId === supplierId);
  },

  getPendingCommunications: () => {
    return get().communications.filter(c => c.status === 'pending' || c.status === 'followup');
  },
}));
