import { useActivityStore } from '../../store/useActivityStore';
import { ACTIVITY_STATUS_MAP } from '../../types/activity';
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
  Play,
  Pause,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
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
  const formatPercent = (value: number) => (value * 100).toFixed(2) + '%';

  const getActivityStatusIcon = () => {
    switch (selectedActivity.status) {
      case 'active': return <Play size={12} />;
      case 'paused': return <Pause size={12} />;
      case 'ended': return <XCircle size={12} />;
      case 'draft': return <FileText size={12} />;
      case 'pending': return <CheckCircle size={12} />;
      default: return <FileText size={12} />;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '未设置';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-800">数据概览</h3>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white ${ACTIVITY_STATUS_MAP[selectedActivity.status].color}`}>
            {getActivityStatusIcon()}
            {ACTIVITY_STATUS_MAP[selectedActivity.status].label}
          </div>
        </div>
        <p className="text-xs text-gray-500 truncate mb-1">{selectedActivity.name}</p>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Clock size={10} />
          <span>{formatDate(selectedActivity.startTime)} - {formatDate(selectedActivity.endTime)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard
            icon={<Eye size={16} className="text-white" />}
            label="曝光量(PV)"
            value={(metrics.pv || 0).toLocaleString()}
            trend={hasData ? 12.5 : undefined}
            color="bg-blue-500"
          />
          <MetricCard
            icon={<Users size={16} className="text-white" />}
            label="访客数(UV)"
            value={(metrics.uv || 0).toLocaleString()}
            trend={hasData ? 8.3 : undefined}
            color="bg-[#1E3A5F]"
          />
          <MetricCard
            icon={<Target size={16} className="text-white" />}
            label="参与人数"
            value={(metrics.participateCount || 0).toLocaleString()}
            trend={hasData ? 15.2 : undefined}
            color="bg-[#2DD4BF]"
          />
          <MetricCard
            icon={<TrendingUp size={16} className="text-white" />}
            label="转化率"
            value={formatPercent(metrics.conversionRate || 0)}
            trend={hasData ? -2.1 : undefined}
            color="bg-orange-500"
          />
          <MetricCard
            icon={<DollarSign size={16} className="text-white" />}
            label="投入成本"
            value={'¥' + (metrics.cost || 0).toLocaleString()}
            color="bg-purple-500"
          />
          <MetricCard
            icon={<TrendingUp size={16} className="text-white" />}
            label="ROI"
            value={metrics.roi || 0}
            trend={hasData ? 5.8 : undefined}
            color="bg-green-500"
          />
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-3">7日趋势</h4>
          <div className="h-40">
            {hasData ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Calendar size={20} className="mx-auto mb-1 opacity-50" />
                  <p className="text-[10px]">活动暂未开始，暂无趋势数据</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <h4 className="text-xs font-medium text-gray-700 mb-3">渠道对比</h4>
          <div className="h-36">
            {hasData ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Activity size={20} className="mx-auto mb-1 opacity-50" />
                  <p className="text-[10px]">活动暂未开始，暂无渠道数据</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
