export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ExperienceLevel = '0-1 year' | '1-2 years' | '2-4 years' | '4+ years';

export interface UserProfile {
  id: string;
  name: string;
  collegeOrOrg: string;
  email?: string;
  avatarSeed?: string;
  skills: string[];
  skillLevel: SkillLevel;
  interests: string[];
  previousExperience: string; // Summary of past projects, hackathons, etc.
  yearsExperience: ExperienceLevel;
  preferredRole: string;
  secondaryRoles?: string[];
  availabilityHours: number; // Hours per week (e.g. 5, 10, 15, 20, 30+)
  availabilityType: 'Weekdays' | 'Weekends' | 'Flexible' | 'Full-time Sprint';
  teamPreferences: {
    workStyle: 'Autonomous' | 'Collaborative' | 'Structured' | 'Fast-paced Hackathon';
    preferredTeamSize: string; // e.g. "3-5 members"
    communicationPreference: 'Slack/Discord' | 'Async Docs' | 'Daily Video Calls';
  };
  bio?: string;
  githubOrPortfolio?: string;
  createdAt: string;
  isRegistered: boolean;
}

export type ProjectType = 'standard' | 'hackathon';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  projectType: ProjectType;
  requiredTeamSize: number;
  requiredSkills: string[];
  requiredRoles: string[];
  experienceRequirement: 'Any' | 'Intermediate+' | 'Experienced';
  duration: string; // e.g. '24h Hackathon', '48h Hackathon', '2 Weeks', '1 Month', '3-6 Months'
  availabilityRequirement: number; // min hrs/week
  
  // Hackathon specific attributes
  hackathonName?: string;
  hackathonTheme?: string;
  hackathonDeadline?: string;
  isHackathon?: boolean;

  createdBy: string;
  createdAt: string;
  status: 'Open' | 'Team Formed' | 'In Progress' | 'Completed';
  selectedTeamId?: string;
}

export interface IndividualMatchScore {
  userId: string;
  user: UserProfile;
  assignedRole: string;
  overallScore: number;
  breakdown: {
    skillMatch: number;         // 30%
    complementarySkills: number;// 20%
    availability: number;       // 15%
    experience: number;         // 15%
    interestMatch: number;      // 10%
    roleSuitability: number;    // 10%
  };
  matchedSkills: string[];
  complementarySkills: string[];
  selectionReason: string;
}

export interface TeamScenario {
  id: string;
  name: string; // e.g. "Team A - High Synergy Balanced", "Team B - Deep Tech Specialization", "Team C - Rapid Sprint Velocity"
  tagline: string;
  overallScore: number;
  members: IndividualMatchScore[];
  metrics: {
    skillCoverage: number;       // 0-100%
    availabilitySync: number;    // 0-100%
    experienceDepth: number;     // 0-100%
    interestAlignment: number;   // 0-100%
    roleCoverage: number;        // 0-100%
  };
  coveredSkills: string[];
  missingSkills: string[];
  strengths: string[];
  recommendationReason: string;
  isBestTeam?: boolean;
}

export interface SkillGap {
  skill: string;
  severity: 'Critical' | 'Moderate' | 'Nice-to-have';
  category: string;
  neededTeammateType: string;
  explanation: string;
  matchingRegisteredUsers: UserProfile[];
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
}

export interface MeetingItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Sprint Planning' | 'Daily Standup' | 'Design Review' | 'Tech Sync' | 'Hackathon Checkpoint';
  link?: string;
  agenda: string;
}

export interface FormedTeamState {
  projectId: string;
  project: Project;
  teamScenario: TeamScenario;
  tasks: TaskItem[];
  meetings: MeetingItem[];
  progressPercent: number;
  formedAt: string;
}
