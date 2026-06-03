import { create } from "zustand";
import type {
  Application,
  ApprovalFlow,
  OperationRecord,
  Alert,
  CurrentUser,
  Role,
  ApplicationType,
  ApplicationStatus,
} from "@/types";
import {
  applications as mockApplications,
  approvalFlows as mockFlows,
  operationRecords as mockRecords,
  alerts as mockAlerts,
  currentUsers as mockUsers,
  roles as mockRoles,
} from "@/data/mockData";

interface ApprovalStore {
  applications: Application[];
  flows: ApprovalFlow[];
  records: OperationRecord[];
  alerts: Alert[];
  users: CurrentUser[];
  roles: Role[];
  selectedApplicationId: string | null;
  currentUser: CurrentUser;
  permissionViolation: string | null;
  statusFilter: ApplicationStatus | "all";
  typeFilter: ApplicationType | "all";
  searchQuery: string;

  selectApplication: (id: string | null) => void;
  switchUser: (userId: string) => void;
  approveNode: (nodeId: string) => void;
  rejectNode: (nodeId: string) => void;
  dismissAlert: (alertId: string) => void;
  clearPermissionViolation: () => void;
  setStatusFilter: (filter: ApplicationStatus | "all") => void;
  setTypeFilter: (filter: ApplicationType | "all") => void;
  setSearchQuery: (query: string) => void;

  getSelectedApplication: () => Application | undefined;
  getSelectedFlow: () => ApprovalFlow | undefined;
  getSelectedRecords: () => OperationRecord[];
  getApplicationAlerts: (appId: string) => Alert[];
  getFilteredApplications: () => Application[];
  getCurrentRole: () => Role | undefined;
  canOperateOnNode: (nodeRole: string) => boolean;
}

