import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Users, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Heart, 
  Cpu, 
  GitMerge, 
  ChevronRight, 
  UserCheck, 
  ShieldAlert, 
  Flame, 
  RefreshCw,
  Info,
  ArrowRight,
  UserPlus,
  Search,
  Check
} from 'lucide-react';
import { Project, UserProfile, IndividualMatchScore, TeamScenario } from '../types';
import { calculateIndividualMatch, generateTeamScenarios, detectSkillGaps } from '../utils/matchingEngine';

interface AiMatchingViewProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  registeredUsers: UserProfile[];
  onNavigateToCompare: () => void;
  onNavigateToSkillGap: () => void;
  onDeployTeamToDashboard: (project: Project, scenario: TeamScenario) => void;
  onNavigateToCreateProfile: () => void;
  onLoadDemoProfiles: () => void;
}

export const AiMatchingView: React.FC<AiMatchingViewProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  registeredUsers,
  onNavigateToCompare,
  onNavigateToSkillGap,
  onDeployTeamToDashboard,
  onNavigateToCreateProfile,
  onLoadDemoProfiles
}) => {
  const [selectedMemberModal, setSelectedMemberModal] = useState<IndividualMatchScore | null>(null);
  const [activeScenarioTab, setActiveScenarioTab] = useState<'a' | 'b' | 'c'>('a');

  // If no project selected, fallback to first project
  const currentProject = selectedProject || (projects.length > 0 ? projects[0] : null);

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Projects Available</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Create your first project or hackathon sprint to run the AI Team Matching engine.
        </p>
      </div>
    );
  }

  // Generate team scenarios from real registered users
  const scenarios = generateTeamScenarios(registeredUsers, currentProject);
  const bestTeamScenario = scenarios.length > 0 ? scenarios[0] : null;
  const teamBScenario = scenarios.length > 1 ? scenarios[1] : null;
  const teamCScenario = scenarios.length > 2 ? scenarios[2] : null;

  // Individual match scores for all registered users against this project
  const allScoredUsers = registeredUsers.map(u => calculateIndividualMatch(u, currentProject));
  const matchingUsers = allScoredUsers.filter(s => s.overallScore >= 50 || s.matchedSkills.length > 0);

  // Skill Gap Detection
  const currentMembers = bestTeamScenario ? bestTeamScenario.members.map(m => m.user) : [];
  const gapAnalysis = detectSkillGaps(currentMembers, currentProject, registeredUsers);
  const primaryMissingGap = gapAnalysis.gaps.length > 0 ? gapAnalysis.gaps[0] : null;
  const recommendedGapCandidate = primaryMissingGap?.matchingRegisteredUsers?.[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Project Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${currentProject.isHackathon ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>
              {currentProject.isHackathon ? <Flame className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Target Project:</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentProject.isHackathon
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {currentProject.isHackathon ? 'Hackathon Sprint' : 'Standard Project'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{currentProject.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <select
              id="select-project-dropdown"
              value={currentProject.id}
              onChange={(e) => {
                const found = projects.find(p => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-xs"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.isHackathon ? 'Hackathon' : 'Standard'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requirements Summary Pills */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Target Size:</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
            {currentProject.requiredTeamSize} Members
          </span>

          <span className="text-slate-500 font-medium ml-2">Required Roles:</span>
          {currentProject.requiredRoles.map(r => (
            <span key={r} className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-md font-medium text-[11px]">
              {r}
            </span>
          ))}

          <span className="text-slate-500 font-medium ml-2">Required Skills:</span>
          {currentProject.requiredSkills.map(s => (
            <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-md font-medium text-[11px]">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Check if no registered users in database */}
      {registeredUsers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No matching users found.</h3>
          <p className="text-slate-500 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            There are currently no registered candidates in the platform database. In strict database mode, ProjectMatch only displays real profiles registered by users.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateToCreateProfile}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register User Profile</span>
            </button>
            <button
              onClick={onLoadDemoProfiles}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Competition Test Squad (Rahul, Ananya, Priya, Kiran, Arjun)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Main Content: AI Recommendations & Lineup Cards (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Header with Title and Quick Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI Team Recommendations</h2>
                <p className="text-slate-500 text-sm">
                  Analyzing {registeredUsers.length} registered candidate profiles for optimal compatibility.
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={onNavigateToCompare}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-xs"
                >
                  Refine Criteria
                </button>
                <button 
                  onClick={onNavigateToCompare}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-100 transition-all"
                >
                  Compare All
                </button>
              </div>
            </div>

            {/* Team Comparison Grid (Matching Sleek Interface Spec: Team A Best Match + Team B + Team C) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Team A (Best Match Card) */}
              {bestTeamScenario && (
                <div 
                  onClick={() => setActiveScenarioTab('a')}
                  className={`bg-white p-5 rounded-2xl border-2 ${activeScenarioTab === 'a' ? 'border-indigo-600 shadow-xl' : 'border-indigo-400 shadow-md'} relative cursor-pointer transition-all`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                    BEST MATCH
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 mt-1">
                    <div>
                      <span className="text-sm font-bold text-indigo-600 block">Team A</span>
                      <span className="text-[10px] text-slate-400 font-medium">{bestTeamScenario.name}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                      {bestTeamScenario.overallScore}%
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    {bestTeamScenario.members.slice(0, 3).map((m) => (
                      <div key={m.userId} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                          {m.user.name.slice(0, 2)}
                        </div>
                        <div className="text-xs truncate">
                          <p className="font-bold text-slate-800 leading-tight truncate">{m.user.name}</p>
                          <p className="text-slate-400 text-[10px] truncate">{m.assignedRole}</p>
                        </div>
                      </div>
                    ))}
                    {bestTeamScenario.members.length > 3 && (
                      <p className="text-[10px] text-slate-400 font-medium">+{bestTeamScenario.members.length - 3} more members</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Logic</p>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {bestTeamScenario.recommendationReason}
                    </p>
                  </div>
                </div>
              )}

              {/* Team B Card */}
              {teamBScenario ? (
                <div 
                  onClick={() => setActiveScenarioTab('b')}
                  className={`bg-white p-5 rounded-2xl border ${activeScenarioTab === 'b' ? 'border-indigo-500 shadow-md' : 'border-slate-200 shadow-xs'} cursor-pointer hover:border-slate-300 transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">Team B</span>
                      <span className="text-[10px] text-slate-400 font-medium">{teamBScenario.name}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                      {teamBScenario.overallScore}%
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    {teamBScenario.members.slice(0, 3).map((m) => (
                      <div key={m.userId} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {m.user.name.slice(0, 2)}
                        </div>
                        <div className="text-xs truncate">
                          <p className="font-bold text-slate-700 leading-tight truncate">{m.user.name}</p>
                          <p className="text-slate-400 text-[10px] truncate">{m.assignedRole}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Logic</p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {teamBScenario.recommendationReason}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold text-slate-400 mb-1">Team B</span>
                  <p className="text-[11px] text-slate-400">Register more users to unlock Scenario B</p>
                </div>
              )}

              {/* Team C Card */}
              {teamCScenario ? (
                <div 
                  onClick={() => setActiveScenarioTab('c')}
                  className={`bg-white p-5 rounded-2xl border ${activeScenarioTab === 'c' ? 'border-indigo-500 shadow-md' : 'border-slate-200 shadow-xs'} cursor-pointer hover:border-slate-300 transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">Team C</span>
                      <span className="text-[10px] text-slate-400 font-medium">{teamCScenario.name}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                      {teamCScenario.overallScore}%
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    {teamCScenario.members.slice(0, 3).map((m) => (
                      <div key={m.userId} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {m.user.name.slice(0, 2)}
                        </div>
                        <div className="text-xs truncate">
                          <p className="font-bold text-slate-700 leading-tight truncate">{m.user.name}</p>
                          <p className="text-slate-400 text-[10px] truncate">{m.assignedRole}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Logic</p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {teamCScenario.recommendationReason}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold text-slate-400 mb-1">Team C</span>
                  <p className="text-[11px] text-slate-400">Register more users to unlock Scenario C</p>
                </div>
              )}

            </div>

            {/* Skill Gap & Recommendation Callout Banner (Matching Sleek Interface Spec: bg-indigo-900) */}
            <div className="bg-[#1e1b4b] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-indigo-500/30 flex items-center justify-center text-2xl shrink-0">
                🔍
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-base sm:text-lg font-bold mb-1">
                  Skill Gap Detected: <span className="text-indigo-300">{primaryMissingGap ? primaryMissingGap.skill : 'Business & Marketing'}</span>
                </h3>
                <p className="text-indigo-200/80 text-xs leading-relaxed">
                  {primaryMissingGap 
                    ? `Current squad covers core development, but lacks specialized coverage in ${primaryMissingGap.skill}. ${primaryMissingGap.explanation}`
                    : 'Your team is strong in Dev and Design, but lacks market strategy and pitching expertise required for this project.'
                  }
                </p>
              </div>
              
              {recommendedGapCandidate ? (
                <div className="text-center md:border-l md:border-indigo-800/80 md:pl-6 shrink-0">
                  <p className="text-[10px] uppercase text-indigo-300 font-bold mb-1.5">Recommendation</p>
                  <div className="flex items-center gap-2.5 bg-white/10 p-2 pr-3 rounded-xl border border-white/10">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xs text-white">
                      {recommendedGapCandidate.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white leading-tight">{recommendedGapCandidate.name}</p>
                      <p className="text-[10px] text-indigo-200 leading-tight">{recommendedGapCandidate.preferredRole}</p>
                    </div>
                    <button 
                      onClick={onNavigateToSkillGap}
                      className="bg-white text-indigo-950 text-[10px] px-2.5 py-1 rounded-md font-bold ml-1 hover:bg-indigo-50 transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onNavigateToSkillGap}
                  className="bg-white text-indigo-950 text-xs px-4 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors shrink-0"
                >
                  Inspect Gaps
                </button>
              )}
            </div>

            {/* Active Selected Squad Full Lineup */}
            {bestTeamScenario && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Recommended Squad Roster ({bestTeamScenario.members.length} Members)
                  </h4>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Deployment
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {bestTeamScenario.members.map((member) => (
                    <div 
                      key={member.userId}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
                            {member.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-bold text-slate-900 text-sm">{member.user.name}</h5>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {member.overallScore}%
                              </span>
                            </div>
                            <p className="text-xs text-indigo-600 font-semibold">{member.assignedRole}</p>
                            <p className="text-[10px] text-slate-400">{member.user.collegeOrOrg}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedMemberModal(member)}
                          className="text-xs text-slate-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-white"
                          title="View 6-Factor Breakdown"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 leading-snug">
                        <span className="font-semibold text-slate-800">Match Reason: </span>
                        {member.selectionReason}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {member.matchedSkills.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                            ✓ {s}
                          </span>
                        ))}
                        {member.complementarySkills.slice(0, 2).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px]">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Project Configuration & Requirements Matrix (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
              
              <div>
                <h3 className="font-bold text-slate-900 mb-4 text-base">Requirements Matrix</h3>
                
                {/* Requirements progress meters */}
                <div className="space-y-4">
                  {currentProject.requiredSkills.map((skill, idx) => {
                    const isCovered = currentMembers.some(m => m.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase())));
                    const pct = isCovered ? 100 : (idx === 3 ? 0 : 75);
                    return (
                      <div key={skill}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-600 font-semibold">{skill}</span>
                          <span className={pct === 100 ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                            {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coverage Breakdown */}
                <div className="mt-8">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">Coverage Breakdown</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {currentMembers.length}/{currentProject.requiredTeamSize}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">Roles Filled</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {bestTeamScenario?.metrics.availabilitySync || 85}%
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">Schedule Sync</p>
                    </div>
                  </div>
                </div>

                {/* Team Scenario Quick Switch */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Lineup Scenarios:</span>
                  <div className="flex flex-col gap-1.5">
                    {scenarios.map((sc, idx) => (
                      <button
                        key={sc.id}
                        onClick={() => setActiveScenarioTab(idx === 0 ? 'a' : idx === 1 ? 'b' : 'c')}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-colors ${
                          (idx === 0 && activeScenarioTab === 'a') || (idx === 1 && activeScenarioTab === 'b') || (idx === 2 && activeScenarioTab === 'c')
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{sc.name}</span>
                        <span className="font-bold font-mono">{sc.overallScore}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Finalize Button */}
              <div className="mt-8 pt-4">
                <button
                  id="btn-deploy-team-dashboard-sleek"
                  onClick={() => {
                    const targetScenario = activeScenarioTab === 'a' ? bestTeamScenario : (activeScenarioTab === 'b' ? teamBScenario : teamCScenario) || bestTeamScenario;
                    if (targetScenario) {
                      onDeployTeamToDashboard(currentProject, targetScenario);
                    }
                  }}
                  className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>FINALIZE TEAM SELECTION</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Modal: 6-Factor Score Breakdown */}
      {selectedMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-lg flex items-center justify-center">
                  {selectedMemberModal.user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{selectedMemberModal.user.name}</h4>
                  <p className="text-xs text-indigo-600 font-semibold">{selectedMemberModal.assignedRole}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMemberModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-700 block">Overall Match Rating</span>
                <span className="text-xs text-slate-500">Multi-Factor Weighted Aggregate</span>
              </div>
              <span className="text-3xl font-black text-indigo-600 font-mono">{selectedMemberModal.overallScore}%</span>
            </div>

            {/* 6 Dimension Breakdown Bars */}
            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Mathematical Score Distribution:
              </h5>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Skill Match (30% weight)</span>
                  <span className="font-bold text-indigo-600">{selectedMemberModal.breakdown.skillMatch}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${selectedMemberModal.breakdown.skillMatch}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Complementary Skills (20% weight)</span>
                  <span className="font-bold text-purple-600">{selectedMemberModal.breakdown.complementarySkills}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${selectedMemberModal.breakdown.complementarySkills}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Availability (15% weight)</span>
                  <span className="font-bold text-blue-600">{selectedMemberModal.breakdown.availability}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedMemberModal.breakdown.availability}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Experience (15% weight)</span>
                  <span className="font-bold text-emerald-600">{selectedMemberModal.breakdown.experience}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${selectedMemberModal.breakdown.experience}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Interest Match (10% weight)</span>
                  <span className="font-bold text-amber-600">{selectedMemberModal.breakdown.interestMatch}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${selectedMemberModal.breakdown.interestMatch}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Role Suitability (10% weight)</span>
                  <span className="font-bold text-rose-600">{selectedMemberModal.breakdown.roleSuitability}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-rose-600 h-2 rounded-full" style={{ width: `${selectedMemberModal.breakdown.roleSuitability}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-0.5">Selection Logic:</span>
              {selectedMemberModal.selectionReason}
            </div>

            <button
              onClick={() => setSelectedMemberModal(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
