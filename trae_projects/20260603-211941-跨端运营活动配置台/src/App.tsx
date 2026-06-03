import { useEffect, useState } from 'react';
import { LayoutDashboard, Activity, BarChart3, Settings, Eye, Layers } from 'lucide-react';
import { useActivityStore } from './store/useActivityStore';
import { ActivityList } from './components/ActivityList';
import { RuleEditor } from './components/RuleEditor';
import { ChannelPanel } from './components/ChannelPanel';
import { LivePreview } from './components/LivePreview';
import { DataOverview } from './components/DataOverview';
import { ValidationBar } from './components/ValidationBar';

type RightPanelTab = 'preview' | 'data';

function App() {
  const { initData, selectedActivity, validateCurrentActivity } = useActivityStore();
  const [rightTab, setRightTab] = useState<RightPanelTab>('preview');

  useEffect(() => {
    initData();
  }, [initData]);

  useEffect(() => {
    if (selectedActivity) {
      validateCurrentActivity();
    }
  }, [selectedActivity, validateCurrentActivity]);

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <header className="h-14 bg-[#1E3A5F] text-white flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2DD4BF] to-teal-400 flex items-center justify-center">
            <Layers size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold">运营活动配置台</h1>
            <p className="text-[10px] text-gray-300">Multi-channel Activity Platform</p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {[
            { icon: LayoutDashboard, label: '工作台', active: true },
            { icon: Activity, label: '活动管理', active: false },
            { icon: BarChart3, label: '数据分析', active: false },
            { icon: Settings, label: '系统设置', active: false },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-[#2DD4BF] flex items-center justify-center text-sm font-bold">
            运
          </div>
          <span className="text-sm">运营管理员</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 flex-shrink-0">
          <ActivityList />
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 min-w-0">
              <RuleEditor />
            </div>

            <aside className="w-80 flex-shrink-0">
              <ChannelPanel />
            </aside>
          </div>

          <ValidationBar />
        </main>

        <aside className="w-96 flex-shrink-0 flex flex-col border-l border-gray-200">
          <div className="h-10 bg-white border-b border-gray-200 flex">
            <button
              onClick={() => setRightTab('preview')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm transition-colors ${
                rightTab === 'preview'
                  ? 'text-[#1E3A5F] border-b-2 border-[#1E3A5F] font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye size={14} />
              实时预览
            </button>
            <button
              onClick={() => setRightTab('data')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm transition-colors ${
                rightTab === 'data'
                  ? 'text-[#1E3A5F] border-b-2 border-[#1E3A5F] font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 size={14} />
              数据概览
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {rightTab === 'preview' ? <LivePreview /> : <DataOverview />}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
