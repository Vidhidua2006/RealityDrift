import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-6 max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <SettingsIcon className="text-primary" size={20} />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.email}</p>
            <p className="text-sm text-muted-foreground">Authenticated user</p>
          </div>
        </div>
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="font-semibold text-foreground">Platform Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">Version</p><p className="text-foreground font-mono">2.0.0</p></div>
            <div><p className="text-muted-foreground">AI Engine</p><p className="text-foreground font-mono">Gemini Flash </p></div>
            <div><p className="text-muted-foreground">Architecture</p><p className="text-foreground font-mono">Realtime Streaming</p></div>
            <div><p className="text-muted-foreground">Status</p><p className="severity-low font-mono">● Online</p></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
