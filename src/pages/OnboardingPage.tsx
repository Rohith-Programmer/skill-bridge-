import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CareerDomain, 
  ProfessionalStatus, 
  QualificationCompleted,
  LearningMethod,
  SkillProficiency,
  CareerPath
} from '../types';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Clock, 
  CheckCircle2,
  BookOpen,
  Briefcase,
  User,
  GraduationCap,
  Landmark,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { currentUser, completeOnboarding, setActivePage, allCareers } = useApp();

  const [step, setStep] = useState(1);

  // Field 1: Full Name
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Sarah Miller');

  // Field 2: Age (Optional)
  const [age, setAge] = useState<string>(currentUser?.age ? String(currentUser.age) : '');

  // Field 3: What are you doing now?
  const [currentStatus, setCurrentStatus] = useState<ProfessionalStatus>(
    currentUser?.currentStatus || 'Career Switcher'
  );

  // Field 4: What did you study? (Optional)
  const [highestQualification, setHighestQualification] = useState<QualificationCompleted | undefined>(
    currentUser?.highestQualificationCompleted
  );

  // Field 6: Career Domain (Career Goal Area)
  const [selectedDomain, setSelectedDomain] = useState<CareerDomain>(
    currentUser?.careerDomain || 'Software and IT'
  );

  // Field 7: Target Career or Job Role (Which job do you want?)
  const [selectedCareerId, setSelectedCareerId] = useState<string>(
    currentUser?.targetCareerId || 'career-fullstack'
  );

  // Field 5: Interests
  const [interests, setInterests] = useState<string[]>(
    currentUser?.interests?.length ? currentUser.interests : ['Coding & Web Apps', 'Solving Problems', 'Learning New Things']
  );
  const [newInterestInput, setNewInterestInput] = useState('');

  // Field 8: Existing Skills (What skills do you already have?)
  const [skillRatings, setSkillRatings] = useState<Record<string, SkillProficiency>>({
    'skill-core-logic': 'Intermediate',
    'skill-ts': 'Intermediate',
    'skill-react': 'Beginner',
    'skill-node': 'Beginner',
  });

  // Field 9: Daily Available Learning Time (How much time can you spend learning every day?)
  const [dailyHours, setDailyHours] = useState<number>(currentUser?.dailyHoursGoal || 2);

  // Field 10: Preferred Learning Method (How do you like to learn?)
  const [preferredMethods, setPreferredMethods] = useState<LearningMethod[]>([
    'Hands-on Projects & Portfolios',
    'Interactive Coding & Labs',
  ]);

  const statusOptions: { value: ProfessionalStatus; label: string; desc: string }[] = [
    { value: 'School Student', label: 'School Student', desc: 'Currently in school (10th, 11th, 12th)' },
    { value: 'College Student', label: 'College Student', desc: 'Studying in college or university' },
    { value: 'Graduate', label: 'Graduate', desc: 'Finished my degree (e.g. B.Tech, B.Sc, B.Com)' },
    { value: 'Working Professional', label: 'Working in a Job', desc: 'Currently employed in a job' },
    { value: 'Job Seeker', label: 'Looking for a Job', desc: 'Actively searching for work' },
    { value: 'Career Switcher', label: 'Changing My Career', desc: 'Moving from one field to another' },
    { value: 'Other', label: 'Other', desc: 'Self-learner or alternative path' },
  ];

  const qualificationOptions: { value: QualificationCompleted; label: string }[] = [
    { value: '10th', label: '10th Class' },
    { value: '12th', label: '12th Class' },
    { value: 'Diploma', label: 'Diploma' },
    { value: "Bachelor's Degree", label: "Bachelor's Degree (B.Tech, B.Sc, B.Com, B.A)" },
    { value: "Master's Degree", label: "Master's Degree (M.Tech, MBA, M.Sc)" },
    { value: 'PhD', label: 'PhD' },
    { value: 'Other', label: 'Other / Alternative' },
  ];

  const domainOptions: CareerDomain[] = [
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

  const methodOptions: { value: LearningMethod; title: string; desc: string }[] = [
    {
      value: 'Hands-on Projects & Portfolios',
      title: 'Practice & Projects',
      desc: 'Build real things and practical tasks',
    },
    {
      value: 'Interactive Coding & Labs',
      title: 'Hands-on Labs & Exercises',
      desc: 'Interactive step-by-step challenges',
    },
    {
      value: 'Video Masterclasses',
      title: 'Watching Videos',
      desc: 'Video lessons and screen recordings',
    },
    {
      value: 'Official Documentation & Handbooks',
      title: 'Reading Books & Guides',
      desc: 'Written tutorials, official notes, and docs',
    },
    {
      value: 'Mock Exams & Speed Tests',
      title: 'Practice Tests & Quizzes',
      desc: 'Speed quizzes and sample exam questions',
    },
    {
      value: 'Mentorship & Peer Review',
      title: 'Mentorship & Reviews',
      desc: 'Feedback from mentors and learning groups',
    },
  ];

  const careersInDomain = allCareers.filter(
    (c) => c.domain === selectedDomain || selectedDomain === 'Other Careers & Specialized Trades'
  );

  const selectedCareerObj = allCareers.find((c) => c.id === selectedCareerId) || allCareers[0];

  const toggleMethod = (method: LearningMethod) => {
    setPreferredMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  // Simple English eligibility evaluation
  const evaluateFormalEligibility = (career: CareerPath) => {
    const isGov = career.domain === 'Government Jobs and Civil Services' || career.isCompetitiveExam;
    const hasDegree = highestQualification === "Bachelor's Degree" || highestQualification === "Master's Degree" || highestQualification === 'PhD';
    const ageNum = age ? Number(age) : null;

    if (!isGov) {
      return {
        status: 'No College Degree Needed',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        note: 'You can do this job without any special college degree! Companies hire based on your real skills and practical projects. A 12th student, a college student, or a working person can all start learning today.',
        isStatutory: false,
        missingDetails: [],
        mandatory: ['None — You do not need any college degree'],
        recommended: career.keySkills.slice(0, 4),
        optional: ['Helpful certificates and online projects'],
      };
    }

    // Career has formal government exam requirements (Civil Services / Banking)
    const missing: string[] = [];
    if (!age) missing.push('Age');
    if (!highestQualification) missing.push('Education details');

    if (missing.length > 0) {
      return {
        status: 'Official Exam Check',
        statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
        note: `Government exams require a completed graduation degree (B.Tech, B.Com, B.Sc, B.A) and age 21 to 32. You can enter your details to verify eligibility, or start preparing the syllabus right now!`,
        isStatutory: true,
        missingDetails: missing,
        mandatory: [
          career.competitiveExamDetails?.officialEligibility || "Any recognized graduation degree before writing the final exam",
          "Age 21 to 32 years (extra years allowed for reserved categories)",
        ],
        recommended: ['General Studies, Reasoning, and Current Affairs'],
        optional: ['Mock tests and past question papers'],
      };
    }

    if (hasDegree) {
      if (ageNum && (ageNum < 21 || ageNum > 32)) {
        return {
          status: 'Check Exam Age Limit',
          statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
          note: `You have a degree! The general age limit is 21 to 32 years. If you qualify for reserved category rules (OBC +3 yrs, SC/ST +5 yrs), you can still write the exam.`,
          isStatutory: true,
          missingDetails: [],
          mandatory: ["Any recognized Bachelor's degree (Verified)", "Age 21 to 32 years"],
          recommended: ['General Studies, Reasoning, and Essay Writing'],
          optional: ['Mock interview practice and test series'],
        };
      }
      return {
        status: 'You Are Eligible!',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        note: `Great news! A B.Tech, B.Sc, B.Com, or any graduate can write this exam. You meet the requirements. Let's start preparing for the exam stages and syllabus!`,
        isStatutory: true,
        missingDetails: [],
        mandatory: ["Any recognized graduation degree (Verified)"],
        recommended: ['General Studies, Aptitude, and Subjective Writing'],
        optional: ['Practice test series'],
      };
    }

    return {
      status: 'You Can Start Preparing Now!',
      statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      note: `The government requires a completed degree to write the final exam. But you do NOT need to wait! A 12th-class student or college student can start learning the basics and General Studies right now.`,
      isStatutory: true,
      missingDetails: [],
      mandatory: ["Any recognized Bachelor's degree before writing the final exam"],
      recommended: ['General Studies basics, Aptitude, and Reading habits'],
      optional: ['Beginner practice tests'],
    };
  };

  const eligibilityCheck = evaluateFormalEligibility(selectedCareerObj);

  const handleFinish = () => {
    completeOnboarding({
      fullName,
      age: age ? Number(age) : undefined,
      currentStatus,
      highestQualificationCompleted: highestQualification,
      careerDomain: selectedDomain,
      targetCareerId: selectedCareerId,
      interests,
      dailyHoursGoal: dailyHours,
      weeklyHourGoal: dailyHours * 7,
      preferredMethods,
      initialSkills: skillRatings,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xs border border-[#E2E8F0] overflow-hidden">
        {/* Wizard Header */}
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
              {step}/5
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111827]">Career Plan Setup</h2>
              <p className="text-[11px] text-[#64748B]">
                Step {step}:{' '}
                {step === 1
                  ? 'About You'
                  : step === 2
                  ? 'Choose Your Career'
                  : step === 3
                  ? 'Skills You Have'
                  : step === 4
                  ? 'Daily Time & How You Learn'
                  : 'Your Learning Plan is Ready'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="text-xs text-[#64748B] hover:text-[#111827] transition-colors"
          >
            Skip to Dashboard
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E2E8F0] h-1 flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? 'bg-[#2563EB]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Wizard Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Profile & Current Background */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">1. Tell Us About Yourself</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Skill Bridge is for everyone. Whether you are in school, college, or working in a job, you can choose any career.
                </p>
              </div>

              <div className="space-y-5 text-xs">
                {/* 1. Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    1. What is your full name? <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* 2. Age (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">2. How old are you? (Optional)</label>
                    <span className="text-[11px] text-slate-400 font-mono">Optional</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can leave this blank. We only check age if an official government exam has an age limit.
                  </p>
                </div>

                {/* 3. What are you doing now? */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    3. What are you doing now? <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {statusOptions.map((st) => (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => setCurrentStatus(st.value)}
                        className={`p-3 rounded-lg border text-left text-xs transition-all ${
                          currentStatus === st.value
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <p className="font-bold text-slate-900">{st.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. What did you study? (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">
                      4. What did you study? (Optional)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">Optional</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setHighestQualification(undefined)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        highestQualification === undefined
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      None / Still in School
                    </button>
                    {qualificationOptions.map((q) => (
                      <button
                        key={q.value}
                        type="button"
                        onClick={() => setHighestQualification(q.value)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          highestQualification === q.value
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    You can skip this if you want. We will never ask you to take another college degree.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Career Domain, Target Role & Simple Requirements Check */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">2. Choose Your Career Goal</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You can choose ANY career you are interested in! A B.Tech graduate can choose Civil Services. A 12th student can choose Software Developer. A working person can switch careers.
                </p>
              </div>

              {/* 5. What are your interests? */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-800 text-xs">
                  5. What are your interests?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs bg-white text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(item)}
                        className="text-indigo-400 hover:text-indigo-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddInterest} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    placeholder="Type an interest (e.g. Coding, Math, Drawing, Public Policy, Robotics, Business)..."
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* 6. What is your career goal? (Pick a Career Area) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-xs">
                  6. What is your career goal? (Pick a Career Area)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {domainOptions.map((dom) => (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => {
                        setSelectedDomain(dom);
                        const first = allCareers.find((c) => c.domain === dom);
                        if (first) setSelectedCareerId(first.id);
                      }}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        selectedDomain === dom
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {dom}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Which job do you want? */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-xs">
                  7. Which job do you want?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                  {careersInDomain.map((career) => {
                    const isSelected = selectedCareerId === career.id;
                    return (
                      <div
                        key={career.id}
                        onClick={() => setSelectedCareerId(career.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-blue-600">{career.domain}</span>
                          {career.isCompetitiveExam && (
                            <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                              Official Exam
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{career.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {career.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Job Requirements Check Card in Simple English */}
              <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      Job Requirements Check (In Simple Words)
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${eligibilityCheck.statusColor}`}>
                    {eligibilityCheck.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {eligibilityCheck.note}
                </p>

                {/* 3 Simple Parts: Mandatory, Recommended, Optional */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-rose-700 block mb-1">Mandatory (By Law):</span>
                    <ul className="text-slate-600 space-y-1">
                      {eligibilityCheck.mandatory.map((m, i) => (
                        <li key={i}>· {m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-blue-700 block mb-1">Skills to Learn:</span>
                    <ul className="text-slate-600 space-y-1">
                      {eligibilityCheck.recommended.map((r, i) => (
                        <li key={i}>· {r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-indigo-700 block mb-1">Optional (Helpful):</span>
                    <ul className="text-slate-600 space-y-1">
                      {eligibilityCheck.optional.map((o, i) => (
                        <li key={i}>· {o}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: What skills do you already have? */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">8. What skills do you already have?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Rate what you know today. Be honest—this helps us build your personalized plan so you only learn what you need!
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'skill-core-logic', name: 'Thinking and Problem Solving', desc: 'Understanding problems and breaking them into small steps' },
                  { id: 'skill-ts', name: 'Coding or Technical Basics', desc: 'Writing basic code or understanding technical systems' },
                  { id: 'skill-node', name: 'Tools and Frameworks', desc: 'Using software tools, libraries, or design apps' },
                  { id: 'skill-postgres', name: 'Data, Numbers and Storage', desc: 'Working with tables, numbers, or databases' },
                ].map((s) => {
                  const currentRating = skillRatings[s.id] || 'None';
                  return (
                    <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-800">{s.name}</span>
                        <p className="text-[11px] text-slate-500">{s.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[
                          { val: 'None', label: 'None' },
                          { val: 'Beginner', label: 'Beginner' },
                          { val: 'Intermediate', label: 'Medium' },
                          { val: 'Advanced', label: 'Good' },
                        ].map((level) => (
                          <button
                            key={level.val}
                            type="button"
                            onClick={() => setSkillRatings((prev) => ({ ...prev, [s.id]: level.val as SkillProficiency }))}
                            className={`px-3 py-1.5 rounded text-[11px] font-medium transition-all ${
                              currentRating === level.val
                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Daily Learning Time & Preferred Methods */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Learning Schedule & Style</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us how much time you have and how you like to learn best.
                </p>
              </div>

              <div className="space-y-5 text-xs">
                {/* 9. How much time can you spend learning every day? */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    9. How much time can you spend learning every day? <span className="text-blue-600 font-mono font-bold">({dailyHours} Hours Every Day)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { hours: 1, label: '1 hour / day', sub: 'Great for busy working people' },
                      { hours: 2, label: '2 hours / day', sub: 'Recommended for most learners' },
                      { hours: 3.5, label: '3.5 hours / day', sub: 'Fast track learning' },
                      { hours: 5, label: '5+ hours / day', sub: 'Full-time study' },
                    ].map((opt) => (
                      <button
                        key={opt.hours}
                        type="button"
                        onClick={() => setDailyHours(opt.hours)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          dailyHours === opt.hours
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{opt.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 10. How do you like to learn? (Videos, Reading or Practice) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    10. How do you like to learn? (Videos, Reading or Practice)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {methodOptions.map((method) => {
                      const isSelected = preferredMethods.includes(method.value);
                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => toggleMethod(method.value)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-medium'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{method.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{method.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Your Learning Plan is Ready! */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Your Step-by-Step Learning Plan is Ready!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  We customized a daily, weekly, and monthly roadmap for {selectedCareerObj.title}.
                </p>
              </div>

              {/* Summary Review Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-3 max-w-lg mx-auto text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Your Target Job</span>
                  <span className="font-bold text-slate-900">{selectedCareerObj.title}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Career Area</span>
                  <span className="font-semibold text-blue-600">{selectedDomain}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">What You Are Doing Now</span>
                  <span className="font-medium text-slate-800">{currentStatus}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">What You Studied</span>
                  <span className="text-slate-800">{highestQualification || 'None / Not Specified (Optional)'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Job Requirements Check</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${eligibilityCheck.statusColor}`}>
                    {eligibilityCheck.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Daily Study Time</span>
                  <span className="font-mono font-medium text-slate-800">{dailyHours} Hours Every Day ({dailyHours * 7} hours/week)</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Launch My Learning Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