export const useApprovalStore = create<ApprovalStore>((set, get) => ({
  applications: mockApplications,
  flows: mockFlows,
  records: mockRecords,
  alerts: mockAlerts,
  users: mockUsers,
  roles: mockRoles,
  selectedApplicationId: null,
  currentUser: mockUsers[0],
  permissionViolation: null,
  statusFilter: "all",
  typeFilter: "all",
  searchQuery: "",

  selectApplication: (id) => set({ selectedApplicationId: id, permissionViolation: null }),

  switchUser: (userId) => {
    const user = get().users.find((u) => u.id === userId);
    if (user) set({ currentUser: user, permissionViolation: null });
  },

  approveNode: (nodeId) => {
    const state = get();
    const flow = state.flows.find((f) =>
      f.nodes.some((n) => n.id === nodeId)
    );
    if (!flow) return;

    const node = flow.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const role = state.getCurrentRole();
    if (!role) return;

    const canOperate = state.canOperateOnNode(node.role);
    if (!canOperate) {
      set({
        permissionViolation: `当前角色「${role.name}」无权审批「${node.role}」节点的操作`,
      });
      const newAlert: Alert = {
        id: `alert-violation-${Date.now()}`,
        type: "permission_violation",
        applicationId: flow.applicationId,
        message: `${state.currentUser.name}（${role.name}）尝试审批节点，越权操作已拦截`,
        severity: "warning",
        createdAt: new Date().toISOString(),
        dismissed: false,
      };
      set((s) => ({ alerts: [newAlert, ...s.alerts] }));
      return;
    }

    const now = new Date().toISOString();
    const updatedFlows = state.flows.map((f) => {
      if (f.id !== flow.id) return f;
      return {
        ...f,
        nodes: f.nodes.map((n) => {
          if (n.id !== nodeId) return n;
          return {
            ...n,
            status: "approved" as const,
            operatedAt: now,
            assignee: state.currentUser.name,
          };
        }),
      };
    });

    const allNodesDone = updatedFlows
      .find((f) => f.id === flow.id)!
      .nodes.every((n) => n.status === "approved" || n.status === "rejected");

    const currentPendingNode = updatedFlows
      .find((f) => f.id === flow.id)!
      .nodes.find((n) => n.status === "pending");

    const updatedApplications = state.applications.map((a) => {
      if (a.id !== flow.applicationId) return a;
      if (allNodesDone) {
        const hasReject = updatedFlows
          .find((f) => f.id === flow.id)!
          .nodes.some((n) => n.status === "rejected");
        return { ...a, status: hasReject ? ("rejected" as const) : ("approved" as const) };
      }
      if (!currentPendingNode) {
        return a;
      }
      return a;
    });

    const newRecord: OperationRecord = {
      id: `rec-${Date.now()}`,
      applicationId: flow.applicationId,
      operator: state.currentUser.name,
      operatorRole: role.name,
      action: "approve",
      timestamp: now,
      remark: "审批通过",
      nodeId,
    };

    set({
      flows: updatedFlows,
      applications: updatedApplications,
      records: [...state.records, newRecord],
      permissionViolation: null,
    });
  },

  rejectNode: (nodeId) => {
    const state = get();
    const flow = state.flows.find((f) =>
      f.nodes.some((n) => n.id === nodeId)
    );
    if (!flow) return;

    const node = flow.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const role = state.getCurrentRole();
    if (!role) return;

    const canOperate = state.canOperateOnNode(node.role);
    if (!canOperate) {
      set({
        permissionViolation: `当前角色「${role.name}」无权审批「${node.role}」节点的操作`,
      });
      const newAlert: Alert = {
        id: `alert-violation-${Date.now()}`,
        type: "permission_violation",
        applicationId: flow.applicationId,
        message: `${state.currentUser.name}（${role.name}）尝试拒绝审批节点，越权操作已拦截`,
        severity: "warning",
        createdAt: new Date().toISOString(),
        dismissed: false,
      };
      set((s) => ({ alerts: [newAlert, ...s.alerts] }));
      return;
    }

    const now = new Date().toISOString();
    const updatedFlows = state.flows.map((f) => {
      if (f.id !== flow.id) return f;
      return {
        ...f,
        nodes: f.nodes.map((n) => {
          if (n.id === nodeId) return n;
          return n;
        }).map((n) => {
          if (n.id !== nodeId) return n;
          return {
            ...n,
            status: "rejected" as const,
            operatedAt: now,
            assignee: state.currentUser.name,
          };
        }),
      };
    });

    const updatedApplications = state.applications.map((a) => {
      if (a.id !== flow.applicationId) return a;
      return { ...a, status: "rejected" as const };
    });

    const newRecord: OperationRecord = {
      id: `rec-${Date.now()}`,
      applicationId: flow.applicationId,
      operator: state.currentUser.name,
      operatorRole: role.name,
      action: "reject",
      timestamp: now,
      remark: "审批拒绝",
      nodeId,
    };

    set({
      flows: updatedFlows,
      applications: updatedApplications,
      records: [...state.records, newRecord],
      permissionViolation: null,
    });
  },

  dismissAlert: (alertId) =>
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === alertId ? { ...a, dismissed: true } : a
      ),
    })),

  clearPermissionViolation: () => set({ permissionViolation: null }),

  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getSelectedApplication: () => {
    const state = get();
    return state.applications.find((a) => a.id === state.selectedApplicationId);
  },

  getSelectedFlow: () => {
    const state = get();
    const app = state.getSelectedApplication();
    if (!app) return undefined;
    return state.flows.find((f) => f.applicationId === app.id);
  },

  getSelectedRecords: () => {
    const state = get();
    if (!state.selectedApplicationId) return [];
    return state.records.filter(
      (r) => r.applicationId === state.selectedApplicationId
    );
  },

  getApplicationAlerts: (appId) => {
    const state = get();
    return state.alerts.filter((a) => a.applicationId === appId && !a.dismissed);
  },

  getFilteredApplications: () => {
    const state = get();
    return state.applications.filter((a) => {
      if (state.statusFilter !== "all" && a.status !== state.statusFilter)
        return false;
      if (state.typeFilter !== "all" && a.type !== state.typeFilter)
        return false;
      if (
        state.searchQuery &&
        !a.title.toLowerCase().includes(state.searchQuery.toLowerCase()) &&
        !a.applicant.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  },

  getCurrentRole: () => {
    const state = get();
    return state.roles.find((r) => r.id === state.currentUser.roleId);
  },

  canOperateOnNode: (nodeRole) => {
    const state = get();
    const role = state.getCurrentRole();
    if (!role) return false;

    if (role.permissions.includes("approve_any") || role.permissions.includes("reject_any"))
      return true;

    if (nodeRole === "部门主管" && role.permissions.includes("approve_department"))
      return true;
    if (nodeRole === "财务审核" && role.permissions.includes("approve_finance"))
      return true;

    return false;
  },
}));
