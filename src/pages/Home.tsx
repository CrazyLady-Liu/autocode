import { useState, useMemo } from "react";
import TaskList from "@/components/TaskList";
import TaskDetail from "@/components/TaskDetail";
import StatusPanel from "@/components/StatusPanel";
import { mockTodos, getTodoStats } from "@/data/mockTodos";
import type { Todo, TodoStatus, TodoPriority } from "@/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [activeFilter, setActiveFilter] = useState<TodoStatus | "all">("all");

  const stats = useMemo(() => getTodoStats(todos), [todos]);

  const filteredTodos = useMemo(() => {
    if (activeFilter === "all") return todos;
    return todos.filter((t) => t.status === activeFilter);
  }, [todos, activeFilter]);

  const handleToggleStatus = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : ("done" as TodoStatus) }
          : t
      )
    );
    if (selectedTodo?.id === id) {
      setSelectedTodo((prev) =>
        prev ? { ...prev, status: prev.status === "done" ? "todo" : "done" } : null
      );
    }
  };

  const handleStatusChange = (id: string, status: TodoStatus) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (selectedTodo?.id === id) {
      setSelectedTodo((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handlePriorityChange = (id: string, priority: TodoPriority) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));
    if (selectedTodo?.id === id) {
      setSelectedTodo((prev) => (prev ? { ...prev, priority } : null));
    }
  };

  const handleSelectTodo = (todo: Todo) => {
    const latest = todos.find((t) => t.id === todo.id);
    setSelectedTodo(latest || todo);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-screen flex flex-col p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">待办管理</h1>
              <p className="text-sm text-gray-500 mt-0.5">团队任务看板</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                上次更新: {new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-sm rounded transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建任务
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          <div className="col-span-3 min-h-0">
            <TaskList
              todos={filteredTodos}
              selectedId={selectedTodo?.id || null}
              onSelect={handleSelectTodo}
              onToggleStatus={handleToggleStatus}
            />
          </div>
          <div className="col-span-5 min-h-0">
            <TaskDetail
              todo={selectedTodo}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
            />
          </div>
          <div className="col-span-4 min-h-0">
            <StatusPanel
              stats={stats}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
