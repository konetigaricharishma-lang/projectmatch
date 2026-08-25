import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Flame, 
  Clock, 
  Users, 
  Layers, 
  Target, 
  Check, 
  Plus, 
  X, 
  Briefcase, 
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Project, ProjectType } from '../types';
import { SAMPLE_HEALTHCARE_PROJECT, SAMPLE_HACKATHON_PROJECT } from '../data/storage';

interface CreateProjectViewProps {
  onSaveProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'status'>) => Project;
  onNavigateToMatching: (project: Project) => void;
}

const COMMON_SKILLS = [
  'Machine Learning', 'Python', 'UI/UX', 'Healthcare knowledge', 'Business & Marketing',
  'Cloud Developer', 'Cloud Deployment', 'React', 'Node.js', 'PyTorch', 'AWS', 'Docker',
  'FastAPI', 'Figma', 'Clinical Validation', 'Financial Modeling', 'PostgreSQL'
];

const COMMON_ROLES = [
  'Machine Learning Developer',
  'UI/UX Designer',
  'Healthcare Domain Expert',
  'Business & Marketing',
  'Cloud Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Lead',
  'Product Manager',
  'DevOps Architect'
];

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({
  onSaveProject,
  onNavigateToMatching
}) => {
  const [projectType, setProjectType] = useState<ProjectType>('standard');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Healthcare & AI');
  const [requiredTeamSize, setRequiredTeamSize] = useState(4);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'Machine Learning', 'UI/UX', 'Healthcare knowledge', 'Business & Marketing'
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [requiredRoles, setRequiredRoles] = useState<string[]>([
    'Machine Learning Developer', 'UI/UX Designer', 'Healthcare Domain Expert', 'Business & Marketing'
  ]);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [experienceRequirement, setExperienceRequirement] = useState<'Any' | 'Intermediate+' | 'Experienced'>('Intermediate+');
  const [duration, setDuration] = useState('1 Month Sprint');
  const [availabilityRequirement, setAvailabilityRequirement] = useState(15);

  // Hackathon Specific states
  const [hackathonName, setHackathonName] = useState('HackMIT 2026 AI Innovation Cup');
  const [hackathonTheme, setHackathonTheme] = useState('AI for Healthcare & Emergency Triage');
  const [hackathonDeadline, setHackathonDeadline] = useState('24 Hours');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
  };

  const handleAddRole = (role: string) => {
    const trimmed = role.trim();
    if (trimmed && !requiredRoles.includes(trimmed)) {
      setRequiredRoles([...requiredRoles, trimmed]);
      setCustomRoleInput('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRequiredRoles(requiredRoles.filter(r => r !== roleToRemove));
  };

  const handleLoadSampleHealthcare = () => {
    setProjectType('standard');
    setName(SAMPLE_HEALTHCARE_PROJECT.name);
    setDescription(SAMPLE_HEALTHCARE_PROJECT.description);
    setCategory(SAMPLE_HEALTHCARE_PROJECT.category);
    setRequiredTeamSize(SAMPLE_HEALTHCARE_PROJECT.requiredTeamSize);
    setRequiredSkills([...SAMPLE_HEALTHCARE_PROJECT.requiredSkills]);
    setRequiredRoles([...SAMPLE_HEALTHCARE_PROJECT.requiredRoles]);
    setExperienceRequirement(SAMPLE_HEALTHCARE_PROJECT.experienceRequirement);
    setDuration(SAMPLE_HEALTHCARE_PROJECT.duration);
    setAvailabilityRequirement(SAMPLE_HEALTHCARE_PROJECT.availabilityRequirement);
  };

  const handleLoadSampleHackathon = () => {
    setProjectType('hackathon');
    setName(SAMPLE_HACKATHON_PROJECT.name);
    setDescription(SAMPLE_HACKATHON_PROJECT.description);
    setCategory(SAMPLE_HACKATHON_PROJECT.category);
    setRequiredTeamSize(SAMPLE_HACKATHON_PROJECT.requiredTeamSize);
    setRequiredSkills([...SAMPLE_HACKATHON_PROJECT.requiredSkills]);
    setRequiredRoles([...SAMPLE_HACKATHON_PROJECT.requiredRoles]);
    setExperienceRequirement(SAMPLE_HACKATHON_PROJECT.experienceRequirement);
    setDuration('24h Hackathon');
    setAvailabilityRequirement(20);
    setHackathonName(SAMPLE_HACKATHON_PROJECT.hackathonName || 'HackMIT 2026 AI Innovation Cup');
    setHackathonTheme(SAMPLE_HACKATHON_PROJECT.hackathonTheme || 'AI for Healthcare & Emergency Response');
    setHackathonDeadline('24 Hours');
  };

  const handleAiBrainstormHackathon = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/hackathon-architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hackathonName,
          theme: hackathonTheme,
          idea: description || name
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.refinedIdea && !description) {
          setDescription(data.refinedIdea);
        }
        if (data.suggestedRoles && data.suggestedRoles.length > 0) {
          setRequiredRoles(Array.from(new Set([...requiredRoles, ...data.suggestedRoles])));
        }
        if (data.recommendedSkills && data.recommendedSkills.length > 0) {
          setRequiredSkills(Array.from(new Set([...requiredSkills, ...data.recommendedSkills])));
        }
      }
    } catch (e) {
      console.log('AI Hackathon suggestion fallback used:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a project or hackathon name');
      return;
    }
    if (requiredSkills.length === 0) {
      alert('Please add at least one required skill');
      return;
    }
    if (requiredRoles.length === 0) {
      alert('Please specify at least one required role');
      return;
    }

    const newProjectData: Omit<Project, 'id' | 'createdAt' | 'status'> = {
      name: name.trim(),
      description: description.trim() || `${name} project aiming to deliver innovative software solutions.`,
      category,
      projectType,
      requiredTeamSize: Number(requiredTeamSize),
      requiredSkills,
      requiredRoles,
      experienceRequirement,
      duration: projectType === 'hackathon' ? `${hackathonDeadline} Hackathon` : duration,
      availabilityRequirement: Number(availabilityRequirement),
      isHackathon: projectType === 'hackathon',
      hackathonName: projectType === 'hackathon' ? hackathonName.trim() : undefined,
      hackathonTheme: projectType === 'hackathon' ? hackathonTheme.trim() : undefined,
      hackathonDeadline: projectType === 'hackathon' ? hackathonDeadline : undefined,
      createdBy: 'You'
    };

    const saved = onSaveProject(newProjectData);
    onNavigateToMatching(saved);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Quick Presets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {projectType === 'hackathon' ? 'Create Hackathon Sprint' : 'Create New Project'}
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Specify requirements and let our AI engine formulate the ideal squad from registered candidates.
          </p>
        </div>

        {/* Quick Sample Project Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSampleHealthcare}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load "AI Healthcare Assistant"</span>
          </button>
          <button
            type="button"
            onClick={handleLoadSampleHackathon}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Load "Hackathon Sprint"</span>
          </button>
        </div>
      </div>

      {/* Mode Selection Tabs (Standard vs Hackathon) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          id="btn-mode-standard"
          onClick={() => {
            setProjectType('standard');
            setDuration('1 Month Sprint');
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 shadow-xs ${
            projectType === 'standard'
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-100'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${projectType === 'standard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Standard Project Mode</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Semester projects, startups, research papers, and open-source initiatives.
            </p>
          </div>
        </button>

        <button
          type="button"
          id="btn-mode-hackathon"
          onClick={() => {
            setProjectType('hackathon');
            setDuration('24h Hackathon');
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 shadow-xs ${
            projectType === 'hackathon'
              ? 'bg-white border-amber-500 ring-2 ring-amber-100'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${projectType === 'hackathon' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Dedicated Hackathon Mode</h3>
              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                FAST SPRINT
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-intensity 24h/48h sprints, hackathon tracks, and rapid role matching.
            </p>
          </div>
        </button>
      </div>

      {/* Main Project Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        
        {/* Hackathon Specific Section */}
        {projectType === 'hackathon' && (
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Hackathon Sprint Details</span>
              </div>
              <button
                type="button"
                onClick={handleAiBrainstormHackathon}
                disabled={isAiGenerating}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>{isAiGenerating ? 'Analyzing Theme...' : 'AI Role & Skill Architect'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hackathon Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HackMIT 2026, Smart India Hackathon"
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Idea / Track Theme *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI for Emergency Health Triage"
                  value={hackathonTheme}
                  onChange={(e) => setHackathonTheme(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sprint Duration / Deadline
                </label>
                <select
                  value={hackathonDeadline}
                  onChange={(e) => setHackathonDeadline(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="24 Hours">24 Hours Blitz</option>
                  <option value="36 Hours">36 Hours Sprint</option>
                  <option value="48 Hours">48 Hours Classic</option>
                  <option value="1 Week">1 Week Virtual Hackathon</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 1. Project Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Name *
            </label>
            <input
              id="input-project-name"
              type="text"
              required
              placeholder="e.g. AI Healthcare Assistant"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category / Domain *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="Healthcare & AI">Healthcare & AI</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="FinTech & Web3">FinTech & Web3</option>
              <option value="Sustainability & Climate">Sustainability & Climate</option>
              <option value="EdTech & Learning">EdTech & Learning</option>
              <option value="Developer Tools & Cloud">Developer Tools & Cloud</option>
              <option value="Open Innovation">Open Innovation</option>
            </select>
          </div>
        </div>

        {/* 2. Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Project Description & Mission *
          </label>
          <textarea
            id="textarea-project-desc"
            rows={3}
            required
            placeholder="Explain the problem statement, target deliverables, and what the team will build..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        {/* 3. Team Size & Experience Requirement */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Team Size ({requiredTeamSize} Members)
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={requiredTeamSize}
              onChange={(e) => setRequiredTeamSize(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Experience Requirement
            </label>
            <select
              value={experienceRequirement}
              onChange={(e) => setExperienceRequirement(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="Any">Any (Beginners & Experts)</option>
              <option value="Intermediate+">Intermediate+ Preferred</option>
              <option value="Experienced">Experienced Specialists Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Min. Availability Required
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="40"
                value={availabilityRequirement}
                onChange={(e) => setAvailabilityRequirement(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">hrs/week</span>
            </div>
          </div>
        </div>

        {/* 4. Required Skills (30% Match Weight) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Required Technical & Domain Skills * (30% Engine Weight)
            </label>
            <span className="text-xs text-indigo-600 font-semibold">{requiredSkills.length} selected</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[42px] p-2 bg-slate-50 rounded-xl border border-slate-200">
            {requiredSkills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              placeholder="Add specific required skill (e.g. Machine Learning, UI/UX, Healthcare knowledge, Cloud Deployment)..."
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-slate-500 self-center mr-1">Recommended:</span>
            {COMMON_SKILLS.filter(s => !requiredSkills.includes(s)).slice(0, 10).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handleAddSkill(s)}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Required Roles (10% Match Weight) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Required Roles to Fill *
            </label>
            <span className="text-xs text-purple-600 font-semibold">{requiredRoles.length} selected</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[42px] p-2 bg-slate-50 rounded-xl border border-slate-200">
            {requiredRoles.map(role => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role)}
                  className="hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COMMON_ROLES.filter(r => !requiredRoles.includes(r)).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => handleAddRole(r)}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 border border-slate-200 hover:border-purple-300"
              >
                + {r}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            All registered database members will be evaluated against these {requiredSkills.length} skills & {requiredRoles.length} roles.
          </div>

          <button
            id="btn-create-project-submit"
            type="submit"
            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Create & Launch AI Matcher</span>
          </button>
        </div>

      </form>
    </div>
  );
};
