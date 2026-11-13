import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderKanban, 
  BookOpen, 
  Search, 
  Bookmark, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Check
} from 'lucide-react';

export const ProjectsResourcesPage: React.FC = () => {
  const { 
    projects, 
    resources, 
    toggleProjectBookmark, 
    toggleProjectStatus, 
    toggleResourceBookmark, 
    toggleResourceCompleted,
    setSelectedProjectModal,
    targetCareer 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'projects' | 'resources'>('projects');

  // Projects filter
  const [projectDifficulty, setProjectDifficulty] = useState<string>('All');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('All');

  // Resources filter
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceCategory, setResourceCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchDiff = projectDifficulty === 'All' || p.difficulty === projectDifficulty;
      const matchStatus =
        projectStatusFilter === 'All'
          ? true
          : projectStatusFilter === 'Bookmarked'
          ? p.isBookmarked
          : p.status === projectStatusFilter;

      return matchDiff && matchStatus;
    });
  }, [projects, projectDifficulty, projectStatusFilter]);

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
        r.category.toLowerCase().includes(resourceSearch.toLowerCase()) ||
        r.provider.toLowerCase().includes(resourceSearch.toLowerCase());

      const matchesCat = resourceCategory === 'All' || r.category === resourceCategory;

      return matchesSearch && matchesCat;
    });
  }, [resources, resourceSearch, resourceCategory]);

  const resourceCategories = [
    'All',
    'Government & Civil Services',
    'Software and IT',
    'Hardware and Electronics',
    'Banking and Finance',
    'System Design',
    'Databases',
    'Business and Management',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <FolderKanban className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Target Goal: <strong className="text-[#111827]">{targetCareer.title}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">
            Practice Projects & Learning Resources
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Build real projects to demonstrate your practical skills and study curated learning materials.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#2563EB]" />
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
            Resources ({resources.length})
          </button>
        </div>
      </div>

      {/* PROJECTS VIEW */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Difficulty:</span>
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setProjectDifficulty(diff)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    projectDifficulty === diff
                      ? 'bg-[#2563EB] text-white font-medium'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Status:</span>
              {(['All', 'In Progress', 'Completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setProjectStatusFilter(st)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    projectStatusFilter === st
                      ? 'bg-[#111827] text-white font-medium'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-white rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      p.difficulty === 'Beginner'
                        ? 'bg-emerald-50 text-[#16A34A]'
                        : p.difficulty === 'Intermediate'
                        ? 'bg-blue-50 text-[#2563EB]'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {p.difficulty}
                    </span>
                    <button
                      onClick={() => toggleProjectBookmark(p.id)}
                      className={`p-1 rounded hover:bg-slate-100 ${
                        p.isBookmarked ? 'text-[#F59E0B]' : 'text-slate-400'
                      }`}
                      title="Bookmark project"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#111827]">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                    {p.brief}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est. {p.timeEstimate}</span>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.techStack.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedProjectModal(p)}
                    className="text-[#2563EB] font-medium hover:underline"
                  >
                    View Brief & Steps
                  </button>
                  <button
                    onClick={() => toggleProjectStatus(p.id, p.status === 'Completed' ? 'In Progress' : 'Completed')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                      p.status === 'Completed'
                        ? 'bg-emerald-50 text-[#16A34A]'
                        : 'bg-slate-100 text-[#64748B] hover:text-[#111827]'
                    }`}
                  >
                    {p.status === 'Completed' ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESOURCES VIEW */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          {/* Search & Categories */}
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search courses, docs, cheat sheets..."
                className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {resourceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setResourceCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    resourceCategory === cat
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Resources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div 
                key={res.id}
                className="p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors flex items-start justify-between gap-4 text-xs shadow-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[10px] text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                      {res.type}
                    </span>
                    <span className="text-[#64748B] text-[11px]">{res.category}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-[#111827]">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Provider: <strong>{res.provider}</strong> · Duration: {res.duration}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#F8FAFC] hover:bg-blue-50 text-[#2563EB] rounded-lg border border-[#E2E8F0] transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => toggleResourceCompleted(res.id)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                      res.isCompleted ? 'bg-emerald-50 text-[#16A34A]' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {res.isCompleted ? '✓ Read' : 'Mark Read'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
