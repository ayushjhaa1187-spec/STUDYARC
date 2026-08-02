import React, { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DiagnosticModal from './components/DiagnosticModal';
import MentorModal from './components/MentorModal';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import JourneysPage from './pages/JourneysPage';
import WorkspacePage from './pages/WorkspacePage';
import MentorsPage from './pages/MentorsPage';
import PortfolioPage from './pages/PortfolioPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import GenericPage from './pages/GenericPage';

import { DashboardSkeleton, GridSkeleton, FeedSkeleton } from './components/SkeletonLoader';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { INITIAL_USER, MENTORS } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('/');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [user, setUser] = useState(INITIAL_USER);
  const lenis = useLenis();
  const { 
    isSlowConnection, 
    simulatedSlow, 
    setSimulatedSlow, 
    triggerSimulatedLoad 
  } = useNetworkStatus();


  // Handle smooth page switching with skeleton transition if network is slow
  const handlePageChange = (newPage) => {
    triggerSimulatedLoad(isSlowConnection ? 1200 : 300);
    setActivePage(newPage);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  };

  const openMentorModal = (mentor = null) => {
    setSelectedMentor(mentor || MENTORS[0]);
  };

  const handleDiagnosticComplete = (result) => {
    setUser(prev => ({
      ...prev,
      readinessScore: result.score,
      role: result.targetRole
    }));
    handlePageChange('/dashboard');
  };

  const isLanding = activePage === '/';
  const isAuth = activePage === '/login';

  return (
    <div className="min-h-screen bg-bright-bg text-slate-100 font-sans selection:bg-brand-cyan selection:text-black">
      
      {/* Global Top Header Navbar */}
      {!isLanding && (
        <Navbar
          activePage={activePage}
          setActivePage={handlePageChange}
          openDiagnostic={() => setIsDiagnosticOpen(true)}
          user={user}
          simulatedSlow={simulatedSlow}
          setSimulatedSlow={setSimulatedSlow}
        />
      )}

      <div className="flex">
        
        {/* Sidebar Navigation for app routes */}
        {!isLanding && !isAuth && (
          <Sidebar
            activePage={activePage}
            setActivePage={handlePageChange}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            openDiagnostic={() => setIsDiagnosticOpen(true)}
          />
        )}

        {/* Main Route Content View */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
            !isLanding && !isAuth ? (isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64') : 'mx-auto max-w-7xl'
          }`}
        >
          {/* SKELETON UI UX FOR SLOW INTERNET / LOADING */}
          {isSlowConnection ? (
            <div className="space-y-6">
              {activePage === '/dashboard' && <DashboardSkeleton />}
              {activePage === '/community' && <FeedSkeleton />}
              {(activePage === '/journeys' || activePage === '/mentors' || activePage === '/portfolio') && <GridSkeleton count={6} />}
              {activePage === '/' && <DashboardSkeleton />}
              {activePage === '/challenges' && <GridSkeleton count={3} />}
              {activePage === '/settings' && <DashboardSkeleton />}
              {activePage === '/login' && <GridSkeleton count={2} />}
            </div>
          ) : (
            <>
              {activePage === '/' && (
                <LandingPage
                  setActivePage={handlePageChange}
                  openDiagnostic={() => setIsDiagnosticOpen(true)}
                />
              )}

              {activePage === '/login' && (
                <AuthPage
                  onLoginSuccess={(userData) => setUser(prev => ({ ...prev, ...userData }))}
                  setActivePage={handlePageChange}
                />
              )}

              {activePage === '/dashboard' && (
                <DashboardPage
                  user={user}
                  setActivePage={handlePageChange}
                  openDiagnostic={() => setIsDiagnosticOpen(true)}
                  openMentorModal={openMentorModal}
                />
              )}

              {activePage === '/journeys' && (
                <JourneysPage setActivePage={handlePageChange} />
              )}

              {activePage === '/challenges' && (
                <WorkspacePage />
              )}

              {activePage === '/mentors' && (
                <MentorsPage openMentorModal={openMentorModal} />
              )}

              {activePage === '/portfolio' && (
                <PortfolioPage />
              )}

              {activePage === '/community' && (
                <CommunityPage openMentorModal={openMentorModal} />
              )}

              {activePage === '/settings' && (
                <SettingsPage user={user} setUser={setUser} />
              )}

              {activePage === '/admin' && (
                <AdminDashboard />
              )}

              {/* Missing Footer Pages */}
              {['/features', '/pricing', '/marketplace', '/blog', '/guides', '/success-stories', '/help', '/about', '/careers', '/privacy', '/terms'].includes(activePage) && (
                <GenericPage 
                  title={
                    activePage === '/features' ? 'Features' :
                    activePage === '/pricing' ? 'Pricing' :
                    activePage === '/marketplace' ? 'Expert Marketplace' :
                    activePage === '/blog' ? 'Blog' :
                    activePage === '/guides' ? 'Career Guides' :
                    activePage === '/success-stories' ? 'Success Stories' :
                    activePage === '/help' ? 'Help Center' :
                    activePage === '/about' ? 'About Us' :
                    activePage === '/careers' ? 'Careers' :
                    activePage === '/privacy' ? 'Privacy Policy' :
                    'Terms of Service'
                  } 
                  setActivePage={handlePageChange} 
                />
              )}
            </>
          )}
        </main>
      </div>
      
      {!isLanding && <Footer setActivePage={setActivePage} />}

      {/* Global Interactive Modals */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onComplete={handleDiagnosticComplete}
      />

      <MentorModal
        mentor={selectedMentor}
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
      />

    </div>
  );
}
