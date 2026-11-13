import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CareerPath } from '../types';
import { 
  Search, 
  Target, 
  Check, 
  Sparkles,
  ChevronRight,
  Plus,
  Loader2,
  Compass,
  ArrowRight
} from 'lucide-react';

export const CareerExplorationPage: React.FC = () => {
  const { 
    targetCareer, 
    selectTargetCareer, 
    setSelectedCareerModal, 
    setActivePage, 
    allCareers, 
    searchCustomCareerWithAI,
    isSearchingCustomCareer 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [customRoleInput, setCustomRoleInput] = useState('');

  const domains: string[] = [
    'All',
    'Software and IT',
    'Hardware and Electronics',
    'Government Jobs and Civil Services',
    'Banking and Finance',
    'Healthcare and Medical',
    'Business and Management',
    'Mechanical and Core Engineering',
    'Civil Engineering',
    'Creative Arts and Design',
    'Teaching and Education',
    'Research and Science',
    'Entrepreneurship',
    'Other Careers & Specialized Trades',
  ];

  const filteredCareers = useMemo(() => {
    return allCareers.filter((career) => {
      const matchesSearch =
        career.title.toLowerCase().includes(search.toLowerCase()) ||
        career.description.toLowerCase().includes(search.toLowerCase()) ||
        career.keySkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchesDomain = selectedDomain === 'All' || career.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [allCareers, search, selectedDomain]);

  const handleCustomCareerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleInput.trim()) return;
    const generated = await searchCustomCareerWithAI(customRoleInput);
    if (generated) {
      setSelectedCareerModal(generated);
      setCustomRoleInput('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Career Exploration</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">
            Explore Careers & Job Roles
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Choose from 12+ domains or search any specialized career to view required skills, market demand, and your customized learning path.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <span className="text-[#64748B]">Active Goal:</span>
          <span className="font-semibold text-[#2563EB]">
            {targetCareer.title}
          </span>
        </div>
      </div>

      {/* AI Custom Career Generator */}
      <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#111827]">Looking for a Specific Role?</h3>
            <p className="text-[11px] text-[#64748B]">
              Type any career title to generate its skill benchmarks (e.g. Drone Pilot, Audio Engineer).
            </p>
          </div>
        </div>

        <form onSubmit={handleCustomCareerSearch} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={customRoleInput}
            onChange={(e) => setCustomRoleInput(e.target.value)}
            placeholder="Type any career title..."
            className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs bg-white text-[#111827] focus:outline-hidden focus:border-[#2563EB] min-w-[220px]"
          />
          <button
            type="submit"
            disabled={!customRoleInput.trim() || isSearchingCustomCareer}
            className="px-3.5 py-2 bg-[#111827] hover:bg-slate-800 disabled:bg-slate-200 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {isSearchingCustomCareer ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Find Role
              </>
            )}
          </button>
        </form>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers by title, required skills, or industry..."
            className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>

        {/* Domain Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDomain === dom
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] hover:bg-slate-100 border border-[#E2E8F0]'
              }`}
            >
              {dom === 'All' ? 'All Domains' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career) => {
          const isCurrent = targetCareer.id === career.id;

          return (
            <div
              key={career.id}
              className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-[#2563EB] ring-1 ring-[#2563EB]'
                  : 'border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Domain & Demand Badges */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2563EB] truncate max-w-[180px]">
                    {career.domain}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {career.isCompetitiveExam && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Exam Track
                      </span>
                    )}
                    <span className="text-[#16A34A] font-medium text-[11px]">
                      {career.demandLevel} Demand
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    {career.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-3 leading-relaxed">
                    {career.description}
                  </p>
                </div>

                {/* Salary & Open Positions */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Salary Range</span>
                    <span className="font-semibold text-[#111827] text-[11px] font-mono">
                      {career.entrySalary}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Open Roles</span>
                    <span className="font-semibold text-[#2563EB] text-[11px] font-mono">
                      {career.openJuniorJobs.toLocaleString()}+
                    </span>
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
                    Key Skills Needed
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {career.keySkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                      >
                        {skill}
                      </span>
                    ))}
                    {career.keySkills.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                        +{career.keySkills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCareerModal(career)}
                  className="text-xs font-medium text-[#64748B] hover:text-[#111827] transition-colors"
                >
                  View Details
                </button>

                {isCurrent ? (
                  <span className="px-3 py-1.5 bg-emerald-50 text-[#16A34A] text-xs font-semibold rounded-lg flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Active Goal
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      selectTargetCareer(career.id);
                      setActivePage('skill-gap');
                    }}
                    className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Target className="w-3 h-3" />
                    Set as Goal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
