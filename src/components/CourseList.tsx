import type { Course, CourseStatus } from "@/types/study";

interface CourseListProps {
  courses: Course[];
}

const statusConfig: Record<CourseStatus, { label: string; class: string }> = {
  not_started: { label: "未开始", class: "bg-gray-100 text-gray-500" },
  in_progress: { label: "进行中", class: "bg-blue-50 text-blue-600" },
  completed: { label: "已完成", class: "bg-green-50 text-green-600" },
};

const categoryColors: Record<string, string> = {
  前端: "bg-indigo-500",
  后端: "bg-emerald-500",
  基础: "bg-amber-500",
  工具: "bg-gray-500",
};

function CourseItem({ course }: { course: Course }) {
  const config = statusConfig[course.status];
  const barColor =
    course.status === "completed"
      ? "bg-green-500"
      : course.progress >= 50
        ? "bg-blue-500"
        : "bg-indigo-400";

  return (
    <div className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${categoryColors[course.category] || "bg-gray-400"}`} />
          <h3 className="text-sm font-medium text-gray-800">{course.name}</h3>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${config.class}`}>
          {config.label}
        </span>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">{course.completedLessons}/{course.totalLessons} 课时</span>
          <span className="text-xs font-semibold text-gray-600">{course.progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function CourseList({ courses }: CourseListProps) {
  const inProgress = courses.filter((c) => c.status === "in_progress");
  const notStarted = courses.filter((c) => c.status === "not_started");
  const completed = courses.filter((c) => c.status === "completed");

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">课程列表</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          进行中 {inProgress.length} · 未开始 {notStarted.length} · 已完成 {completed.length}
        </p>
      </div>

      <div className="p-4 space-y-2">
        {inProgress.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2 px-1">进行中</p>
            <div className="space-y-2">
              {inProgress.map((c) => (
                <CourseItem key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}

        {notStarted.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 px-1">未开始</p>
            <div className="space-y-2">
              {notStarted.map((c) => (
                <CourseItem key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 px-1">已完成</p>
            <div className="space-y-2">
              {completed.map((c) => (
                <CourseItem key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
