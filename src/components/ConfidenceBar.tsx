import { TrendingUp } from 'lucide-react';

const ConfidenceBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-3">
    <TrendingUp size={16} className="text-primary" />
    <span className="text-sm text-muted-foreground">Confidence</span>
    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${value}%` }} />
    </div>
    <span className="text-sm font-mono text-foreground">{value}%</span>
  </div>
);

export default ConfidenceBar;
