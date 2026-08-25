import React, { useState } from 'react';
import { 
  UserPlus, 
  Check, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Briefcase, 
  Clock, 
  BookOpen, 
  Heart, 
  ShieldCheck,
  Plus,
  X,
  User,
  Building,
  Mail,
  ExternalLink
} from 'lucide-react';
import { UserProfile, SkillLevel, ExperienceLevel } from '../types';
import { COMPETITION_DEMO_PROFILES } from '../data/storage';

interface CreateProfileViewProps {
  onSaveProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'isRegistered'>) => UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onDeleteProfile: (userId: string) => void;
  registeredUsers: UserProfile[];
  currentUserId: string | null;
  setCurrentUserId: (id: string) => void;
  onNavigateToMatching: () => void;
}

const COMMON_SKILLS = [
  'Machine Learning', 'Python', 'PyTorch', 'UI/UX', 'Figma', 'React', 'Node.js', 
  'Healthcare knowledge', 'Clinical Validation', 'Business & Marketing', 'Go-To-Market', 
  'Cloud Developer', 'AWS', 'Docker', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Pitch Deck Pitching'
];

const COMMON_INTERESTS = [
  'AI/ML', 'Healthcare', 'MedTech', 'FinTech', 'Sustainability', 'EdTech', 
  'Web3', 'Cybersecurity', 'Cloud Architecture', 'Mobile Apps', 'Social Impact'
];

const COMMON_ROLES = [
  'Machine Learning Developer',
  'UI/UX Designer',
  'Healthcare Domain Expert',
  'Business & Marketing',
  'Cloud Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Product Manager',
  'DevOps Architect'
];

