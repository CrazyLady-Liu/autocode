import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Play, Pause, Search, Filter } from 'lucide-react'
import { useActivity } from '../contexts/ActivityContext'
import StatusBadge from '../components/StatusBadge'
import { Activity } from '../types'

const ActivityList: React.FC = () => {
  const { activities, deleteActivity, updateActivity } = useActivity()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除此活动吗？')) {
      deleteActivity(id)
    }
  }

  const toggleStatus = (activity: Activity) => {
    const newStatus = activity.status === 'active' ? 'paused' : 'active'
    updateActivity(activity.id, { status: newStatus as Activity['status'] })
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">活动列表</h1>
          <p className="text-gray-500 mt-1">管理所有运营活动</p>
        </div>
        <Link
          to="/activities/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          新建活动
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索活动名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="draft">草稿</option>
                <option value="active">进行中</option>
                <option value="paused">已暂停</option>
                <option value="ended">已结束</option>
              </select>
            </div>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">暂无活动数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结束时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredActivities.map(activity => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{activity.name || '未命名活动'}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {activity.description || '无描述'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={activity.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(activity.startTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(activity.endTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(activity.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activity.status !== 'ended' && (
                          <button
                            onClick={() => toggleStatus(activity)}
                            className={`p-2 rounded-lg transition-colors ${
                              activity.status === 'active'
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={activity.status === 'active' ? '暂停' : '启用'}
                          >
                            {activity.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                        )}
                        <Link
                          to={`/activities/${activity.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityList
