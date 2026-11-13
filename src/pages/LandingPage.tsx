import React from 'react';
import { useApp } from '../context/AppContext';
import { CAREER_PATHS } from '../data/sampleData';
import { 
  ArrowRight, 
  Check, 
  Compass, 
  Map, 
  GitCompare, 
  FileText, 
  Award,
  FolderKanban, 
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActivePage, setSelectedCareerModal, loginAsUser } = useApp();

  const features = [
    {
      title: 'Career Exploration',
      description: 'Discover in-demand careers across 12+ domains with real salary benchmarks and required skills.',
      icon: Compass,
    },
    {
      title: 'Skill & Resume Analysis',
      description: 'Enter your skills manually or upload your resume (PDF/DOCX) for instant, unbiased AI extraction.',
      icon: FileText,
    },
    {
      title: 'Skill Gap Breakdown',
      description: 'Clearly see what skills you have, what to improve, and what you need to learn to get hired.',
      icon: GitCompare,
    },
    {
      title: 'Personalized Roadmap',
      description: 'Follow a step-by-step learning schedule with daily tasks, exercises, and milestones tailored to your pace.',
      icon: Map,
    },
    {
      title: 'Hands-on Projects',
      description: 'Build portfolio-ready projects that demonstrate real-world competency to hiring managers.',
      icon: FolderKanban,
    },
    {
      title: 'Progress Tracking',
      description: 'Track daily study streaks, task completions, and test your knowledge with interactive quizzes.',
      icon: TrendingUp,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Any Career Goal',
      description: 'Pick any job role or exam you want to pursue. No college degree or background is mandatory.',
    },
    {
      number: '02',
      title: 'Share Your Existing Skills',
      description: 'Type in skills you already know or upload your resume for automatic extraction.',
    },
    {
      number: '03',
      title: 'See Your Skill Gaps',
      description: 'Our AI compares your skills with real job requirements and highlights exactly what to learn.',
    },
    {
      number: '04',
      title: 'Follow Your Daily Roadmap',
      description: 'Master daily topics, complete practice tasks, and build your career-ready portfolio.',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* Clean Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Logo Display */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-[#E2E8F0] shadow-xs flex items-center justify-center">
              <img
                src="/assets/aistudio/Skill_Bridge_Learning_Emblem_c8344995.png"
                alt="Skill Bridge Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#64748B] text-xs font-medium">
            <span>Free Career Planning for Everyone</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] tracking-tight leading-tight max-w-4xl mx-auto">
            Turn Your Goals Into a Clear Career Plan.
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            Skill Bridge helps students, graduates, and professionals discover their career path, find skill gaps, and follow a personalized step-by-step roadmap to achieve their dream job.
          </p>

          {/* Prominent Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('auth')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => loginAsUser('user-sarah')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] font-medium text-sm transition-colors"
            >
              Explore Live Demo
            </button>
          </div>

          {/* Subtle Key Benefits */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A]" />
              No degree requirements
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A]" />
              12+ Career Categories
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A]" />
              Resume & Skill Gap Analysis
            </span>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="py-10 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <p className="text-2xl sm:text-3xl font-bold text-[#111827] font-mono">28,000+</p>
              <p className="text-xs text-[#64748B] mt-1">Roadmaps Generated</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <p className="text-2xl sm:text-3xl font-bold text-[#2563EB] font-mono">12+</p>
              <p className="text-xs text-[#64748B] mt-1">Career Domains</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <p className="text-2xl sm:text-3xl font-bold text-[#16A34A] font-mono">100%</p>
              <p className="text-xs text-[#64748B] mt-1">Free to Access</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <p className="text-2xl sm:text-3xl font-bold text-[#F59E0B] font-mono">24/7</p>
              <p className="text-xs text-[#64748B] mt-1">Personalized Guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean How It Works Section */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
              Simple 4-Step Process
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              How Skill Bridge Works
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              From setting your goal to becoming job-ready in structured, achievable steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-[#2563EB] block mb-2">
                    {step.number}
                  </span>
                  <h3 className="text-sm font-semibold text-[#111827]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Features Cards Section */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
              Platform Features
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Everything You Need to Build Real Skills
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              A complete SaaS platform designed to remove guesswork from your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 bg-white rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors space-y-3 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#111827]">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Careers Minimal Preview */}
      <section className="py-16 md:py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
                Explore Tracks
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                Popular Career Pathways
              </h2>
            </div>
            <button
              onClick={() => setActivePage('career-exploration')}
              className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              View all 12+ domains
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAREER_PATHS.slice(0, 6).map((career) => (
              <div
                key={career.id}
                onClick={() => setSelectedCareerModal(career)}
                className="p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-blue-300 hover:bg-white cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#64748B]">
                    {career.domain}
                  </span>
                  <span className="text-[11px] font-medium text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">
                    {career.demandLevel} Demand
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#111827]">
                  {career.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2">
                  {career.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] border-t border-[#E2E8F0]">
                  <span className="font-mono text-[#111827]">{career.avgSalaryRange}</span>
                  <span className="text-[#2563EB] font-medium flex items-center gap-1">
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer CTA */}
      <section className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
            Start Your Career Journey Today
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto">
            Create an account in less than 30 seconds and get your customized skill development plan.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('auth')}
              className="px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-colors inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
