import type { TodoStats, TodoStatus } from "@/types/todo";

interface StatusPanelProps {
  stats: TodoStats;
  activeFilter: TodoStatus | "all";
  onFilterChange: (filter: TodoStatus | "all") => void;
}

const statusConfig: Record<TodoStatus | "all", { label: string; bg: string; text: string; bar: string }> = {
  all: { label: "全部", bg: "bg-gray-100", text: "text-gray-700", bar: "bg-gray-400" },
  todo: { label: "待办", bg: "bg-gray-50", text: "text-gray-600", bar: "bg-gray-400" },
  in_progress: { label: "进行中", bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
  review: { label: "审核中", bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  done: { label: "已完成", bg: "bg-green-50", text: "text-green-600", bar: "bg-green-500" },
};

export default function StatusPanel({ stats, activeFilter, onFilterChange }: StatusPanelProps) {
  const items = [
    { key: "all" as const, count: stats.total },
    { key: "todo" as const, count: stats.todo },
    { key: "in_progress" as const, count: stats.inProgress },
    { key: "review" as const, count: stats.review },
    { key: "done" as const, count: stats.done },
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">状态统计</h2>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">完成率</span>
          <span className="text-sm font-semibold text-gray-700">{completionRate}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {stats.done} / {stats.total} 任务已完成
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const config = statusConfig[item.key];
          const isActive = activeFilter === item.key;
          const percentage = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;

          return (
            <button
              key={item.key}
              onClick={() => onFilterChange(item.key)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                isActive ? config.bg : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isActive ? config.text : "text-gray-700"}`}>
                  {config.label}
                </span>
                <span className="text-lg font-bold text-gray-800">{item.count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-400">{percentage}%</div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>今日新增</span>
            <span className="text-gray-700 font-medium">2</span>
          </div>
          <div className="flex justify-between">
            <span>今日完成</span>
            <span className="text-green-600 font-medium">1</span>
          </div>
          <div className="flex justify-between">
            <span>即将到期</span>
            <span className="text-amber-600 font-medium">3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
