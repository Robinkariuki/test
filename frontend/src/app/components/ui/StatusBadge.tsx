// src/components/ui/StatusBadge.tsx
import type { ServerStatus, AlertSeverity } from '@/types';

const styles = {
  online:   'bg-green-100 text-green-800',
  degraded: 'bg-amber-100 text-amber-800',
  offline:  'bg-red-100 text-red-800',
  critical: 'bg-red-100 text-red-800',
  warning:  'bg-amber-100 text-amber-800',
};

export default function StatusBadge({ status }: { status: ServerStatus | AlertSeverity }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}