import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  Flame, 
  AlertTriangle, 
  Users, 
  CheckSquare, 
  BarChart3, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
  Target,
  Edit2
} from 'lucide-react';
import { Project, UserProfile, TeamScenario, FormedTeamState, TaskItem, MeetingItem } from '../types';
import { getFormedTeams, saveFormedTeam } from '../data/storage';
import { generateTeamScenarios, detectSkillGaps } from '../utils/matchingEngine';

interface TeamDashboardViewProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  registeredUsers: UserProfile[];
  onNavigateToMatching: () => void;
  onNavigateToSkillGap: () => void;
  onNavigateToCreateProfile: () => void;
}

export const TeamDashboardView: React.FC<TeamDashboardViewProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  registeredUsers,
  onNavigateToMatching,
  onNavigateToSkillGap,
  onNavigateToCreateProfile
}) => {
  const currentProject = selectedProject || (projects.length > 0 ? projects[0] : null);

  const [formedTeams, setFormedTeams] = useState<Record<string, FormedTeamState>>(() => getFormedTeams());
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'meetings' | 'advisor'>('overview');

  // Task creation states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Meeting creation states
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('Today, 4:00 PM');
  const [newMeetingType, setNewMeetingType] = useState<'Sprint Planning' | 'Daily Standup' | 'Design Review' | 'Tech Sync' | 'Hackathon Checkpoint'>('Daily Standup');
  const [newMeetingAgenda, setNewMeetingAgenda] = useState('');
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);

  // AI Advisor states
  const [aiInsights, setAiInsights] = useState<{ summary?: string; strengths?: string[]; advice?: string[] } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Initialize formed team for active project if not existing
  const currentFormedTeam = currentProject ? formedTeams[currentProject.id] : null;

  // Generate fallback scenario if not locked yet
  const scenarios = currentProject ? generateTeamScenarios(registeredUsers, currentProject) : [];
  const defaultScenario = scenarios.length > 0 ? scenarios[0] : null;

  const activeScenario: TeamScenario | null = currentFormedTeam ? currentFormedTeam.teamScenario : defaultScenario;

  const currentMembers = activeScenario ? activeScenario.members.map(m => m.user) : [];
  const gapAnalysis = currentProject ? detectSkillGaps(currentMembers, currentProject, registeredUsers) : null;

  // Tasks and meetings
  const tasks: TaskItem[] = currentFormedTeam?.tasks || [
    {
      id: 'task_1',
      title: 'Define Project Architecture & Tech Stack Lock',
      assigneeName: activeScenario?.members[0]?.user.name || 'Team Lead',
      status: 'Done',
      priority: 'High'
    },
    {
      id: 'task_2',
      title: 'Build UI Component Design System in Figma/Tailwind',
      assigneeName: activeScenario?.members[1]?.user.name || 'UI/UX Designer',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: 'task_3',
      title: 'Implement Core Data Models & API Endpoints',
      assigneeName: activeScenario?.members[0]?.user.name || 'ML / Backend Lead',
      status: 'In Progress',
      priority: 'Urgent'
    },
    {
      id: 'task_4',
      title: 'Clinical / Domain Validation Protocols Audit',
      assigneeName: activeScenario?.members[2]?.user.name || 'Domain Expert',
      status: 'Todo',
      priority: 'Medium'
    }
  ];

  const meetings: MeetingItem[] = currentFormedTeam?.meetings || [
    {
      id: 'meet_1',
      title: 'Sprint Kickoff & Role Ownership Sync',
      date: 'Aug 25, 2026',
      time: '10:00 AM EDT',
      type: 'Sprint Planning',
      agenda: 'Align on MVP deliverables, GitHub repo branching, and 48h milestone timeline.'
    },
    {
      id: 'meet_2',
      title: 'Daily Standup & Blocker Triage',
      date: 'Aug 26, 2026',
      time: '04:30 PM EDT',
      type: 'Daily Standup',
      agenda: 'Review completed tasks, discuss API integration blockers, and assign UI handoff.'
    }
  ];

  const progressPercent = currentFormedTeam?.progressPercent || 45;

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'Todo' | 'In Progress' | 'Review' | 'Done') => {
    if (!currentProject || !activeScenario) return;
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    
    const doneCount = updatedTasks.filter(t => t.status === 'Done').length;
    const newProgress = Math.round((doneCount / Math.max(1, updatedTasks.length)) * 100);

    const newState: FormedTeamState = {
      projectId: currentProject.id,
      project: currentProject,
      teamScenario: activeScenario,
      tasks: updatedTasks,
      meetings,
      progressPercent: newProgress,
      formedAt: currentFormedTeam?.formedAt || new Date().toISOString()
    };
    saveFormedTeam(newState);
    setFormedTeams({ ...formedTeams, [currentProject.id]: newState });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentProject || !activeScenario) return;
    const newTask: TaskItem = {
      id: 'task_' + Math.random().toString(36).substring(2, 7),
      title: newTaskTitle.trim(),
      assigneeName: newTaskAssignee || activeScenario.members[0]?.user.name || 'Unassigned',
      status: 'Todo',
      priority: newTaskPriority
    };
    const updated = [...tasks, newTask];
    const newState: FormedTeamState = {
      projectId: currentProject.id,
      project: currentProject,
      teamScenario: activeScenario,
      tasks: updated,
      meetings,
      progressPercent,
      formedAt: currentFormedTeam?.formedAt || new Date().toISOString()
    };
    saveFormedTeam(newState);
    setFormedTeams({ ...formedTeams, [currentProject.id]: newState });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle.trim() || !currentProject || !activeScenario) return;
    const newMeeting: MeetingItem = {
      id: 'meet_' + Math.random().toString(36).substring(2, 7),
      title: newMeetingTitle.trim(),
      date: newMeetingDate,
      time: '3:00 PM',
      type: newMeetingType,
      agenda: newMeetingAgenda.trim() || 'Team sync on project deliverables.'
    };
    const updated = [...meetings, newMeeting];
    const newState: FormedTeamState = {
      projectId: currentProject.id,
      project: currentProject,
      teamScenario: activeScenario,
      tasks,
      meetings: updated,
      progressPercent,
      formedAt: currentFormedTeam?.formedAt || new Date().toISOString()
    };
    saveFormedTeam(newState);
    setFormedTeams({ ...formedTeams, [currentProject.id]: newState });
    setNewMeetingTitle('');
    setNewMeetingAgenda('');
    setIsAddingMeeting(false);
  };

  const fetchAiTeamAdvice = async () => {
    if (!currentProject || !activeScenario) return;
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/match-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: currentProject,
          team: activeScenario.members.map(m => ({
            name: m.user.name,
            role: m.assignedRole,
            skillLevel: m.user.skillLevel,
            availability: m.user.availabilityHours,
            skills: m.user.skills,
            interests: m.user.interests
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiInsights({
          summary: data.executiveSummary || data.analysis,
          strengths: data.strengths || [],
          advice: data.tacticalAdvice || data.recommendations || []
        });
      }
    } catch (e) {
      console.log('AI Advisor offline fallback:', e);
      setAiInsights({
        summary: 'AI multi-factor engine confirms this squad possesses complementary roles across ML modeling, clinical validation, and product design.',
        strengths: ['Balanced engineering-to-design ratio', 'Strong weekly availability sync', 'High domain enthusiasm'],
        advice: ['Set up shared GitHub repo with branch protections', 'Schedule daily 15-min async standups', 'Lock API contracts early']
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'advisor' && !aiInsights) {
      fetchAiTeamAdvice();
    }
  }, [activeTab]);

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        No project available.
      </div>
    );
  }

  if (!activeScenario || activeScenario.members.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No Team Formed Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Run the AI Matcher or select a team combination from the registered candidate pool.
          </p>
          <button
            onClick={onNavigateToMatching}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100"
          >
            Launch AI Team Matcher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner with Project Name & Synergy Gauge */}
      <div className="bg-[#1e1b4b] rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-indigo-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                currentProject.isHackathon
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                {currentProject.isHackathon ? '⚡ Hackathon Sprint Workspace' : 'Active Project Workspace'}
              </span>
              <span className="text-xs text-indigo-200">Duration: {currentProject.duration}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentProject.name}
            </h1>
            <p className="text-indigo-200/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {currentProject.description}
            </p>
          </div>

          {/* Synergy & Progress Card */}
          <div className="flex items-center gap-4 bg-white/10 p-3.5 sm:p-4 rounded-xl border border-white/10 self-start lg:self-auto">
            <div className="text-center">
              <span className="text-2xl font-black text-indigo-300 font-mono">
                {activeScenario.overallScore}%
              </span>
              <span className="text-[10px] text-indigo-200 uppercase font-bold block">
                Synergy Score
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-2xl font-black text-emerald-300 font-mono">
                {progressPercent}%
              </span>
              <span className="text-[10px] text-indigo-200 uppercase font-bold block">
                Milestones
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Sub-Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-1">
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-white text-indigo-950 shadow-xs' : 'text-indigo-200 hover:text-white'
              }`}
            >
              Overview & Roster
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'tasks' ? 'bg-white text-indigo-950 shadow-xs' : 'text-indigo-200 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Tasks Board ({tasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('meetings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'meetings' ? 'bg-white text-indigo-950 shadow-xs' : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sync Meetings ({meetings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'advisor' ? 'bg-white text-indigo-950 shadow-xs' : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Advisor</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToSkillGap}
              className="text-xs text-amber-200 hover:text-amber-100 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Check Skill Gaps</span>
            </button>
          </div>
        </div>

      </div>

      {/* Tab 1: Overview & Roster */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Missing Skills Alert Banner if any */}
          {gapAnalysis && gapAnalysis.missingSkills.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Skill Gap Alert:</strong> Your squad lacks {gapAnalysis.missingSkills.join(' & ')}.
                </span>
              </div>
              <button
                onClick={onNavigateToSkillGap}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 rounded-lg font-semibold whitespace-nowrap self-start sm:self-auto"
              >
                Find Registered Teammates →
              </button>
            </div>
          )}

          {/* Team Members Roster */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Deployed Squad Roster ({activeScenario.members.length} Members)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Designated ownership and verified qualifications.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeScenario.members.map(member => (
                <div 
                  key={member.userId}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
                        {member.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{member.user.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {member.overallScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-indigo-600 font-semibold">{member.assignedRole}</p>
                        <p className="text-[11px] text-slate-400">{member.user.collegeOrOrg}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-800 font-semibold block text-[11px] mb-0.5">Role Focus:</span>
                    {member.selectionReason}
                  </div>

                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {member.matchedSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                        ✓ {s}
                      </span>
                    ))}
                    {member.user.skills.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                    <span>{member.user.skillLevel} • {member.user.yearsExperience}</span>
                    <span className="text-emerald-600 font-semibold">{member.user.availabilityHours}h/wk ({member.user.availabilityType})</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Skill Coverage</div>
              <div className="text-2xl font-bold text-indigo-600">{activeScenario.metrics.skillCoverage}%</div>
              <p className="text-[11px] text-slate-500 mt-1">Direct match to required tech stack</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Weekly Bandwidth</div>
              <div className="text-2xl font-bold text-emerald-600">
                {activeScenario.members.reduce((a, m) => a + m.user.availabilityHours, 0)} hrs/wk
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Combined sprint commitment</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Role Coverage</div>
              <div className="text-2xl font-bold text-purple-600">{activeScenario.metrics.roleCoverage}%</div>
              <p className="text-[11px] text-slate-500 mt-1">Engineering, product, & design ownership</p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Interactive Tasks Board (Kanban) */}
      {activeTab === 'tasks' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                Sprint Tasks & Deliverables Board
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track task progress, assignees, and urgent blockers.
              </p>
            </div>

            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          {/* Add Task Form Modal / Box */}
          {isAddingTask && (
            <form onSubmit={handleAddTask} className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Create New Sprint Task</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Task title (e.g. Implement FastAPI symptom intake endpoints)..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Assign Teammate...</option>
                    {activeScenario.members.map(m => (
                      <option key={m.userId} value={m.user.name}>{m.user.name} ({m.assignedRole})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Priority:</span>
                  {(['Low', 'Medium', 'High', 'Urgent'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        newTaskPriority === p
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs"
                  >
                    Save Task
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['Todo', 'In Progress', 'Review', 'Done'] as const).map(columnStatus => {
              const colTasks = tasks.filter(t => t.status === columnStatus);
              return (
                <div key={columnStatus} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col min-h-[320px]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {columnStatus}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {colTasks.map(task => (
                      <div key={task.id} className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-slate-900 leading-snug">{task.title}</h5>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            task.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            task.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="text-indigo-600 font-medium">{task.assigneeName}</span>
                          <div className="flex gap-1">
                            {columnStatus !== 'Done' && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'Done')}
                                className="text-[10px] text-emerald-600 hover:underline font-semibold"
                              >
                                ✓ Done
                              </button>
                            )}
                            {columnStatus === 'Todo' && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'In Progress')}
                                className="text-[10px] text-indigo-600 hover:underline font-semibold"
                              >
                                → Start
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {colTasks.length === 0 && (
                      <div className="h-20 flex items-center justify-center text-slate-400 text-xs italic">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Tab 3: Meeting Schedule */}
      {activeTab === 'meetings' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Team Sync & Sprint Meetings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Coordinated sprint reviews, standups, and demo sessions.
              </p>
            </div>

            <button
              onClick={() => setIsAddingMeeting(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Schedule Meeting
            </button>
          </div>

          {isAddingMeeting && (
            <form onSubmit={handleAddMeeting} className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Schedule Sprint Sync</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Meeting Title (e.g. Daily Standup)..."
                    value={newMeetingTitle}
                    onChange={(e) => setNewMeetingTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Date & Time (e.g. Tomorrow, 3:00 PM)..."
                    value={newMeetingDate}
                    onChange={(e) => setNewMeetingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={newMeetingType}
                    onChange={(e) => setNewMeetingType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Daily Standup">Daily Standup</option>
                    <option value="Sprint Planning">Sprint Planning</option>
                    <option value="Tech Sync">Tech Sync</option>
                    <option value="Design Review">Design Review</option>
                    <option value="Hackathon Checkpoint">Hackathon Checkpoint</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Agenda & key discussion points..."
                  value={newMeetingAgenda}
                  onChange={(e) => setNewMeetingAgenda(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMeeting(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3.5">
            {meetings.map(meeting => (
              <div key={meeting.id} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                      {meeting.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{meeting.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    {meeting.agenda}
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{meeting.date} ({meeting.time})</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Google Meet / Discord Voice</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab 4: AI Advisor */}
      {activeTab === 'advisor' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI Team Dynamic & Execution Insights
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated by Google GenAI model for maximum collaboration velocity.
              </p>
            </div>

            <button
              onClick={fetchAiTeamAdvice}
              disabled={isLoadingAi}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Zap className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>{isLoadingAi ? 'Synthesizing...' : 'Regenerate Analysis'}</span>
            </button>
          </div>

          {isLoadingAi ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              <span>Generating real-time squad synergy recommendations...</span>
            </div>
          ) : (
            <div className="space-y-5">
              {aiInsights?.summary && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                  <strong className="text-indigo-900 block mb-1">Executive Synergy Verdict:</strong>
                  {aiInsights.summary}
                </div>
              )}

              {aiInsights?.strengths && aiInsights.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Squad Core Strengths:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {aiInsights.strengths.map((str, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <span className="text-emerald-600 font-bold block mb-1">✓ Strength {idx + 1}</span>
                        {str}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiInsights?.advice && aiInsights.advice.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Sprint Tactical Recommendations:
                  </h4>
                  <div className="space-y-2">
                    {aiInsights.advice.map((rec, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
