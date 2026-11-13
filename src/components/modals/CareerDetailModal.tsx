import React from 'react';
import { useApp } from '../../context/AppContext';
import { CareerPath } from '../../types';
import { 
  X, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Landmark,
  ShieldCheck,
  AlertCircle,
  Cpu,
  Code2
} from 'lucide-react';

interface CareerDetailModalProps {
  career: CareerPath | null;
  onClose: () => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({ career, onClose }) => {
  const { selectTargetCareer, setActivePage, targetCareer } = useApp();

  if (!career) return null;

  const isCurrentTarget = targetCareer.id === career.id;

  const handleSetTarget = () => {
    selectTargetCareer(career.id);
    onClose();
    setActivePage('skill-gap');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {career.domain}
              </span>
              {career.isCompetitiveExam && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Government Exam
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{career.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Starting Pay</p>
              <p className="text-sm font-bold text-slate-900 font-mono tabular-nums truncate">{career.entrySalary}</p>
              <span className="text-[10px] text-slate-500 truncate block">{career.avgSalaryRange}</span>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Job Demand</p>
              <p className="text-sm font-bold text-emerald-600">{career.demandLevel}</p>
              <span className="text-[10px] text-slate-500 font-mono tabular-nums">{career.growthRate}</span>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Open Jobs</p>
              <p className="text-sm font-bold text-blue-600 font-mono tabular-nums">
                {career.openJuniorJobs.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">Active postings</span>
            </div>
          </div>

          {/* Official Competitive Exam Structure (for Government / Civil Services) */}
          {career.isCompetitiveExam && career.competitiveExamDetails && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-blue-950 text-xs">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  <span>{career.competitiveExamDetails.examName}</span>
                </div>
                <span className="text-[10px] text-blue-700 font-medium">
                  {career.competitiveExamDetails.conductingBody}
                </span>
              </div>

              <div className="text-[11px] text-slate-700 bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-semibold text-blue-900 block">Official Eligibility:</span>
                <p>{career.competitiveExamDetails.officialEligibility}</p>
              </div>

              {/* Exam Stages List */}
              {career.competitiveExamDetails.examStages && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-900 block">Exam Stages:</span>
                  {career.competitiveExamDetails.examStages.map((stg, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{stg.stageName}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{stg.format}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        Subjects: {stg.keySubjects.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-slate-500 italic">
                * Note: Exam stages, syllabus, and eligibility criteria are verified from official government notifications.
              </p>
            </div>
          )}

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About This Career</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{career.overview}</p>
          </div>

          {/* Required Competencies */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Skills You Need
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {career.keySkills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Good to Have Before Starting
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {career.prerequisites.map((pre, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hiring Organizations / Agencies */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Top Companies & Organizations Hiring
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              {career.topCompaniesHiring.map((company, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                  {company}
                </span>
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
          {isCurrentTarget ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Your Chosen Career
              </span>
              <button
                onClick={() => {
                  onClose();
                  setActivePage('skill-gap');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                See Skills to Learn
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSetTarget}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Choose This Career & See My Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
