import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Award,
  GitCompare,
  Map,
  FolderKanban,
  TrendingUp,
  User,
  Settings,
  Target,
  ChevronRight,
  Flame,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: PageId | 'profile' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage, targetCareer, stats, currentUser } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'career-exploration', label: 'Explore Careers', icon: Compass },
    { id: 'skills-resume', label: 'My Skills', icon: Award },
    { id: 'skills-resume', label: 'Resume Analysis', icon: FileText },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: GitCompare },
    { id: 'roadmap', label: 'My Learning Plan', icon: Map },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
  ];

  const bottomNavItems: NavItem[] = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      action: () => setActivePage('onboarding') 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      action: () => setIsSettingsOpen(true) 
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Minimalist Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-lg lg:shadow-none' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Active Goal Clean Card */}
          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                Active Goal
              </span>
              <button 
                onClick={() => {
                  setActivePage('career-exploration');
                  onClose();
                }}
                className="text-[#2563EB] hover:text-blue-700 font-medium text-[11px] transition-colors"
              >
                Change
              </button>
            </div>
            <p className="text-sm font-semibold text-[#111827] truncate">
              {targetCareer.title}
            </p>
            <p className="text-xs text-[#64748B] truncate mt-0.5">
              {targetCareer.domain}
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#E2E8F0]">
              <div className="flex justify-between items-center text-xs text-[#64748B] mb-1.5">
                <span>Readiness</span>
                <span className="font-semibold text-[#111827]">
                  {stats.readinessScore}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                  style={{ width: `${stats.readinessScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5">
            <p className="px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Menu
            </p>
            {mainNavItems.map((item, idx) => {
              const Icon = item.icon;
              // Check active status based on page id
              const isActive = activePage === item.id;

              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    setActivePage(item.id as PageId);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] font-semibold'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary Links: Profile & Settings */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-0.5">
            <p className="px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Account
            </p>
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action) item.action();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#64748B]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimal User Bar */}
        <div className="p-3 border-t border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between text-xs text-[#64748B] px-2 py-1">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{currentUser?.streakDays || 14} Day Streak</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{currentUser?.dailyHoursGoal || 2}h/day</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Minimal Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-semibold text-[#111827]">Account & App Settings</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#64748B]">
              <div>
                <label className="block text-xs font-medium text-[#111827] mb-1">Theme</label>
                <p className="text-[11px] text-[#64748B]">Clean Minimalist (Default SaaS)</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111827] mb-1">Target Role</label>
                <p className="text-xs text-[#111827] font-medium">{targetCareer.title}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111827] mb-1">Study Hours Goal</label>
                <p className="text-xs text-[#111827] font-medium">{currentUser?.dailyHoursGoal || 2} hours every day</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setActivePage('onboarding');
                }}
                className="px-3 py-1.5 text-xs font-medium text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
              >
                Update Profile & Goals
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-3 py-1.5 text-xs font-medium bg-[#111827] text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
