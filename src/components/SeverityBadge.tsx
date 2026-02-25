import { cn } from '@/lib/utils';

const SeverityBadge = ({ severity }: { severity: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
  return (
    <span className={cn(
      'px-3 py-1 rounded text-xs font-mono font-semibold tracking-wider',
      severity === 'LOW' && 'bg-severity-low/15 severity-low border border-severity-low/30',
      severity === 'MEDIUM' && 'bg-severity-medium/15 severity-medium border border-severity-medium/30',
      severity === 'HIGH' && 'bg-severity-high/15 severity-high border border-severity-high/30',
    )}>
      {severity}
    </span>
  );
};

export default SeverityBadge;
