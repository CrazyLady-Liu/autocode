import { useApprovalStore } from "@/store/useApprovalStore";
import { ACTION_LABELS } from "@/types";
import type { ActionType } from "@/types";
import {
  History,
  CheckCircle2,
  XCircle,
  Send,
  RotateCcw,
  ArrowRightLeft,
  MessageSquare,
  FileText,
  X,
  Target,
  Filter,
} from "lucide-react";
import { clsx } from "clsx";

const actionIcons: Record<ActionType, React.ReactNode> = {
  approve: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  reject: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
  submit: <Send className="w-3.5 h-3.5 text-blue-500" />,
  withdraw: <RotateCcw className="w-3.5 h-3.5 text-slate-500" />,
  reassign: <ArrowRightLeft className="w-3.5 h-3.5 text-purple-500" />,
  comment: <MessageSquare className="w-3.5 h-3.5 text-amber-500" />,
};

const actionColors: Record<ActionType, string> = {
  approve: "border-emerald-400 dark:border-emerald-600",
  reject: "border-rose-400 dark:border-rose-600",
  submit: "border-blue-400 dark:border-blue-600",
  withdraw: "border-slate-400 dark:border-slate-600",
  reassign: "border-purple-400 dark:border-purple-600",
  comment: "border-amber-400 dark:border-amber-600",
};

export default function OperationRecord() {
  const {
    getSelectedRecords,
    getNodeRelatedRecords,
    getSelectedNode,
    selectedApplicationId,
    selectedNodeId,
    selectNode,
  } = useApprovalStore();

  const allRecords = getSelectedRecords();
  const node = getSelectedNode();
  const nodeRecords = selectedNodeId ? getNodeRelatedRecords(selectedNodeId) : [];

  const isFiltered = selectedNodeId && nodeRecords.length > 0;
  const displayRecords = isFiltered ? nodeRecords : allRecords;
  const filteredOutCount = allRecords.length - nodeRecords.length;

  if (!selectedApplicationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
        <History className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm">请选择申请查看操作记录</p>
        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
          <Target className="w-3 h-3" />
          点击上方节点可联动筛选相关记录
        </p>
      </div>
    );
  }

  if (displayRecords.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
              操作记录
            </h2>
            {isFiltered && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <Target className="w-3 h-3" />
                {node?.role}
                <button
                  onClick={() => selectNode(null)}
                  className="ml-1 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <FileText className="w-8 h-8 opacity-30" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {isFiltered ? "该节点暂无关联操作记录" : "暂无操作记录"}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {isFiltered
              ? `${node?.role}节点尚未产生任何操作记录，共 ${filteredOutCount} 条其他记录被隐藏`
              : "该申请尚未产生任何审批操作"}
          </p>
          {isFiltered && (
            <button
              onClick={() => selectNode(null)}
              className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
            >
              <Filter className="w-3 h-3" />
              清除筛选，显示全部记录
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 flex-wrap">
          <History className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
            操作记录
          </h2>
          {isFiltered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 animate-[flash_0.5s_ease-in-out]">
              <Target className="w-3 h-3" />
              筛选: {node?.role}
              <button
                onClick={() => selectNode(null)}
                className="ml-1 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-full p-0.5 transition-colors"
                title="清除筛选"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
            {isFiltered ? (
              <>
                <span className="text-amber-500 font-medium">{displayRecords.length}</span>
                <span className="text-slate-400">/ {allRecords.length} 条</span>
                {filteredOutCount > 0 && (
                  <span className="text-[10px] text-slate-400">
                    ({filteredOutCount} 条被隐藏)
                  </span>
                )}
              </>
            ) : (
              <span>{allRecords.length} 条</span>
            )}
          </span>
        </div>
        {isFiltered && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-500" />
            当前仅显示与「{node?.role}」节点相关的操作记录，点击右侧 X 可清除筛选
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

          {displayRecords.map((record, idx) => {
            const isNodeRelated = record.nodeId === selectedNodeId;

            return (
              <div
                key={record.id}
                className={clsx(
                  "relative flex gap-3 pb-4 last:pb-0 transition-all duration-300",
                  isNodeRelated && "animate-[flash_0.5s_ease-in-out]"
                )}
              >
                <div
                  className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 bg-white dark:bg-slate-900 z-10 transition-all duration-300",
                    actionColors[record.action],
                    isNodeRelated && "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900 scale-110"
                  )}
                >
                  {actionIcons[record.action]}
                </div>

                <div
                  className={clsx(
                    "flex-1 min-w-0 pt-0.5 p-2 -mt-2 -ml-2 rounded-lg transition-all duration-300",
                    isNodeRelated
                      ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                      : !isFiltered && "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  )}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {record.operator}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {record.operatorRole}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {ACTION_LABELS[record.action]}
                    </span>
                    {isNodeRelated && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium">
                        <Target className="w-2.5 h-2.5" />
                        关联节点
                      </span>
                    )}
                  </div>

                  {record.remark && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {record.remark}
                    </p>
                  )}

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(record.timestamp).toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
