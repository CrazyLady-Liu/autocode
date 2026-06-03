import { motion } from 'framer-motion';
import {
  DollarSign,
  AlertTriangle,
  UserX,
  ShoppingCart,
  Bell,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type { KPIData } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof DollarSign> = {
  DollarSign,
  AlertTriangle,
  UserX,
  ShoppingCart,
  Bell,
  Heart,
};

interface KPICardProps {
  data: KPIData;
  index: number;
}

export default function KPICard({ data, index }: KPICardProps) {
  const Icon = iconMap[data.icon] || DollarSign;

  const getTrendIcon = () => {
    if (data.trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (data.trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getTrendColor = () => {
    if (data.label.includes('断货') || data.label.includes('告警') || data.label.includes('无供应商')) {
      return data.trend === 'up' ? 'text-red-400' : 'text-emerald-400';
    }
    return data.trend === 'up' ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700 p-5 group hover:border-slate-600 transition-colors"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${data.color}10 0%, transparent 50%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${data.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: data.color }} />
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={cn('text-sm font-medium', getTrendColor())}>
              {data.change > 0 ? '+' : ''}{data.change}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-slate-400 text-sm">{data.label}</p>
          <motion.p
            key={String(data.value)}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-white font-mono"
          >
            {data.value}
          </motion.p>
        </div>

        <div
          className="absolute bottom-0 left-0 h-1 opacity-50"
          style={{
            width: `${Math.min(100, (Math.abs(data.change) / 10) * 100)}%`,
            backgroundColor: data.color,
          }}
        />
      </div>
    </motion.div>
  );
}
