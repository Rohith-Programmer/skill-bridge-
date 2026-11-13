import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  PageId,
  UserProfile,
  CareerPath,
  CareerDomain,
  SkillItem,
  RoadmapPhase,
  RoadmapTask,
  PortfolioProject,
  LearningResource,
  QuizResult,
  SkillProficiency,
  AICareerAnalysis,
  AIChatMessage,
  UserManualSkill,
  ParsedResumeData,
  ResumeSkillGapResult,
  PersonalizedPlanData,
} from '../types';
import {
  INITIAL_USERS,
  CAREER_PATHS,
  INITIAL_SKILLS,
  INITIAL_ROADMAP,
  PORTFOLIO_PROJECTS,
  LEARNING_RESOURCES,
} from '../data/sampleData';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  currentUser: UserProfile | null;
  targetCareer: CareerPath;
  allCareers: CareerPath[];
  skills: SkillItem[];
  roadmap: RoadmapPhase[];
  projects: PortfolioProject[];
  resources: LearningResource[];
  quizzesTaken: QuizResult[];
  isQuizModalOpen: boolean;
  selectedProjectModal: PortfolioProject | null;
  selectedCareerModal: CareerPath | null;
  notifications: NotificationItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // AI Career Guidance Engine State & Methods
  aiAnalysis: AICareerAnalysis | null;
  isAnalyzingCareer: boolean;
  aiAnalysisError: string | null;
  runCareerAIAnalysis: (careerOverride?: CareerPath) => Promise<void>;

  // Custom Career AI Search
  searchCustomCareerWithAI: (query: string) => Promise<CareerPath | null>;
  isSearchingCustomCareer: boolean;

  // AI Interactive Advisor Chat
  aiChatMessages: AIChatMessage[];
  isAdvisorTyping: boolean;
  sendAIChatMessage: (text: string) => Promise<void>;
  clearAIChat: () => void;

  // Roadmap Pacing View Mode (Daily, Weekly, Monthly)
  roadmapViewMode: 'Daily' | 'Weekly' | 'Monthly';
  setRoadmapViewMode: (mode: 'Daily' | 'Weekly' | 'Monthly') => void;

  // My Skills & Resume Analysis State & Methods
  manualSkills: import('../types').UserManualSkill[];
  addManualSkill: (skill: Omit<import('../types').UserManualSkill, 'id'>) => void;
  updateManualSkill: (id: string, skill: Partial<import('../types').UserManualSkill>) => void;
  deleteManualSkill: (id: string) => void;
  uploadedResume: import('../types').ParsedResumeData | null;
  isUploadingResume: boolean;
  resumeUploadError: string | null;
  uploadAndParseResume: (file: File) => Promise<{ success: boolean; error?: string }>;
  deleteUploadedResume: () => void;
  updateExtractedResumeData: (data: import('../types').ParsedResumeData) => void;
  combinedSkillsMode: 'both' | 'manual_only' | 'resume_only';
  setCombinedSkillsMode: (mode: 'both' | 'manual_only' | 'resume_only') => void;
  skillsResumeAnalysis: {
    gapResult: import('../types').ResumeSkillGapResult;
    learningPlan: import('../types').PersonalizedPlanData;
  } | null;
  isAnalyzingSkillsResume: boolean;
  skillsResumeAnalysisError: string | null;
  runSkillsResumeAnalysis: () => Promise<void>;
  applyPlanToRoadmap: (plan: import('../types').PersonalizedPlanData) => void;

  // Actions
  selectTargetCareer: (careerId: string) => void;
  toggleTaskCompletion: (phaseId: string, taskId: string) => void;
  updateSkillLevel: (skillId: string, level: SkillProficiency) => void;
  toggleSkillInRoadmap: (skillId: string) => void;
  toggleProjectStatus: (projectId: string, status: 'Not Started' | 'In Progress' | 'Completed') => void;
  toggleProjectBookmark: (projectId: string) => void;
  toggleResourceBookmark: (resourceId: string) => void;
  toggleResourceCompleted: (resourceId: string) => void;
  recordQuizResult: (result: QuizResult) => void;
  openQuizModal: () => void;
  closeQuizModal: () => void;
  setSelectedProjectModal: (proj: PortfolioProject | null) => void;
  setSelectedCareerModal: (career: CareerPath | null) => void;
  loginAsUser: (userId: string) => void;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (info: Partial<UserProfile>) => void;
  logout: () => void;
  completeOnboarding: (data: Partial<UserProfile> & { initialSkills?: Record<string, SkillProficiency> }) => void;
  dismissNotification: (id: string) => void;
  addNotification: (title: string, message: string) => void;

  // Computed statistics
  stats: {
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
    skillsMasteredCount: number;
    totalSkillsCount: number;
    readinessScore: number;
    hoursThisWeek: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]);
  const [targetCareerId, setTargetCareerId] = useState<string>('career-fullstack');
  const [allCareersList, setAllCareersList] = useState<CareerPath[]>(CAREER_PATHS);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(INITIAL_ROADMAP);
  const [projects, setProjects] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS);
  const [resources, setResources] = useState<LearningResource[]>(LEARNING_RESOURCES);
  const [roadmapViewMode, setRoadmapViewMode] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  const [quizzesTaken, setQuizzesTaken] = useState<QuizResult[]>([
    { date: 'Yesterday', title: 'Full Stack Architecture & TypeScript', score: 4, total: 5, passed: true },
    { date: '3 days ago', title: 'Relational Database Indexing & SQL', score: 5, total: 5, passed: true },
  ]);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState<PortfolioProject | null>(null);
  const [selectedCareerModal, setSelectedCareerModal] = useState<CareerPath | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Guidance States
  const [aiAnalysis, setAiAnalysis] = useState<AICareerAnalysis | null>(null);
  const [isAnalyzingCareer, setIsAnalyzingCareer] = useState(false);
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null);
  const [isSearchingCustomCareer, setIsSearchingCustomCareer] = useState(false);

  // AI Chat Advisor
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: 'Hello! I am your Skill Bridge AI Career Advisor. I analyze real-world hiring criteria, competitive exam notifications, eligibility standards, and skill gaps to build your personalized roadmap. What career goal or transition are you exploring today?',
      timestamp: 'Just now',
    },
  ]);
  const [isAdvisorTyping, setIsAdvisorTyping] = useState(false);

  // My Skills & Resume Analysis State
  const [manualSkills, setManualSkills] = useState<UserManualSkill[]>([
    { id: 'ms-1', name: 'JavaScript & Web Fundamentals', level: 'Intermediate', category: 'Technical' },
    { id: 'ms-2', name: 'React & Component UI', level: 'Beginner', category: 'Technical' },
    { id: 'ms-3', name: 'Git & Version Control', level: 'Intermediate', category: 'Technical' },
    { id: 'ms-4', name: 'SQL & Database Basics', level: 'Beginner', category: 'Technical' },
    { id: 'ms-5', name: 'Problem Solving & Logic', level: 'Intermediate', category: 'Non-Technical' },
    { id: 'ms-6', name: 'Team Communication', level: 'Intermediate', category: 'Non-Technical' },
  ]);
  const [uploadedResume, setUploadedResume] = useState<ParsedResumeData | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const [combinedSkillsMode, setCombinedSkillsMode] = useState<'both' | 'manual_only' | 'resume_only'>('both');
  const [skillsResumeAnalysis, setSkillsResumeAnalysis] = useState<{
    gapResult: ResumeSkillGapResult;
    learningPlan: PersonalizedPlanData;
  } | null>(null);
  const [isAnalyzingSkillsResume, setIsAnalyzingSkillsResume] = useState(false);
  const [skillsResumeAnalysisError, setSkillsResumeAnalysisError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Roadmap Milestone Active',
      message: 'You have 3 tasks left in Phase 2: Applied Competencies & Systems.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'AI Analysis Ready',
      message: 'Gemini AI has calibrated your skill gaps against verified industry standards.',
      timestamp: '1 day ago',
      read: false,
    },
  ]);

  const targetCareer = useMemo(() => {
    return allCareersList.find((c) => c.id === targetCareerId) || allCareersList[0];
  }, [allCareersList, targetCareerId]);

  const addNotification = (title: string, message: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const selectTargetCareer = (careerId: string) => {
    setTargetCareerId(careerId);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        targetCareerId: careerId,
      });
    }
    const career = allCareersList.find((c) => c.id === careerId);
    if (career) {
      addNotification('Target Career Updated', `Your roadmap is now calibrated for ${career.title}.`);
      // Trigger AI Analysis in background
      runCareerAIAnalysis(career);
    }
  };

  // Run AI Career Analysis using server-side Gemini API
  const runCareerAIAnalysis = async (careerOverride?: CareerPath) => {
    const career = careerOverride || targetCareer;
    setIsAnalyzingCareer(true);
    setAiAnalysisError(null);

    try {
      const response = await fetch('/api/gemini/analyze-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerTitle: career.title,
          domain: career.domain,
          currentStatus: currentUser?.currentStatus,
          highestQualificationCompleted: currentUser?.highestQualificationCompleted,
          age: currentUser?.age,
          existingSkills: currentUser?.existingSkills || skills.filter((s) => s.currentLevel !== 'None').map((s) => s.name),
          availableHours: `${currentUser?.dailyHoursGoal || 2} hours/day`,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAiAnalysis(json.data);
      } else {
        throw new Error(json.error || 'Failed to analyze career');
      }
    } catch (err: any) {
      console.warn('AI analysis request error:', err.message);
      setAiAnalysisError(err.message);
    } finally {
      setIsAnalyzingCareer(false);
    }
  };

  // Search and generate any custom career using Gemini AI
  const searchCustomCareerWithAI = async (query: string): Promise<CareerPath | null> => {
    setIsSearchingCustomCareer(true);
    try {
      const response = await fetch('/api/gemini/custom-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const customPath: CareerPath = json.data;
        // Add to all careers list
        setAllCareersList((prev) => [customPath, ...prev.filter((c) => c.id !== customPath.id)]);
        addNotification('Custom Career Discovered with AI', `Created full track for ${customPath.title}.`);
        return customPath;
      }
      return null;
    } catch (err) {
      console.error('Custom career search error:', err);
      return null;
    } finally {
      setIsSearchingCustomCareer(false);
    }
  };

  // Send message to AI Advisor
  const sendAIChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiChatMessages((prev) => [...prev, userMsg]);
    setIsAdvisorTyping(true);

    try {
      const response = await fetch('/api/gemini/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: aiChatMessages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          userProfile: {
            educationLevel: currentUser?.educationLevel,
            currentStatus: currentUser?.currentStatus,
            dailyHours: `${currentUser?.dailyHoursGoal || 2} hours/day`,
          },
          targetCareer,
        }),
      });

      const json = await response.json();
      const reply = json.reply || "I've reviewed your request. Focus on mastering the daily milestones in your roadmap to maintain peak momentum.";

      const modelMsg: AIChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAiChatMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: AIChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: `Based on your goal for **${targetCareer.title}**, prioritize dedicating your available **${currentUser?.dailyHoursGoal || 2} hours daily** to the active milestones. Would you like a breakdown of the core competencies?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAdvisorTyping(false);
    }
  };

  const clearAIChat = () => {
    setAiChatMessages([
      {
        id: 'msg-reset',
        role: 'model',
        text: `Chat history reset. How can I assist you with your roadmap for ${targetCareer.title}?`,
        timestamp: 'Just now',
      },
    ]);
  };

  const toggleTaskCompletion = (phaseId: string, taskId: string) => {
    setRoadmap((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;

        const updatedModules = phase.modules.map((mod) => ({
          ...mod,
          tasks: mod.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        }));

        const allTasks = updatedModules.flatMap((m) => m.tasks);
        const allCompleted = allTasks.every((t) => t.completed);
        const anyCompleted = allTasks.some((t) => t.completed);

        const newStatus = allCompleted
          ? 'Completed'
          : anyCompleted
          ? 'In Progress'
          : phase.status === 'Completed'
          ? 'In Progress'
          : phase.status;

        return {
          ...phase,
          status: newStatus as 'Completed' | 'In Progress' | 'Upcoming',
          modules: updatedModules,
        };
      })
    );
  };

  const updateSkillLevel = (skillId: string, level: SkillProficiency) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, currentLevel: level } : s))
    );
    addNotification('Skill Proficiency Updated', 'Your readiness metrics have been recalculated.');
  };

  const toggleSkillInRoadmap = (skillId: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id !== skillId) return s;
        const newState = !s.inRoadmap;
        addNotification(
          newState ? 'Added to Learning Roadmap' : 'Removed from Roadmap',
          `${s.name} has been ${newState ? 'queued in your roadmap' : 'removed'}.`
        );
        return { ...s, inRoadmap: newState };
      })
    );
  };

  const toggleProjectStatus = (
    projectId: string,
    status: 'Not Started' | 'In Progress' | 'Completed'
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status } : p))
    );
    addNotification('Project Status Updated', `Project status changed to ${status}.`);
  };

  const toggleProjectBookmark = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  const toggleResourceBookmark = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  const toggleResourceCompleted = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const recordQuizResult = (result: QuizResult) => {
    setQuizzesTaken((prev) => [result, ...prev]);
    addNotification(
      result.passed ? 'Assessment Passed!' : 'Assessment Logged',
      `You scored ${result.score}/${result.total} on ${result.title}.`
    );
  };

  const openQuizModal = () => setIsQuizModalOpen(true);
  const closeQuizModal = () => setIsQuizModalOpen(false);

  const loginAsUser = (userId: string) => {
    const user = INITIAL_USERS.find((s) => s.id === userId);
    if (user) {
      setCurrentUser(user);
      setTargetCareerId(user.targetCareerId);
      setActivePage('dashboard');
      addNotification('Welcome Back!', `Signed in as ${user.fullName}.`);
      runCareerAIAnalysis();
    }
  };

  const loginWithEmail = async (email: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const existing = INITIAL_USERS.find((u) => u.email.toLowerCase() === trimmed);
    if (existing) {
      setCurrentUser(existing);
      setTargetCareerId(existing.targetCareerId);
      setActivePage('dashboard');
      addNotification('Welcome Back!', `Signed in as ${existing.fullName}.`);
      runCareerAIAnalysis();
      return { success: true };
    }
    const namePart = email.split('@')[0] || 'User';
    const inferredName = namePart.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Student Learner';
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: inferredName,
      email: trimmed,
      currentStatus: 'College Student',
      interests: ['Software Development', 'Skill Growth'],
      existingSkills: ['Problem Solving', 'Computer Basics'],
      careerDomain: 'Software and IT',
      targetCareerId: 'career-fullstack',
      dailyHoursGoal: 2,
      weeklyHourGoal: 14,
      preferredMethods: ['Video Masterclasses', 'Hands-on Projects & Portfolios'],
      streakDays: 1,
      isOnboarded: false,
    };
    setCurrentUser(newUser);
    setActivePage('dashboard');
    addNotification('Welcome to Skill Bridge!', `Logged in as ${inferredName}.`);
    runCareerAIAnalysis();
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    const googleUser = INITIAL_USERS[0];
    setCurrentUser(googleUser);
    setTargetCareerId(googleUser.targetCareerId);
    setActivePage('dashboard');
    addNotification('Google Sign-In Successful', `Welcome back, ${googleUser.fullName}!`);
    runCareerAIAnalysis();
    return { success: true };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    if (!email.trim()) {
      return { success: false, message: 'Please enter your email address to receive reset instructions.' };
    }
    addNotification('Password Reset Sent', `Reset instructions sent to ${email.trim()}. Check your inbox.`);
    return { success: true, message: `Password reset link sent to ${email.trim()}.` };
  };

  const registerUser = (info: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: info.fullName || 'New Learner',
      email: info.email || 'learner@skillbridge.io',
      age: info.age,
      currentStatus: info.currentStatus || 'Career Switcher',
      highestQualificationCompleted: info.highestQualificationCompleted,
      interests: info.interests || ['Technology', 'Professional Development'],
      existingSkills: info.existingSkills || ['Analytical Thinking', 'Problem Solving'],
      careerDomain: info.careerDomain || 'Software and IT',
      targetCareerId: targetCareerId,
      dailyHoursGoal: 2,
      weeklyHourGoal: 14,
      preferredMethods: ['Hands-on Projects & Portfolios', 'Interactive Coding & Labs'],
      streakDays: 1,
      isOnboarded: false,
    };
    setCurrentUser(newUser);
    setActivePage('onboarding');
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('landing');
  };

  const completeOnboarding = (data: Partial<UserProfile> & { initialSkills?: Record<string, SkillProficiency> }) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        fullName: data.fullName || currentUser.fullName,
        age: data.age !== undefined ? data.age : currentUser.age,
        currentStatus: data.currentStatus || currentUser.currentStatus,
        highestQualificationCompleted: data.highestQualificationCompleted !== undefined ? data.highestQualificationCompleted : currentUser.highestQualificationCompleted,
        interests: data.interests || currentUser.interests,
        existingSkills: data.existingSkills || currentUser.existingSkills,
        careerDomain: data.careerDomain || currentUser.careerDomain,
        targetCareerId: data.targetCareerId || currentUser.targetCareerId,
        dailyHoursGoal: data.dailyHoursGoal || 2,
        weeklyHourGoal: (data.dailyHoursGoal || 2) * 7,
        preferredMethods: data.preferredMethods || currentUser.preferredMethods,
        isOnboarded: true,
      });
    }

    if (data.targetCareerId) {
      setTargetCareerId(data.targetCareerId);
    }

    if (data.initialSkills) {
      setSkills((prev) =>
        prev.map((s) => {
          if (data.initialSkills && data.initialSkills[s.id]) {
            return { ...s, currentLevel: data.initialSkills[s.id] };
          }
          return s;
        })
      );
    }

    setActivePage('dashboard');
    addNotification('Onboarding Complete', 'Your personalized career roadmap and skill gap benchmarks have been synthesized!');
    runCareerAIAnalysis();
  };

  // My Skills & Resume Analysis Actions
  const addManualSkill = (skill: Omit<UserManualSkill, 'id'>) => {
    const newSkill: UserManualSkill = {
      ...skill,
      id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setManualSkills((prev) => [newSkill, ...prev]);
    addNotification('Skill Added', `Added ${newSkill.name} (${newSkill.level}) to your skills.`);
  };

  const updateManualSkill = (id: string, skill: Partial<UserManualSkill>) => {
    setManualSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...skill } : s))
    );
    addNotification('Skill Updated', 'Your skill level was updated.');
  };

  const deleteManualSkill = (id: string) => {
    const target = manualSkills.find((s) => s.id === id);
    setManualSkills((prev) => prev.filter((s) => s.id !== id));
    if (target) {
      addNotification('Skill Removed', `Removed ${target.name} from your profile.`);
    }
  };

  const uploadAndParseResume = async (file: File): Promise<{ success: boolean; error?: string }> => {
    setIsUploadingResume(true);
    setResumeUploadError(null);
    try {
      const allowedExts = ['.pdf', '.docx', '.doc', '.txt'];
      const fileExt = '.' + (file.name.split('.').pop() || '').toLowerCase();
      if (!allowedExts.includes(fileExt) && !file.type.includes('pdf') && !file.type.includes('word')) {
        throw new Error('Please upload a PDF (.pdf) or Word document (.docx).');
      }

      // Convert file to Base64
      const base64Data: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Content = result.includes(',') ? result.split(',')[1] : result;
          resolve(base64Content);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/resume/parse-and-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64Data,
          fileName: file.name,
          fileType: file.type || 'application/pdf',
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setUploadedResume(result.data);
        addNotification(
          'Resume Extracted',
          `Parsed skills, education, and experience from ${file.name}. Review extracted items below.`
        );
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to extract resume details.');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Could not parse resume file.';
      setResumeUploadError(errorMsg);
      addNotification('Resume Upload Issue', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsUploadingResume(false);
    }
  };

  const deleteUploadedResume = () => {
    setUploadedResume(null);
    setResumeUploadError(null);
    addNotification('Resume Removed', 'Uploaded resume data was securely removed from your profile.');
  };

  const updateExtractedResumeData = (data: ParsedResumeData) => {
    setUploadedResume(data);
    addNotification('Resume Details Saved', 'Your confirmed resume extraction is updated.');
  };

  const runSkillsResumeAnalysis = async () => {
    setIsAnalyzingSkillsResume(true);
    setSkillsResumeAnalysisError(null);

    try {
      // Build normalized combined skills
      const combinedSkillsMap = new Map<string, { name: string; level: string; category: string; source: string }>();

      if (combinedSkillsMode === 'both' || combinedSkillsMode === 'manual_only') {
        manualSkills.forEach((s) => {
          combinedSkillsMap.set(s.name.trim().toLowerCase(), {
            name: s.name.trim(),
            level: s.level,
            category: s.category,
            source: 'Manual Entry (User Confirmed)',
          });
        });
      }

      if (uploadedResume && (combinedSkillsMode === 'both' || combinedSkillsMode === 'resume_only')) {
        const resumeSkills = [
          ...(uploadedResume.technicalSkills || []),
          ...(uploadedResume.nonTechnicalSkills || []),
        ];

        resumeSkills.forEach((s) => {
          const key = s.name.trim().toLowerCase();
          // Priority to manual skill if already set!
          if (!combinedSkillsMap.has(key)) {
            combinedSkillsMap.set(key, {
              name: s.name.trim(),
              level: s.level || 'Beginner',
              category: s.category || 'Technical',
              source: 'Extracted from Resume',
            });
          }
        });
      }

      const activeSkillsList = Array.from(combinedSkillsMap.values());

      const response = await fetch('/api/skills/analyze-and-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCareer,
          userSkills: activeSkillsList,
          combinedMode: combinedSkillsMode,
          dailyHours: currentUser?.dailyHoursGoal || 2,
          userStatus: currentUser?.currentStatus || 'College Student',
          highestQualification: currentUser?.highestQualificationCompleted || 'Not specified',
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setSkillsResumeAnalysis(resJson.data);
        addNotification(
          'Skill Gap & Plan Ready',
          `AI analyzed your profile against ${targetCareer.title}. 3-tier gaps and personalized schedule generated!`
        );
      } else {
        throw new Error(resJson.error || 'Failed to analyze skills.');
      }
    } catch (err: any) {
      console.warn('Skills & resume analysis error:', err.message);
      setSkillsResumeAnalysisError(err.message || 'Analysis failed. Please check your network.');
    } finally {
      setIsAnalyzingSkillsResume(false);
    }
  };

  const applyPlanToRoadmap = (plan: PersonalizedPlanData) => {
    const tailoredTasks: RoadmapTask[] = plan.dailyTasks.map((t, idx) => ({
      id: `tailored-task-${Date.now()}-${idx}`,
      title: `${t.day}: ${t.task}`,
      completed: false,
      estimatedHours: Math.max(1, Math.round(t.estimatedMinutes / 60)),
      resourceType: 'Exercise',
      cadence: 'Daily',
    }));

    const tailoredModules = [
      {
        id: `mod-focus-${Date.now()}`,
        title: 'Priority Skills Sprint',
        description: plan.skillsToLearnFirst.map((s) => `${s.skill} (~${s.estimatedDays} days)`).join(' · '),
        tasks: tailoredTasks,
      },
      ...plan.topicsToStudy.map((topic, i) => ({
        id: `mod-topic-${Date.now()}-${i}`,
        title: topic.topic,
        description: `Targeting ${topic.relatedSkill}. Key areas: ${topic.subtopics.join(', ')}`,
        tasks: [
          {
            id: `task-sub-${Date.now()}-${i}`,
            title: `Study & build practice exercises for ${topic.topic}`,
            completed: false,
            estimatedHours: 2,
            resourceType: 'Tutorial' as const,
            cadence: 'Weekly' as const,
          },
        ],
      })),
    ];

    const customizedPhase: RoadmapPhase = {
      id: `phase-personalized-${Date.now()}`,
      phaseNumber: 1,
      title: `Accelerated Plan for ${targetCareer.title} (Skills & Resume Calibrated)`,
      description: `Targeted daily & weekly learning milestones aligned with your confirmed skills and ${currentUser?.dailyHoursGoal || 2}h/day commitment.`,
      targetDurationWeeks: 4,
      status: 'In Progress',
      modules: tailoredModules,
    };

    setRoadmap((prev) => [customizedPhase, ...prev.map((p, idx) => ({ ...p, phaseNumber: idx + 2, status: 'Upcoming' as const }))]);

    if (plan.recommendedProjects && plan.recommendedProjects.length > 0) {
      const newPortfolioProjects: PortfolioProject[] = plan.recommendedProjects.map((p, idx) => ({
        id: `custom-proj-${Date.now()}-${idx}`,
        title: p.title,
        careerPathId: targetCareer.id,
        difficulty: (p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced') || 'Intermediate',
        techStack: plan.skillsToLearnFirst.map((s) => s.skill),
        timeEstimate: '2-3 Weeks',
        brief: p.brief,
        keyDeliverables: p.deliverables || ['Working prototype', 'Clean code repository'],
        architectureOverview: `Designed to prove competency in ${targetCareer.title}.`,
        status: 'In Progress',
        isBookmarked: true,
      }));

      setProjects((prev) => [...newPortfolioProjects, ...prev]);
    }

    addNotification(
      'Roadmap Updated with Personalized Plan',
      'Applied daily tasks, weekly targets, and recommended projects directly to your Learning Plan!'
    );
    setActivePage('roadmap');
  };

  // Compute live stats
  const stats = useMemo(() => {
    const allTasks = roadmap.flatMap((p) => p.modules.flatMap((m) => m.tasks));
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.completed).length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const proficiencyScoreMap: Record<SkillProficiency, number> = {
      None: 0,
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
      Mastery: 4,
    };

    let totalPointsRequired = 0;
    let studentPoints = 0;
    let skillsMasteredCount = 0;

    skills.forEach((s) => {
      const cur = proficiencyScoreMap[s.currentLevel];
      const req = proficiencyScoreMap[s.requiredLevel];
      totalPointsRequired += req;
      studentPoints += Math.min(cur, req);
      if (cur >= req) {
        skillsMasteredCount += 1;
      }
    });

    const readinessScore =
      totalPointsRequired > 0 ? Math.min(100, Math.round((studentPoints / totalPointsRequired) * 100)) : 68;

    return {
      totalTasks,
      completedTasks,
      completionPercentage,
      skillsMasteredCount,
      totalSkillsCount: skills.length,
      readinessScore,
      hoursThisWeek: 11.5,
    };
  }, [roadmap, skills]);

  // Initial AI analysis trigger on mount
  useEffect(() => {
    runCareerAIAnalysis();
  }, []);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        currentUser,
        targetCareer,
        allCareers: allCareersList,
        skills,
        roadmap,
        projects,
        resources,
        quizzesTaken,
        isQuizModalOpen,
        selectedProjectModal,
        selectedCareerModal,
        notifications,
        searchQuery,
        setSearchQuery,
        aiAnalysis,
        isAnalyzingCareer,
        aiAnalysisError,
        runCareerAIAnalysis,
        searchCustomCareerWithAI,
        isSearchingCustomCareer,
        aiChatMessages,
        isAdvisorTyping,
        sendAIChatMessage,
        clearAIChat,
        roadmapViewMode,
        setRoadmapViewMode,
        manualSkills,
        addManualSkill,
        updateManualSkill,
        deleteManualSkill,
        uploadedResume,
        isUploadingResume,
        resumeUploadError,
        uploadAndParseResume,
        deleteUploadedResume,
        updateExtractedResumeData,
        combinedSkillsMode,
        setCombinedSkillsMode,
        skillsResumeAnalysis,
        isAnalyzingSkillsResume,
        skillsResumeAnalysisError,
        runSkillsResumeAnalysis,
        applyPlanToRoadmap,
        selectTargetCareer,
        toggleTaskCompletion,
        updateSkillLevel,
        toggleSkillInRoadmap,
        toggleProjectStatus,
        toggleProjectBookmark,
        toggleResourceBookmark,
        toggleResourceCompleted,
        recordQuizResult,
        openQuizModal,
        closeQuizModal,
        setSelectedProjectModal,
        setSelectedCareerModal,
        loginAsUser,
        loginWithEmail,
        loginWithGoogle,
        resetPassword,
        registerUser,
        logout,
        completeOnboarding,
        dismissNotification,
        addNotification,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
