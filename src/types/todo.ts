export type TodoStatus = "todo" | "in_progress" | "review" | "done";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  assignee: string;
  createdAt: string;
  dueDate: string;
  tags: string[];
}

export interface TodoStats {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}
