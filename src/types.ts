export type PageId =
  | 'landing'
  | 'auth'
  | 'onboarding'
  | 'dashboard'
  | 'career-exploration'
  | 'skill-gap'
  | 'roadmap'
  | 'progress'
  | 'projects'
  | 'ai-advisor'
  | 'skills-resume';

export type CareerDomain =
  | 'Software and IT'
  | 'Hardware and Electronics'
  | 'Government Jobs and Civil Services'
  | 'Banking and Finance'
  | 'Healthcare and Medical'
  | 'Business and Management'
  | 'Mechanical and Core Engineering'
  | 'Civil Engineering'
  | 'Creative Arts and Design'
  | 'Teaching and Education'
  | 'Research and Science'
  | 'Entrepreneurship'
  | 'Other Careers & Specialized Trades';

export type ProfessionalStatus =
  | 'School Student'
  | 'College Student'
  | 'Graduate'
  | 'Working Professional'
  | 'Job Seeker'
  | 'Career Switcher'
  | 'Other';

export type QualificationCompleted =
  | '10th'
  | '12th'
  | 'Diploma'
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'PhD'
  | 'Other';

export type LearningMethod =
  | 'Hands-on Projects & Portfolios'
  | 'Interactive Coding & Labs'
  | 'Video Masterclasses'
  | 'Official Documentation & Handbooks'
  | 'Mock Exams & Speed Tests'
  | 'Mentorship & Peer Review';

export type SkillProficiency = 'None' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';

export interface FormalEligibilityCriteria {
  hasFormalRequirements: boolean;
  isMandatoryDegreeRequired: boolean;
  minimumDegreeRequired?: string;
  minimumAge?: number;
  maximumAge?: number;
  mandatoryQualifications: string[];
  recommendedSkills: string[];
  optionalCertifications: string[];
  authorityName?: string;
  officialSourceNote?: string;
}

export interface EligibilityEvaluationResult {
  status: 'Officially Eligible' | 'Prerequisite In Progress' | 'Details Needed' | 'Skills-First / No Formal Degree Required';
  summary: string;
  missingDetails?: string[];
  mandatoryBreakdown: string[];
  recommendedBreakdown: string[];
  optionalBreakdown: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Core Technologies' | 'Architecture & Systems' | 'Tools & Workflows' | 'Soft & Professional' | 'Competitive Exam Topics';
  currentLevel: SkillProficiency;
  requiredLevel: SkillProficiency;
  inRoadmap: boolean;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number;
  resourceType: 'Project' | 'Exercise' | 'Reading' | 'Tutorial' | 'Mock Test';
  resourceLink?: string;
  cadence?: 'Daily' | 'Weekly' | 'Monthly';
}

export interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  tasks: RoadmapTask[];
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  targetDurationWeeks: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  modules: RoadmapModule[];
}

export interface CompetitiveExamStage {
  stageName: string;
  format: string;
  keySubjects: string[];
}

export interface CompetitiveExamInfo {
  hasExam: boolean;
  examName?: string;
  conductingBody?: string;
  officialEligibility?: string;
  examStages?: CompetitiveExamStage[];
  officialSourceNote?: string;
}

export interface TechnicalCoreFocus {
  softwareSpecific?: string | null;
  hardwareSpecific?: string | null;
  generalStrategicFocus?: string;
}

export interface CareerPath {
  id: string;
  title: string;
  domain: CareerDomain;
  description: string;
  demandLevel: 'Very High' | 'High' | 'Steady';
  avgSalaryRange: string;
  entrySalary: string;
  growthRate: string;
  openJuniorJobs: number;
  keySkills: string[];
  prerequisites: string[];
  overview: string;
  topCompaniesHiring: string[];
  recommendedPhases: number;
  isCompetitiveExam?: boolean;
  competitiveExamDetails?: CompetitiveExamInfo;
  technicalOrCoreFocus?: TechnicalCoreFocus;
  formalEligibility?: FormalEligibilityCriteria;
}

export interface PortfolioProject {
  id: string;
  title: string;
  careerPathId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  timeEstimate: string;
  brief: string;
  keyDeliverables: string[];
  architectureOverview: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  isBookmarked: boolean;
  githubTemplateUrl?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  category: string;
  type: 'Interactive Guide' | 'Official Docs' | 'Video Course' | 'Handbook' | 'Cheat Sheet' | 'Official Syllabus';
  duration: string;
  provider: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  isBookmarked: boolean;
  isCompleted: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skillCategory: string;
}

