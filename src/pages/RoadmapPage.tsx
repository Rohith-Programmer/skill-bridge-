import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Map,
  Layers, 
  BookOpen,
  Calendar,
  Sparkles,
  Check,
  Target
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { 
    roadmap, 
    targetCareer, 
    stats, 
    toggleTaskCompletion, 
    openQuizModal,
    roadmapViewMode,
    setRoadmapViewMode,
    setActivePage,
    aiAnalysis 
  } = useApp();

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'phase-1': true,
    'phase-2': true,
    'phase-3': true,
    'phase-4': false,
  });

  const [phaseFilter, setPhaseFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Upcoming'>('All');

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const filteredPhases = roadmap.filter((phase) => {
    if (phaseFilter === 'All') return true;
    return phase.status === phaseFilter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <Map className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Target Goal: <strong className="text-[#111827]">{targetCareer.title}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">
            My Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            A vertical timeline designed to take you from foundational concepts to advanced job-ready competency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePage('ai-advisor')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            AI Guide
          </button>
          <button
            onClick={openQuizModal}
            className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            Practice Quiz
          </button>
        </div>
      </div>

      {/* Progress & Controls Bar */}
      <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Roadmap Progress</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111827] font-mono">
              {stats.completionPercentage}%
            </span>
            <span className="text-xs text-[#64748B]">
              ({stats.completedTasks} of {stats.totalTasks} tasks completed)
            </span>
          </div>
          <div className="w-full sm:w-80 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Pacing View Mode */}
          <div className="flex p-0.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setRoadmapViewMode(mode)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  roadmapViewMode === mode
                    ? 'bg-white text-[#111827] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex p-0.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs">
            {(['All', 'In Progress', 'Completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setPhaseFilter(filter)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  phaseFilter === filter
                    ? 'bg-white text-[#111827] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Strategy Guidance */}
      {aiAnalysis?.dailyWeeklyMonthlyStrategy && (
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-[#111827] flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#2563EB] block">
              Pacing Recommendation ({roadmapViewMode} view):
            </strong>
            <span className="text-[#64748B] text-[11px] leading-relaxed">
              {roadmapViewMode === 'Daily'
                ? aiAnalysis.dailyWeeklyMonthlyStrategy.dailyPlan
                : roadmapViewMode === 'Weekly'
                ? aiAnalysis.dailyWeeklyMonthlyStrategy.weeklyCadence
                : 'Follow the 3-month milestone sequence to build portfolio depth.'}
            </span>
          </div>
        </div>
      )}

      {/* Clean Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E2E8F0]">
        {filteredPhases.map((phase) => {
          const isExpanded = expandedPhases[phase.id] !== false;
          const allPhaseTasks = phase.modules.flatMap((m) => m.tasks);
          const completedInPhase = allPhaseTasks.filter((t) => t.completed).length;

          return (
            <div key={phase.id} className="relative">
              {/* Timeline Node Icon */}
              <div 
                className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-[#F8FAFC] z-10 ${
                  phase.status === 'Completed'
                    ? 'bg-[#16A34A] text-white'
                    : phase.status === 'In Progress'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {phase.status === 'Completed' ? <Check className="w-3.5 h-3.5" /> : phase.phaseNumber}
              </div>

              {/* Stage Card */}
              <div 
                className={`bg-white rounded-xl border shadow-xs transition-colors ${
                  phase.status === 'In Progress' ? 'border-[#2563EB]' : 'border-[#E2E8F0]'
                }`}
              >
                {/* Stage Header */}
                <div
                  onClick={() => togglePhaseExpand(phase.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#64748B]">
                        Stage {phase.phaseNumber}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        phase.status === 'Completed'
                          ? 'bg-emerald-50 text-[#16A34A]'
                          : phase.status === 'In Progress'
                          ? 'bg-blue-50 text-[#2563EB]'
                          : 'bg-slate-100 text-[#64748B]'
                      }`}>
                        {phase.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#111827]">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-[#64748B] max-w-xl">
                      {phase.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-xs">
                      <span className="font-semibold text-[#111827] block font-mono">
                        {completedInPhase}/{allPhaseTasks.length} Done
                      </span>
                      <span className="text-[10px] text-[#64748B] flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        ~{phase.targetDurationWeeks} Weeks
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#E2E8F0] space-y-4">
                    {phase.modules.map((module) => (
                      <div key={module.id} className="space-y-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                            {module.title}
                          </h4>
                          <p className="text-[11px] text-[#64748B] mt-0.5">{module.description}</p>
                        </div>

                        {/* Task List with Checkboxes */}
                        <div className="space-y-1.5">
                          {module.tasks.map((task) => (
                            <div
                              key={task.id}
                              onClick={() => toggleTaskCompletion(phase.id, task.id)}
                              className={`p-2.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                                task.completed
                                  ? 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-400'
                                  : 'bg-white border-[#E2E8F0] hover:border-blue-300'
                              }`}
                            >
                              <button type="button" className="mt-0.5 shrink-0">
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium ${task.completed ? 'line-through text-[#64748B]' : 'text-[#111827]'}`}>
                                  {task.title}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#64748B]">
                                  <span>{task.estimatedHours} hrs</span>
                                  <span>·</span>
                                  <span>{task.resourceType}</span>
                                  {task.cadence && (
                                    <>
                                      <span>·</span>
                                      <span className="text-[#2563EB]">{task.cadence}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
