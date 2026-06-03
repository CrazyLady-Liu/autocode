import React from 'react';
import { Bell, RefreshCw, User, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const currentTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">库</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">库存补货协同看板</h1>
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                <Clock className="w-3 h-3 mr-1" />
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>刷新数据</span>
          </Button>

          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">管理员</p>
              <p className="text-xs text-gray-500">供应链部</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
