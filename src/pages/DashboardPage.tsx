import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, 
  Map, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  ArrowRight, 
  FolderKanban, 
  TrendingUp, 
  Check, 
  BookOpen, 
  Award,
  ChevronRight,
  FileText,
  Upload,
  ExternalLink,
  GitCompare,
  Plus
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    targetCareer, 
    stats, 
    roadmap, 
    skills, 
    manualSkills,
    uploadedResume,
    skillsResumeAnalysis,
    projects, 
    resources,
    quizzesTaken,
    setActivePage, 
    toggleTaskCompletion, 
    openQuizModal,
    setSelectedProjectModal,
    toggleResourceCompleted
  } = useApp();

  // Active roadmap phase
  const activePhase = roadmap.find((p) => p.status === 'In Progress') || roadmap[0];
  const activeTasks = activePhase ? activePhase.modules.flatMap((m) => m.tasks) : [];
  const pendingTasks = activeTasks.filter((t) => !t.completed);
  const todaysTasks = activeTasks.slice(0, 4);

  // Top skill gaps
  const gapSkills = skills.filter((s) => s.currentLevel !== s.requiredLevel).slice(0, 4);

  // Recommended resources
  const topResources = resources.slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Welcome & Career Goal Header */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <span className="font-medium text-[#111827]">Current Career Goal:</span>
            <span className="font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
              {targetCareer.title}
            </span>
            <span>·</span>
            <span>{targetCareer.domain}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Welcome back, {currentUser?.fullName || 'Learner'}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
            {currentUser?.currentStatus || 'Learner'}
            {currentUser?.highestQualificationCompleted ? ` · ${currentUser.highestQualificationCompleted}` : ''}
            {currentUser?.age ? ` · Age ${currentUser.age}` : ''}. 
            You are learning <strong>{activePhase?.title || 'Foundations'}</strong> with {pendingTasks.length} tasks remaining.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActivePage('skills-resume')}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            Skills & Resume
          </button>
          <button
            onClick={() => setActivePage('roadmap')}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Map className="w-3.5 h-3.5 text-[#64748B]" />
            Learning Plan
          </button>
          <button
            onClick={() => setActivePage('career-exploration')}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            Change Goal
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Readiness */}
        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span className="font-medium">Job Readiness</span>
            <Target className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111827] font-mono">
            {stats.readinessScore}%
          </p>
          <div className="mt-2 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.readinessScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-1.5">
            {stats.skillsMasteredCount} of {stats.totalSkillsCount} skills ready
          </p>
        </div>

        {/* Metric 2: Tasks Done */}
        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span className="font-medium">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111827] font-mono">
            {stats.completedTasks} / {stats.totalTasks}
          </p>
          <div className="mt-2 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#16A34A] h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-1.5">
            {stats.completionPercentage}% of roadmap done
          </p>
        </div>

        {/* Metric 3: Weekly Study */}
        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span className="font-medium">Hours This Week</span>
            <Clock className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111827] font-mono">
            {stats.hoursThisWeek}h
          </p>
          <div className="mt-2 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
              style={{ width: '80%' }}
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-1.5">
            Goal: {currentUser?.dailyHoursGoal || 2}h/day ({((currentUser?.dailyHoursGoal || 2) * 7)}h/wk)
          </p>
        </div>

        {/* Metric 4: Streak */}
        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span className="font-medium">Study Streak</span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111827] font-mono">
            {currentUser?.streakDays || 14} Days
          </p>
          <div className="mt-2 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#F59E0B] h-full rounded-full transition-all duration-300"
              style={{ width: '100%' }}
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-1.5">
            Keep learning daily to maintain streak
          </p>
        </div>
      </div>

      {/* 3. Dual Row: My Skills & Resume Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section: My Skills */}
        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#2563EB]" />
                My Skills
              </h2>
              <p className="text-xs text-[#64748B]">
                {manualSkills.length} skills confirmed in your profile
              </p>
            </div>
            <button
              onClick={() => setActivePage('skills-resume')}
              className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add More
            </button>
          </div>

          <div className="space-y-2">
            {manualSkills.slice(0, 4).map((skill) => (
              <div 
                key={skill.id}
                className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-[#111827]">{skill.name}</span>
                  <span className="text-[11px] text-[#64748B] ml-2">({skill.category})</span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  skill.level === 'Advanced'
                    ? 'bg-emerald-50 text-[#16A34A]'
                    : skill.level === 'Intermediate'
                    ? 'bg-blue-50 text-[#2563EB]'
                    : 'bg-slate-100 text-[#64748B]'
                }`}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Showing {Math.min(4, manualSkills.length)} of {manualSkills.length}</span>
            <button
              onClick={() => setActivePage('skills-resume')}
              className="text-[#2563EB] font-medium hover:underline flex items-center gap-1"
            >
              Manage all skills
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Section: Resume Analysis */}
        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                Resume Analysis
              </h2>
              <p className="text-xs text-[#64748B]">
                Upload PDF or DOCX for automatic skill calibration
              </p>
            </div>
            {uploadedResume && (
              <span className="text-[11px] font-medium text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">
                Analyzed
              </span>
            )}
          </div>

          {uploadedResume ? (
            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111827] truncate max-w-[200px]">
                  {uploadedResume.fileName || 'Resume.pdf'}
                </span>
                <span className="text-[11px] text-[#64748B]">{uploadedResume.uploadedAt || 'Uploaded'}</span>
              </div>
              <p className="text-[#64748B] line-clamp-2">
                {uploadedResume.summary}
              </p>
              <div className="flex gap-4 text-[11px] text-[#64748B] pt-1 border-t border-[#E2E8F0]">
                <span>Technical: <strong className="text-[#111827]">{uploadedResume.technicalSkills.length}</strong></span>
                <span>Soft skills: <strong className="text-[#111827]">{uploadedResume.nonTechnicalSkills.length}</strong></span>
                <span>Projects: <strong className="text-[#111827]">{(uploadedResume.projects || []).length}</strong></span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setActivePage('skills-resume')}
              className="p-6 border-2 border-dashed border-[#E2E8F0] hover:border-blue-400 rounded-lg text-center cursor-pointer transition-colors"
            >
              <Upload className="w-6 h-6 text-[#64748B] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#111827]">No resume uploaded yet</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Click to upload your resume (PDF/DOCX) for AI analysis</p>
            </div>
          )}

          <div className="pt-2 border-t border-[#E2E8F0] flex justify-end">
            <button
              onClick={() => setActivePage('skills-resume')}
              className="text-xs text-[#2563EB] font-medium hover:underline flex items-center gap-1"
            >
              {uploadedResume ? 'Review resume analysis' : 'Upload and analyze resume'}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. Dual Row: Today's Tasks & Skill Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section: Today's Tasks & Active Roadmap */}
        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Map className="w-4 h-4 text-[#2563EB]" />
                Today's Tasks ({activePhase?.title || 'Active Step'})
              </h2>
              <p className="text-xs text-[#64748B]">
                Check off items as you complete your daily study goal
              </p>
            </div>
            <button
              onClick={() => setActivePage('roadmap')}
              className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Full Plan
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {todaysTasks.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">No pending tasks for today.</p>
            ) : (
              todaysTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => activePhase && toggleTaskCompletion(activePhase.id, task.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                    task.completed 
                      ? 'bg-slate-50 border-[#E2E8F0] opacity-60' 
                      : 'bg-white border-[#E2E8F0] hover:border-blue-300'
                  }`}
                >
                  <button type="button" className="mt-0.5 shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${task.completed ? 'line-through text-[#64748B]' : 'text-[#111827]'}`}>
                      {task.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#64748B]">
                      <span>{task.estimatedHours}h est.</span>
                      <span>·</span>
                      <span>{task.resourceType}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section: Skill Gap Analysis */}
        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#2563EB]" />
                Skill Gap Analysis
              </h2>
              <p className="text-xs text-[#64748B]">
                Key skills to improve for {targetCareer.title}
              </p>
            </div>
            <button
              onClick={() => setActivePage('skill-gap')}
              className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Full Analysis
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {gapSkills.map((s) => (
              <div 
                key={s.id} 
                className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-[#111827]">{s.name}</p>
                  <span className="text-[11px] text-[#64748B]">{s.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                    Current: {s.currentLevel} → Need: {s.requiredLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Want to verify a skill?</span>
            <button
              onClick={openQuizModal}
              className="text-xs font-medium text-[#2563EB] hover:underline"
            >
              Take Practice Quiz
            </button>
          </div>
        </div>

      </div>

      {/* 5. Dual Row: Learning Progress & Recommended Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section: Learning Progress */}
        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                Learning Progress
              </h2>
              <p className="text-xs text-[#64748B]">
                Overall roadmap completion and assessment history
              </p>
            </div>
            <button
              onClick={() => setActivePage('progress')}
              className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              View Analytics
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-[#111827] mb-1">
                <span>Total Roadmap Progress</span>
                <span className="font-mono text-[#2563EB]">{stats.completionPercentage}%</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
                Recent Quiz Results
              </span>
              <div className="space-y-1.5">
                {quizzesTaken.slice(0, 2).map((q, idx) => (
                  <div key={idx} className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-[#111827]">{q.title}</span>
                      <span className="text-[10px] text-[#64748B] block">{q.date}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">
                      {q.score} / {q.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Recommended Resources */}
        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                Recommended Resources
              </h2>
              <p className="text-xs text-[#64748B]">
                Curated documentation, courses, and guides
              </p>
            </div>
            <button
              onClick={() => setActivePage('projects')}
              className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              All Resources
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {topResources.map((res) => (
              <div 
                key={res.id}
                className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-medium text-[#111827]">{res.title}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    {res.provider} · {res.duration} · {res.type}
                  </p>
                </div>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:text-blue-700 p-1 shrink-0"
                  title="Open resource"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