export interface QuizResult {
  date: string;
  title: string;
  score: number;
  total: number;
  passed: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  age?: number | string; // Optional age
  currentStatus: ProfessionalStatus;
  highestQualificationCompleted?: QualificationCompleted; // Optional completed qualification
  interests: string[];
  existingSkills: string[];
  careerDomain: CareerDomain;
  targetCareerId: string;
  dailyHoursGoal: number;
  weeklyHourGoal: number;
  preferredMethods: LearningMethod[];
  streakDays: number;
  isOnboarded: boolean;
  // Skills & Resume features
  manualSkills?: UserManualSkill[];
  uploadedResume?: ParsedResumeData | null;
  savedSkillAnalysis?: {
    gapResult: ResumeSkillGapResult;
    learningPlan: PersonalizedPlanData;
    analyzedAt: string;
    combinedMode: 'manual_only' | 'resume_only' | 'both';
  } | null;
  // Backward compatibility aliases
  educationLevel?: string;
  university?: string;
  major?: string;
  graduationYear?: string;
  ageGroup?: string;
}

export type StudentProfile = UserProfile;

export interface AICareerAnalysis {
  careerTitle: string;
  domain: string;
  eligibilitySummary: string;
  eligibilityEvaluation?: EligibilityEvaluationResult;
  isGovernmentOrCompetitive: boolean;
  competitiveExamDetails?: CompetitiveExamInfo;
  technicalOrCoreFocus?: TechnicalCoreFocus;
  verifiedRequiredSkills: { name: string; category: string; importance: string; description: string }[];
  personalizedSkillGaps: { skill: string; gapStatus: string; recommendation: string }[];
  dailyWeeklyMonthlyStrategy: {
    dailyPlan: string;
    weeklyCadence: string;
    monthlyPhases: { month: number; focus: string; deliverable: string }[];
  };
  recommendedProjectsOrExercises: { title: string; difficulty: string; brief: string; deliverable: string }[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface UserManualSkill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Technical' | 'Non-Technical';
}

export interface ExtractedResumeSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Technical' | 'Non-Technical';
  context?: string;
}

export interface ExtractedEducation {
  degree: string;
  institution: string;
  year?: string;
  fieldOfStudy?: string;
}

export interface ExtractedExperience {
  role: string;
  organization: string;
  duration?: string;
  highlights?: string[];
}

export interface ExtractedProject {
  title: string;
  techUsed?: string[];
  description?: string;
}

export interface ExtractedCertification {
  title: string;
  issuer?: string;
  date?: string;
}

export interface ParsedResumeData {
  technicalSkills: ExtractedResumeSkill[];
  nonTechnicalSkills: ExtractedResumeSkill[];
  education: ExtractedEducation[];
  experience: ExtractedExperience[];
  projects: ExtractedProject[];
  certifications: ExtractedCertification[];
  achievements: string[];
  summary: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
}

export interface SkillGapItem {
  name: string;
  currentLevel?: string;
  requiredLevel: string;
  whyImportant: string;
  verificationMethod: 'Practice Quiz' | 'Self-Assessment' | 'Project Proof';
  category: 'Technical' | 'Non-Technical';
}

export interface ResumeSkillGapResult {
  skillsAlreadyHave: SkillGapItem[];
  skillsNeedToImprove: SkillGapItem[];
  skillsNeedToLearn: SkillGapItem[];
  summary: string;
}

export interface PersonalizedPlanData {
  skillsToLearnFirst: { skill: string; reason: string; estimatedDays: number }[];
  topicsToStudy: { topic: string; relatedSkill: string; subtopics: string[] }[];
  recommendedResources: { title: string; type: string; provider: string; url?: string; description: string }[];
  practicalExercises: { title: string; skill: string; exerciseBrief: string }[];
  recommendedProjects: { title: string; difficulty: string; brief: string; deliverables: string[] }[];
  dailyTasks: { day: string; task: string; estimatedMinutes: number; skill: string }[];
  weeklyTargets: { weekNumber: number; title: string; milestones: string[] }[];
  monthlyTargets: { monthNumber: number; focus: string; outcomes: string[] }[];
}
