import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'green' | 'red' | 'amber';
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  red: 'bg-red-100 text-red-600',
  amber: 'bg-amber-100 text-amber-600',
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'blue',
}) => {
  return (
    <Card hover={false} className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">{Math.abs(trend)}%</span>
              {trendLabel && (
                <span className="text-gray-500 ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default KPICard;
