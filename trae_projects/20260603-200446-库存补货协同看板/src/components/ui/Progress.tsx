import React from 'react';

type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  height?: string;
  className?: string;
}

const variantColors: Record<ProgressVariant, string> = {
  default: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  showLabel = false,
  height = 'h-2',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${variantColors[variant]} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 mt-1 block">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

export default Progress;
