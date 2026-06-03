import { cn } from '@/lib/utils';
import { getStatusText, getStatusColor } from '@/utils/formatters';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export default function StatusBadge({ status, size = 'md', pulse = false }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const text = getStatusText(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size]
      )}
      style={{ backgroundColor: `${color}15`, color }}
    >
      {pulse && (
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      )}
      {!pulse && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {text}
    </span>
  );
}
