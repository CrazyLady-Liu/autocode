import { ACTIVITY_STATUS_MAP, CHANNEL_STATUS_MAP } from '../../types/activity';
import type { ActivityStatus, ChannelStatus } from '../../types/activity';

interface StatusBadgeProps {
  status: ActivityStatus | ChannelStatus;
  type?: 'activity' | 'channel';
}

export const StatusBadge = ({ status, type = 'activity' }: StatusBadgeProps) => {
  const config = type === 'activity'
    ? ACTIVITY_STATUS_MAP[status as ActivityStatus]
    : CHANNEL_STATUS_MAP[status as ChannelStatus];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${config.color}`}
    >
      {config.label}
    </span>
  );
};
