import { useApprovalStore } from "@/store/useApprovalStore";
import { ALERT_TYPE_LABELS } from "@/types";
import type { AlertType, AlertSeverity } from "@/types";
import {
  AlertTriangle,
  UserX,
  Clock,
  ShieldAlert,
  X,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

const alertIcons: Record<AlertType, React.ReactNode> = {
  missing_approver: <UserX className="w-3.5 h-3.5" />,
  timeout: <Clock className="w-3.5 h-3.5" />,
  permission_violation: <ShieldAlert className="w-3.5 h-3.5" />,
};

const severityStyles: Record<AlertSeverity, string> = {
  error:
    "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
  warning:
    "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
  info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
};

const severityIconStyles: Record<AlertSeverity, string> = {
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

export default function AlertBanner() {
  const { alerts, dismissAlert, selectApplication } = useApprovalStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const activeAlerts = alerts.filter((a) => !a.dismissed);

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 via-amber-50 to-transparent dark:from-red-950/20 dark:via-amber-950/20 hover:from-red-100 hover:via-amber-100 dark:hover:from-red-950/30 dark:hover:via-amber-950/30 transition-colors"
      >
        <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          异常提醒
        </span>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
          {activeAlerts.length}
        </span>
        <span className="ml-auto">
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={clsx(
                "flex items-start gap-2 px-3 py-2 rounded-lg border text-xs min-w-[280px] max-w-[400px] flex-shrink-0",
                severityStyles[alert.severity]
              )}
            >
              <span
                className={clsx(
                  "mt-0.5 flex-shrink-0",
                  severityIconStyles[alert.severity]
                )}
              >
                {alertIcons[alert.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-[10px] uppercase tracking-wider opacity-75">
                    {ALERT_TYPE_LABELS[alert.type]}
                  </span>
                </div>
                <p className="mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => {
                    selectApplication(alert.applicationId);
                  }}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/30 transition-colors"
                  title="定位到该申请"
                >
                  定位
                </button>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-0.5 rounded hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                >
                  <X className="w-3 h-3 opacity-50 hover:opacity-100" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
