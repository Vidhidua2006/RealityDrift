import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DriftMonitor from "./pages/DriftMonitor";
import Entities from "./pages/Entities";
import EventStream from "./pages/EventStream";
import DriftHistory from "./pages/DriftHistory";
import AILogs from "./pages/AILogs";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/drift-monitor" element={<ProtectedRoute><DriftMonitor /></ProtectedRoute>} />
            <Route path="/entities" element={<ProtectedRoute><Entities /></ProtectedRoute>} />
            <Route path="/event-stream" element={<ProtectedRoute><EventStream /></ProtectedRoute>} />
            <Route path="/drift-history" element={<ProtectedRoute><DriftHistory /></ProtectedRoute>} />
            <Route path="/ai-logs" element={<ProtectedRoute><AILogs /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
