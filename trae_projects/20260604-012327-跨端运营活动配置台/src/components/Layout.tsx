import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, List, Settings, BarChart3 } from 'lucide-react'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '概览' },
  { path: '/activities', icon: List, label: '活动列表' },
  { path: '/channels', icon: Settings, label: '渠道管理' },
  { path: '/analytics', icon: BarChart3, label: '数据分析' }
]

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">运营活动平台</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout
