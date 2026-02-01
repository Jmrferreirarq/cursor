import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TimeProvider } from './context/TimeContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/common/Navbar';
import CommandBar from './components/common/CommandBar';
import GlobalUtilities from './components/common/GlobalUtilities';

// Pages
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import TasksPage from './pages/TasksPage';
import FinancialPage from './pages/FinancialPage';
import CalendarPage from './pages/CalendarPage';
import MarketingPage from './pages/MarketingPage';
import TechnicalHubPage from './pages/TechnicalHubPage';
import ProposalsManagementPage from './pages/ProposalsManagementPage';
import MediaHubPage from './pages/MediaHubPage';
import MaterialLibraryPage from './pages/MaterialLibraryPage';
import StudioInboxPage from './pages/StudioInboxPage';
import BrandIdentityPage from './pages/BrandIdentityPage';
import CalculatorPage from './pages/CalculatorPage';
import PropostaPublicPage from './pages/PropostaPublicPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isPublic = location.pathname.startsWith('/public');
  const isPortal = location.pathname.startsWith('/portal');

  if (isPublic || isPortal) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <CommandBar />
      <GlobalUtilities />
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-28 max-w-[2400px] mx-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TimeProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/:id" element={<ClientDetailsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/financial" element={<FinancialPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/marketing" element={<MarketingPage />} />
                <Route path="/technical" element={<TechnicalHubPage />} />
                <Route path="/proposals" element={<ProposalsManagementPage />} />
                <Route path="/media" element={<MediaHubPage />} />
                <Route path="/library" element={<MaterialLibraryPage />} />
                <Route path="/inbox" element={<StudioInboxPage />} />
                <Route path="/brand" element={<BrandIdentityPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/public/proposta" element={<PropostaPublicPage />} />
              </Routes>
            </AppLayout>
          </Router>
          </TimeProvider>
        </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;
