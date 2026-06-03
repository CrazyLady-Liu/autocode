import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Trash2 } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { StatusBadge } from '../common/StatusBadge';
import type { Activity, ActivityStatus } from '../../types/activity';

const statusFilters: { value: ActivityStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'active', label: '进行中' },
  { value: 'pending', label: '待审核' },
  { value: 'paused', label: '已暂停' },
  { value: 'ended', label: '已结束' },
];

export const ActivityList = () => {
  const {
    activities,
    selectedActivityId,
    selectActivity,
    addActivity,
    deleteActivity,
  } = useActivityStore();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'all'>('all');

  const filteredActivities = activities.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchText.toLowerCase()) ||
      a.description.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个活动吗？')) {
      deleteActivity(id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">活动列表</h2>
          <button
            onClick={addActivity}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A5F] text-white text-sm rounded-lg hover:bg-[#162d4a] transition-colors"
          >
            <Plus size={16} />
            新建
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="搜索活动名称或描述..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-500 flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {statusFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    statusFilter === filter.value
                      ? 'bg-[#1E3A5F] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Calendar size={32} className="mb-2 opacity-50" />
            <p className="text-sm">暂无活动</p>
            <button
              onClick={addActivity}
              className="mt-2 text-[#2DD4BF] text-sm hover:underline"
            >
              创建第一个活动
            </button>
          </div>
        ) : (
          filteredActivities.map((activity: Activity) => (
            <div
              key={activity.id}
              onClick={() => selectActivity(activity.id)}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all
                ${selectedActivityId === activity.id
                  ? 'border-[#2DD4BF] bg-teal-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-gray-800 text-sm line-clamp-1 flex-1">
                  {activity.name || '未命名活动'}
                </h3>
                <button
                  onClick={(e) => handleDelete(e, activity.id)}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  title="删除活动"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {activity.description || '暂无描述'}
              </p>

              <div className="flex items-center justify-between">
                <StatusBadge status={activity.status} type="activity" />
                <span className="text-xs text-gray-400">
                  {formatDate(activity.startTime)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          共 {filteredActivities.length} 个活动
        </p>
      </div>
    </div>
  );
};
