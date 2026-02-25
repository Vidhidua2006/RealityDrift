import { DriftAnalysis } from '@/lib/types';
import SeverityBadge from './SeverityBadge';
import ConfidenceBar from './ConfidenceBar';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DriftCard = ({ drift }: { drift: DriftAnalysis }) => (
  <div className="rounded-lg border border-border bg-card p-5 space-y-4">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-foreground">{drift.entityName}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Clock size={12} />
          {formatDistanceToNow(new Date(drift.timestamp), { addSuffix: true })}
        </p>
      </div>
      <SeverityBadge severity={drift.severity} />
    </div>
    <p className="text-sm text-muted-foreground">{drift.changeSummary}</p>
    <ConfidenceBar value={drift.confidence} />
    <p className="text-xs text-muted-foreground/80 border-t border-border pt-3">
      {drift.explanation}
    </p>
  </div>
);

export default DriftCard;
