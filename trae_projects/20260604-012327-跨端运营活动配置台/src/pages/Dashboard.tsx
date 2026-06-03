import React from 'react'
import { Link } from 'react-router-dom'
import { useActivity } from '../contexts/ActivityContext'
import { Plus, TrendingUp, Users, Calendar, Play } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { activities, stats } = useActivity()

  const activeActivities = activities.filter(a => a.status === 'active')
  const draftActivities = activities.filter(a => a.status === 'draft')
  const totalStats = stats.reduce((acc, s) => acc + s.totalViews, 0)
  const totalConversions = stats.reduce((acc, s) => acc + s.totalConversions, 0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">运营概览</h1>
          <p className="text-gray-500 mt-1">欢迎回来，查看运营活动一览</p>
        </div>
        <Link
          to="/activities/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          新建活动
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {activeActivities.length} 个进行中
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
          <p className="text-sm text-gray-500 mt-1">总活动数</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeActivities.length}</p>
          <p className="text-sm text-gray-500 mt-1">进行中活动</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalStats.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">总曝光量</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalConversions.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">总转化量</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">进行中活动</h2>
            <Link to="/activities" className="text-sm text-blue-600 hover:text-blue-700">
              查看全部
            </Link>
          </div>
          <div className="p-6">
            {activeActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无进行中的活动
              </div>
            ) : (
              <div className="space-y-4">
                {activeActivities.slice(0, 5).map(activity => {
                const activityStats = stats.find(s => s.activityId === activity.id)
                return (
                  <Link
                    key={activity.id}
                    to={`/activities/${activity.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{activity.name}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        进行中
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                    {activityStats && (
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>曝光 {activityStats.totalViews.toLocaleString()}</span>
                        <span>转化 {activityStats.totalConversions.toLocaleString()}</span>
                      </div>
                    )}
                  </Link>
                )
              })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">草稿活动</h2>
            <Link to="/activities" className="text-sm text-blue-600 hover:text-blue-700">
              查看全部
            </Link>
          </div>
          <div className="p-6">
            {draftActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无草稿活动
              </div>
            ) : (
              <div className="space-y-4">
                {draftActivities.slice(0, 5).map(activity => (
                <Link
                  key={activity.id}
                  to={`/activities/${activity.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{activity.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      草稿
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.description || '暂无描述'}
                  </p>
                </Link>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
