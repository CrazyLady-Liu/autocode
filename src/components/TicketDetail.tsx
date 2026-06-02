import { useState } from "react";
import type { Ticket, TicketStatus, TicketActivity } from "@/types/ticket";

interface TicketDetailProps {
  ticket: Ticket | null;
}

const statusConfig: Record<TicketStatus, { label: string; class: string }> = {
  open: { label: "待处理", class: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  pending: { label: "待跟进", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  in_progress: { label: "处理中", class: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  resolved: { label: "已解决", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  closed: { label: "已关闭", class: "bg-white/10 text-white/50 border-white/20" },
};

const categoryLabels: Record<string, string> = {
  technical: "技术问题",
  billing: "账单问题",
  account: "账户问题",
  general: "一般咨询",
  feature: "功能建议",
};

function ActivityItem({ activity }: { activity: TicketActivity }) {
  const getIcon = () => {
    switch (activity.type) {
      case "status_change":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case "assignment":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "attachment":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
    }
  };

  const bgClass =
    activity.type === "comment" ? "bg-white/5 border-white/10" : "bg-violet-500/5 border-violet-500/20";

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white/50">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <img src={activity.authorAvatar} alt="" className="w-5 h-5 rounded-full" />
          <span className="text-sm font-medium text-white">{activity.author}</span>
          <span className="text-xs text-white/30">{activity.timestamp}</span>
        </div>
        <div className={`p-3 rounded-lg border ${bgClass}`}>
          <p className="text-sm text-white/80">{activity.content}</p>
          {activity.metadata && activity.type === "status_change" && activity.metadata.newStatus && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusConfig[activity.metadata.newStatus].class}`}>
                {statusConfig[activity.metadata.newStatus].label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const [replyText, setReplyText] = useState("");

  if (!ticket) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-white/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-white/30">选择一个工单查看详情</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-white/40">{ticket.id}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[ticket.status].class}`}>
                {statusConfig[ticket.status].label}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">{ticket.subject}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <img src={ticket.customer.avatar} alt="" className="w-9 h-9 rounded-full" />
            <div>
              <p className="text-sm font-medium text-white">{ticket.customer.name}</p>
              <p className="text-xs text-white/40">{ticket.customer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src={ticket.assignee.avatar} alt="" className="w-9 h-9 rounded-full" />
            <div>
              <p className="text-sm font-medium text-white">{ticket.assignee.name}</p>
              <p className="text-xs text-white/40">处理人</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50">
            {categoryLabels[ticket.category]}
          </span>
          {ticket.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded bg-violet-500/10 text-violet-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">问题描述</p>
        <p className="text-sm text-white/70 leading-relaxed">{ticket.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
          <span>创建: {ticket.createdAt}</span>
          <span>更新: {ticket.updatedAt}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-4">活动记录 ({ticket.activities.length})</p>
        <div className="space-y-4">
          {ticket.activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="输入回复内容..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan/50 resize-none"
            rows={2}
          />
          <button className="px-4 py-2 bg-accent-cyan/20 hover:bg-accent-cyan/30 text-accent-cyan rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            发送回复
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            附件
          </button>
          <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            模板
          </button>
          <select className="ml-auto bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/70 focus:outline-none">
            <option value="">更新状态</option>
            <option value="in_progress">处理中</option>
            <option value="pending">待跟进</option>
            <option value="resolved">已解决</option>
            <option value="closed">已关闭</option>
          </select>
        </div>
      </div>
    </div>
  );
}
