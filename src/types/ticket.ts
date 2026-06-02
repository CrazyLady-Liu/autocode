export type TicketStatus = "open" | "pending" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "technical" | "billing" | "account" | "general" | "feature";

export interface TicketActivity {
  id: string;
  type: "comment" | "status_change" | "assignment" | "attachment";
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  metadata?: {
    oldStatus?: TicketStatus;
    newStatus?: TicketStatus;
    assignee?: string;
  };
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  activities: TicketActivity[];
  tags: string[];
}

export interface TicketStats {
  open: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
}
