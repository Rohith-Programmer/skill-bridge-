import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QualificationCompleted } from '../types';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  RefreshCw, 
  ArrowRight,
  Edit3,
  Bot
} from 'lucide-react';

export const AIAdvisorPage: React.FC = () => {
  const { 
    targetCareer, 
    currentUser, 
    aiAnalysis, 
    isAnalyzingCareer, 
    runCareerAIAnalysis,
    aiChatMessages, 
    isAdvisorTyping, 
    sendAIChatMessage, 
    clearAIChat,
    setActivePage,
    completeOnboarding,
    addNotification
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [inlineAge, setInlineAge] = useState(currentUser?.age ? String(currentUser.age) : '');
  const [inlineQual, setInlineQual] = useState<string>(currentUser?.highestQualificationCompleted || '');
  const [showDetailEditor, setShowDetailEditor] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const msg = inputMessage;
    setInputMessage('');
    sendAIChatMessage(msg);
  };

  const handleSaveEligibilityDetails = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      age: inlineAge ? Number(inlineAge) : undefined,
      highestQualificationCompleted: inlineQual ? (inlineQual as QualificationCompleted) : undefined,
    });
    setShowDetailEditor(false);
    addNotification('Profile Details Saved', 'Re-evaluating career benchmarks...');
  };

  const quickPrompts = [
    `Can a graduate switch to this role without prior background?`,
    `What skills are most critical to learn first for ${targetCareer.title}?`,
    `How should I structure my ${currentUser?.dailyHoursGoal || 2} hours daily study time?`,
    `Are there any formal degree or age requirements for this path?`,
  ];

  const evalResult = aiAnalysis?.eligibilityEvaluation;
  const isDetailsNeeded = evalResult?.status === 'Details Needed' || (evalResult?.missingDetails && evalResult.missingDetails.length > 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>AI Career Guidance · Powered by Gemini</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">
            AI Career Guide: {targetCareer.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Ask questions, understand real hiring criteria, verify eligibility guidelines, and get instant personalized advice.
          </p>
        </div>

        <button
          onClick={() => runCareerAIAnalysis()}
          disabled={isAnalyzingCareer}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${isAnalyzingCareer ? 'animate-spin' : ''}`} />
          <span>{isAnalyzingCareer ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      {/* Main 2-Column: Left Side AI Diagnostic Report, Right Side Interactive Chat Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Career Analysis Report */}
        <div className="lg:col-span-7 space-y-6">
          {/* Job Requirements & Eligibility Card */}
          <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <h3 className="text-sm font-bold text-[#111827]">
                  Job & Exam Requirements
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailEditor(!showDetailEditor)}
                className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                {showDetailEditor ? 'Close' : 'Update Background'}
              </button>
            </div>

            {/* Status Indicator Banner */}
            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  evalResult?.status === 'Officially Eligible'
                    ? 'bg-emerald-50 text-[#16A34A]'
                    : evalResult?.status === 'Prerequisite In Progress'
                    ? 'bg-amber-50 text-[#F59E0B]'
                    : 'bg-blue-50 text-[#2563EB]'
                }`}>
                  {evalResult?.status || 'Skills-First (No Degree Required)'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {evalResult?.summary || aiAnalysis?.eligibilitySummary || (
                  targetCareer.isCompetitiveExam
                    ? 'Official government exam pathway. Graduates of any accredited discipline are eligible to apply.'
                    : 'Companies prioritize proven skill competency, portfolio artifacts, and problem solving over specific degrees.'
                )}
              </p>
            </div>

            {/* Inline Detail Editor */}
            {(showDetailEditor || isDetailsNeeded) && (
              <form onSubmit={handleSaveEligibilityDetails} className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-3 text-xs">
                <span className="font-semibold text-[#111827] block">
                  Verify Qualifications for Statutory Check
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#64748B] mb-1">Age (Optional)</label>
                    <input
                      type="number"
                      value={inlineAge}
                      onChange={(e) => setInlineAge(e.target.value)}
                      placeholder="e.g. 22"
                      className="w-full p-2 border border-[#E2E8F0] rounded-lg bg-white text-[#111827]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#64748B] mb-1">Completed Education</label>
                    <select
                      value={inlineQual}
                      onChange={(e) => setInlineQual(e.target.value)}
                      className="w-full p-2 border border-[#E2E8F0] rounded-lg bg-white text-[#111827]"
                    >
                      <option value="">None / In Progress</option>
                      <option value="10th">10th</option>
                      <option value="12th">12th</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold"
                  >
                    Save & Recalibrate
                  </button>
                </div>
              </form>
            )}

            {/* Required Skills Table */}
            {aiAnalysis?.verifiedRequiredSkills && (
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#111827] block">
                  Verified Industry Skill Benchmarks
                </span>
                <div className="divide-y divide-[#E2E8F0]">
                  {aiAnalysis.verifiedRequiredSkills.slice(0, 4).map((s, i) => (
                    <div key={i} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#111827]">{s.name}</strong>
                        <span className="text-[11px] text-[#64748B] ml-2">({s.category})</span>
                      </div>
                      <span className="text-[11px] text-[#2563EB] font-medium bg-blue-50 px-2 py-0.5 rounded">
                        {s.importance} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cadence Allocation Card */}
          <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                Daily & Weekly Learning Strategy ({currentUser?.dailyHoursGoal || 2}h / day)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Daily Cadence
                </span>
                <p className="text-[#111827] leading-relaxed">
                  {aiAnalysis?.dailyWeeklyMonthlyStrategy?.dailyPlan || 
                    `Spend 45 minutes on concept lectures/reading and 45 minutes writing code or solving exercises.`}
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Weekly Milestone
                </span>
                <p className="text-[#111827] leading-relaxed">
                  {aiAnalysis?.dailyWeeklyMonthlyStrategy?.weeklyCadence || 
                    `Dedicate weekends to building a mini project or taking a timed self-assessment quiz.`}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActivePage('roadmap')}
                className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1"
              >
                Go to Step-by-Step Learning Plan
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Advisor Chat */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#111827]">Skill Bridge AI Advisor</h3>
                <span className="text-[10px] text-[#64748B]">Active & responsive</span>
              </div>
            </div>
            <button
              onClick={clearAIChat}
              className="text-[11px] text-[#64748B] hover:text-[#111827] transition-colors"
            >
              Reset Chat
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#F8FAFC]/50 border-b border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendAIChatMessage(p)}
                className="px-2.5 py-1 text-[11px] whitespace-nowrap bg-white text-[#64748B] hover:text-[#2563EB] border border-[#E2E8F0] rounded-md transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {aiChatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F8FAFC] text-[#111827] border border-[#E2E8F0]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-[#64748B] mt-0.5 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isAdvisorTyping && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-xs w-28">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] ml-1">Thinking</span>
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E2E8F0] flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask anything about ${targetCareer.title}...`}
              className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isAdvisorTyping}
              className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
