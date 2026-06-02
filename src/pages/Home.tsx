import { useState, useMemo } from "react";
import StatusBar from "@/components/StatusBar";
import TicketList from "@/components/TicketList";
import TicketDetail from "@/components/TicketDetail";
import { mockTickets, getTicketStats } from "@/data/mockTickets";
import type { Ticket, TicketStatus } from "@/types/ticket";

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeFilter, setActiveFilter] = useState<TicketStatus | "all">("all");

  const stats = useMemo(() => getTicketStats(mockTickets), []);

  const filteredTickets = useMemo(() => {
    if (activeFilter === "all") return mockTickets;
    return mockTickets.filter((t) => t.status === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="fixed inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-violet/5 pointer-events-none" />
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.15) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 h-screen flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              客服工单看板
            </h1>
            <p className="text-white/40 text-sm mt-1">实时处理客户问题</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="font-medium">3</span>
            </div>
            <button className="px-4 py-1.5 bg-accent-cyan/20 hover:bg-accent-cyan/30 text-accent-cyan rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
          </div>
        </div>

        <div className="mb-4">
          <StatusBar
            stats={stats}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          <div className="col-span-4 min-h-0">
            <TicketList
              tickets={filteredTickets}
              selectedId={selectedTicket?.id || null}
              onSelect={setSelectedTicket}
            />
          </div>
          <div className="col-span-8 min-h-0">
            <TicketDetail ticket={selectedTicket} />
          </div>
        </div>
      </div>
    </div>
  );
}
