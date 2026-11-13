/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CareerExplorationPage } from './pages/CareerExplorationPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProjectsResourcesPage } from './pages/ProjectsResourcesPage';
import { AIAdvisorPage } from './pages/AIAdvisorPage';
import { SkillsResumePage } from './pages/SkillsResumePage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'ai-advisor':
        return <AIAdvisorPage />;
      case 'skills-resume':
        return <SkillsResumePage />;
      case 'career-exploration':
        return <CareerExplorationPage />;
      case 'skill-gap':
        return <SkillGapPage />;
      case 'roadmap':
        return <RoadmapPage />;
      case 'progress':
        return <ProgressPage />;
      case 'projects':
        return <ProjectsResourcesPage />;
      default:
        return <LandingPage />;
    }
  };

  return <AppLayout>{renderCurrentPage()}</AppLayout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
