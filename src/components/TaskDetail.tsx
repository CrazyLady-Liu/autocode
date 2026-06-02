import type { Todo, TodoStatus, TodoPriority } from "@/types/todo";

interface TaskDetailProps {
  todo: Todo | null;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onPriorityChange: (id: string, priority: TodoPriority) => void;
}

const statusOptions: { value: TodoStatus; label: string; class: string }[] = [
  { value: "todo", label: "待办", class: "bg-gray-100 text-gray-600" },
  { value: "in_progress", label: "进行中", class: "bg-blue-100 text-blue-600" },
  { value: "review", label: "审核中", class: "bg-amber-100 text-amber-600" },
  { value: "done", label: "已完成", class: "bg-green-100 text-green-600" },
];

const priorityOptions: { value: TodoPriority; label: string; class: string }[] = [
  { value: "low", label: "低", class: "bg-gray-100 text-gray-600" },
  { value: "medium", label: "中", class: "bg-blue-100 text-blue-600" },
  { value: "high", label: "高", class: "bg-amber-100 text-amber-600" },
];

export default function TaskDetail({
  todo,
  onStatusChange,
  onPriorityChange,
}: TaskDetailProps) {
  if (!todo) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">选择任务查看详情</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-gray-400">#{todo.id}</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              statusOptions.find((s) => s.value === todo.status)?.class
            }`}
          >
            {statusOptions.find((s) => s.value === todo.status)?.label}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{todo.title}</h2>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">负责人</label>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                {todo.assignee.charAt(0)}
              </div>
              <span className="text-sm text-gray-700">{todo.assignee}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">截止日期</label>
            <span className="text-sm text-gray-700">{todo.dueDate}</span>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">状态</label>
            <select
              value={todo.status}
              onChange={(e) => onStatusChange(todo.id, e.target.value as TodoStatus)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">优先级</label>
            <select
              value={todo.priority}
              onChange={(e) => onPriorityChange(todo.id, e.target.value as TodoPriority)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {priorityOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">标签</label>
          <div className="flex flex-wrap gap-1.5">
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <label className="block text-xs text-gray-500 mb-2">任务描述</label>
        <p className="text-sm text-gray-700 leading-relaxed">{todo.description}</p>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-xs text-gray-500 mb-2">时间信息</label>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>创建时间</span>
              <span>{todo.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span>截止日期</span>
              <span>{todo.dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <textarea
          placeholder="添加备注..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={2}
        />
        <div className="flex justify-end mt-2">
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
            保存备注
          </button>
        </div>
      </div>
    </div>
  );
}
