import type { StudyRecord, Course } from "@/types/study";

interface CourseRecordsProps {
  course: Course | null;
  records: StudyRecord[];
}

const courseColors: Record<string, string> = {
  "React 进阶": "bg-blue-100 text-blue-600",
  "TypeScript 全解": "bg-indigo-100 text-indigo-600",
  "CSS 现代布局": "bg-pink-100 text-pink-600",
  "Node.js 后端开发": "bg-emerald-100 text-emerald-600",
  "算法与数据结构": "bg-amber-100 text-amber-600",
  "Git 版本控制": "bg-gray-100 text-gray-600",
};

export default function CourseRecords({ course, records }: CourseRecordsProps) {
  if (!course) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">课程学习记录</h2>
        </div>
        <div className="p-8 text-center text-gray-400 text-sm">
          选择一门课程查看学习记录
        </div>
      </div>
    );
  }

  const courseRecords = records.filter((r) => r.courseName === course.name);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">课程学习记录</h2>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${courseColors[course.name] || "bg-gray-100 text-gray-600"}`}>
            {course.name}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">共 {courseRecords.length} 条记录</p>
      </div>

      <div className="p-4 space-y-3 max-h-[220px] overflow-y-auto">
        {courseRecords.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            暂无学习记录
          </div>
        ) : (
          courseRecords.map((record) => (
            <div key={record.id} className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400">{record.date}</span>
                <span className="text-[10px] text-gray-400">{record.duration}</span>
              </div>
              <p className="text-sm text-gray-700">{record.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
