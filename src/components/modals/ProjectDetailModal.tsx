import React from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioProject } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  ExternalLink, 
  Layers, 
  Code2, 
  Check, 
  Play
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { toggleProjectStatus, toggleProjectBookmark } = useApp();

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-blue-600">{project.difficulty} Level</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {project.timeEstimate}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleProjectBookmark(project.id)}
              className={`p-2 rounded-lg border transition-colors ${
                project.isBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
              title={project.isBookmarked ? 'Bookmarked' : 'Bookmark Project'}
            >
              <Bookmark className={`w-4 h-4 ${project.isBookmarked ? 'fill-amber-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Brief */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About This Project</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{project.brief}</p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Tools & Technologies to Use
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono bg-slate-100 text-slate-800 rounded-md border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables / Acceptance Criteria */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              What You Will Build & Deliver
            </h4>
            <div className="space-y-2">
              {project.keyDeliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              How It Works
            </h4>
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed flex items-start gap-3">
              <Layers className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>{project.architectureOverview}</p>
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              My Project Status
            </h4>
            <div className="flex items-center gap-2">
              {(['Not Started', 'In Progress', 'Completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleProjectStatus(project.id, status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                    project.status === status
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            {project.githubTemplateUrl && (
              <a
                href={project.githubTemplateUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                View Starter Code
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            <button
              onClick={() => {
                toggleProjectStatus(project.id, 'In Progress');
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Start This Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
