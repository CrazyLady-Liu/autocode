import type { Order } from "@/types/order";
import { useEffect, useState } from "react";

interface TrackingDrawerProps {
  order: Order | null;
  onClose: () => void;
}

export default function TrackingDrawer({ order, onClose }: TrackingDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (order) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [order]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-surface border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">物流跟踪</h2>
              <p className="text-sm text-white/50 font-mono mt-1">{order.orderNumber}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">商品</p>
                <p className="text-white font-medium">{order.product}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">金额</p>
                <p className="text-white font-semibold">¥{order.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">客户</p>
                <p className="text-white">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">下单日期</p>
                <p className="text-white">{order.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-6">物流轨迹</p>
            <div className="relative">
              {order.trackingEvents.map((event, index) => {
                const isLatest = index === order.trackingEvents.length - 1;
                return (
                  <div key={event.id} className="relative flex gap-4 pb-8">
                    {index < order.trackingEvents.length - 1 && (
                      <div
                        className={`absolute left-2.5 top-6 w-px h-full ${
                          isLatest ? "bg-emerald-500/30" : "bg-white/10"
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isLatest
                          ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                          : "bg-white/20"
                      }`}
                    >
                      {isLatest && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isLatest ? "text-emerald-400" : "text-white"}`}>
                        {event.status}
                      </p>
                      <p className="text-sm text-white/60 mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </span>
                        <span>{event.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
