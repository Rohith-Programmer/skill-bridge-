import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Flame, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { 
    currentUser, 
    stats, 
    quizzesTaken, 
    openQuizModal, 
    targetCareer,
  } = useApp();

  const weeklyVelocityData = [
    { week: 'W1', hours: 8.5, target: 14 },
    { week: 'W2', hours: 11.0, target: 14 },
    { week: 'W3', hours: 14.5, target: 14 },
    { week: 'W4', hours: 13.0, target: 14 },
    { week: 'W5', hours: 16.0, target: 14 },
    { week: 'W6', hours: 9.5, target: 14 },
  ];

  const heatmapDays = Array.from({ length: 35 }, (_, i) => {
    const isPast = i < 30;
    const hours = isPast ? (i % 7 === 0 || i % 6 === 0 ? 0 : (i % 3 === 0 ? 3.5 : 2.0)) : (i === 30 ? 2.5 : 0);
    return { day: i + 1, hours, isPast };
  });

  const badges = [
    {
      id: 'b-1',
      title: 'Foundational Knowledge Mastered',
      desc: 'Completed Phase 1 prerequisites and core concepts.',
      earnedDate: 'Verified',
      icon: ShieldCheck,
    },
    {
      id: 'b-2',
      title: 'Hands-on Exercise Specialist',
      desc: 'Completed 10 practical exercises across active modules.',
      earnedDate: 'Verified',
      icon: Award,
    },
    {
      id: 'b-3',
      title: 'Consistent Daily Learner',
      desc: 'Maintained uninterrupted study progress for over 14 days.',
      earnedDate: 'Active',
      icon: Flame,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Target Goal: <strong className="text-[#111827]">{targetCareer.title}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">
            My Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Track your study velocity, streak consistency, and quiz performance over time.
          </p>
        </div>

        <button
          onClick={openQuizModal}
          className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Take a Practice Quiz
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Readiness Score</span>
          <p className="text-3xl font-bold text-[#2563EB] font-mono">
            {stats.readinessScore}%
          </p>
          <p className="text-xs text-[#64748B] pt-1">
            Calculated against real job criteria for {targetCareer.title}.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Total Study Time</span>
          <p className="text-3xl font-bold text-[#111827] font-mono">
            72.5 <span className="text-sm font-normal text-[#64748B]">hours</span>
          </p>
          <p className="text-xs text-[#64748B] pt-1">
            Across {stats.completedTasks} completed roadmap milestones.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Daily Streak</span>
          <p className="text-3xl font-bold text-[#F59E0B] font-mono flex items-center gap-2">
            {currentUser?.streakDays || 14} <span className="text-sm font-normal text-[#64748B]">days</span>
          </p>
          <p className="text-xs text-[#64748B] pt-1">
            Daily goal: {currentUser?.dailyHoursGoal || 2} hours per day.
          </p>
        </div>
      </div>

      {/* Weekly Velocity Chart & 35-Day Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time */}
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Weekly Study Hours</h3>
              <p className="text-xs text-[#64748B]">Comparison against your 14h weekly goal</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#2563EB]">
              Avg: 12.1h/wk
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 pb-2 border-b border-[#E2E8F0]">
            {weeklyVelocityData.map((d, idx) => {
              const heightPercent = Math.min(100, (d.hours / 18) * 100);
              const isCurrent = idx === weeklyVelocityData.length - 1;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {d.hours}h
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      isCurrent ? 'bg-[#2563EB]' : 'bg-slate-200'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] text-[#64748B] font-medium">
                    {d.week}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Weekly Target: 14.0 hours</span>
            <span className="text-[#16A34A] font-medium">On Track</span>
          </div>
        </div>

        {/* 35-Day Calendar Grid */}
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">30-Day Activity Calendar</h3>
              <p className="text-xs text-[#64748B]">Daily learning habit overview</p>
            </div>
            <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Streak
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {heatmapDays.map((item, idx) => {
              let bg = 'bg-[#F8FAFC] border border-[#E2E8F0] text-slate-400';
              if (item.hours >= 3) bg = 'bg-[#2563EB] text-white';
              else if (item.hours >= 2) bg = 'bg-blue-400 text-white';
              else if (item.hours > 0) bg = 'bg-blue-100 text-[#2563EB]';

              return (
                <div
                  key={idx}
                  title={`Day ${item.day}: ${item.hours}h`}
                  className={`h-8 rounded flex items-center justify-center text-[10px] font-mono ${bg}`}
                >
                  {item.hours > 0 ? `${item.hours}h` : ''}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
            <span>Less study</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-[#E2E8F0]" />
              <span className="w-2.5 h-2.5 rounded bg-blue-100" />
              <span className="w-2.5 h-2.5 rounded bg-blue-400" />
              <span className="w-2.5 h-2.5 rounded bg-[#2563EB]" />
            </div>
            <span>More study</span>
          </div>
        </div>
      </div>

      {/* Quiz Log & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Quiz Results */}
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827]">Practice Quiz Results</h3>
            <button
              onClick={openQuizModal}
              className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Take Another Quiz
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {quizzesTaken.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-[#111827]">{q.title}</h4>
                  <span className="text-[11px] text-[#64748B]">{q.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#16A34A] font-mono">
                    {q.score} / {q.total}
                  </span>
                  <span className="block text-[10px] text-[#64748B]">Passed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Milestones */}
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#111827]">Milestones & Achievements</h3>
          <div className="space-y-2.5">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-start gap-3 text-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-[#111827]">{b.title}</h4>
                      <span className="text-[10px] text-[#16A34A] bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                        {b.earnedDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
