import type { TicketStats, TicketStatus } from "@/types/ticket";

interface StatusBarProps {
  stats: TicketStats;
  activeFilter: TicketStatus | "all";
  onFilterChange: (filter: TicketStatus | "all") => void;
}

const statusConfig: Record<TicketStatus | "all", { label: string; color: string; bg: string; dot: string }> = {
  all: { label: "全部", color: "text-white/70", bg: "bg-white/5", dot: "bg-white/40" },
  open: { label: "待处理", color: "text-sky-400", bg: "bg-sky-500/10", dot: "bg-sky-400" },
  pending: { label: "待跟进", color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
  in_progress: { label: "处理中", color: "text-violet-400", bg: "bg-violet-500/10", dot: "bg-violet-400" },
  resolved: { label: "已解决", color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  closed: { label: "已关闭", color: "text-white/50", bg: "bg-white/5", dot: "bg-white/30" },
};

export default function StatusBar({ stats, activeFilter, onFilterChange }: StatusBarProps) {
  const items = [
    { key: "all" as const, count: stats.open + stats.pending + stats.inProgress + stats.resolved + stats.closed },
    { key: "open" as const, count: stats.open },
    { key: "pending" as const, count: stats.pending },
    { key: "in_progress" as const, count: stats.inProgress },
    { key: "resolved" as const, count: stats.resolved },
    { key: "closed" as const, count: stats.closed },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        {items.map((item) => {
          const config = statusConfig[item.key];
          const isActive = activeFilter === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onFilterChange(item.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? `${config.bg} border border-white/10`
                  : "hover:bg-white/5"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${config.dot}`} />
              <span className={`font-medium ${isActive ? config.color : "text-white/60"}`}>
                {config.label}
              </span>
              <span
                className={`text-sm px-2 py-0.5 rounded-full ${isActive ? "bg-white/10 text-white" : "bg-white/5 text-white/40"}`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
