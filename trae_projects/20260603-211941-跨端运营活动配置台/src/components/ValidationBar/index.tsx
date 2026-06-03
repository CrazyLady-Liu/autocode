import { useState } from 'react';
import { AlertCircle, AlertTriangle, X, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import type { ValidationItem } from '../../types/activity';

export const ValidationBar = () => {
  const { validationResult, saveActivity } = useActivityStore();
  const [expanded, setExpanded] = useState(false);

  if (!validationResult) return null;

  const { errors, warnings } = validationResult;

  const handleItemClick = (item: ValidationItem) => {
    console.log('Navigate to:', item.location);
  };

  const handleSave = () => {
    const success = saveActivity();
    if (success) {
      alert('活动保存成功！');
    } else {
      alert('请先修复所有错误后再保存');
      setExpanded(true);
    }
  };

  const totalIssues = errors.length + warnings.length;

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 flex-1"
      >
        {validationResult.valid ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <span className="text-sm font-medium text-green-700">校验通过</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
          {errors.length > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{errors.length} 个错误</span>
              </div>
          )}
          {warnings.length > 0 && (
              <div className="flex items-center gap-1 text-yellow-500 ml-3">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">{warnings.length} 个警告</span>
              </div>
          )}
          </div>
        )}
        {totalIssues > 0 && (
          <span className="text-xs text-gray-400">
            共 {totalIssues} 个问题待处理
          </span>
        )}
        {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            validationResult.valid
              ? 'bg-[#2DD4BF] text-white hover:bg-teal-500'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!validationResult.valid}
        >
          保存活动
        </button>
      </div>
      </div>

      {expanded && totalIssues > 0 && (
        <div className="border-t border-gray-100 max-h-48 overflow-y-auto">
          {errors.length > 0 && (
            <div className="px-4 py-2">
              <p className="text-xs font-medium text-red-600 mb-2">错误</p>
              <div className="space-y-1">
                {errors.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex items-start gap-2 p-2 rounded hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-red-700 flex-1">{item.message}</span>
                    <button className="p-0.5 text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="px-4 py-2 bg-yellow-50/50">
              <p className="text-xs font-medium text-yellow-600 mb-2">警告</p>
              <div className="space-y-1">
                {warnings.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex items-start gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer transition-colors"
                  >
                    <AlertTriangle size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-yellow-700 flex-1">{item.message}</span>
                    <button className="p-0.5 text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
