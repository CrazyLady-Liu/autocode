import type { StudyRecord } from "@/types/study";

interface StudyRecordsProps {
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

export default function StudyRecords({ records }: StudyRecordsProps) {
  const grouped = records.reduce<Record<string, StudyRecord[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">学习记录</h2>
        <p className="text-xs text-gray-400 mt-0.5">最近 {records.length} 条记录</p>
      </div>

      <div className="p-4 space-y-5">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-gray-500">{date}</span>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400">{items.length} 条</span>
            </div>

            <div className="space-y-2">
              {items.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          courseColors[record.courseName] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {record.courseName}
                      </span>
                      <span className="text-[10px] text-gray-400">{record.duration}</span>
                    </div>
                    <p className="text-sm text-gray-700">{record.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
