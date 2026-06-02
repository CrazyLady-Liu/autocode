import type { TodayTask, Course, StudyRecord, DayPlan } from "@/types/study";

export const mockDayPlan: DayPlan = {
  date: "2024-06-03",
  totalMinutes: 180,
  tasks: [
    { id: "t1", title: "React Hooks 深入理解", duration: "45分钟", status: "done", courseName: "React 进阶" },
    { id: "t2", title: "TypeScript 泛型实战", duration: "60分钟", status: "done", courseName: "TypeScript 全解" },
    { id: "t3", title: "CSS Grid 布局练习", duration: "30分钟", status: "pending", courseName: "CSS 现代布局" },
    { id: "t4", title: "Node.js 中间件原理", duration: "45分钟", status: "pending", courseName: "Node.js 后端开发" },
  ],
};

export const mockCourses: Course[] = [
  { id: "c1", name: "React 进阶", progress: 72, totalLessons: 36, completedLessons: 26, status: "in_progress", category: "前端" },
  { id: "c2", name: "TypeScript 全解", progress: 45, totalLessons: 40, completedLessons: 18, status: "in_progress", category: "前端" },
  { id: "c3", name: "CSS 现代布局", progress: 20, totalLessons: 25, completedLessons: 5, status: "in_progress", category: "前端" },
  { id: "c4", name: "Node.js 后端开发", progress: 10, totalLessons: 48, completedLessons: 5, status: "in_progress", category: "后端" },
  { id: "c5", name: "算法与数据结构", progress: 0, totalLessons: 30, completedLessons: 0, status: "not_started", category: "基础" },
  { id: "c6", name: "Git 版本控制", progress: 100, totalLessons: 12, completedLessons: 12, status: "completed", category: "工具" },
];

export const mockRecords: StudyRecord[] = [
  { id: "r1", date: "06-02", courseName: "React 进阶", content: "useEffect 清理函数与竞态条件处理", duration: "50分钟" },
  { id: "r2", date: "06-02", courseName: "TypeScript 全解", content: "条件类型与 infer 关键字", duration: "40分钟" },
  { id: "r3", date: "06-01", courseName: "CSS 现代布局", content: "Grid 容器属性与隐式轨道", duration: "35分钟" },
  { id: "r4", date: "06-01", courseName: "React 进阶", content: "useMemo 与 useCallback 性能优化", duration: "55分钟" },
  { id: "r5", date: "05-31", courseName: "Node.js 后端开发", content: "Express 中间件执行流程", duration: "45分钟" },
  { id: "r6", date: "05-31", courseName: "TypeScript 全解", content: "泛型约束与默认类型参数", duration: "30分钟" },
  { id: "r7", date: "05-30", courseName: "Git 版本控制", content: "rebase 与 merge 区别和适用场景", duration: "25分钟" },
];
