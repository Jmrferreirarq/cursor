import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TimeProvider } from './context/TimeContext';
import { DataProvider } from './context/DataContext';
import { MediaProvider } from './context/MediaContext';
import { PresentationProvider } from './context/PresentationContext';
import { useRemoveOverlays } from './hooks/useRemoveOverlays';
import Navbar from './components/common/Navbar';
import CommandBar from './components/common/CommandBar';
import GlobalUtilities from './components/common/GlobalUtilities';
import { PresentationOverlay, PresentationButton } from './components/common/PresentationOverlay';
import MobileNavigation from './components/common/MobileNavigation';
import { PWAInstallBanner, OfflineIndicator, UpdateAvailableBanner } from './components/common/PWAInstallBanner';

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
import ConstructionDetailsPage from './pages/ConstructionDetailsPage';
import ProposalsManagementPage from './pages/ProposalsManagementPage';
import MediaHubPage from './pages/MediaHubPage';
import AssetDetailPage from './pages/AssetDetailPage';
import PlannerPage from './pages/PlannerPage';
import ContentQueuePage from './pages/ContentQueuePage';
import ContentCalendarPage from './pages/ContentCalendarPage';
import PerformancePage from './pages/PerformancePage';
import EditorialDNAPage from './pages/EditorialDNAPage';
import AgentPage from './pages/AgentPage';
import MaterialLibraryPage from './pages/MaterialLibraryPage';
import StudioInboxPage from './pages/StudioInboxPage';
import BrandIdentityPage from './pages/BrandIdentityPage';
import CalculatorPage from './pages/CalculatorPage';
import LegislacaoPage from './pages/LegislacaoPage';
import PropostaPublicPage from './pages/PropostaPublicPage';
import PropostaShortPage from './pages/PropostaShortPage';
import PortfolioPublicPage from './pages/PortfolioPublicPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isPublic = location.pathname.startsWith('/public') || location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/p/');
  const isPortal = location.pathname.startsWith('/portal');
  useRemoveOverlays();

  if (isPublic || isPortal) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <GlobalUtilities />
        <OfflineIndicator />
        <UpdateAvailableBanner />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden overflow-y-auto" style={{ isolation: 'isolate' }}>
      <Navbar />
      <CommandBar />
      <GlobalUtilities />
      <PresentationOverlay />
      <PresentationButton />
      <MobileNavigation />
      <PWAInstallBanner />
      <OfflineIndicator />
      <UpdateAvailableBanner />
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-28 lg:pb-8 max-w-[2400px] mx-auto min-h-[calc(100vh-4rem)]" data-allow-shifts>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <MediaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TimeProvider>
          <Router>
            <PresentationProvider>
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
                <Route path="/media/:id" element={<AssetDetailPage />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/queue" element={
                  <ErrorBoundary fallback={<div className="p-8 border border-destructive/50 bg-destructive/5 rounded-xl"><h2 className="text-lg font-semibold text-destructive mb-2">Erro na Queue</h2><p className="text-muted-foreground text-sm mb-4">Abre F12 → Console para detalhes.</p><button type="button" onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Recarregar</button></div>}>
                    <ContentQueuePage />
                  </ErrorBoundary>
                } />
                <Route path="/content-calendar" element={
                  <ErrorBoundary fallback={<div className="p-8 border border-destructive/50 bg-destructive/5 rounded-xl"><h2 className="text-lg font-semibold text-destructive mb-2">Erro no Calendário</h2><p className="text-muted-foreground text-sm mb-4">Abre F12 → Console para detalhes.</p><button type="button" onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Recarregar</button></div>}>
                    <ContentCalendarPage />
                  </ErrorBoundary>
                } />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/editorial-dna" element={<EditorialDNAPage />} />
                <Route path="/agent" element={
                  <ErrorBoundary fallback={
                    <div className="p-8 rounded-xl border border-destructive/50 bg-destructive/5">
                      <h2 className="text-lg font-semibold text-destructive mb-2">Erro no Agente</h2>
                      <p className="text-muted-foreground text-sm mb-4">Ocorreu um erro ao carregar. Abre a consola (F12) para detalhes.</p>
                      <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Recarregar</button>
                    </div>
                  }>
                    <AgentPage />
                  </ErrorBoundary>
                } />
                <Route path="/technical" element={<TechnicalHubPage />} />
                <Route path="/technical/details" element={<ConstructionDetailsPage />} />
                <Route path="/legislacao" element={<LegislacaoPage />} />
                <Route path="/proposals" element={<ProposalsManagementPage />} />
                <Route path="/media" element={<MediaHubPage />} />
                <Route path="/library" element={<MaterialLibraryPage />} />
                <Route path="/inbox" element={<StudioInboxPage />} />
                <Route path="/brand" element={<BrandIdentityPage />} />
                <Route path="/calculator" element={
                  <ErrorBoundary fallback={
                    <div className="p-8 rounded-xl border border-destructive/50 bg-destructive/5">
                      <h2 className="text-lg font-semibold text-destructive mb-2">Erro na Calculadora</h2>
                      <p className="text-muted-foreground text-sm mb-4">Ocorreu um erro ao carregar. Abre a consola (F12) para detalhes.</p>
                      <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Recarregar</button>
                    </div>
                  }>
                    <CalculatorPage />
                  </ErrorBoundary>
                } />
                <Route path="/public/proposta" element={<PropostaPublicPage />} />
                <Route path="/p/:shortId" element={<PropostaShortPage />} />
                <Route path="/portfolio" element={<PortfolioPublicPage />} />
              </Routes>
            </AppLayout>
            </PresentationProvider>
          </Router>
          </TimeProvider>
        </LanguageProvider>
      </ThemeProvider>
      </MediaProvider>
    </DataProvider>
  );
}

export default App;
