import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import BuildVersion from './components/common/BuildVersion';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-loaded pages — each page is only downloaded when the user navigates to it
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ClientDetailsPage = lazy(() => import('./pages/ClientDetailsPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const FinancialPage = lazy(() => import('./pages/FinancialPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const MarketingPage = lazy(() => import('./pages/MarketingPage'));
const TechnicalHubPage = lazy(() => import('./pages/TechnicalHubPage'));
const ConstructionDetailsPage = lazy(() => import('./pages/ConstructionDetailsPage'));
const ProposalsManagementPage = lazy(() => import('./pages/ProposalsManagementPage'));
const MediaHubPage = lazy(() => import('./pages/MediaHubPage'));
const AssetDetailPage = lazy(() => import('./pages/AssetDetailPage'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const PerformancePage = lazy(() => import('./pages/PerformancePage'));
const EditorialDNAPage = lazy(() => import('./pages/EditorialDNAPage'));
const AgentPage = lazy(() => import('./pages/AgentPage'));
const MaterialLibraryPage = lazy(() => import('./pages/MaterialLibraryPage'));
const StudioInboxPage = lazy(() => import('./pages/StudioInboxPage'));
const BrandIdentityPage = lazy(() => import('./pages/BrandIdentityPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const LegislacaoPage = lazy(() => import('./pages/LegislacaoPage'));
const ConsultaLegislacaoPage = lazy(() => import('./pages/ConsultaLegislacaoPage'));
const ChecklistPage = lazy(() => import('./pages/ChecklistPage'));
const MunicipiosPage = lazy(() => import('./pages/MunicipiosPage'));
const PropostaPublicPage = lazy(() => import('./pages/PropostaPublicPage'));
const PropostaShortPage = lazy(() => import('./pages/PropostaShortPage'));
const PortfolioPublicPage = lazy(() => import('./pages/PortfolioPublicPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SpecialistsPage = lazy(() => import('./pages/SpecialistsPage'));
const TrashPage = lazy(() => import('./pages/TrashPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isPublic = location.pathname.startsWith('/cotacao') || location.pathname.startsWith('/proposta') || location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/p/');
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
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-28 lg:pb-24 max-w-[2400px] mx-auto min-h-[calc(100vh-4rem)]" data-allow-shifts>
        {children}
      </main>
      <BuildVersion />
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
              <ErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                </div>
              }>
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
                <Route path="/queue" element={<Navigate to="/planner" replace />} />
                <Route path="/content-calendar" element={<Navigate to="/planner" replace />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/editorial-dna" element={<EditorialDNAPage />} />
                <Route path="/agent" element={<AgentPage />} />
                <Route path="/technical" element={<TechnicalHubPage />} />
                <Route path="/technical/details" element={<ConstructionDetailsPage />} />
                <Route path="/legislacao" element={<LegislacaoPage />} />
                <Route path="/consulta-legislacao" element={<ConsultaLegislacaoPage />} />
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/municipios" element={<MunicipiosPage />} />
                <Route path="/proposals" element={<ProposalsManagementPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/specialists" element={<SpecialistsPage />} />
                <Route path="/media" element={<MediaHubPage />} />
                <Route path="/library" element={<MaterialLibraryPage />} />
                <Route path="/inbox" element={<StudioInboxPage />} />
                <Route path="/brand" element={<BrandIdentityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/trash" element={<TrashPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/cotacao" element={<PropostaPublicPage />} />
                <Route path="/proposta" element={<PropostaPublicPage />} />
                <Route path="/p/:shortId" element={<PropostaShortPage />} />
                <Route path="/portfolio" element={<PortfolioPublicPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </Suspense>
              </ErrorBoundary>
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