export const CreateProfileView: React.FC<CreateProfileViewProps> = ({
  onSaveProfile,
  onUpdateProfile,
  onDeleteProfile,
  registeredUsers,
  currentUserId,
  setCurrentUserId,
  onNavigateToMatching
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'directory'>('create');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [collegeOrOrg, setCollegeOrOrg] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState<string[]>(['Machine Learning', 'Python']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [interests, setInterests] = useState<string[]>(['AI/ML', 'Healthcare']);
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [previousExperience, setPreviousExperience] = useState('');
  const [yearsExperience, setYearsExperience] = useState<ExperienceLevel>('1-2 years');
  const [preferredRole, setPreferredRole] = useState('Machine Learning Developer');
  const [availabilityHours, setAvailabilityHours] = useState(20);
  const [availabilityType, setAvailabilityType] = useState<'Weekdays' | 'Weekends' | 'Flexible' | 'Full-time Sprint'>('Flexible');
  const [workStyle, setWorkStyle] = useState<'Autonomous' | 'Collaborative' | 'Structured' | 'Fast-paced Hackathon'>('Collaborative');
  const [preferredTeamSize, setPreferredTeamSize] = useState('3-5 members');
  const [commPreference, setCommPreference] = useState<'Slack/Discord' | 'Async Docs' | 'Daily Video Calls'>('Slack/Discord');
  const [bio, setBio] = useState('');
  const [githubOrPortfolio, setGithubOrPortfolio] = useState('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setCustomInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(i => i !== interestToRemove));
  };

  const handleLoadDemoTemplate = (index: number) => {
    const t = COMPETITION_DEMO_PROFILES[index];
    if (!t) return;
    setName(t.name);
    setCollegeOrOrg(t.collegeOrOrg);
    setEmail(t.email || '');
    setSkills([...t.skills]);
    setSkillLevel(t.skillLevel);
    setInterests([...t.interests]);
    setPreviousExperience(t.previousExperience);
    setYearsExperience(t.yearsExperience);
    setPreferredRole(t.preferredRole);
    setAvailabilityHours(t.availabilityHours);
    setAvailabilityType(t.availabilityType);
    setWorkStyle(t.teamPreferences.workStyle);
    setPreferredTeamSize(t.teamPreferences.preferredTeamSize);
    setCommPreference(t.teamPreferences.communicationPreference);
    setBio(t.bio || '');
    setGithubOrPortfolio(t.githubOrPortfolio || '');
    showNotification(`Loaded template for ${t.name}. Click 'Register Profile' to save!`, 'info');
  };

  const handleEditExisting = (user: UserProfile) => {
    setEditingUserId(user.id);
    setName(user.name);
    setCollegeOrOrg(user.collegeOrOrg);
    setEmail(user.email || '');
    setSkills([...user.skills]);
    setSkillLevel(user.skillLevel);
    setInterests([...user.interests]);
    setPreviousExperience(user.previousExperience);
    setYearsExperience(user.yearsExperience);
    setPreferredRole(user.preferredRole);
    setAvailabilityHours(user.availabilityHours);
    setAvailabilityType(user.availabilityType);
    setWorkStyle(user.teamPreferences.workStyle);
    setPreferredTeamSize(user.teamPreferences.preferredTeamSize);
    setCommPreference(user.teamPreferences.communicationPreference);
    setBio(user.bio || '');
    setGithubOrPortfolio(user.githubOrPortfolio || '');
    setActiveTab('create');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!collegeOrOrg.trim()) {
      alert('Please enter your college or organization');
      return;
    }
    if (skills.length === 0) {
      alert('Please add at least one skill');
      return;
    }

    const profileData = {
      name: name.trim(),
      collegeOrOrg: collegeOrOrg.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.') || 'user'}@domain.edu`,
      skills,
      skillLevel,
      interests,
      previousExperience: previousExperience.trim() || 'Active project contributor with relevant software engineering and collaboration experience.',
      yearsExperience,
      preferredRole,
      secondaryRoles: [],
      availabilityHours: Number(availabilityHours),
      availabilityType,
      teamPreferences: {
        workStyle,
        preferredTeamSize,
        communicationPreference: commPreference
      },
      bio: bio.trim() || `${preferredRole} passionate about building scalable solutions.`,
      githubOrPortfolio: githubOrPortfolio.trim()
    };

    if (editingUserId) {
      const existingUser = registeredUsers.find(u => u.id === editingUserId);
      if (existingUser) {
        onUpdateProfile({
          ...existingUser,
          ...profileData,
          isRegistered: true
        });
        showNotification(`Profile for ${name} updated successfully!`);
        setEditingUserId(null);
      }
    } else {
      const created = onSaveProfile(profileData);
      setCurrentUserId(created.id);
      showNotification(`Profile for ${name} created and registered in database!`);
    }

    setActiveTab('directory');
  };

  const handleResetForm = () => {
    setEditingUserId(null);
    setName('');
    setCollegeOrOrg('');
    setEmail('');
    setSkills(['React', 'TypeScript']);
    setInterests(['AI/ML']);
    setPreviousExperience('');
    setBio('');
    setGithubOrPortfolio('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-indigo-500">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {editingUserId ? 'Edit Profile' : 'Create & Register Profile'}
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Register your technical credentials, domain interests, and availability into the active matching pool.
          </p>
        </div>

        {/* Tab switcher: Form vs Registered Directory */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            id="tab-profile-form"
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {editingUserId ? 'Edit Form' : '+ New Profile'}
          </button>
          <button
            id="tab-profile-directory"
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Registered Directory</span>
            <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 text-[11px] rounded-full border border-indigo-200 font-bold">
              {registeredUsers.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            
            {/* Quick Demo Templates Picker */}
            <div className="mb-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Quick Load Competition Template (1-Click Fill)
                </span>
                <span className="text-[11px] text-indigo-700">Loads sample credentials</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COMPETITION_DEMO_PROFILES.map((demo, idx) => (
                  <button
                    key={demo.name}
                    type="button"
                    onClick={() => handleLoadDemoTemplate(idx)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200 transition-all flex items-center gap-1 font-medium shadow-xs"
                  >
                    <span>{demo.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-indigo-500">({demo.preferredRole.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="input-profile-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    College / Organization *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="input-profile-college"
                      type="text"
                      required
                      placeholder="e.g. Stanford University / Tech Club"
                      value={collegeOrOrg}
                      onChange={(e) => setCollegeOrOrg(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Portfolio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Email / Discord
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    GitHub / Portfolio Link
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="github.com/username"
                      value={githubOrPortfolio}
                      onChange={(e) => setGithubOrPortfolio(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Preferred Role & Skill Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Role *
                  </label>
                  <select
                    id="select-profile-role"
                    value={preferredRole}
                    onChange={(e) => setPreferredRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {COMMON_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Overall Skill Proficiency Level *
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSkillLevel(level)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          skillLevel === level
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Skills Selection & Tags */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Skills * (30% Match Weight)
                  </label>
                  <span className="text-xs text-slate-500">{skills.length} selected</span>
                </div>

                {/* Selected Skills Badges */}
                <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[40px] p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {skills.map(s => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-xs text-slate-400 italic p-1">No skills added yet. Select from presets below or type custom.</span>
                  )}
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2 mb-2.5">
                  <input
                    type="text"
                    placeholder="Type custom skill (e.g. PyTorch, Kubernetes) and press Add..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(customSkillInput);
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(customSkillInput)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-500 self-center mr-1">Suggestions:</span>
                  {COMMON_SKILLS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="px-2 py-0.5 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Domain Interests */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Domain Interests (10% Match Weight)
                  </label>
                  <span className="text-xs text-slate-500">{interests.length} selected</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[38px] p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {interests.map(i => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200"
                    >
                      {i}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(i)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {COMMON_INTERESTS.filter(i => !interests.includes(i)).map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddInterest(i)}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 border border-slate-200 hover:border-purple-300 transition-colors"
                    >
                      + {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Experience Summary & Years */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Years of Experience *
                  </label>
                  <select
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value as ExperienceLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="0-1 year">0-1 year (Emerging)</option>
                    <option value="1-2 years">1-2 years (Junior/Mid)</option>
                    <option value="2-4 years">2-4 years (Experienced)</option>
                    <option value="4+ years">4+ years (Senior / Lead)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Previous Projects / Hackathon Experience
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe 1-2 past projects, hackathons won, or technical highlights..."
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* 6. Availability & Work Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Availability ({availabilityHours} hrs/week)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={availabilityHours}
                    onChange={(e) => setAvailabilityHours(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>5h/wk</span>
                    <span>20h/wk</span>
                    <span>40h/wk</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Schedule Type
                  </label>
                  <select
                    value={availabilityType}
                    onChange={(e) => setAvailabilityType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Flexible">Flexible (Anytime)</option>
                    <option value="Weekdays">Weekdays Focused</option>
                    <option value="Weekends">Weekends Only</option>
                    <option value="Full-time Sprint">Full-time Sprint (Hackathons)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Style
                  </label>
                  <select
                    value={workStyle}
                    onChange={(e) => setWorkStyle(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Collaborative">Collaborative & Paired</option>
                    <option value="Autonomous">Autonomous & Independent</option>
                    <option value="Structured">Structured with Milestones</option>
                    <option value="Fast-paced Hackathon">Fast-paced Hackathon Sprint</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Clear Form
                </button>

                <div className="flex gap-3">
                  {editingUserId && (
                    <button
                      type="button"
                      onClick={() => setEditingUserId(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    id="btn-submit-profile"
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-100 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingUserId ? 'Save Changes' : 'Register Profile in Database'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Right Sidebar: Profile Preview & Live DB Status */}
          <div className="space-y-6">
            
            {/* Live Profile Card Preview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-4 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Live Candidate Card Preview
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-lg flex items-center justify-center">
                  {name.trim() ? name.trim().charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {name.trim() || 'Your Name Here'}
                  </h3>
                  <p className="text-xs text-indigo-600 font-medium">
                    {preferredRole}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {collegeOrOrg.trim() || 'Your College / Org'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs border-t border-slate-200 pt-3">
                <div>
                  <span className="text-slate-500 block mb-1 text-[11px]">Core Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.slice(0, 5).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]">
                        {s}
                      </span>
                    ))}
                    {skills.length > 5 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                        +{skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Level & Exp</span>
                    <span className="font-semibold text-slate-800">{skillLevel} • {yearsExperience}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Availability</span>
                    <span className="font-semibold text-emerald-600">{availabilityHours}h/wk ({availabilityType})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ready for AI Matcher
                </span>
                <span>{workStyle}</span>
              </div>
            </div>

            {/* Quick action to match */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Done Creating Profiles?
              </h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Test the AI matching system on your registered team and compare 3 generated squads!
              </p>
              <button
                id="btn-goto-matching-from-profile"
                onClick={onNavigateToMatching}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Go to AI Team Matching
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Registered Directory Tab */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Registered Platform Database Members ({registeredUsers.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Strict database mode: Only these authenticated profiles participate in team matching.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingUserId(null);
                setActiveTab('create');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Another User
            </button>
          </div>

          {registeredUsers.length === 0 ? (
            <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl">
              <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No matching users found.</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto mb-6">
                The database is currently empty. Register your first user profile above or load the competition test squad.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                + Register First User Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registeredUsers.map(user => {
                const isSelected = currentUserId === user.id;
                return (
                  <div 
                    key={user.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/40 border-indigo-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                            {isSelected && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-indigo-600">{user.preferredRole}</p>
                          <p className="text-[11px] text-slate-400">{user.collegeOrOrg}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditExisting(user)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Edit Profile"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProfile(user.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                      <div className="flex flex-wrap gap-1">
                        {user.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] border border-slate-200 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                        <span>{user.skillLevel} • {user.yearsExperience}</span>
                        <span className="text-emerald-600 font-medium">{user.availabilityHours}h/wk</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setCurrentUserId(user.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ Current Active' : 'Select Active'}
                      </button>

                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {user.id.slice(0, 10)}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
