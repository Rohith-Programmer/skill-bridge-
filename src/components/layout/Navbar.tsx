import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/sampleData';
import { 
  Compass, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Flame,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    currentUser, 
    targetCareer, 
    logout, 
    loginAsUser, 
    notifications, 
    dismissNotification,
    stats 
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isPublicView = activePage === 'landing' || activePage === 'auth';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActivePage(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 border border-slate-200/80 shadow-xs shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/Skill_Bridge_Learning_Emblem_c8344995.png"
                alt="Skill Bridge Official Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Skill Bridge
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500">
                AI Career & Skill Platform
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {isPublicView ? (
            <>
              <button
                onClick={() => setActivePage('landing')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                  activePage === 'landing' ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActivePage('career-exploration')}
                className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-900"
              >
                Explore Careers
              </button>
              <button
                onClick={() => setActivePage('skill-gap')}
                className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-900"
              >
                Skills to Learn
              </button>
              <button
                onClick={() => setActivePage('projects')}
                className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-900"
              >
                Projects & Resources
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <span className="text-slate-800 font-semibold">{currentUser?.currentStatus || 'Learning'}</span>
              {currentUser?.highestQualificationCompleted && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600">{currentUser.highestQualificationCompleted}</span>
                </>
              )}
              {currentUser?.age && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 font-mono">Age {currentUser.age}</span>
                </>
              )}
              <span aria-hidden="true" className="text-slate-300">·</span>
              <button
                onClick={() => setActivePage('ai-advisor')}
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Target: {targetCareer.title}
              </button>
            </div>
          )}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <>
              {/* Daily Streak Indicator */}
              <div 
                title={`${currentUser.streakDays} Day Study Streak`}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold"
              >
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span className="font-mono tabular-nums">{currentUser.streakDays}d</span>
                <span className="text-amber-700/80 font-normal">streak</span>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsProfileOpen(false);
                  }}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Popover */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Notifications ({notifications.length})
                      </h4>
                      <span className="text-[11px] text-slate-500 font-mono tabular-nums">Alerts</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-500">
                          All caught up! No unread notifications.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                            </div>
                            <button
                              onClick={() => dismissNotification(n.id)}
                              className="text-slate-400 hover:text-slate-600 p-1"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Account / Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/60"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                        <span>How Ready You Are</span>
                        <span className="font-mono font-bold text-blue-600 tabular-nums">
                          {stats.readinessScore}%
                        </span>
                      </div>
                    </div>

                    {/* Quick Demo Personas */}
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Switch Example Account
                      </p>
                      <div className="space-y-1">
                        {INITIAL_USERS.map((st) => (
                          <button
                            key={st.id}
                            onClick={() => {
                              loginAsUser(st.id);
                              setIsProfileOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                              currentUser.id === st.id
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">{st.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]">
                              {st.careerDomain.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setActivePage('ai-advisor');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        AI Career Guide
                      </button>
                      <button
                        onClick={() => {
                          setActivePage('onboarding');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        Edit My Profile & Goals
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setActivePage('auth')}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
              <button
                onClick={() => setActivePage('auth')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
