import type { Ticket, TicketPriority } from "@/types/ticket";

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
}

const priorityConfig: Record<TicketPriority, { label: string; class: string }> = {
  low: { label: "低", class: "bg-white/10 text-white/50" },
  medium: { label: "中", class: "bg-sky-500/20 text-sky-400" },
  high: { label: "高", class: "bg-amber-500/20 text-amber-400" },
  urgent: { label: "紧急", class: "bg-rose-500/20 text-rose-400" },
};

const categoryLabels: Record<string, string> = {
  technical: "技术",
  billing: "账单",
  account: "账户",
  general: "咨询",
  feature: "功能",
};

function TicketItem({ ticket, isSelected, onClick }: { ticket: Ticket; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
        isSelected ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={ticket.customer.avatar}
          alt={ticket.customer.name}
          className="w-9 h-9 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-mono text-white/40">{ticket.id}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priorityConfig[ticket.priority].class}`}>
              {priorityConfig[ticket.priority].label}
            </span>
          </div>
          <h3 className="text-sm font-medium text-white truncate">{ticket.subject}</h3>
          <p className="text-xs text-white/40 truncate mt-0.5">{ticket.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                {categoryLabels[ticket.category]}
              </span>
              {ticket.tags.slice(0, 1).map((tag) => (
                <span key={tag} className="text-[10px] text-white/30">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-white/30">{ticket.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white flex items-center justify-between">
          <span>工单队列</span>
          <span className="text-xs font-normal text-white/40">{tickets.length} 条</span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-sm">
            暂无工单
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketItem
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedId === ticket.id}
              onClick={() => onSelect(ticket)}
            />
          ))
        )}
      </div>
    </div>
  );
}
