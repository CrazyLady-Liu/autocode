import type { Order, OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; class: string }> = {
  pending: { label: "待处理", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  shipped: { label: "已发货", class: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  in_transit: { label: "运输中", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  delivered: { label: "已送达", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "已取消", class: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
};

interface OrderTableProps {
  orders: Order[];
  onRowClick: (order: Order) => void;
  selectedOrderId?: string;
}

export default function OrderTable({ orders, onRowClick, selectedOrderId }: OrderTableProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">订单号</th>
              <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">客户</th>
              <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">商品</th>
              <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">金额</th>
              <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">状态</th>
              <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">预计送达</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onRowClick(order)}
                className={`border-b border-white/5 cursor-pointer transition-colors hover:bg-white/10 ${
                  selectedOrderId === order.id ? "bg-white/10" : ""
                }`}
              >
                <td className="py-4 px-6">
                  <span className="font-mono text-sm text-sky-400">{order.orderNumber}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-white font-medium">{order.customerName}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-white/80">{order.product}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-white font-semibold">¥{order.amount.toLocaleString()}</span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      statusConfig[order.status].class
                    }`}
                  >
                    {statusConfig[order.status].label}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-white/60 text-sm">{order.estimatedDelivery}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
