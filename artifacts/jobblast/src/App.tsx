import { Switch, Route, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './lib/auth';

// Pages
import NotFound from '@/pages/not-found';
import LandingPage from './pages/landing';
import DashboardPage from './pages/dashboard';
import QueuePage from './pages/queue';
import JobsDetailPage from './pages/job-detail';
import ApplicationsPage from './pages/applications';
import ApplicationDetailPage from './pages/application-detail';
import ProfilePage from './pages/profile';

// Layout
import { Shell } from './components/layout/shell';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/sign-in"><Redirect to="/dashboard" /></Route>
        <Route path="/sign-up"><Redirect to="/dashboard" /></Route>
        
        <Route path="/dashboard"><Shell><DashboardPage /></Shell></Route>
        <Route path="/queue"><Shell><QueuePage /></Shell></Route>
        <Route path="/jobs/:id"><Shell><JobsDetailPage /></Shell></Route>
        <Route path="/applications"><Shell><ApplicationsPage /></Shell></Route>
        <Route path="/applications/:id"><Shell><ApplicationDetailPage /></Shell></Route>
        <Route path="/profile"><Shell><ProfilePage /></Shell></Route>
        
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={0}>
            <AppRoutes />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </WouterRouter>
  );
}

export default App;
