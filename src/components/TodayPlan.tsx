import type { TodayTask } from "@/types/study";

interface TodayPlanProps {
  tasks: TodayTask[];
  totalMinutes: number;
  onToggle: (id: string) => void;
}

export default function TodayPlan({ tasks, totalMinutes, onToggle }: TodayPlanProps) {
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const doneMinutes = tasks
    .filter((t) => t.status === "done")
    .reduce((sum, t) => sum + parseInt(t.duration), 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-800">今日计划</h2>
          <span className="text-sm text-gray-500">{doneCount}/{tasks.length} 已完成</span>
        </div>
        <p className="text-xs text-gray-400">预计学习 {totalMinutes} 分钟 · 已完成 {doneMinutes} 分钟</p>

        <div className="mt-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-400">进度</span>
            <span className="text-xs font-semibold text-blue-600">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onToggle(task.id)}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                task.status === "done"
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              }`}
            >
              {task.status === "done" && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${
                  task.status === "done" ? "text-gray-400 line-through" : "text-gray-700 font-medium"
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{task.courseName}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{task.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
