import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardHeader } from '../ui/Card';
import { StockTrend } from '../../data/types';

interface TrendChartProps {
  data: StockTrend[];
}

type ChartType = 'line' | 'area';

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('area');

  const formattedData = data.map((item) => ({
    ...item,
    date: item.date.slice(5),
  }));

  return (
    <Card hover={false} className="col-span-2">
      <CardHeader 
        title="库存趋势概览" 
        subtitle="近30天库存变化趋势"
        action={
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                chartType === 'area'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              面积图
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              折线图
            </button>
          </div>
        }
      />

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOutOfStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="totalStock"
                name="总库存量"
                stroke="#3B82F6"
                fill="url(#colorStock)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="outOfStockCount"
                name="缺货数量"
                stroke="#EF4444"
                fill="url(#colorOutOfStock)"
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="totalStock"
                name="总库存量"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="outOfStockCount"
                name="缺货数量"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="restockCount"
                name="补货数量"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrendChart;
