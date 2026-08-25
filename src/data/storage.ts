import { UserProfile, Project, FormedTeamState } from '../types';

const STORAGE_KEYS = {
  USERS: 'projectmatch_registered_users_v2',
  PROJECTS: 'projectmatch_projects_v2',
  CURRENT_USER_ID: 'projectmatch_current_user_id_v2',
  FORMED_TEAMS: 'projectmatch_formed_teams_v2',
  ACTIVE_PROJECT_ID: 'projectmatch_active_project_id_v2'
};

// Initial template profiles for competition / testing evaluation (can be loaded with 1-click or user creates their own)
export const COMPETITION_DEMO_PROFILES: Omit<UserProfile, 'id' | 'createdAt'>[] = [
  {
    name: 'Rahul Sharma',
    collegeOrOrg: 'Stanford University / AI Lab',
    email: 'rahul.ml@stanford.edu',
    skills: ['Machine Learning', 'Python', 'PyTorch', 'Computer Vision', 'Data Science', 'FastAPI'],
    skillLevel: 'Expert',
    interests: ['AI/ML', 'Healthcare AI', 'Deep Learning', 'Autonomous Systems'],
    previousExperience: 'Built real-time diagnostic imaging model at MIT Hackathon 2025 (1st place). 3 years building PyTorch models.',
    yearsExperience: '2-4 years',
    preferredRole: 'Machine Learning Developer',
    secondaryRoles: ['AI Researcher', 'Backend Developer'],
    availabilityHours: 25,
    availabilityType: 'Flexible',
    teamPreferences: {
      workStyle: 'Fast-paced Hackathon',
      preferredTeamSize: '4-5 members',
      communicationPreference: 'Slack/Discord'
    },
    bio: 'ML Engineer specializing in deep neural networks, computer vision, and high-performance inference pipelines.',
    githubOrPortfolio: 'github.com/rahul-ml',
    isRegistered: true
  },
  {
    name: 'Ananya Deshmukh',
    collegeOrOrg: 'National Institute of Design / Tech Guild',
    email: 'ananya.ux@designguild.org',
    skills: ['UI/UX', 'Figma', 'User Research', 'Design Systems', 'Prototyping', 'Tailwind CSS', 'Frontend UI'],
    skillLevel: 'Advanced',
    interests: ['UI/UX', 'Healthcare', 'Accessibility', 'Mobile Product Design'],
    previousExperience: 'Designed accessible med-tech dashboards for clinical trials. Finalist in Global Design Sprint 2025.',
    yearsExperience: '2-4 years',
    preferredRole: 'UI/UX Designer',
    secondaryRoles: ['Frontend Developer', 'Product Manager'],
    availabilityHours: 20,
    availabilityType: 'Weekdays',
    teamPreferences: {
      workStyle: 'Collaborative',
      preferredTeamSize: '3-4 members',
      communicationPreference: 'Slack/Discord'
    },
    bio: 'Product Designer obsessed with human-centered interfaces, micro-interactions, and high-fidelity prototypes.',
    githubOrPortfolio: 'behance.net/ananyadesign',
    isRegistered: true
  },
  {
    name: 'Dr. Priya Nair',
    collegeOrOrg: 'Johns Hopkins / Health Innovation Hub',
    email: 'priya.nair@jhu.edu',
    skills: ['Healthcare knowledge', 'Clinical Validation', 'Medical Protocols', 'Health Data Compliance', 'Biostatistics', 'Domain Strategy'],
    skillLevel: 'Expert',
    interests: ['Healthcare', 'MedTech', 'Preventive Health', 'Public Health Informatics'],
    previousExperience: 'Physician-researcher advising digital health startups on HIPAA compliance, clinical workflows, and patient safety metrics.',
    yearsExperience: '4+ years',
    preferredRole: 'Healthcare Domain Expert',
    secondaryRoles: ['Product Manager', 'Domain Specialist'],
    availabilityHours: 15,
    availabilityType: 'Weekends',
    teamPreferences: {
      workStyle: 'Structured',
      preferredTeamSize: '4-6 members',
      communicationPreference: 'Async Docs'
    },
    bio: 'Bridging modern clinical medicine with innovative software systems to improve clinical diagnostics and patient outcomes.',
    githubOrPortfolio: 'orcid.org/priya-nair-md',
    isRegistered: true
  },
  {
    name: 'Kiran Patel',
    collegeOrOrg: 'Harvard Business School / Entrepreneurship Club',
    email: 'kiran.patel@hbs.edu',
    skills: ['Business & Marketing', 'Go-To-Market', 'Product Strategy', 'Financial Modeling', 'Pitch Deck Pitching', 'User Acquisition'],
    skillLevel: 'Advanced',
    interests: ['Business/Marketing', 'HealthTech', 'FinTech', 'Venture Scaling'],
    previousExperience: 'Led marketing and fundraising for 2 seed-stage hackathon winning ventures. Raised $120k non-dilutive grants.',
    yearsExperience: '2-4 years',
    preferredRole: 'Business & Marketing',
    secondaryRoles: ['Product Manager', 'Growth Lead'],
    availabilityHours: 20,
    availabilityType: 'Flexible',
    teamPreferences: {
      workStyle: 'Collaborative',
      preferredTeamSize: '4-5 members',
      communicationPreference: 'Daily Video Calls'
    },
    bio: 'Growth strategist and pitch architect specializing in narrative building, GTM execution, and product-market fit.',
    githubOrPortfolio: 'linkedin.com/in/kiran-growth',
    isRegistered: true
  },
  {
    name: 'Arjun Mehta',
    collegeOrOrg: 'Carnegie Mellon University / Cloud Systems Lab',
    email: 'arjun.cloud@cmu.edu',
    skills: ['Cloud Developer', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices', 'PostgreSQL', 'Cloud Deployment'],
    skillLevel: 'Expert',
    interests: ['Cloud Architecture', 'DevOps', 'Distributed Systems', 'Security'],
    previousExperience: 'Designed serverless auto-scaling backend handling 10k req/sec for university hackathon portal. AWS Certified Solutions Architect.',
    yearsExperience: '2-4 years',
    preferredRole: 'Cloud Developer',
    secondaryRoles: ['Backend Lead', 'DevOps Architect'],
    availabilityHours: 25,
    availabilityType: 'Full-time Sprint',
    teamPreferences: {
      workStyle: 'Fast-paced Hackathon',
      preferredTeamSize: '3-5 members',
      communicationPreference: 'Slack/Discord'
    },
    bio: 'Backend & Cloud Infrastructure specialist with expertise in resilient distributed services and automated deployment pipelines.',
    githubOrPortfolio: 'github.com/arjun-cloudops',
    isRegistered: true
  }
];

// Default sample project requested in prompt
export const SAMPLE_HEALTHCARE_PROJECT: Project = {
  id: 'proj_healthcare_ai_001',
  name: 'AI Healthcare Assistant',
  description: 'An intelligent clinical diagnostics and patient intake assistant that leverages machine learning for symptom triage, intuitive clinical UI/UX, and robust healthcare domain validation.',
  category: 'Healthcare & AI',
  projectType: 'standard',
  requiredTeamSize: 4,
  requiredSkills: ['Machine Learning', 'UI/UX', 'Healthcare knowledge', 'Business & Marketing', 'Cloud Deployment'],
  requiredRoles: ['Machine Learning Developer', 'UI/UX Designer', 'Healthcare Domain Expert', 'Business & Marketing'],
  experienceRequirement: 'Intermediate+',
  duration: '1 Month Sprint',
  availabilityRequirement: 15,
  createdBy: 'System Demo',
  createdAt: new Date().toISOString(),
  status: 'Open'
};

export const SAMPLE_HACKATHON_PROJECT: Project = {
  id: 'proj_hackathon_002',
  name: 'HealthPulse 360 AI',
  description: 'Building a 360-degree real-time vitals triage engine and clinician dashboard for fast emergency room response during 24h HackMIT.',
  category: 'Healthcare & AI',
  projectType: 'hackathon',
  requiredTeamSize: 4,
  requiredSkills: ['Machine Learning', 'UI/UX', 'Healthcare knowledge', 'Cloud Developer', 'FastAPI'],
  requiredRoles: ['Machine Learning Developer', 'UI/UX Designer', 'Healthcare Domain Expert', 'Cloud Developer'],
  experienceRequirement: 'Any',
  duration: '24h Hackathon',
  availabilityRequirement: 20,
  hackathonName: 'HackMIT 2026 AI Innovation Cup',
  hackathonTheme: 'AI for Healthcare & Emergency Response',
  hackathonDeadline: '24 Hours',
  isHackathon: true,
  createdBy: 'System Demo',
  createdAt: new Date().toISOString(),
  status: 'Open'
};

export function getRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading users:', e);
    return [];
  }
}

