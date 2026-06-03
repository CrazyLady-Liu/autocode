import ApplicationList from "@/components/ApplicationList";
import ApprovalFlow from "@/components/ApprovalFlow";
import RolePermission from "@/components/RolePermission";
import OperationRecord from "@/components/OperationRecord";
import StatisticsChart from "@/components/StatisticsChart";
import AlertBanner from "@/components/AlertBanner";
import NodeDetailPanel from "@/components/NodeDetailPanel";
import { useApprovalStore } from "@/store/useApprovalStore";
import { LayoutDashboard, Moon, Sun } from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";

export default function Home() {
  const { currentUser, getCurrentRole, selectedNodeId } = useApprovalStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const role = getCurrentRole();

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <header className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-bold font-display text-slate-800 dark:text-slate-200 tracking-tight">
            审批工作台
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                {currentUser.name[0]}
              </span>
            </div>
            <span>{currentUser.name}</span>
            {role && (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium">
                {role.name}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <AlertBanner />

      <div className="flex-1 flex min-h-0">
        <aside className="w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0 overflow-hidden">
          <ApplicationList />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 flex min-h-0">
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-slate-700">
              <div className="flex-shrink-0">
                <ApprovalFlow />
              </div>
              {selectedNodeId && (
                <div className="h-80 flex-shrink-0 border-t border-slate-200 dark:border-slate-700 overflow-hidden">
                  <NodeDetailPanel />
                </div>
              )}
              <div className={clsx(
                "flex-1 min-h-0 border-t border-slate-200 dark:border-slate-700",
                !selectedNodeId && "border-t-0"
              )}>
                <OperationRecord />
              </div>
            </div>

            <aside className="w-72 flex-shrink-0 bg-white dark:bg-slate-900 overflow-hidden">
              <RolePermission />
            </aside>
          </div>

          <div className="h-64 flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <StatisticsChart />
          </div>
        </main>
      </div>
    </div>
  );
}
