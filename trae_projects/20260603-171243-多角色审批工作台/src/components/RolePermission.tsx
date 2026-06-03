import { useApprovalStore } from "@/store/useApprovalStore";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  Users,
} from "lucide-react";
import { clsx } from "clsx";

export default function RolePermission() {
  const { currentUser, roles, getCurrentRole, getSelectedFlow, canOperateOnNode } =
    useApprovalStore();

  const currentRole = getCurrentRole();
  const flow = getSelectedFlow();

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
            角色权限
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                {currentUser.name[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentUser.department}
              </p>
            </div>
          </div>
          {currentRole && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <ShieldCheck className="w-3 h-3" />
              {currentRole.name}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            当前权限
          </h3>
          {currentRole ? (
            <div className="space-y-1">
              {currentRole.permissions.map((perm) => {
                const permLabels: Record<string, string> = {
                  view_all_applications: "查看所有申请",
                  manage_flows: "管理审批流",
                  assign_roles: "分配角色",
                  view_statistics: "查看统计",
                  handle_alerts: "处理异常",
                  approve_any: "审批任意节点",
                  reject_any: "拒绝任意节点",
                  view_department_applications: "查看本部门申请",
                  approve_department: "审批本部门申请",
                  reject_department: "拒绝本部门申请",
                  view_department_records: "查看本部门记录",
                  view_finance_applications: "查看财务申请",
                  approve_finance: "审批财务申请",
                  reject_finance: "拒绝财务申请",
                  view_finance_records: "查看财务记录",
                  submit_application: "提交申请",
                  view_own_applications: "查看本人申请",
                  view_own_records: "查看本人记录",
                  withdraw_own: "撤回本人申请",
                };
                return (
                  <div
                    key={perm}
                    className="flex items-center gap-2 py-1 px-2 rounded text-xs text-slate-600 dark:text-slate-400"
                  >
                    <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    {permLabels[perm] || perm}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {flow && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              节点操作权限
            </h3>
            <div className="space-y-1">
              {flow.nodes.map((node) => {
                const canOperate = canOperateOnNode(node.role);
                return (
                  <div
                    key={node.id}
                    className={clsx(
                      "flex items-center justify-between py-1.5 px-2 rounded text-xs border",
                      canOperate
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {node.role}
                      {!node.assignee && (
                        <span className="text-red-500 ml-1">(未指派)</span>
                      )}
                    </span>
                    {canOperate ? (
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        可操作
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-slate-400">
                        <ShieldAlert className="w-3 h-3" />
                        无权限
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3 h-3" />
            切换角色
          </h3>
          <div className="space-y-1">
            {roles.map((role) => {
              const userForRole = useApprovalStore
                .getState()
                .users.find((u) => u.roleId === role.id);
              const isActive = currentUser.roleId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    if (userForRole && !isActive) {
                      useApprovalStore.getState().switchUser(userForRole.id);
                    }
                  }}
                  disabled={isActive}
                  className={clsx(
                    "w-full flex items-center gap-2 py-1.5 px-2 rounded text-xs transition-colors border",
                    isActive
                      ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-medium"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {role.level}
                  </span>
                  <span>{role.name}</span>
                  {userForRole && (
                    <span className="ml-auto text-[10px] text-slate-400">
                      {userForRole.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
