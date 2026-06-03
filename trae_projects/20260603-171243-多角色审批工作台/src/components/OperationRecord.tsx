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
  const { getSelectedRecords, selectedApplicationId } = useApprovalStore();

  const records = getSelectedRecords();

  if (!selectedApplicationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
        <History className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm">请选择申请查看操作记录</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
              操作记录
            </h2>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <FileText className="w-8 h-8 opacity-30" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            暂无操作记录
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            该申请尚未产生任何审批操作
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
            操作记录
          </h2>
          <span className="ml-auto text-xs text-slate-400">
            {records.length} 条
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

          {records.map((record, idx) => (
            <div key={record.id} className="relative flex gap-3 pb-4 last:pb-0">
              <div
                className={clsx(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 bg-white dark:bg-slate-900 z-10",
                  actionColors[record.action]
                )}
              >
                {actionIcons[record.action]}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
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
          ))}
        </div>
      </div>
    </div>
  );
}
