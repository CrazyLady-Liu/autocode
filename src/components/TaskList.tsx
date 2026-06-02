import type { Todo, TodoPriority, TodoStatus } from "@/types/todo";

interface TaskListProps {
  todos: Todo[];
  selectedId: string | null;
  onSelect: (todo: Todo) => void;
  onToggleStatus: (id: string) => void;
}

const priorityConfig: Record<TodoPriority, { label: string; class: string }> = {
  low: { label: "低", class: "bg-gray-100 text-gray-500" },
  medium: { label: "中", class: "bg-blue-100 text-blue-600" },
  high: { label: "高", class: "bg-amber-100 text-amber-600" },
};

const statusLabels: Record<TodoStatus, string> = {
  todo: "待办",
  in_progress: "进行中",
  review: "审核中",
  done: "已完成",
};

function TaskItem({
  todo,
  isSelected,
  onClick,
  onToggle,
}: {
  todo: Todo;
  isSelected: boolean;
  onClick: () => void;
  onToggle: () => void;
}) {
  const isDone = todo.status === "done";

  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm ${
                isDone ? "text-gray-400 line-through" : "text-gray-800 font-medium"
              }`}
            >
              {todo.title}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  priorityConfig[todo.priority].class
                }`}
              >
                {priorityConfig[todo.priority].label}
              </span>
              <span className="text-[10px] text-gray-400">{statusLabels[todo.status]}</span>
            </div>
            <span className="text-[10px] text-gray-400">{todo.dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskList({
  todos,
  selectedId,
  onSelect,
  onToggleStatus,
}: TaskListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">任务列表</h2>
        <p className="text-xs text-gray-500 mt-0.5">共 {todos.length} 项任务</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {todos.map((todo) => (
          <TaskItem
            key={todo.id}
            todo={todo}
            isSelected={selectedId === todo.id}
            onClick={() => onSelect(todo)}
            onToggle={() => onToggleStatus(todo.id)}
          />
        ))}
      </div>
    </div>
  );
}
