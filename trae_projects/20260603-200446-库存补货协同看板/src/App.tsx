import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Simulation } from "@/pages/Simulation";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/settings" element={
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">系统设置</h2>
              <p className="text-gray-500">设置功能开发中...</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}
