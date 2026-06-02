export type TaskStatus = "pending" | "done";
export type CourseStatus = "not_started" | "in_progress" | "completed";

export interface TodayTask {
  id: string;
  title: string;
  duration: string;
  status: TaskStatus;
  courseName: string;
}

export interface Course {
  id: string;
  name: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  status: CourseStatus;
  category: string;
}

export interface StudyRecord {
  id: string;
  date: string;
  courseName: string;
  content: string;
  duration: string;
}

export interface DayPlan {
  date: string;
  totalMinutes: number;
  tasks: TodayTask[];
}
