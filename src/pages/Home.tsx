import { useState } from "react";
import StatsGrid from "@/components/StatsGrid";
import OrderTable from "@/components/OrderTable";
import TrackingDrawer from "@/components/TrackingDrawer";
import { mockOrders, mockStats } from "@/data/mockOrders";
import type { Order } from "@/types/order";

export default function Home() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="fixed inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-violet/5 pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.15) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">订单跟踪仪表盘</h1>
              <p className="text-white/50 mt-2">实时监控所有订单的物流状态</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70">
                <span className="text-emerald-400 mr-2">●</span>
                实时同步
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <StatsGrid stats={mockStats} />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">订单列表</h2>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span>点击任意行查看物流详情</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        <OrderTable
          orders={mockOrders}
          onRowClick={handleRowClick}
          selectedOrderId={selectedOrder?.id}
        />

        <div className="mt-8 text-center text-white/30 text-sm">
          数据每 30 秒自动刷新 · 最后更新: {new Date().toLocaleTimeString("zh-CN")}
        </div>
      </div>

      <TrackingDrawer order={selectedOrder} onClose={handleCloseDrawer} />
    </div>
  );
}
