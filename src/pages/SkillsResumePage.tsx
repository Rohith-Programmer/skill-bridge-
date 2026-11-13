import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserManualSkill, 
  SkillGapItem,
} from '../types';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Target,
  RefreshCw,
  Eye,
  Check,
  X,
  GraduationCap,
  Briefcase,
  FolderKanban,
  FileCheck2,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export const SkillsResumePage: React.FC = () => {
  const {
    targetCareer,
    currentUser,
    manualSkills,
    addManualSkill,
    updateManualSkill,
    deleteManualSkill,
    uploadedResume,
    isUploadingResume,
    resumeUploadError,
    uploadAndParseResume,
    deleteUploadedResume,
    combinedSkillsMode,
    setCombinedSkillsMode,
    skillsResumeAnalysis,
    isAnalyzingSkillsResume,
    skillsResumeAnalysisError,
    runSkillsResumeAnalysis,
    applyPlanToRoadmap,
    openQuizModal,
    setActivePage,
  } = useApp();

  // Manual skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<'Technical' | 'Non-Technical'>('Technical');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editSkillName, setEditSkillName] = useState('');
  const [editSkillLevel, setEditSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [editSkillCategory, setEditSkillCategory] = useState<'Technical' | 'Non-Technical'>('Technical');

  // Resume file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [verifiedItemMessage, setVerifiedItemMessage] = useState<string | null>(null);

  // Suggestions for target career
  const careerSuggestedSkills = [
    { name: 'JavaScript & Web Standards', category: 'Technical' as const, level: 'Intermediate' as const },
    { name: 'React Component UI', category: 'Technical' as const, level: 'Beginner' as const },
    { name: 'REST APIs & Integration', category: 'Technical' as const, level: 'Intermediate' as const },
    { name: 'SQL & Database Queries', category: 'Technical' as const, level: 'Beginner' as const },
    { name: 'System Troubleshooting', category: 'Technical' as const, level: 'Intermediate' as const },
    { name: 'Analytical Problem Solving', category: 'Non-Technical' as const, level: 'Intermediate' as const },
    { name: 'Clear Technical Writing', category: 'Non-Technical' as const, level: 'Intermediate' as const },
    { name: 'Agile & Teamwork', category: 'Non-Technical' as const, level: 'Advanced' as const },
  ];

  const handleAddManualSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const exists = manualSkills.some(
      (s) => s.name.trim().toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) {
      alert(`"${newSkillName.trim()}" is already in your skills list.`);
      return;
    }

    addManualSkill({
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
    });

    setNewSkillName('');
  };

  const startEditSkill = (skill: UserManualSkill) => {
    setEditingSkillId(skill.id);
    setEditSkillName(skill.name);
    setEditSkillLevel(skill.level);
    setEditSkillCategory(skill.category);
  };

  const saveEditSkill = () => {
    if (!editingSkillId || !editSkillName.trim()) return;
    updateManualSkill(editingSkillId, {
      name: editSkillName.trim(),
      level: editSkillLevel,
      category: editSkillCategory,
    });
    setEditingSkillId(null);
  };

  const handleFileUpload = async (file: File) => {
    await uploadAndParseResume(file);
  };

  const onDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const combinedSkillCount = React.useMemo(() => {
    const set = new Set<string>();
    if (combinedSkillsMode === 'both' || combinedSkillsMode === 'manual_only') {
      manualSkills.forEach((s) => set.add(s.name.toLowerCase().trim()));
    }
    if (uploadedResume && (combinedSkillsMode === 'both' || combinedSkillsMode === 'resume_only')) {
      (uploadedResume.technicalSkills || []).forEach((s) => set.add(s.name.toLowerCase().trim()));
      (uploadedResume.nonTechnicalSkills || []).forEach((s) => set.add(s.name.toLowerCase().trim()));
    }
    return set.size;
  }, [manualSkills, uploadedResume, combinedSkillsMode]);

  const handleVerifyAction = (item: SkillGapItem) => {
    if (item.verificationMethod === 'Practice Quiz') {
      openQuizModal();
    } else {
      setVerifiedItemMessage(
        `Logged verification: ${item.verificationMethod} for "${item.name}".`
      );
      setTimeout(() => setVerifiedItemMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Target className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Target Career: <strong className="text-[#111827]">{targetCareer.title}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">
            My Skills & Resume Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Record what you already know or upload your resume. Our AI compares your current skills with industry standards for <strong>{targetCareer.title}</strong> to build your personalized plan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActivePage('career-exploration')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-medium transition-colors"
          >
            Change Career
          </button>
          <button
            onClick={runSkillsResumeAnalysis}
            disabled={isAnalyzingSkillsResume || combinedSkillCount === 0}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs ${
              isAnalyzingSkillsResume || combinedSkillCount === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-blue-700 text-white'
            }`}
          >
            {isAnalyzingSkillsResume ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Analyze Skills & Plan
              </>
            )}
          </button>
        </div>
      </div>

      {verifiedItemMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>{verifiedItemMessage}</span>
          </div>
          <button 
            onClick={() => setVerifiedItemMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Two Input Cards: Add Skills & Upload Resume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* CARD 1: Add My Skills (Manual Entry) */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <span>1. Add My Skills</span>
                <span className="text-[11px] font-normal text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                  {manualSkills.length} Added
                </span>
              </h2>
              <p className="text-xs text-[#64748B]">
                Manually record skills you have practiced or studied.
              </p>
            </div>
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAddManualSkill} className="space-y-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1">
                Skill Name
              </label>
              <input
                type="text"
                placeholder="e.g. JavaScript, Python, Communication, React, SQL..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#111827] mb-1">
                  Type
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNewSkillCategory('Technical')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                      newSkillCategory === 'Technical'
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    Technical
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSkillCategory('Non-Technical')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                      newSkillCategory === 'Non-Technical'
                        ? 'bg-[#111827] text-white border-[#111827]'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    Soft Skill
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111827] mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
                >
                  <option value="Beginner">Beginner (Basics)</option>
                  <option value="Intermediate">Intermediate (Project ready)</option>
                  <option value="Advanced">Advanced (Production experience)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!newSkillName.trim()}
              className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                newSkillName.trim()
                  ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill to List
            </button>
          </form>

          {/* Quick-add Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
              Suggestions for {targetCareer.title}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {careerSuggestedSkills.map((sug) => {
                const isAdded = manualSkills.some(
                  (s) => s.name.toLowerCase().trim() === sug.name.toLowerCase().trim()
                );
                return (
                  <button
                    key={sug.name}
                    disabled={isAdded}
                    onClick={() => addManualSkill(sug)}
                    className={`text-[11px] px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                      isAdded
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                        : 'bg-white hover:bg-slate-50 text-[#111827] border-[#E2E8F0]'
                    }`}
                  >
                    {isAdded ? <Check className="w-3 h-3 text-slate-400" /> : <Plus className="w-3 h-3 text-[#2563EB]" />}
                    {sug.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Added Skills List */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Confirmed Skills ({manualSkills.length})
            </span>

            {manualSkills.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-[#E2E8F0] rounded-lg text-xs text-[#64748B]">
                No skills added yet. Use the form above to add your skills.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0] max-h-60 overflow-y-auto pr-1">
                {manualSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="py-2 flex items-center justify-between gap-2"
                  >
                    {editingSkillId === skill.id ? (
                      <div className="flex-1 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editSkillName}
                          onChange={(e) => setEditSkillName(e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-[#E2E8F0] rounded bg-white"
                        />
                        <select
                          value={editSkillLevel}
                          onChange={(e) => setEditSkillLevel(e.target.value as any)}
                          className="px-1.5 py-1 text-xs border border-[#E2E8F0] rounded bg-white"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <button
                          onClick={saveEditSkill}
                          className="p-1 bg-[#16A34A] text-white rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingSkillId(null)}
                          className="p-1 bg-slate-200 text-slate-700 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#111827] truncate">
                            {skill.name}
                          </p>
                          <p className="text-[11px] text-[#64748B]">
                            {skill.category} · <span className="text-[#2563EB] font-medium">{skill.level}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEditSkill(skill)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteManualSkill(skill.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: Upload Resume (PDF / DOCX) */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <span>2. Upload Resume</span>
                {uploadedResume && (
                  <span className="text-[11px] font-medium text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <FileCheck2 className="w-3 h-3" />
                    Processed
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#64748B]">
                Upload PDF or DOCX file for automatic skill & experience extraction.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {!uploadedResume ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDropFile}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-xl cursor-pointer text-center transition-colors ${
                isDragOver ? 'border-[#2563EB] bg-blue-50/50' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#111827]">
                Click to upload or drag & drop resume
              </p>
              <p className="text-[11px] text-[#64748B] mt-1">
                Supported formats: PDF or DOCX (Max 15MB)
              </p>
              <div className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-medium shadow-xs">
                <FileText className="w-3.5 h-3.5" />
                Select File
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <div>
                    <p className="text-xs font-bold text-[#111827] truncate max-w-xs">
                      {uploadedResume.fileName || 'Resume.pdf'}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      Uploaded {uploadedResume.uploadedAt || 'Today'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowResumeModal(true)}
                  className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[#111827] rounded text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                  Review Details
                </button>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
                <strong className="text-[#111827] block mb-0.5">Extracted Summary:</strong>
                {uploadedResume.summary}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Technical</span>
                  <span className="font-bold text-[#2563EB]">{uploadedResume.technicalSkills.length}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Soft Skills</span>
                  <span className="font-bold text-[#111827]">{uploadedResume.nonTechnicalSkills.length}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Experience</span>
                  <span className="font-bold text-[#16A34A]">{(uploadedResume.experience || []).length}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Replace File
                </button>
                <button
                  type="button"
                  onClick={deleteUploadedResume}
                  className="text-rose-600 hover:underline font-medium"
                >
                  Delete Resume Data
                </button>
              </div>
            </div>
          )}

          {isUploadingResume && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-xs text-[#2563EB]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing resume content with Gemini AI...</span>
            </div>
          )}

          {resumeUploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{resumeUploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Selector Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              Analysis Source
            </h2>
            <p className="text-xs text-[#64748B]">
              Choose how you want your skills evaluated against {targetCareer.title}.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded">
            {combinedSkillCount} Unique Skills Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setCombinedSkillsMode('both')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
              combinedSkillsMode === 'both'
                ? 'border-[#2563EB] bg-blue-50/50'
                : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#111827]">Combine Both</span>
              <span className="text-[10px] font-semibold text-[#2563EB]">Recommended</span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Merges manual and resume skills. Deduplicates and prioritizes your manual input.
            </p>
          </div>

          <div
            onClick={() => setCombinedSkillsMode('manual_only')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
              combinedSkillsMode === 'manual_only'
                ? 'border-[#2563EB] bg-blue-50/50'
                : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <span className="text-xs font-bold text-[#111827] block mb-1">
              Only Manual Skills ({manualSkills.length})
            </span>
            <p className="text-[11px] text-[#64748B]">
              Analyzes only the skills you entered manually in Card 1.
            </p>
          </div>

          <div
            onClick={() => {
              if (!uploadedResume) {
                alert('Please upload a resume first to select this mode.');
                return;
              }
              setCombinedSkillsMode('resume_only');
            }}
            className={`p-3.5 rounded-lg border transition-colors ${
              !uploadedResume
                ? 'opacity-40 cursor-not-allowed border-[#E2E8F0] bg-slate-50'
                : combinedSkillsMode === 'resume_only'
                ? 'border-[#2563EB] bg-blue-50/50 cursor-pointer'
                : 'border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer'
            }`}
          >
            <span className="text-xs font-bold text-[#111827] block mb-1">
              Only Uploaded Resume
            </span>
            <p className="text-[11px] text-[#64748B]">
              Analyzes only skills extracted from your uploaded resume.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={runSkillsResumeAnalysis}
            disabled={isAnalyzingSkillsResume || combinedSkillCount === 0}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              isAnalyzingSkillsResume || combinedSkillCount === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            {isAnalyzingSkillsResume ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Calculating Skill Gaps...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Run AI Skill Gap Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {skillsResumeAnalysisError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{skillsResumeAnalysisError}</span>
        </div>
      )}

      {/* AI Skill Gap Results (3 Clean Sections) */}
      {skillsResumeAnalysis && (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
            <h2 className="text-base font-bold text-[#111827] mb-1">
              AI Skill Gap Analysis Results
            </h2>
            <p className="text-xs text-[#64748B]">
              {skillsResumeAnalysis.gapResult.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Skills I Already Have */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-xs font-bold text-[#16A34A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Skills I Already Have
                </h3>
                <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">
                  {skillsResumeAnalysis.gapResult.skillsAlreadyHave.length}
                </span>
              </div>

              <div className="space-y-2">
                {skillsResumeAnalysis.gapResult.skillsAlreadyHave.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#111827]">{item.name}</span>
                      <span className="text-[10px] text-[#16A34A] font-medium">{item.currentLevel}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{item.whyImportant}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-[#64748B]">
                      <span>{item.verificationMethod}</span>
                      <button
                        onClick={() => handleVerifyAction(item)}
                        className="text-[#2563EB] font-medium hover:underline"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Skills I Need to Improve */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-xs font-bold text-[#F59E0B] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Skills to Improve
                </h3>
                <span className="text-xs font-bold text-[#F59E0B] bg-amber-50 px-2 py-0.5 rounded">
                  {skillsResumeAnalysis.gapResult.skillsNeedToImprove.length}
                </span>
              </div>

              <div className="space-y-2">
                {skillsResumeAnalysis.gapResult.skillsNeedToImprove.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#111827]">{item.name}</span>
                      <span className="text-[10px] text-[#F59E0B] font-medium">
                        {item.currentLevel} → {item.requiredLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{item.whyImportant}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-[#64748B]">
                      <span>{item.verificationMethod}</span>
                      <button
                        onClick={() => handleVerifyAction(item)}
                        className="text-[#2563EB] font-medium hover:underline"
                      >
                        Practice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Skills I Need to Learn */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  Skills to Learn
                </h3>
                <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                  {skillsResumeAnalysis.gapResult.skillsNeedToLearn.length}
                </span>
              </div>

              <div className="space-y-2">
                {skillsResumeAnalysis.gapResult.skillsNeedToLearn.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#111827]">{item.name}</span>
                      <span className="text-[10px] text-[#2563EB] font-medium">Target: {item.requiredLevel}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{item.whyImportant}</p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          addManualSkill({
                            name: item.name,
                            level: 'Beginner',
                            category: item.category || 'Technical',
                          });
                        }}
                        className="text-[10px] text-[#2563EB] font-medium hover:underline"
                      >
                        + Add to My Skills
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personalized Learning Plan Card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  Personalized Learning Plan for {targetCareer.title}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Paced for your {currentUser?.dailyHoursGoal || 2} hours/day study commitment
                </p>
              </div>

              <button
                onClick={() => applyPlanToRoadmap(skillsResumeAnalysis.learningPlan)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                Apply to My Learning Roadmap (1-Click)
              </button>
            </div>

            {/* Priority Skills */}
            <div>
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-2">
                Priority Skills to Master First
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {skillsResumeAnalysis.learningPlan.skillsToLearnFirst.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#111827]">{item.skill}</span>
                      <span className="text-[11px] text-[#2563EB] font-mono">~{item.estimatedDays} days</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Tasks */}
            <div>
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-2">
                This Week's Daily Tasks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {skillsResumeAnalysis.learningPlan.dailyTasks.map((t, idx) => (
                  <div key={idx} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#2563EB] font-semibold text-[11px]">
                      <span>{t.day}</span>
                      <span className="font-mono">{t.estimatedMinutes}m</span>
                    </div>
                    <p className="font-medium text-[#111827]">{t.task}</p>
                    <span className="text-[10px] text-[#64748B] block">{t.skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Details Modal */}
      {showResumeModal && uploadedResume && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl border border-[#E2E8F0] overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="text-sm font-bold text-[#111827]">Extracted Resume Details</h3>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="font-semibold text-[#111827] block mb-1">Summary</span>
                <p className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[#64748B]">
                  {uploadedResume.summary}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#111827] block mb-1">Technical Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {uploadedResume.technicalSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-[#2563EB] rounded text-[11px]">
                      {s.name} ({s.level})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#111827] block mb-1">Soft Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {uploadedResume.nonTechnicalSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-[#111827] rounded text-[11px]">
                      {s.name} ({s.level})
                    </span>
                  ))}
                </div>
              </div>

              {uploadedResume.education && uploadedResume.education.length > 0 && (
                <div>
                  <span className="font-semibold text-[#111827] block mb-1">Education</span>
                  {uploadedResume.education.map((edu, i) => (
                    <div key={i} className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] mb-1">
                      <strong className="text-[#111827]">{edu.degree}</strong> · {edu.institution}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-1.5 bg-[#111827] text-white rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
