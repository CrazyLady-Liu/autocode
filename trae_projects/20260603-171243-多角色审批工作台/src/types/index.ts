export type ApplicationType = "purchase" | "leave" | "expense" | "contract";
export type ApplicationStatus = "pending" | "approved" | "rejected" | "timeout";
export type NodeStatus = "pending" | "approved" | "rejected" | "timeout" | "unassigned";
export type ActionType = "approve" | "reject" | "submit" | "withdraw" | "reassign" | "comment";
export type AlertType = "missing_approver" | "timeout" | "permission_violation";
export type AlertSeverity = "warning" | "error" | "info";

export interface Application {
  id: string;
  title: string;
  applicant: string;
  department: string;
  type: ApplicationType;
  status: ApplicationStatus;
  createdAt: string;
  amount?: number;
  flowId: string;
}

export interface ApprovalNode {
  id: string;
  flowId: string;
  order: number;
  role: string;
  assignee?: string;
  status: NodeStatus;
  operatedAt?: string;
  remark?: string;
}

export interface ApprovalFlow {
  id: string;
  applicationId: string;
  nodes: ApprovalNode[];
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  level: number;
}

export interface OperationRecord {
  id: string;
  applicationId: string;
  operator: string;
  operatorRole: string;
  action: ActionType;
  timestamp: string;
  remark: string;
  nodeId?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  applicationId: string;
  message: string;
  severity: AlertSeverity;
  createdAt: string;
  dismissed: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  roleId: string;
  department: string;
}

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  purchase: "采购申请",
  leave: "请假申请",
  expense: "报销申请",
  contract: "合同审批",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "待审批",
  approved: "已通过",
  rejected: "已拒绝",
  timeout: "已超时",
};

export const NODE_STATUS_LABELS: Record<NodeStatus, string> = {
  pending: "待审批",
  approved: "已通过",
  rejected: "已拒绝",
  timeout: "已超时",
  unassigned: "缺审批人",
};

export const ACTION_LABELS: Record<ActionType, string> = {
  approve: "审批通过",
  reject: "审批拒绝",
  submit: "提交申请",
  withdraw: "撤回申请",
  reassign: "转交审批",
  comment: "添加备注",
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  missing_approver: "缺审批人",
  timeout: "审批超时",
  permission_violation: "越权尝试",
};
