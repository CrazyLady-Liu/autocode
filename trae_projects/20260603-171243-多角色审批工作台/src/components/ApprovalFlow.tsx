import { useApprovalStore } from "@/store/useApprovalStore";
import { NODE_STATUS_LABELS } from "@/types";
import type { ApprovalNode } from "@/types";
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  UserX,
  ChevronRight,
  ShieldCheck,
  ShieldX,
  Target,
} from "lucide-react";
import { clsx } from "clsx";

function NodeIcon({ status }: { status: ApprovalNode["status"] }) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "rejected":
      return <XCircle className="w-4 h-4 text-rose-500" />;
    case "timeout":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "unassigned":
      return <UserX className="w-4 h-4 text-red-400" />;
    default:
      return <Clock className="w-4 h-4 text-amber-500" />;
  }
}

function NodeStatusBadge({ status }: { status: ApprovalNode["status"] }) {
  const styles: Record<ApprovalNode["status"], string> = {
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    rejected: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
    timeout: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    unassigned: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-300 dark:border-red-700",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  };

  return (
    <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full font-medium", styles[status])}>
      {NODE_STATUS_LABELS[status]}
    </span>
  );
}

export default function ApprovalFlow() {
  const {
    getSelectedFlow,
    getSelectedApplication,
    canOperateOnNode,
    approveNode,
    rejectNode,
    permissionViolation,
    clearPermissionViolation,
    selectedNodeId,
    selectNode,
  } = useApprovalStore();

  const flow = getSelectedFlow();
  const app = getSelectedApplication();

  if (!flow || !app) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
        <GitBranch className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm">请从左侧选择一条申请</p>
        <p className="text-xs mt-1">审批流节点将在此展示</p>
        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
          <Target className="w-3 h-3" />
          点击节点查看详情并联动操作记录
        </p>
      </div>
    );
  }

  const hasUnassigned = flow.nodes.some((n) => n.status === "unassigned");

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    selectNode(selectedNodeId === nodeId ? null : nodeId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
            审批流程
          </h2>
          {hasUnassigned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 animate-pulse">
              <UserX className="w-3 h-3" />
              缺审批人
            </span>
          )}
          <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Target className="w-3 h-3" />
            点击节点查看详情
          </span>
        </div>
      </div>

      {permissionViolation && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-700 animate-[flash_0.5s_ease-in-out_3]">
          <div className="flex items-start gap-2">
            <ShieldX className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                越权操作被拦截
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                {permissionViolation}
              </p>
            </div>
            <button
              onClick={clearPermissionViolation}
              className="ml-auto text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 text-xs flex-shrink-0"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto px-5 py-4">
        <div className="flex items-start gap-0 min-w-max">
          {flow.nodes.map((node, idx) => {
            const canOperate = canOperateOnNode(node.role);
            const isPending = node.status === "pending";
            const isUnassigned = node.status === "unassigned";
            const isSelected = selectedNodeId === node.id;

            return (
              <div key={node.id} className="flex items-start">
                <div
                  className={clsx(
                    "flex flex-col items-center w-36 cursor-pointer transition-all duration-200 p-2 rounded-lg",
                    isSelected && "bg-amber-50 dark:bg-amber-950/30",
                    !isSelected && "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    isUnassigned && "animate-[pulse_2s_ease-in-out_infinite]"
                  )}
                  onClick={(e) => handleNodeClick(e, node.id)}
                >
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all relative",
                      isSelected && "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900 scale-110",
                      node.status === "approved" &&
                        "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500",
                      node.status === "rejected" &&
                        "bg-rose-50 dark:bg-rose-950/50 border-rose-500",
                      node.status === "pending" &&
                        "bg-amber-50 dark:bg-amber-950/50 border-amber-400",
                      node.status === "timeout" &&
                        "bg-red-50 dark:bg-red-950/50 border-red-500",
                      isUnassigned &&
                        "bg-red-50 dark:bg-red-950/50 border-red-400 border-dashed"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center animate-[bounce_1s_infinite]">
                        <Target className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <NodeIcon status={node.status} />
                  </div>

                  <div className="mt-2 text-center">
                    <p className={clsx(
                      "text-xs font-medium",
                      isSelected
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-slate-700 dark:text-slate-300"
                    )}>
                      {node.role}
                    </p>
                    {node.assignee ? (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {node.assignee}
                      </p>
                    ) : (
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5 font-medium">
                        未指派
                      </p>
                    )}
                    <NodeStatusBadge status={node.status} />
                    {node.remark && (
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[120px] truncate" title={node.remark}>
                        {node.remark}
                      </p>
                    )}
                    {node.operatedAt && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(node.operatedAt).toLocaleString("zh-CN", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>

                  {isPending && canOperate && !isUnassigned && (
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          approveNode(node.id);
                        }}
                        className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        通过
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rejectNode(node.id);
                        }}
                        className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                      >
                        <ShieldX className="w-3 h-3" />
                        拒绝
                      </button>
                    </div>
                  )}

                  {isPending && !canOperate && !isUnassigned && (
                    <p className="text-[10px] text-slate-400 mt-2 italic">
                      无权操作
                    </p>
                  )}

                  {isSelected && (
                    <p className="text-[10px] text-amber-500 mt-2 font-medium flex items-center justify-center gap-1">
                      <Target className="w-3 h-3" />
                      已选中
                    </p>
                  )}
                </div>

                {idx < flow.nodes.length - 1 && (
                  <div className="flex items-center self-center mt-[-2rem] mx-1">
                    <ChevronRight
                      className={clsx(
                        "w-5 h-5 transition-colors",
                        flow.nodes[idx + 1].status === "pending" ||
                        flow.nodes[idx + 1].status === "unassigned"
                          ? "text-slate-300 dark:text-slate-600"
                          : flow.nodes[idx + 1].status === "approved"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
