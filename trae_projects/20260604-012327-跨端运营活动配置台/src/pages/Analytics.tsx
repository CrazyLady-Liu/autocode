import React, { useState } from 'react'
import { useActivity } from '../contexts/ActivityContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, MousePointerClick, DollarSign, Eye } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const Analytics: React.FC = () => {
  const { activities, channels, stats, getActivityStats } = useActivity()
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(stats[0]?.activityId || null)
  

  const selectedStats = selectedActivityId ? getActivityStats(selectedActivityId) : null
  const activeActivities = activities.filter(a => a.status === 'active')

  const totalStats = stats.reduce((acc, s) => ({
    views: acc.views + s.totalViews,
    clicks: acc.clicks + s.totalClicks,
    conversions: acc.conversions + s.totalConversions,
    revenue: acc.revenue + s.totalRevenue
  }), { views: 0, clicks: 0, conversions: 0, revenue: 0 })

  const channelData = selectedStats?.channelStats.map(cs => {
    const channel = channels.find(c => c.id === cs.channelId)
    return {
      name: channel?.name || '未知',
      views: cs.views,
      clicks: cs.clicks,
      conversions: cs.conversions,
      revenue: cs.revenue
    }
  }) || []

  const pieData = channelData.map(c => ({
    name: c.name,
    value: c.views
  }))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-gray-500 mt-1">查看活动表现和渠道数据统计</p>
        </div>
        <select
          value={selectedActivityId || ''}
          onChange={(e) => setSelectedActivityId(e.target.value || null)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {activeActivities.map(activity => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
          <p className="text-sm text-gray-500">总曝光量</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {selectedStats ? selectedStats.totalViews.toLocaleString() : totalStats.views.toLocaleString()}
          </p>
            </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总点击量</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {selectedStats ? selectedStats.totalClicks.toLocaleString() : totalStats.clicks.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <MousePointerClick className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {selectedStats && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-green-600 font-medium">
                点击率 {((selectedStats.totalClicks / selectedStats.totalViews) * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">转化量</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {selectedStats ? selectedStats.totalConversions.toLocaleString() : totalStats.conversions.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          {selectedStats && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-yellow-600 font-medium">
                转化率 {((selectedStats.totalConversions / selectedStats.totalClicks) * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总收入</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ¥{(selectedStats ? selectedStats.totalRevenue : totalStats.revenue).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">趋势分析</h3>
          {selectedStats?.dailyData ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedStats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} name="曝光" />
                  <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} name="点击" />
                  <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={2} name="转化" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              暂无数据
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">渠道分布</h3>
          {pieData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              暂无数据
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">渠道详情</h3>
        {channelData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">渠道</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">曝光</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">点击</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">转化</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">收入</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">点击率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {channelData.map((channel, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 font-medium text-gray-900">{channel.name}</td>
                    <td className="px-4 py-4 text-right text-gray-600">{channel.views.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right text-gray-600">{channel.clicks.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right text-gray-600">{channel.conversions.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right text-gray-600">¥{channel.revenue.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {((channel.clicks / channel.views) * 100).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
          暂无渠道数据
        </div>
        )}
      </div>
    </div>
  )
}

export default Analytics
