import React from 'react';
import { LayoutDashboard, AlertTriangle, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    id: 'dashboard',
    label: '库存看板',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    id: 'simulation',
    label: '模拟预警',
    icon: AlertTriangle,
    path: '/simulation',
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: Settings,
    path: '/settings',
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">导航菜单</h2>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-2">系统状态</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">数据同步正常</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