export function saveRegisteredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users:', e);
  }
}

export function addRegisteredUser(user: Omit<UserProfile, 'id' | 'createdAt' | 'isRegistered'>): UserProfile {
  const users = getRegisteredUsers();
  const newUser: UserProfile = {
    ...user,
    id: 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    isRegistered: true
  };
  users.push(newUser);
  saveRegisteredUsers(users);
  return newUser;
}

export function updateRegisteredUser(updatedUser: UserProfile): void {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveRegisteredUsers(users);
  }
}

export function deleteRegisteredUser(userId: string): void {
  const users = getRegisteredUsers().filter(u => u.id !== userId);
  saveRegisteredUsers(users);
}

export function loadCompetitionProfilesIntoDatabase(): UserProfile[] {
  const existing = getRegisteredUsers();
  const added: UserProfile[] = [];
  
  COMPETITION_DEMO_PROFILES.forEach(profile => {
    // Only add if name not already present
    if (!existing.some(u => u.name.toLowerCase() === profile.name.toLowerCase())) {
      const newUser: UserProfile = {
        ...profile,
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        isRegistered: true
      };
      existing.push(newUser);
      added.push(newUser);
    }
  });

  saveRegisteredUsers(existing);
  return existing;
}

export function clearRegisteredUsers(): void {
  saveRegisteredUsers([]);
}

export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      // Initialize with default demo project so app has immediate demonstration project
      const initial = [SAMPLE_HEALTHCARE_PROJECT, SAMPLE_HACKATHON_PROJECT];
      saveProjects(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading projects:', e);
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects:', e);
  }
}

export function addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'status'>): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...projectData,
    id: 'proj_' + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    status: 'Open'
  };
  projects.unshift(newProject);
  saveProjects(projects);
  return newProject;
}

export function getFormedTeams(): Record<string, FormedTeamState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FORMED_TEAMS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveFormedTeam(teamState: FormedTeamState): void {
  try {
    const teams = getFormedTeams();
    teams[teamState.projectId] = teamState;
    localStorage.setItem(STORAGE_KEYS.FORMED_TEAMS, JSON.stringify(teams));
  } catch (e) {
    console.error('Error saving formed team:', e);
  }
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
}

export function setCurrentUserId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
}

// Aliases for convenience
export const saveUserProfile = addRegisteredUser;
export const registerUserProfile = addRegisteredUser;
export const updateUserProfile = updateRegisteredUser;
export const deleteUserProfile = deleteRegisteredUser;
export const saveProject = addProject;
export const loadCompetitionDemoProfiles = loadCompetitionProfilesIntoDatabase;
