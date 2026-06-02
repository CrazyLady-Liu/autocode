import { useState } from "react";
import TodayPlan from "@/components/TodayPlan";
import CourseList from "@/components/CourseList";
import StudyRecords from "@/components/StudyRecords";
import { mockDayPlan, mockCourses, mockRecords } from "@/data/mockStudy";
import type { TodayTask } from "@/types/study";

export default function Home() {
  const [tasks, setTasks] = useState<TodayTask[]>(mockDayPlan.tasks);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? ("pending" as const) : ("done" as const) } : t
      )
    );
  };

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const streakDays = 12;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">学习计划追踪</h1>
              <p className="text-sm text-gray-500 mt-0.5">坚持每一天，进步一点点</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{streakDays}</p>
                <p className="text-[10px] text-gray-400">连续天数</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{doneCount}/{tasks.length}</p>
                <p className="text-[10px] text-gray-400">今日完成</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-5">
            <TodayPlan
              tasks={tasks}
              totalMinutes={mockDayPlan.totalMinutes}
              onToggle={handleToggleTask}
            />
          </div>

          <div className="col-span-4">
            <CourseList courses={mockCourses} />
          </div>

          <div className="col-span-3">
            <StudyRecords records={mockRecords} />
          </div>
        </div>
      </div>
    </div>
  );
}
