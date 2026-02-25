import { Activity } from 'lucide-react';

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const iconSize = size === 'lg' ? 32 : size === 'md' ? 24 : 20;
  const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-base';
  
  return (
    <div className="flex items-center gap-2">
      <Activity className="text-primary" size={iconSize} />
      <div>
        <span className={`${textSize} font-bold tracking-tight text-foreground`}>REALITY-DRIFT</span>
        {size !== 'sm' && (
          <p className="text-xs text-muted-foreground -mt-1">Intelligence Platform</p>
        )}
      </div>
    </div>
  );
};

export default Logo;
