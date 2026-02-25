import Sidebar from './Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Sidebar />
    <main className="ml-60 p-8">
      {children}
    </main>
  </div>
);

export default DashboardLayout;
