import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Warehouses from '@/pages/Warehouses';
import SkuRisk from '@/pages/SkuRisk';
import Replenishment from '@/pages/Replenishment';
import Suppliers from '@/pages/Suppliers';
import Trends from '@/pages/Trends';
import Simulation from '@/pages/Simulation';
import Home from '@/pages/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="sku-risk" element={<SkuRisk />} />
          <Route path="replenishment" element={<Replenishment />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="trends" element={<Trends />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
