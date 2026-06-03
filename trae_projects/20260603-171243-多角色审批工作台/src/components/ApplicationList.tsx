import { useApprovalStore } from "@/store/useApprovalStore";
import {
  APPLICATION_TYPE_LABELS,
  APPLICATION_STATUS_LABELS,
  NODE_STATUS_LABELS,
} from "@/types";
import type { ApplicationStatus, ApplicationType, NodeStatus } from "@/types";
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserX,
  Users,
  GitBranch,
  X,
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

const APPROVAL_ROLES = ["部门主管", "财务审核", "超级管理员"];

function FilterChip({
  label,
  icon,
  active,
  onClick,
  color = "amber",
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color?: "amber" | "emerald" | "rose" | "red" | "slate" | "blue";
}) {
  const colorMap = {
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300 dark:border-rose-700",
    red: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-300 dark:border-red-700",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-600",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all",
        active ? colorMap[color] : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function FilterSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );
}

export default function ApplicationList() {
  const {
    selectedApplicationId,
    selectApplication,
    statusFilter,
    typeFilter,
    roleFilter,
    nodeStatusFilter,
    searchQuery,
    setStatusFilter,
    setTypeFilter,
    setRoleFilter,
    setNodeStatusFilter,
    setSearchQuery,
    getFilteredApplications,
    getApplicationAlerts,
  } = useApprovalStore();

  const filteredApps = getFilteredApplications();

  const hasActiveFilter =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    roleFilter !== "all" ||
    nodeStatusFilter !== "all";

  const clearAllFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setRoleFilter("all");
    setNodeStatusFilter("all");
  };

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

        <div className="space-y-2">
          <FilterSection
            title="申请状态"
            icon={<Filter className="w-3 h-3 text-slate-400" />}
          >
            <FilterChip
              label="全部"
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              color="slate"
            />
            {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => {
              const statusKey = k as ApplicationStatus;
              const colors: Record<ApplicationStatus, "amber" | "emerald" | "rose" | "red"> = {
                pending: "amber",
                approved: "emerald",
                rejected: "rose",
                timeout: "red",
              };
              return (
                <FilterChip
                  key={k}
                  label={v}
                  icon={statusConfig[statusKey].icon}
                  active={statusFilter === k}
                  onClick={() => setStatusFilter(statusFilter === k ? "all" : statusKey)}
                  color={colors[statusKey]}
                />
              );
            })}
          </FilterSection>

          <FilterSection
            title="审批角色"
            icon={<Users className="w-3 h-3 text-slate-400" />}
          >
            <FilterChip
              label="全部"
              active={roleFilter === "all"}
              onClick={() => setRoleFilter("all")}
              color="slate"
            />
            {APPROVAL_ROLES.map((role) => (
              <FilterChip
                key={role}
                label={role}
                active={roleFilter === role}
                onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
                color="blue"
              />
            ))}
          </FilterSection>

          <FilterSection
            title="节点状态"
            icon={<GitBranch className="w-3 h-3 text-slate-400" />}
          >
            <FilterChip
              label="全部"
              active={nodeStatusFilter === "all"}
              onClick={() => setNodeStatusFilter("all")}
              color="slate"
            />
            {Object.entries(NODE_STATUS_LABELS).map(([k, v]) => {
              const nodeKey = k as NodeStatus;
              const colors: Record<NodeStatus, "amber" | "emerald" | "rose" | "red"> = {
                pending: "amber",
                approved: "emerald",
                rejected: "rose",
                timeout: "red",
                unassigned: "red",
              };
              const icons: Record<NodeStatus, React.ReactNode> = {
                pending: <Clock className="w-2.5 h-2.5" />,
                approved: <CheckCircle2 className="w-2.5 h-2.5" />,
                rejected: <XCircle className="w-2.5 h-2.5" />,
                timeout: <AlertTriangle className="w-2.5 h-2.5" />,
                unassigned: <UserX className="w-2.5 h-2.5" />,
              };
              return (
                <FilterChip
                  key={k}
                  label={v}
                  icon={icons[nodeKey]}
                  active={nodeStatusFilter === k}
                  onClick={() => setNodeStatusFilter(nodeStatusFilter === k ? "all" : nodeKey)}
                  color={colors[nodeKey]}
                />
              );
            })}
          </FilterSection>

          <FilterSection
            title="申请类型"
            icon={<FileText className="w-3 h-3 text-slate-400" />}
          >
            <FilterChip
              label="全部"
              active={typeFilter === "all"}
              onClick={() => setTypeFilter("all")}
              color="slate"
            />
            {Object.entries(APPLICATION_TYPE_LABELS).map(([k, v]) => (
              <FilterChip
                key={k}
                label={v}
                active={typeFilter === k}
                onClick={() => setTypeFilter(typeFilter === k ? "all" : (k as ApplicationType))}
                color="amber"
              />
            ))}
          </FilterSection>
        </div>

        {hasActiveFilter && (
          <button
            onClick={clearAllFilters}
            className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            <X className="w-3 h-3" />
            清除所有筛选
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FileText className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-xs">暂无匹配的申请</p>
            {hasActiveFilter && (
              <button
                onClick={clearAllFilters}
                className="mt-2 text-[10px] text-amber-500 hover:text-amber-600 transition-colors"
              >
                清除筛选条件
              </button>
            )}
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
