import { useApprovalStore } from "@/store/useApprovalStore";
import {
  APPLICATION_TYPE_LABELS,
  APPLICATION_STATUS_LABELS,
} from "@/types";
import type { ApplicationStatus, ApplicationType } from "@/types";
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { clsx } from "clsx";

const statusConfig: Record<
  ApplicationStatus,
  { icon: React.ReactNode; bg: string; text: string; dot: string }
> = {
  pending: {
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  approved: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  rejected: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  timeout: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
};

export default function ApplicationList() {
  const {
    selectedApplicationId,
    selectApplication,
    statusFilter,
    typeFilter,
    searchQuery,
    setStatusFilter,
    setTypeFilter,
    setSearchQuery,
    getFilteredApplications,
    getApplicationAlerts,
  } = useApprovalStore();

  const filteredApps = getFilteredApplications();

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
            申请列表
          </h2>
          <span className="ml-auto text-xs text-slate-400">
            {filteredApps.length} 条
          </span>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索申请标题或申请人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ApplicationStatus | "all")
              }
              className="text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
            >
              <option value="all">全部状态</option>
              {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as ApplicationType | "all")
            }
            className="text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          >
            <option value="all">全部类型</option>
            {Object.entries(APPLICATION_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FileText className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-xs">暂无匹配的申请</p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const config = statusConfig[app.status];
            const appAlerts = getApplicationAlerts(app.id);
            const isSelected = selectedApplicationId === app.id;

            return (
              <button
                key={app.id}
                onClick={() => selectApplication(isSelected ? null : app.id)}
                className={clsx(
                  "w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800 transition-all duration-200 relative group",
                  isSelected
                    ? "bg-amber-50/60 dark:bg-amber-950/20 border-l-[3px] border-l-amber-500"
                    : "border-l-[3px] border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-l-slate-300 dark:hover:border-l-slate-600"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3
                        className={clsx(
                          "text-sm font-medium truncate",
                          isSelected
                            ? "text-amber-900 dark:text-amber-300"
                            : "text-slate-800 dark:text-slate-200"
                        )}
                      >
                        {app.title}
                      </h3>
                      {appAlerts.length > 0 && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{app.applicant}</span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span>{app.department}</span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span>{APPLICATION_TYPE_LABELS[app.type]}</span>
                    </div>
                    {app.amount && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        ¥{app.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0",
                      config.bg,
                      config.text
                    )}
                  >
                    {config.icon}
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {new Date(app.createdAt).toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
