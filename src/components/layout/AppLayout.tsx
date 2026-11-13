import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { CareerDetailModal } from '../modals/CareerDetailModal';
import { ProjectDetailModal } from '../modals/ProjectDetailModal';
import { PracticeQuizModal } from '../modals/PracticeQuizModal';
import { 
  Menu, 
  Sparkles, 
  ChevronRight, 
  HelpCircle,
  Play
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    activePage, 
    setActivePage,
    currentUser, 
    targetCareer, 
    selectedCareerModal, 
    setSelectedCareerModal,
    selectedProjectModal, 
    setSelectedProjectModal,
    openQuizModal
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPublicPage = activePage === 'landing' || activePage === 'auth' || activePage === 'onboarding';

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Career Dashboard';
      case 'skills-resume': return 'My Skills & Resume Analysis';
      case 'ai-advisor': return 'AI Career Guide';
      case 'career-exploration': return 'Explore Careers';
      case 'skill-gap': return 'Skills to Learn';
      case 'roadmap': return 'Step-by-Step Learning Plan';
      case 'progress': return 'My Learning Progress';
      case 'projects': return 'Projects & Resources';
      default: return 'Skill Bridge';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col antialiased">
      <Navbar />

      {isPublicPage ? (
        <main className="flex-1 w-full bg-[#F8FAFC]">{children}</main>
      ) : (
        <div className="flex-1 flex w-full">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main Content Viewport */}
          <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
            {/* Contextual Workspace Bar */}
            <div className="h-12 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#64748B] overflow-hidden">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="hover:text-[#111827] transition-colors whitespace-nowrap shrink-0"
                >
                  Dashboard
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <button
                  onClick={() => setActivePage('career-exploration')}
                  className="hover:text-[#111827] text-slate-700 font-medium truncate max-w-[150px] sm:max-w-xs"
                >
                  {targetCareer.title}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
                <span className="font-semibold text-[#111827] whitespace-nowrap shrink-0 hidden sm:inline">
                  {getPageTitle()}
                </span>
              </div>

              {/* Workspace Action Shortcuts */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={openQuizModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-slate-100 text-[#111827] text-xs font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span className="hidden sm:inline">Practice Quiz</span>
                  <span className="sm:hidden">Quiz</span>
                </button>
              </div>
            </div>

            {/* Viewport Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      )}

      {/* Global Interactive Modals */}
      <CareerDetailModal
        career={selectedCareerModal}
        onClose={() => setSelectedCareerModal(null)}
      />
      <ProjectDetailModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
      />
      <PracticeQuizModal />
    </div>
  );
};
