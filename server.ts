import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper for Gemini generateContent with fallback
async function generateAIResponse(prompt: string, systemInstruction?: string) {
  if (!ai || !apiKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || 'You are an authoritative career counselor, statutory eligibility validator, and technical architect for Skill Bridge. Provide structured, accurate, practical advice. Never recommend additional degrees unless they are statutory prerequisites. Clearly separate mandatory qualifications from recommended skills and optional certifications.',
      responseMimeType: 'application/json',
    },
  });

  return response.text;
}

// 1. Analyze Career & Skill Gaps with Rigorous Statutory Eligibility Validation
app.post('/api/gemini/analyze-career', async (req, res) => {
  try {
    const { 
      careerTitle, 
      domain, 
      currentStatus, 
      highestQualificationCompleted, 
      age, 
      existingSkills, 
      availableHours 
    } = req.body;

    const prompt = `
Analyze the career goal "${careerTitle}" (Domain: ${domain}) for a user with the following profile:
- What they are doing now: ${currentStatus || 'Not specified'}
- What they studied: ${highestQualificationCompleted || 'Not provided / Optional'}
- Age: ${age || 'Not provided / Optional'}
- Skills they already have: ${Array.isArray(existingSkills) ? existingSkills.join(', ') : existingSkills || 'None listed'}
- Available study time every day: ${availableHours || '2 hours/day'}

CRITICAL RULES (USE SIMPLE, EASY-TO-UNDERSTAND ENGLISH):
1. Write everything in simple, clear, and friendly English. Avoid complex words or hard jargon.
2. Users can choose ANY career they want, no matter what they studied.
3. A B.Tech graduate can choose Civil Services or Banking.
4. A 12th-class student can choose Software Developer or Hardware Engineer.
5. A working person can switch to a new career.
6. Do NOT tell users to get another college degree unless the government or law strictly requires it (like UPSC Civil Services, Banking Officer, or Doctor). For software, hardware, design, product, and business, real skills and projects are what matter!
7. If the role is a government or bank exam that requires a degree, and the user is in school or college, tell them nicely: "You need a degree to write the final exam, but you can start learning the basics and syllabus right now!"
8. If age or degree information is missing for an exam that needs it, ask only for what is needed.
9. Divide requirements into three simple parts:
   - "mandatoryBreakdown": What the law strictly requires (or "None - You do not need any college degree").
   - "recommendedBreakdown": The main skills you need to learn.
   - "optionalBreakdown": Helpful certificates and extra practice.

Return a strictly valid JSON object with:
{
  "careerTitle": "${careerTitle}",
  "domain": "${domain}",
  "eligibilitySummary": "1-2 short sentences in simple English explaining what you need for this job",
  "isGovernmentOrCompetitive": ${domain.includes('Government') || domain.includes('Civil Services') || domain.includes('Banking')},
  "eligibilityEvaluation": {
    "status": "Officially Eligible / Prerequisite In Progress / Details Needed / Skills-First / No Formal Degree Required",
    "summary": "Simple, encouraging explanation of how the user can reach this goal",
    "missingDetails": ["List missing detail if needed for official exam, e.g. 'Age' or 'Graduation Status', else empty array"],
    "mandatoryBreakdown": ["Simple bullet points of mandatory rules or 'None - No college degree required'"],
    "recommendedBreakdown": ["Simple bullet points of main skills to learn"],
    "optionalBreakdown": ["Simple bullet points of optional certificates or practice tests"]
  },
  "competitiveExamDetails": {
    "hasExam": true/false,
    "examName": "e.g. UPSC Civil Services / RBI Grade B / SSC CGL",
    "conductingBody": "Name of official board",
    "officialEligibility": "In simple words: Any graduation degree (B.Tech, B.Com, B.Sc, B.A). Age 21 to 32.",
    "examStages": [
      { "stageName": "Stage 1: Preliminary Exam", "format": "Multiple choice questions", "keySubjects": ["General Studies", "Aptitude"] },
      { "stageName": "Stage 2: Main Exam", "format": "Written papers and essays", "keySubjects": ["Essay", "Core Subjects"] },
      { "stageName": "Stage 3: Interview", "format": "Face-to-face interview", "keySubjects": ["Personality and knowledge"] }
    ],
    "officialSourceNote": "Official government exam rules"
  },
  "technicalOrCoreFocus": {
    "softwareSpecific": "Languages, coding practice, projects, and interview preparation (if software, else null)",
    "hardwareSpecific": "Electronics, circuits, microcontrollers, and hands-on projects (if hardware, else null)",
    "generalStrategicFocus": "Key practical skills needed for this job"
  },
  "verifiedRequiredSkills": [
    { "name": "Skill Name", "category": "Core / Tools / Soft Skills", "importance": "Crucial", "description": "Why you need this in simple words" }
  ],
  "personalizedSkillGaps": [
    { "skill": "Skill Name", "gapStatus": "Need to learn / Getting ready / Already have", "recommendation": "Simple advice on how to learn this" }
  ],
  "dailyWeeklyMonthlyStrategy": {
    "dailyPlan": "Simple advice on what to practice each day",
    "weeklyCadence": "What to finish by the end of each week",
    "monthlyPhases": [
      { "month": 1, "focus": "Learn the basics", "deliverable": "First small project or quiz" },
      { "month": 2, "focus": "Build practical skills", "deliverable": "Complete a real project or test" },
      { "month": 3, "focus": "Get ready for jobs or exams", "deliverable": "Portfolio project or mock exam" }
    ]
  },
  "recommendedProjectsOrExercises": [
    { "title": "Project or Practice Task", "difficulty": "Beginner / Intermediate / Advanced", "brief": "What you will build or do", "deliverable": "What you will finish" }
  ]
}
`;

    if (ai) {
      try {
        const text = await generateAIResponse(prompt);
        const data = JSON.parse(text || '{}');
        return res.json({ success: true, source: 'gemini', data });
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to heuristic engine:', err.message);
      }
    }

    // Heuristic fallback
    const isGov = domain.toLowerCase().includes('government') || domain.toLowerCase().includes('civil') || careerTitle.toLowerCase().includes('officer');
    const isHw = domain.toLowerCase().includes('hardware') || domain.toLowerCase().includes('electronics');
    const isSw = domain.toLowerCase().includes('software') || domain.toLowerCase().includes('it');

    // Simple, plain English fallback
    const userQual = highestQualificationCompleted || '';
    const userAgeNum = age ? Number(age) : null;
    const hasDegree = userQual.includes('Bachelor') || userQual.includes('Master') || userQual.includes('PhD');

    let eligStatus: 'Officially Eligible' | 'Prerequisite In Progress' | 'Details Needed' | 'Skills-First / No Formal Degree Required' = 'Skills-First / No Formal Degree Required';
    let eligSummary = 'Open to everyone! You do not need any college degree. Companies hire based on your real skills and projects.';
    const missingDetails: string[] = [];

    if (isGov) {
      if (!userQual && !age) {
        eligStatus = 'Details Needed';
        missingDetails.push('Age', 'What did you study');
        eligSummary = 'Government exams have official degree and age rules. You can enter your age and education to check if you can write the exam, or start learning right away.';
      } else if (!hasDegree && (userQual === '10th' || userQual === '12th' || userQual === 'Diploma')) {
        eligStatus = 'Prerequisite In Progress';
        eligSummary = `Official government rules require any completed graduation degree before writing the final exam. A 12th-class student or college student can start learning the basics and syllabus right now!`;
      } else if (hasDegree && userAgeNum && (userAgeNum < 21 || userAgeNum > 32)) {
        eligStatus = 'Prerequisite In Progress';
        eligSummary = `Official exam age is usually between 21 and 32 years (with extra years allowed for reserved categories). You have a degree, so check the age limit for this exam cycle.`;
      } else if (hasDegree) {
        eligStatus = 'Officially Eligible';
        eligSummary = `Great news! You have a completed college degree, so you are eligible to write this official exam. Let's start preparing for the exam stages and syllabus!`;
      }
    }

    const fallbackData = {
      careerTitle,
      domain,
      eligibilitySummary: isGov
        ? "Any graduation degree (like B.Tech, B.Sc, B.Com, B.A). Age limit is usually 21 to 32 years."
        : "No college degree required. Anyone can learn and get hired by building practical skills and projects.",
      eligibilityEvaluation: {
        status: eligStatus,
        summary: eligSummary,
        missingDetails,
        mandatoryBreakdown: isGov ? [
          "Any recognized Bachelor's degree (like B.Tech, B.Sc, B.Com, B.A) before writing the final exam",
          "Age usually between 21 and 32 years (extra years allowed for category relaxations)",
          "Citizen of the country as per official exam rules"
        ] : [
          "None - You do not need any college degree. Hiring is based on your real skills and projects."
        ],
        recommendedBreakdown: [
          isGov ? 'General Studies and Current Affairs' : isHw ? 'Circuit Design and Microcontrollers' : 'Coding, Problem Solving, and Building Projects',
          'Practice solving real problems',
          'Study consistently every day'
        ],
        optionalBreakdown: [
          isGov ? 'Mock test series and past exam papers' : isHw ? 'Electronics kit practice' : 'Useful online certificates and project badges',
        ]
      },
      isGovernmentOrCompetitive: isGov,
      competitiveExamDetails: isGov ? {
        hasExam: true,
        examName: careerTitle.includes('Bank') ? 'Bank PO Exam (RBI / IBPS)' : 'Civil Services Examination (UPSC / State PSC)',
        conductingBody: careerTitle.includes('Bank') ? 'Banking Services Board' : 'Union Public Service Commission (UPSC)',
        officialEligibility: 'Any completed graduation degree (B.Tech, B.Com, B.Sc, B.A). Age: 21 to 32 years.',
        examStages: [
          { stageName: 'Stage 1: Preliminary Exam', format: 'Multiple choice questions', keySubjects: ['General Studies', 'Aptitude & Reasoning'] },
          { stageName: 'Stage 2: Main Exam', format: 'Written papers and essay', keySubjects: ['Essay', 'General Studies', 'Chosen Subject'] },
          { stageName: 'Stage 3: Interview', format: 'Face-to-face interview', keySubjects: ['Knowledge, ethics, and confidence'] },
        ],
        officialSourceNote: 'Based on official government exam notifications.',
      } : { hasExam: false },
      technicalOrCoreFocus: {
        softwareSpecific: isSw ? 'Modern TypeScript, React 19, Backend APIs (Node/Python), PostgreSQL schema design, Docker containers, LeetCode patterns.' : null,
        hardwareSpecific: isHw ? 'Digital Electronics, Embedded C/C++, ARM Cortex microcontrollers, PCB design (KiCad), Oscilloscope & logic analyzer debugging.' : null,
        generalStrategicFocus: 'Demonstrable domain competencies, problem solving, and structured execution.',
      },
      verifiedRequiredSkills: [
        { name: isGov ? 'Constitutional Law & Governance' : isHw ? 'Embedded C Programming' : 'Core Architecture & Logic', category: 'Core', importance: 'Crucial', description: 'Essential foundation for performance' },
        { name: isGov ? 'Analytical Reasoning & Aptitude' : isHw ? 'Circuit Simulation & PCB Layout' : 'Modern Frameworks & Tooling', category: 'Tools', importance: 'High', description: 'Practical execution capability' },
        { name: 'Professional Documentation & Communication', category: 'Soft Skills', importance: 'High', description: 'Essential for reports, presentations, and interviews' },
      ],
      personalizedSkillGaps: [
        { skill: 'Core Industry Standards', gapStatus: 'Needs Depth', recommendation: 'Dedicate 1 hour daily to structured practice' },
        { skill: 'Portfolio / Mock Testing', gapStatus: 'Missing', recommendation: 'Complete 2 full mock assessments or project sprints' },
      ],
      dailyWeeklyMonthlyStrategy: {
        dailyPlan: `Allocate 45 mins to concept acquisition, 45 mins to hands-on exercises, 30 mins to active recall and revision.`,
        weeklyCadence: 'Weekly self-assessment on Sundays to evaluate velocity and adjust milestones.',
        monthlyPhases: [
          { month: 1, focus: 'Core Theoretical Foundations', deliverable: 'Comprehensive cheat sheet & initial exercises' },
          { month: 2, focus: 'Intermediate Systems & Tools', deliverable: 'First functional project or full-length practice paper' },
          { month: 3, focus: 'Advanced Capstone & Interview Readiness', deliverable: 'Polished portfolio or top-percentile mock test score' },
        ],
      },
      recommendedProjectsOrExercises: [
        { title: `${careerTitle} Comprehensive Benchmark Sprint`, difficulty: 'Intermediate', brief: 'End-to-end case study proving real-world readiness', deliverable: 'Public documentation and demo/analysis' },
      ],
    };

    return res.json({ success: true, source: 'fallback', data: fallbackData });
  } catch (error: any) {
    console.error('Career analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Custom Career Exploration Search (Generate new career profile on the fly)
app.post('/api/gemini/custom-career', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const prompt = `
Generate a comprehensive, realistic career track definition for the custom role: "${query}".
Return a strictly valid JSON object:
{
  "id": "custom-${Date.now()}",
  "title": "Exact standard job title for ${query}",
  "domain": "One of: Software and IT, Hardware and Electronics, Government Jobs and Civil Services, Banking and Finance, Healthcare and Medical, Business and Management, Mechanical and Core Engineering, Civil Engineering, Creative Arts and Design, Teaching and Education, Research and Science, Entrepreneurship, or Other Careers & Specialized Trades",
  "description": "2-3 sentence overview of what this professional does daily",
  "demandLevel": "High",
  "avgSalaryRange": "$70,000 – $140,000 (or localized equivalent)",
  "entrySalary": "$65,000",
  "growthRate": "+18% (Next 5 Years)",
  "openJuniorJobs": 2400,
  "keySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "overview": "Detailed breakdown of the day-to-day responsibilities, industry trends, and what hiring managers look for",
  "topCompaniesHiring": ["Leading Org 1", "Leading Org 2", "Leading Org 3", "Leading Org 4"],
  "recommendedPhases": 4,
  "isCompetitiveExam": true/false,
  "examSummary": "Details of any required certification, civil service exam, or licensing board (or null)",
  "formalEligibility": {
    "hasFormalRequirements": false,
    "isMandatoryDegreeRequired": false,
    "mandatoryQualifications": ["List mandatory formal degrees if legally required, else state 'None - Skills & portfolio based'"],
    "recommendedSkills": ["List recommended competencies"],
    "optionalCertifications": ["List optional credentials"]
  }
}
`;

    if (ai) {
      try {
        const text = await generateAIResponse(prompt);
        const data = JSON.parse(text || '{}');
        return res.json({ success: true, source: 'gemini', data });
      } catch (err: any) {
        console.warn('Gemini custom career generation failed, using fallback generator:', err.message);
      }
    }

    // Heuristic generator
    const title = query.trim().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const fallbackData = {
      id: `custom-${Date.now()}`,
      title: `${title} Specialist`,
      domain: 'Other Careers & Specialized Trades',
      description: `Plan, develop, and execute critical solutions in the field of ${title}, utilizing modern methodologies and industry standards.`,
      demandLevel: 'High',
      avgSalaryRange: '$75,000 – $130,000',
      entrySalary: '$68,000',
      growthRate: '+16% (Next 5 Years)',
      openJuniorJobs: 1850,
      keySkills: [`${title} Fundamentals`, 'Analytical Problem Solving', 'Quality Assurance & Standards', 'Technical Documentation', 'Project Execution', 'Domain Tooling'],
      prerequisites: ['Foundational problem solving literacy', 'Domain enthusiasm'],
      overview: `Professionals working as ${title} Specialists combine technical expertise with systematic execution to meet rigorous client and organizational objectives.`,
      topCompaniesHiring: ['Industry Leaders Global', 'Pioneer Systems', 'National Services Group', 'Specialized Solutions Inc'],
      recommendedPhases: 4,
      isCompetitiveExam: false,
      examSummary: null,
      formalEligibility: {
        hasFormalRequirements: false,
        isMandatoryDegreeRequired: false,
        mandatoryQualifications: ['None - Skills & Portfolio Based'],
        recommendedSkills: [`${title} core methodologies`, 'Analytical problem solving'],
        optionalCertifications: ['Domain industry certifications']
      }
    };

    res.json({ success: true, source: 'fallback', data: fallbackData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. AI Interactive Career Advisor Chat
app.post('/api/gemini/chat-advisor', async (req, res) => {
  try {
    const { message, conversationHistory, userProfile, targetCareer } = req.body;

    const systemPrompt = `
You are the friendly AI Career Guide inside Skill Bridge, a learning and career platform for everyone.
The user profile is:
- Target Job / Career: ${targetCareer?.title || 'Undecided'}
- Domain: ${targetCareer?.domain || 'General'}
- What they are doing now: ${userProfile?.currentStatus || 'Learner'}
- What they studied: ${userProfile?.highestQualificationCompleted || 'Not provided (optional)'}
- Age: ${userProfile?.age || 'Not provided (optional)'}
- Study time every day: ${userProfile?.dailyHours || '2 hours'}

IMPORTANT GUIDELINES:
1. ALWAYS USE SIMPLE, EASY, AND CLEAR ENGLISH. Write like a friendly teacher or mentor. Keep sentences short and clear.
2. Users can choose ANY career they want, no matter what they studied.
3. A B.Tech graduate can choose Civil Services or Banking.
4. A 12th-class student can choose Software Developer or Hardware Engineer.
5. A working person can switch to a new career.
6. Do NOT tell users to get another college degree unless the government exam strictly requires it. For tech, design, marketing, and business, explain that real skills and projects are what matter!
7. If they ask about government exams (UPSC, Banking, SSC), explain the requirements in plain words (any graduation degree and age limit).
8. If they ask about Software careers, explain what coding languages to learn, how to practice, and what projects to build.
9. If they ask about Hardware careers, explain electronics basics, circuits, and microcontrollers.
10. Give practical, step-by-step answers that fit their daily study time.
`;

    if (ai) {
      try {
        const historyText = Array.isArray(conversationHistory)
          ? conversationHistory.map((m: any) => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.text}`).join('\n')
          : '';

        const fullPrompt = `${historyText}\nUser: ${message}\nAdvisor:`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: fullPrompt,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        return res.json({ success: true, reply: response.text });
      } catch (err: any) {
        console.warn('Gemini chat failed, using fallback:', err.message);
      }
    }

    // Fallback response in simple English
    const reply = `To become a **${targetCareer?.title || 'Professional'}**, the best way is to practice every day. With your goal of **${userProfile?.dailyHours || '1-2 hours'} each day**, you can spend the first half learning concepts and the second half building practical tasks. Would you like to see the skills you need or check job requirements?`;

    res.json({ success: true, reply });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Secure Server-Side Resume Parser & AI Extractor
app.post('/api/resume/parse-and-extract', async (req, res) => {
  try {
    const { fileBase64, fileName, fileType } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ success: false, error: 'No file content provided' });
    }

    const isPdf = fileType === 'application/pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'));
    const isDocx = fileType?.includes('word') || (fileName && fileName.toLowerCase().endsWith('.docx'));

    let docxText = '';
    if (isDocx) {
      try {
        const buffer = Buffer.from(fileBase64, 'base64');
        const result = await mammoth.extractRawText({ buffer });
        docxText = result.value || '';
      } catch (err: any) {
        console.warn('Mammoth docx extraction warning:', err.message);
      }
    }

    const extractionInstruction = `
You are an expert technical recruiter, career advisor, and resume auditor for Skill Bridge.
Analyze the provided resume document accurately.

CRITICAL INSTRUCTION ON SKILL PROFICIENCY:
- Do NOT assume a skill is "Advanced" just because it appears on the resume!
- Assign realistic levels:
  * "Beginner": Mentioned in passing, basic coursework, or intro project.
  * "Intermediate": 1-2 years experience, used in a substantial project or job role.
  * "Advanced": 3+ years experience, senior role, specialized architecture, or major published production achievement.

Extract and structure the candidate's profile into this EXACT JSON format:
{
  "summary": "2-3 short, clear sentences in simple English summarizing candidate's background and core strength.",
  "technicalSkills": [
    { "name": "Skill Name", "level": "Beginner" | "Intermediate" | "Advanced", "category": "Technical", "context": "How they used it, e.g. Used in React portfolio project" }
  ],
  "nonTechnicalSkills": [
    { "name": "Skill Name", "level": "Beginner" | "Intermediate" | "Advanced", "category": "Non-Technical", "context": "Where demonstrated, e.g. Led team of 4 in college hackathon" }
  ],
  "education": [
    { "degree": "Degree Name", "institution": "College / University Name", "year": "Graduation Year or In Progress", "fieldOfStudy": "Branch / Major" }
  ],
  "experience": [
    { "role": "Job Title or Intern", "organization": "Company or Organization", "duration": "Dates or duration", "highlights": ["Key achievement 1", "Key achievement 2"] }
  ],
  "projects": [
    { "title": "Project Name", "techUsed": ["Tech 1", "Tech 2"], "description": "What they built and impact" }
  ],
  "certifications": [
    { "title": "Certificate Name", "issuer": "Issuing Body or Platform", "date": "Year or date" }
  ],
  "achievements": [
    "Short achievement bullet point"
  ]
}
`;

    if (ai) {
      try {
        let response;
        if (isPdf) {
          // Send PDF directly to Gemini multimodal
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: fileBase64,
                  },
                },
                {
                  text: 'Please parse and extract all details from this resume document according to the required schema. Ensure accuracy, do not inflate skill levels, and write descriptions in simple, clear English.',
                },
              ],
            },
            config: {
              systemInstruction: extractionInstruction,
              responseMimeType: 'application/json',
            },
          });
        } else {
          // Send text content (from docx or text file)
          const textContent = docxText || Buffer.from(fileBase64, 'base64').toString('utf-8');
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Resume Content:\n\n${textContent}\n\nPlease parse and extract all details according to the required schema.`,
            config: {
              systemInstruction: extractionInstruction,
              responseMimeType: 'application/json',
            },
          });
        }

        const parsedJson = JSON.parse(response.text || '{}');
        return res.json({
          success: true,
          source: 'gemini',
          data: {
            ...parsedJson,
            fileName: fileName || 'Uploaded_Resume.pdf',
            uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          },
        });
      } catch (geminiErr: any) {
        console.warn('Gemini resume extraction failed, attempting fallback parser:', geminiErr.message);
      }
    }

    // Heuristic Fallback Parser if Gemini key is offline
    const rawText = docxText || Buffer.from(fileBase64, 'base64').toString('utf-8', 0, 5000);
    const fallbackData = {
      summary: 'Extracted profile details from uploaded resume. Please review and customize the skills below before finalizing.',
      technicalSkills: [
        { name: 'JavaScript / TypeScript', level: 'Intermediate', category: 'Technical', context: 'Detected in resume text' },
        { name: 'Web Development', level: 'Intermediate', category: 'Technical', context: 'Project development experience' },
        { name: 'Git & Version Control', level: 'Beginner', category: 'Technical', context: 'Developer tooling' },
        { name: 'SQL & Database Basics', level: 'Beginner', category: 'Technical', context: 'Data querying' },
      ],
      nonTechnicalSkills: [
        { name: 'Problem Solving', level: 'Intermediate', category: 'Non-Technical', context: 'Analytical coursework' },
        { name: 'Communication', level: 'Intermediate', category: 'Non-Technical', context: 'Team collaboration' },
        { name: 'Time Management', level: 'Beginner', category: 'Non-Technical', context: 'Project delivery' },
      ],
      education: [
        { degree: "Bachelor's Degree", institution: 'University', year: '2024', fieldOfStudy: 'Engineering / Science' },
      ],
      experience: [
        { role: 'Junior Associate / Project Intern', organization: 'Tech Project', duration: '6 months', highlights: ['Contributed to core feature delivery and debugging.'] },
      ],
      projects: [
        { title: 'Interactive Web Application', techUsed: ['React', 'CSS', 'Node.js'], description: 'Built responsive client application with state management.' },
      ],
      certifications: [
        { title: 'Foundational Skill Certificate', issuer: 'Online Learning Platform', date: '2024' },
      ],
      achievements: ['Completed hands-on software development capstone.'],
      fileName: fileName || 'Uploaded_Resume.pdf',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    return res.json({ success: true, source: 'fallback', data: fallbackData });
  } catch (error: any) {
    console.error('Resume parse error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Combined Skill Gap Analysis & Personalized Learning Plan Generator
app.post('/api/skills/analyze-and-plan', async (req, res) => {
  try {
    const { 
      targetCareer, 
      userSkills, 
      combinedMode, 
      dailyHours, 
      userStatus, 
      highestQualification 
    } = req.body;

    const careerTitle = targetCareer?.title || 'Full Stack Developer';
    const domain = targetCareer?.domain || 'Software and IT';
    const hours = dailyHours || 2;

    const prompt = `
Analyze the skills of a user targeting the career goal "${careerTitle}" in "${domain}".

User Background:
- Current Status: ${userStatus || 'College Student'}
- Completed Education: ${highestQualification || 'Not specified'}
- Available daily study time: ${hours} hours per day
- Analysis Mode: ${combinedMode} (Using combined manual skills and resume analysis)

User Confirmed Skills:
${JSON.stringify(userSkills || [], null, 2)}

Career Benchmark Requirements for ${careerTitle}:
Key skills typically needed: ${Array.isArray(targetCareer?.keySkills) ? targetCareer.keySkills.join(', ') : 'Industry baseline skills'}

CRITICAL GUIDELINES (SIMPLE AND EASY ENGLISH):
1. Categorize all skills strictly into THREE sections:
   - "skillsAlreadyHave": Skills the user already has that meet or exceed junior/mid requirements for ${careerTitle}. Explain why it is important in simple words, and specify a verificationMethod ('Practice Quiz', 'Self-Assessment', or 'Project Proof').
   - "skillsNeedToImprove": Skills the user has at a Beginner or low level that need practice to reach job readiness. Explain why it is important.
   - "skillsNeedToLearn": Critical missing skills the user does not have yet. Give priority ('High' | 'Medium' | 'Low') and simple explanation.
2. Generate a Personalized Learning Plan calibrated to ${hours} hours of study per day:
   - "skillsToLearnFirst": 3-4 top priority skills to tackle first with clear rationale and estimated days.
   - "topicsToStudy": 3-4 core study modules with clear subtopics.
   - "recommendedResources": 3-4 high quality courses, websites, and documentation (e.g. MDN Web Docs, freeCodeCamp, official guides).
   - "practicalExercises": 2-3 specific hands-on exercises to test concepts.
   - "recommendedProjects": 2 portfolio projects with deliverables.
   - "dailyTasks": 5 concrete tasks the user can do this week.
   - "weeklyTargets": Targets for Week 1, Week 2, Week 3, Week 4.
   - "monthlyTargets": Targets for Month 1, Month 2, Month 3.
3. Write everything in friendly, simple, and encouraging English!

Return strictly valid JSON:
{
  "gapResult": {
    "summary": "1-2 encouraging sentences summarizing their readiness for ${careerTitle}.",
    "skillsAlreadyHave": [
      { "name": "Skill Name", "currentLevel": "Intermediate / Advanced", "requiredLevel": "Intermediate", "whyImportant": "Simple explanation", "verificationMethod": "Practice Quiz", "category": "Technical / Non-Technical" }
    ],
    "skillsNeedToImprove": [
      { "name": "Skill Name", "currentLevel": "Beginner", "requiredLevel": "Intermediate", "whyImportant": "Simple explanation", "verificationMethod": "Project Proof", "category": "Technical / Non-Technical" }
    ],
    "skillsNeedToLearn": [
      { "name": "Skill Name", "priority": "High / Medium", "requiredLevel": "Intermediate", "whyImportant": "Simple explanation", "verificationMethod": "Practice Quiz", "category": "Technical / Non-Technical" }
    ]
  },
  "learningPlan": {
    "skillsToLearnFirst": [
      { "skill": "Skill Name", "reason": "Why learn this first", "estimatedDays": 7 }
    ],
    "topicsToStudy": [
      { "topic": "Module Title", "relatedSkill": "Skill", "subtopics": ["Topic A", "Topic B", "Topic C"] }
    ],
    "recommendedResources": [
      { "title": "Resource Name", "type": "Interactive Course / Documentation / Video", "provider": "Provider Name", "description": "Why it helps" }
    ],
    "practicalExercises": [
      { "title": "Exercise Name", "skill": "Skill", "exerciseBrief": "What to build or do step by step" }
    ],
    "recommendedProjects": [
      { "title": "Project Title", "difficulty": "Beginner / Intermediate", "brief": "What to build", "deliverables": ["Deliverable 1", "Deliverable 2"] }
    ],
    "dailyTasks": [
      { "day": "Day 1", "task": "Actionable task", "estimatedMinutes": 60, "skill": "Skill" }
    ],
    "weeklyTargets": [
      { "weekNumber": 1, "title": "Core Basics", "milestones": ["Milestone 1", "Milestone 2"] }
    ],
    "monthlyTargets": [
      { "monthNumber": 1, "focus": "Foundations & Practice", "outcomes": ["Outcome 1", "Outcome 2"] }
    ]
  }
}
`;

    if (ai) {
      try {
        const text = await generateAIResponse(prompt);
        const data = JSON.parse(text || '{}');
        return res.json({ success: true, source: 'gemini', data });
      } catch (geminiErr: any) {
        console.warn('Gemini skill gap & plan generation failed, using structured fallback:', geminiErr.message);
      }
    }

    // Heuristic Fallback Plan
    const fallbackResponse = {
      gapResult: {
        summary: `Great start! Based on your confirmed skills, you have a solid foundation for ${careerTitle}. Focusing on the targeted gap areas will get you job-ready.`,
        skillsAlreadyHave: [
          { name: 'Problem Solving & Logic', currentLevel: 'Intermediate', requiredLevel: 'Intermediate', whyImportant: 'Helps you break down complex challenges into manageable steps.', verificationMethod: 'Self-Assessment', category: 'Non-Technical' },
          { name: 'Git & Version Control', currentLevel: 'Intermediate', requiredLevel: 'Intermediate', whyImportant: 'Essential for tracking code changes and collaborating with other team members.', verificationMethod: 'Project Proof', category: 'Technical' },
        ],
        skillsNeedToImprove: [
          { name: 'Core Framework Development', currentLevel: 'Beginner', requiredLevel: 'Intermediate', whyImportant: 'Enables you to build responsive, modern interfaces efficiently.', verificationMethod: 'Practice Quiz', category: 'Technical' },
          { name: 'API Integration & Data Fetching', currentLevel: 'Beginner', requiredLevel: 'Intermediate', whyImportant: 'Needed to connect client screens with live database endpoints.', verificationMethod: 'Practice Quiz', category: 'Technical' },
        ],
        skillsNeedToLearn: [
          { name: 'Database Architecture & Indexing', priority: 'High', requiredLevel: 'Intermediate', whyImportant: 'Crucial for persisting application state reliably and securely.', verificationMethod: 'Project Proof', category: 'Technical' },
          { name: 'Automated Testing & Security', priority: 'Medium', requiredLevel: 'Beginner', whyImportant: 'Ensures your code runs bug-free and protects user data.', verificationMethod: 'Self-Assessment', category: 'Technical' },
        ],
      },
      learningPlan: {
        skillsToLearnFirst: [
          { skill: 'Core Framework Development', reason: 'Unlocks building real interactive applications immediately.', estimatedDays: 8 },
          { skill: 'Database Architecture', reason: 'Allows you to store real user data and projects.', estimatedDays: 10 },
          { skill: 'API Integration', reason: 'Connects your frontends with backend APIs.', estimatedDays: 6 },
        ],
        topicsToStudy: [
          { topic: 'Component Architecture & State', relatedSkill: 'Core Framework Development', subtopics: ['Props & State', 'Lifecycle Hooks', 'Custom Reusable UI Elements'] },
          { topic: 'Relational & Document Databases', relatedSkill: 'Database Architecture', subtopics: ['Schema Design', 'Queries & Filters', 'Indexes & Speed'] },
          { topic: 'RESTful API Services', relatedSkill: 'API Integration', subtopics: ['HTTP Methods', 'Authentication Headers', 'Error Handling'] },
        ],
        recommendedResources: [
          { title: 'Official Documentation & Guides', type: 'Documentation', provider: 'Official Docs', description: 'Up-to-date syntax, best practices, and interactive tutorials.' },
          { title: 'Full Stack Interactive Curriculum', type: 'Interactive Course', provider: 'freeCodeCamp', description: 'Step-by-step free practical projects with instant feedback.' },
          { title: 'System Architecture Video Masterclasses', type: 'Video Masterclass', provider: 'YouTube & Open Courseware', description: 'Deep-dive visual lectures on real-world engineering patterns.' },
        ],
        practicalExercises: [
          { title: 'Build a CRUD Task Application', skill: 'Core Framework Development', exerciseBrief: 'Create, update, filter, and delete tasks with real-time UI updates.' },
          { title: 'Database Schema Normalization Exercise', skill: 'Database Architecture', exerciseBrief: 'Design normalized tables for a store with users, orders, and products.' },
        ],
        recommendedProjects: [
          { title: 'Interactive Portfolio Showcase', difficulty: 'Intermediate', brief: 'A complete responsive web application showcasing your skills and live demo projects.', deliverables: ['Deployed web application', 'Clean public GitHub repository', 'Comprehensive README'] },
          { title: 'Full Stack Service with Authentication', difficulty: 'Intermediate', brief: 'An end-to-end web portal with user registration, secure data storage, and dashboard analytics.', deliverables: ['REST API backend', 'Database integration', 'User role protection'] },
        ],
        dailyTasks: [
          { day: 'Day 1', task: 'Complete the interactive state management tutorial (1 hour)', estimatedMinutes: 60, skill: 'Core Framework Development' },
          { day: 'Day 2', task: 'Build a small dynamic form with input validation (1 hour)', estimatedMinutes: 60, skill: 'Core Framework Development' },
          { day: 'Day 3', task: 'Design a clean relational database schema on paper (1 hour)', estimatedMinutes: 60, skill: 'Database Architecture' },
          { day: 'Day 4', task: 'Set up an Express API route with mock data (1 hour)', estimatedMinutes: 60, skill: 'API Integration' },
          { day: 'Day 5', task: 'Connect your frontend with the API route (1 hour)', estimatedMinutes: 60, skill: 'API Integration' },
        ],
        weeklyTargets: [
          { weekNumber: 1, title: 'Master Core Components & State', milestones: ['Finish 5 interactive labs', 'Complete small dynamic app'] },
          { weekNumber: 2, title: 'Database & Data Persistence', milestones: ['Write schema migrations', 'Connect local database'] },
          { weekNumber: 3, title: 'API Integration & Auth', milestones: ['Implement token/session auth', 'Handle loading & errors'] },
          { weekNumber: 4, title: 'Portfolio Project Assembly', milestones: ['Deploy capstone project', 'Publish code to GitHub'] },
        ],
        monthlyTargets: [
          { monthNumber: 1, focus: 'Foundations & Practical Exercises', outcomes: ['Master all High priority skills', 'Complete 2 small practical apps'] },
          { monthNumber: 2, focus: 'Applied Projects & Portfolios', outcomes: ['Complete first major portfolio capstone', 'Pass practice readiness quiz'] },
          { monthNumber: 3, focus: 'Interview & Role Preparation', outcomes: ['Mock assessments and speed tests', 'Job or exam readiness verified'] },
        ],
      },
    };

    res.json({ success: true, source: 'fallback', data: fallbackResponse });
  } catch (error: any) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Production static assets or Vite middleware in development
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Skill Bridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
