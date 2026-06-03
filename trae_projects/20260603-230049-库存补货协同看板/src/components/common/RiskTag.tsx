import type { RiskLevel, RiskReason } from '@/types';
import { getRiskLevelColor, getRiskLevelText, getRiskReasonText } from '@/utils/riskCalculator';
import { cn } from '@/lib/utils';

interface RiskTagProps {
  level: RiskLevel;
  reason?: RiskReason;
  showReason?: boolean;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export default function RiskTag({ level, reason, showReason = false, size = 'md', pulse = false }: RiskTagProps) {
  const color = getRiskLevelColor(level);
  const levelText = getRiskLevelText(level);
  const reasonText = reason ? getRiskReasonText(reason) : '';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium',
        sizeClasses[size]
      )}
      style={{
        backgroundColor: `${color}20`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        className={cn('w-2 h-2 rounded-full', pulse && 'animate-pulse')}
        style={{ backgroundColor: color }}
      />
      {showReason && reason ? (
        <span>{reasonText}</span>
      ) : (
        <span>{levelText}</span>
      )}
    </span>
  );
}
