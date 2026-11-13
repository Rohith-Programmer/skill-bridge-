import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SkillItem, SkillProficiency } from '../types';
import { 
  GitCompare, 
  Target, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Check, 
  Award,
  ChevronRight,
  FileText
} from 'lucide-react';

const PROFICIENCY_SCORES: Record<SkillProficiency, number> = {
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Mastery: 4,
};

const PROFICIENCY_LEVELS: SkillProficiency[] = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Mastery'];

export const SkillGapPage: React.FC = () => {
  const { 
    targetCareer, 
    skills, 
    updateSkillLevel, 
    toggleSkillInRoadmap, 
    stats, 
    openQuizModal,
    setActivePage 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Core Technologies',
    'Competitive Exam Topics',
    'Architecture & Systems',
    'Tools & Workflows',
    'Soft & Professional',
  ];

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      return selectedCategory === 'All' || s.category === selectedCategory;
    });
  }, [skills, selectedCategory]);

  // Three sections
  const skillsAlreadyHave = useMemo(() => {
    return filteredSkills.filter(
      (s) => PROFICIENCY_SCORES[s.currentLevel] >= PROFICIENCY_SCORES[s.requiredLevel]
    );
  }, [filteredSkills]);

  const skillsNeedToImprove = useMemo(() => {
    return filteredSkills.filter(
      (s) =>
        PROFICIENCY_SCORES[s.currentLevel] > 0 &&
        PROFICIENCY_SCORES[s.currentLevel] < PROFICIENCY_SCORES[s.requiredLevel]
    );
  }, [filteredSkills]);

  const skillsNeedToLearn = useMemo(() => {
    return filteredSkills.filter((s) => PROFICIENCY_SCORES[s.currentLevel] === 0);
  }, [filteredSkills]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <GitCompare className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Target Benchmark: <strong className="text-[#111827]">{targetCareer.title}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">
            Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Compare your verified abilities with what companies look for in {targetCareer.title}. Update your skill levels or add gaps to your learning roadmap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActivePage('skills-resume')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
            My Skills & Resume
          </button>
          <button
            onClick={openQuizModal}
            className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Take a Quiz
          </button>
        </div>
      </div>

      {/* Readiness Progress Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-medium">Career Readiness</span>
          <p className="text-2xl font-bold text-[#2563EB] font-mono mt-0.5">
            {stats.readinessScore}%
          </p>
          <div className="mt-2 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.readinessScore}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-medium">Skills Mastered</span>
          <p className="text-2xl font-bold text-[#16A34A] font-mono mt-0.5">
            {skillsAlreadyHave.length}
          </p>
          <span className="text-[11px] text-[#64748B] mt-1 block">
            Already job-ready
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-medium">Need to Improve</span>
          <p className="text-2xl font-bold text-[#F59E0B] font-mono mt-0.5">
            {skillsNeedToImprove.length}
          </p>
          <span className="text-[11px] text-[#64748B] mt-1 block">
            Needs hands-on practice
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-medium">Need to Learn</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-0.5">
            {skillsNeedToLearn.length}
          </p>
          <span className="text-[11px] text-[#64748B] mt-1 block">
            Not started yet
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#111827] hover:bg-slate-50 border border-[#E2E8F0]'
            }`}
          >
            {cat === 'All' ? 'All Skill Categories' : cat}
          </button>
        ))}
      </div>

      {/* THREE REQUIRED SECTIONS */}
      <div className="space-y-6">
        
        {/* SECTION 1: Skills I Already Have */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-sm font-bold text-[#16A34A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Skills I Already Have ({skillsAlreadyHave.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                These skills meet or exceed the requirements for {targetCareer.title}.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded">
              Ready
            </span>
          </div>

          {skillsAlreadyHave.length === 0 ? (
            <p className="text-xs text-[#64748B] py-3 text-center">
              No mastered skills in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skillsAlreadyHave.map((skill) => (
                <div 
                  key={skill.id}
                  className="p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-[#111827] text-sm block">
                        {skill.name}
                      </span>
                      <span className="text-[11px] text-[#64748B]">{skill.category}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-[#16A34A]">
                      {skill.currentLevel}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#64748B] line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Clean Level Progress Bar */}
                  <div className="pt-1">
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#16A34A] h-full w-full rounded-full" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1">
                      <span>Requirement: {skill.requiredLevel}</span>
                      <span className="font-semibold text-[#16A34A]">Goal Met</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Skills I Need to Improve */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-sm font-bold text-[#F59E0B] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Skills I Need to Improve ({skillsNeedToImprove.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                You have learned the basics, but need more hands-on practice to reach job readiness.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#F59E0B] bg-amber-50 px-2.5 py-1 rounded">
              In Progress
            </span>
          </div>

          {skillsNeedToImprove.length === 0 ? (
            <p className="text-xs text-[#64748B] py-3 text-center">
              No skills currently in progress in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skillsNeedToImprove.map((skill) => {
                const curScore = PROFICIENCY_SCORES[skill.currentLevel];
                const reqScore = PROFICIENCY_SCORES[skill.requiredLevel];
                const pct = Math.round((curScore / reqScore) * 100);

                return (
                  <div 
                    key={skill.id}
                    className="p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-[#111827] text-sm block">
                          {skill.name}
                        </span>
                        <span className="text-[11px] text-[#64748B]">{skill.category}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-[#F59E0B]">
                        {skill.currentLevel} → {skill.requiredLevel}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#64748B] line-clamp-2">
                      {skill.description}
                    </p>

                    {/* Clean Level Progress Bar */}
                    <div className="pt-1">
                      <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#F59E0B] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1">
                        <span>Current: {skill.currentLevel} ({pct}%)</span>
                        <span>Target: {skill.requiredLevel}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between border-t border-[#E2E8F0]">
                      <div className="flex gap-1">
                        {PROFICIENCY_LEVELS.slice(1, 4).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateSkillLevel(skill.id, lvl)}
                            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                              skill.currentLevel === lvl
                                ? 'bg-[#2563EB] text-white font-semibold'
                                : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleSkillInRoadmap(skill.id)}
                        className={`text-[10px] font-medium px-2 py-1 rounded transition-colors ${
                          skill.inRoadmap
                            ? 'bg-emerald-50 text-[#16A34A]'
                            : 'bg-[#2563EB] text-white hover:bg-blue-700'
                        }`}
                      >
                        {skill.inRoadmap ? 'Queued in Plan' : '+ Add to Plan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 3: Skills I Need to Learn */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-sm font-bold text-[#2563EB] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Skills I Need to Learn ({skillsNeedToLearn.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                Essential competencies you have not started yet. Prioritize learning these first.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded">
              To Start
            </span>
          </div>

          {skillsNeedToLearn.length === 0 ? (
            <p className="text-xs text-[#64748B] py-3 text-center">
              All required skills have been started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skillsNeedToLearn.map((skill) => (
                <div 
                  key={skill.id}
                  className="p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-[#111827] text-sm block">
                        {skill.name}
                      </span>
                      <span className="text-[11px] text-[#64748B]">{skill.category}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#64748B]">
                      Priority: {skill.priority}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#64748B] line-clamp-2">
                    {skill.description}
                  </p>

                  <div className="pt-1">
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-300 h-full w-0" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1">
                      <span>Not Started</span>
                      <span>Target: {skill.requiredLevel}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-[#E2E8F0]">
                    <div className="flex gap-1">
                      {PROFICIENCY_LEVELS.slice(1, 4).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => updateSkillLevel(skill.id, lvl)}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50"
                        >
                          Mark {lvl}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleSkillInRoadmap(skill.id)}
                      className={`text-[10px] font-medium px-2 py-1 rounded transition-colors ${
                        skill.inRoadmap
                          ? 'bg-emerald-50 text-[#16A34A]'
                          : 'bg-[#2563EB] text-white hover:bg-blue-700'
                      }`}
                    >
                      {skill.inRoadmap ? 'Queued' : '+ Add to Roadmap'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
