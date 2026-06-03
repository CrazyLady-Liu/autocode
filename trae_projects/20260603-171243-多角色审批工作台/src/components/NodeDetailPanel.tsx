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
  X,
  User,
  Calendar,
  MessageSquare,
  Hash,
  Target,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
} from "lucide-react";
import { clsx } from "clsx";

function NodeStatusBadge({ status }: { status: ApprovalNode["status"] }) {
  const styles: Record<ApprovalNode["status"], string> = {
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    rejected: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
    timeout: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    unassigned: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-300 dark:border-red-700",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  };

  return (
    <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-medium", styles[status])}>
      {NODE_STATUS_LABELS[status]}
    </span>
  );
}

function StatusIcon({ status }: { status: ApprovalNode["status"] }) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "rejected":
      return <XCircle className="w-5 h-5 text-rose-500" />;
    case "timeout":
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case "unassigned":
      return <UserX className="w-5 h-5 text-red-400" />;
    default:
      return <Clock className="w-5 h-5 text-amber-500" />;
  }
}

const statusBg: Record<ApprovalNode["status"], string> = {
  approved: "from-emerald-500 to-emerald-600",
  rejected: "from-rose-500 to-rose-600",
  timeout: "from-red-500 to-red-600",
  unassigned: "from-red-400 to-red-500",
  pending: "from-amber-500 to-amber-600",
};

export default function NodeDetailPanel() {
  const {
    getSelectedNode,
    getSelectedFlow,
    getNodeRelatedRecords,
    canOperateOnNode,
    approveNode,
    rejectNode,
    selectedNodeId,
    selectNode,
  } = useApprovalStore();

  const node = getSelectedNode();
  const flow = getSelectedFlow();
  const nodeRecords = selectedNodeId ? getNodeRelatedRecords(selectedNodeId) : [];

  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 p-4">
        <Target className="w-10 h-10 mb-2 opacity-20" />
        <p className="text-xs text-center">
          点击上方审批流节点<br />查看详细信息
        </p>
      </div>
    );
  }

  const nodeIndex = flow ? flow.nodes.findIndex((n) => n.id === node.id) + 1 : 0;
  const canOperate = canOperateOnNode(node.role);
  const isPending = node.status === "pending";
  const isUnassigned = node.status === "unassigned";

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 animate-slide-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display">
            节点详情
          </h3>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className={clsx(
          "rounded-xl p-4 bg-gradient-to-br text-white relative overflow-hidden",
          statusBg[node.status]
        )}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-full">
                  第 {nodeIndex} 节点
                </span>
                <NodeStatusBadge status={node.status} />
              </div>
              <h4 className="text-lg font-bold font-display mb-0.5">{node.role}</h4>
              <p className="text-xs opacity-80 flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {node.id}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <StatusIcon status={node.status} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400">审批人</p>
              <p className={clsx(
                "text-xs font-medium truncate",
                node.assignee
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-red-500 dark:text-red-400 font-semibold"
              )}>
                {node.assignee || "未指派 — 请管理员分配"}
              </p>
            </div>
            {!node.assignee && (
              <ShieldAlert className="w-4 h-4 text-red-500 ml-auto flex-shrink-0 animate-pulse" />
            )}
          </div>

          {node.operatedAt && (
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">操作时间</p>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {new Date(node.operatedAt).toLocaleString("zh-CN")}
                </p>
              </div>
            </div>
          )}

          {node.remark && (
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">审批意见</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {node.remark}
                </p>
              </div>
            </div>
          )}
        </div>

        {isPending && canOperate && !isUnassigned && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 mb-2">
              您有权限处理此节点
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => approveNode(node.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                审批通过
              </button>
              <button
                onClick={() => rejectNode(node.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-rose-500 hover:bg-rose-600 text-white transition-colors"
              >
                <ShieldX className="w-3.5 h-3.5" />
                拒绝
              </button>
            </div>
          </div>
        )}

        {isPending && !canOperate && !isUnassigned && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  无操作权限
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  当前角色无权审批「{node.role}」节点的操作
                </p>
              </div>
            </div>
          </div>
        )}

        {isUnassigned && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 animate-[pulse_2s_ease-in-out_infinite]">
            <div className="flex items-start gap-2">
              <UserX className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-medium text-red-600 dark:text-red-400">
                  异常：缺少审批人
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                  该节点未指派审批人，流程无法推进
                </p>
              </div>
            </div>
          </div>
        )}

        {nodeRecords.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3" />
              该节点相关记录 ({nodeRecords.length})
            </h5>
            <div className="space-y-1.5">
              {nodeRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {record.operator}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                      {record.action === "approve" ? "通过" : record.action === "reject" ? "拒绝" : "操作"}
                    </span>
                  </div>
                  {record.remark && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {record.remark}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(record.timestamp).toLocaleString("zh-CN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
