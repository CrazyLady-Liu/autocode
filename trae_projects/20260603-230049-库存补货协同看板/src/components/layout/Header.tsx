import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, RefreshCw, Settings, ChevronDown } from 'lucide-react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { formatRelativeTime } from '@/utils/formatters';
import { getRiskLevelColor } from '@/utils/riskCalculator';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { alerts, lastUpdate, loadData } = useInventoryStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const newAlerts = alerts.filter(a => a.status === 'new');
  const criticalAlerts = newAlerts.filter(a => a.level === 'critical');

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索 SKU、仓库、供应商..."
            className="w-80 h-9 pl-10 pr-4 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right mr-4">
          <p className="text-slate-400 text-xs">当前时间</p>
          <p className="text-white text-sm font-mono">
            {currentTime.toLocaleString('zh-CN')}
          </p>
        </div>

        {lastUpdate && (
          <div className="text-right mr-4">
            <p className="text-slate-400 text-xs">数据更新</p>
            <p className="text-emerald-400 text-xs">{formatRelativeTime(lastUpdate)}</p>
          </div>
        )}

        <button
          onClick={() => loadData()}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="刷新数据"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        <button
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {newAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {newAlerts.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-white font-medium">告警通知</h3>
                  <span className="text-xs text-slate-400">{newAlerts.length} 条新告警</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {newAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: getRiskLevelColor(alert.level) }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {alert.skuName}
                          </p>
                          <p className="text-slate-400 text-xs truncate">
                            {alert.description}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            {formatRelativeTime(alert.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {criticalAlerts.length > 0 && (
                    <div className="p-3 bg-red-500/10 border-b border-red-500/20">
                      <p className="text-red-400 text-sm font-medium">
                        ⚠️ {criticalAlerts.length} 条紧急告警需立即处理
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-700">
                  <button className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    查看全部告警
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-white text-sm font-medium">库存管理员</p>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              在线
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
