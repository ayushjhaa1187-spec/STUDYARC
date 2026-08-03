import React, { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react';

// Layout
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Global Modals
import DiagnosticModal from './components/DiagnosticModal';
import MentorModal from './components/MentorModal';
import CartCheckoutModal from './components/CartCheckoutModal';
import ChatbotWidget from './components/ChatbotWidget';

// Skeleton loaders
import { DashboardSkeleton, GridSkeleton, FeedSkeleton } from './components/SkeletonLoader';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import JourneysPage from './pages/JourneysPage';
import WorkspacePage from './pages/WorkspacePage';
import PortfolioPage from './pages/PortfolioPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import GenericPage from './pages/GenericPage';
import CoursesPage from './pages/CoursesPage';

// New Pages
import CatalogPage from './pages/CatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LearnWorkspacePage from './pages/LearnWorkspacePage';
import ExpertsPage from './pages/ExpertsPage';
import ExpertProfilePage from './pages/ExpertProfilePage';
import BookingPage from './pages/BookingPage';

// Hooks & Data
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { INITIAL_USER, INITIAL_MENTOR_USER, INITIAL_ADMIN_USER, EXPERTS, DAILY_TASKS } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('/');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [user, setUser] = useState(INITIAL_USER);
  const [sprintTasks, setSprintTasks] = useState(DAILY_TASKS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Route params (simulating URL params without React Router)
  const [routeParams, setRouteParams] = useState({});

  const lenis = useLenis();
  const { isSlowConnection, simulatedSlow, setSimulatedSlow, triggerSimulatedLoad } = useNetworkStatus();

  // Navigate with optional params
  const handlePageChange = (newPage, params = {}) => {
    triggerSimulatedLoad(isSlowConnection ? 1200 : 300);
    setActivePage(newPage);
    setRouteParams(params);
    if (lenis) lenis.scrollTo(0, { immediate: true });
  };

  const openMentorModal = (mentor = null) => {
    setSelectedMentor(mentor || EXPERTS[0]);
  };

  const handleDiagnosticComplete = (result) => {
    setUser(prev => ({
      ...prev,
      readinessScore: result.score,
      role: result.targetRole,
      sprintName: result.recommendedJourney
    }));
    const generatedTasks = result.gapAnalysis.map((gap, idx) => ({
      id: 100 + idx,
      title: 'Address Gap: ' + gap.replace(/\.$/, ''),
      journey: result.recommendedJourney,
      difficulty: idx === 0 ? 'Easy' : (idx === 1 ? 'Medium' : 'Hard'),
      estimate: (idx + 1) + 'h',
      completed: false,
      dueTime: 'Today'
    }));
    setSprintTasks([...generatedTasks, ...DAILY_TASKS.slice(1)]);
    handlePageChange('/dashboard');
  };

  const isLanding = activePage === '/';
  const isAuth = activePage === '/login';

  // Pages that use the full app shell
  const FOOTER_PAGES = ['/features', '/pricing', '/marketplace', '/blog', '/guides', '/success-stories', '/help', '/about', '/careers', '/privacy', '/terms'];
  const isGenericPage = FOOTER_PAGES.includes(activePage);

  const getSkeletonForPage = () => {
    if (activePage === '/dashboard') return <DashboardSkeleton />;
    if (activePage === '/community') return <FeedSkeleton />;
    return <GridSkeleton count={6} />;
  };

  return (
    <div className="min-h-screen bg-bright-bg text-slate-100 font-sans selection:bg-brand-cyan selection:text-black">

      {/* Global Top Navbar — hidden on landing + auth */}
      {!isLanding && !isAuth && (
        <Navbar
          activePage={activePage}
          setActivePage={handlePageChange}
          openDiagnostic={() => setIsDiagnosticOpen(true)}
          user={user}
          simulatedSlow={simulatedSlow}
          setSimulatedSlow={setSimulatedSlow}
          cartCount={cart.length}
          openCart={() => setIsCartOpen(true)}
        />
      )}

      <div className="flex">
        {/* Sidebar — shown on inner app pages */}
        {!isLanding && !isAuth && (
          <Sidebar
            activePage={activePage}
            setActivePage={handlePageChange}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            openDiagnostic={() => setIsDiagnosticOpen(true)}
            userRole={user.role}
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isLanding || isAuth
              ? 'w-full'
              : `${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 sm:p-6 lg:p-8`
          }`}
        >
          {/* Slow network skeleton */}
          {isSlowConnection && !isLanding && !isAuth ? (
            <div className="space-y-6">{getSkeletonForPage()}</div>
          ) : (
            <>
              {/* ── Landing ── */}
              {activePage === '/' && (
                <LandingPage
                  setActivePage={handlePageChange}
                  openDiagnostic={() => setIsDiagnosticOpen(true)}
                />
              )}

              {/* ── Auth ── */}
              {activePage === '/login' && (
                <AuthPage
                  onLoginSuccess={(userData) => {
                    let baseUser = INITIAL_USER;
                    if (userData.role === 'mentor') baseUser = INITIAL_MENTOR_USER;
                    if (userData.role === 'admin') baseUser = INITIAL_ADMIN_USER;
                    setUser({ ...baseUser, ...userData });
                  }}
                  setActivePage={handlePageChange}
                />
              )}

              {/* ── Dashboard ── */}
              {activePage === '/dashboard' && (
                <DashboardPage
                  user={user}
                  setActivePage={handlePageChange}
                  openDiagnostic={() => setIsDiagnosticOpen(true)}
                  openMentorModal={openMentorModal}
                  tasks={sprintTasks}
                  setTasks={setSprintTasks}
                />
              )}

              {/* ── Course Catalog ── */}
              {activePage === '/catalog' && (
                <CatalogPage setActivePage={handlePageChange} />
              )}

              {/* ── Course Detail ── */}
              {activePage === '/course' && (
                <CourseDetailPage
                  courseId={routeParams.courseId}
                  setActivePage={handlePageChange}
                  openMentorModal={openMentorModal}
                />
              )}

              {/* ── Learning Workspace ── */}
              {activePage === '/learn' && (
                <LearnWorkspacePage
                  courseId={routeParams.courseId}
                  setActivePage={handlePageChange}
                  openMentorModal={openMentorModal}
                />
              )}

              {/* ── Legacy Courses (keep for compatibility) ── */}
              {activePage === '/courses' && (
                <CoursesPage cart={cart} setCart={setCart} />
              )}

              {/* ── Journeys ── */}
              {activePage === '/journeys' && (
                <JourneysPage setActivePage={handlePageChange} />
              )}

              {/* ── Sprint Workspace (Challenges) ── */}
              {activePage === '/challenges' && (
                <WorkspacePage
                  tasks={sprintTasks}
                  setTasks={setSprintTasks}
                  user={user}
                />
              )}

              {/* ── Experts Marketplace ── */}
              {activePage === '/experts' && (
                <ExpertsPage
                  setActivePage={handlePageChange}
                  openMentorModal={openMentorModal}
                />
              )}

              {/* ── Legacy Mentors (redirect to experts) ── */}
              {activePage === '/mentors' && (
                <ExpertsPage
                  setActivePage={handlePageChange}
                  openMentorModal={openMentorModal}
                />
              )}

              {/* ── Expert Profile ── */}
              {activePage === '/expert-profile' && (
                <ExpertProfilePage
                  expertId={routeParams.expertId}
                  setActivePage={handlePageChange}
                />
              )}

              {/* ── Booking Flow ── */}
              {activePage === '/booking' && (
                <BookingPage
                  expertId={routeParams.expertId}
                  serviceId={routeParams.serviceId}
                  setActivePage={handlePageChange}
                />
              )}

              {/* ── Portfolio ── */}
              {activePage === '/portfolio' && (
                <PortfolioPage user={user} setActivePage={handlePageChange} />
              )}

              {/* ── Community ── */}
              {activePage === '/community' && (
                <CommunityPage openMentorModal={openMentorModal} setActivePage={handlePageChange} />
              )}

              {/* ── Settings ── */}
              {activePage === '/settings' && (
                <SettingsPage user={user} setUser={setUser} />
              )}

              {/* ── Admin ── */}
              {activePage === '/admin' && (
                <AdminDashboard setActivePage={handlePageChange} />
              )}

              {/* ── Generic footer pages ── */}
              {isGenericPage && (
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

      {/* Footer */}
      {!isLanding && !isAuth && <Footer setActivePage={handlePageChange} />}

      {/* Global Modals */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onComplete={handleDiagnosticComplete}
      />

      <MentorModal
        mentor={selectedMentor}
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
        cart={cart}
        setCart={setCart}
      />

      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
      />

      {/* Floating AI Chatbot */}
      <ChatbotWidget />
    </div>
  );
}
