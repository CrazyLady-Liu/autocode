import { useActivityStore } from '../../store/useActivityStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Calendar,
} from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  color: string;
}

const MetricCard = ({ icon, label, value, trend, color }: MetricCardProps) => (
  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

export const DataOverview = () => {
  const { selectedActivity } = useActivityStore();

  if (!selectedActivity) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
        <div className="text-center">
          <Activity size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">请选择一个活动查看数据</p>
        </div>
      </div>
    );
  }

  const { metrics } = selectedActivity;

  const hasData = metrics.dailyTrend.length > 0 && metrics.channelData.length > 0;

  if (!hasData) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="p-3 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-semibold text-gray-800">数据概览</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Calendar size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">活动暂未开始，暂无数据</p>
          </div>
        </div>
      </div>
    );
  }

  const formatPercent = (value: number) => (value * 100).toFixed(2) + '%';

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-3 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-gray-800">数据概览</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{selectedActivity.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard
            icon={<Eye size={16} className="text-white" />}
            label="曝光量(PV)"
            value={metrics.pv.toLocaleString()}
            trend={12.5}
            color="bg-blue-500"
          />
          <MetricCard
            icon={<Users size={16} className="text-white" />}
            label="访客数(UV)"
            value={metrics.uv.toLocaleString()}
            trend={8.3}
            color="bg-[#1E3A5F]"
          />
          <MetricCard
            icon={<Target size={16} className="text-white" />}
            label="参与人数"
            value={metrics.participateCount.toLocaleString()}
            trend={15.2}
            color="bg-[#2DD4BF]"
          />
          <MetricCard
            icon={<TrendingUp size={16} className="text-white" />}
            label="转化率"
            value={formatPercent(metrics.conversionRate)}
            trend={-2.1}
            color="bg-orange-500"
          />
          <MetricCard
            icon={<DollarSign size={16} className="text-white" />}
            label="投入成本"
            value={'¥' + metrics.cost.toLocaleString()}
            color="bg-purple-500"
          />
          <MetricCard
            icon={<TrendingUp size={16} className="text-white" />}
            label="ROI"
            value={metrics.roi}
            trend={5.8}
            color="bg-green-500"
          />
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-3">7日趋势</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => value >= 10000 ? (value / 10000).toFixed(0) + 'w' : value}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="pv"
                  name="PV"
                  stroke="#1E3A5F"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="uv"
                  name="UV"
                  stroke="#2DD4BF"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  name="转化"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <h4 className="text-xs font-medium text-gray-700 mb-3">渠道对比</h4>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="channel"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => value >= 10000 ? (value / 10000).toFixed(0) + 'w' : value}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="pv" name="PV" fill="#1E3A5F" radius={[2, 2, 0, 0]} />
                <Bar dataKey="uv" name="UV" fill="#2DD4BF" radius={[2, 2, 0, 0]} />
                <Bar dataKey="conversion" name="转化" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
