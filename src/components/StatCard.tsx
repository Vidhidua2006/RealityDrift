import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard = ({ label, value, icon: Icon, iconColor = 'text-primary' }: StatCardProps) => (
  <div className="rounded-lg border border-border bg-card p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Icon size={20} className={iconColor} />
    </div>
    <p className="text-3xl font-bold text-foreground">{value}</p>
  </div>
);

export default StatCard;
