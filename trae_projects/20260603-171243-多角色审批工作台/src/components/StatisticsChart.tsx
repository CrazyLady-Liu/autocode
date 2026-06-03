import { useApprovalStore } from "@/store/useApprovalStore";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { APPLICATION_STATUS_LABELS } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  approved: "#10B981",
  rejected: "#EF4444",
  timeout: "#DC2626",
};

export default function StatisticsChart() {
  const { applications } = useApprovalStore();

  const statusData = Object.entries(APPLICATION_STATUS_LABELS).map(
    ([key, label]) => ({
      name: label,
      value: applications.filter((a) => a.status === key).length,
      color: STATUS_COLORS[key],
    })
  );

  const departments = [...new Set(applications.map((a) => a.department))];
  const deptData = departments.map((dept) => {
    const deptApps = applications.filter((a) => a.department === dept);
    return {
      name: dept,
      待审批: deptApps.filter((a) => a.status === "pending").length,
      已通过: deptApps.filter((a) => a.status === "approved").length,
      已拒绝: deptApps.filter((a) => a.status === "rejected").length,
      已超时: deptApps.filter((a) => a.status === "timeout").length,
    };
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
            审批统计
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              状态分布
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              部门审批量
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={deptData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Bar dataKey="待审批" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="已通过" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="已拒绝" fill="#EF4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="已超时" fill="#DC2626" radius={[2, 2, 0, 0]} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 10 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {statusData.map((item) => (
            <div
              key={item.name}
              className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700 text-center"
            >
              <div
                className="text-lg font-bold font-display"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
