import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSupplierStore } from '@/store/useSupplierStore';

export default function Layout() {
  const loadInventoryData = useInventoryStore(state => state.loadData);
  const loadSupplierData = useSupplierStore(state => state.loadData);

  useEffect(() => {
    loadInventoryData();
    loadSupplierData();
  }, [loadInventoryData, loadSupplierData]);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-auto p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
