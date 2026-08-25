import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  UserPlus, 
  Sparkles, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Clock, 
  Briefcase, 
  UserCheck, 
  X,
  Plus,
  Check
} from 'lucide-react';
import { Project, UserProfile, TeamScenario, SkillGap } from '../types';
import { detectSkillGaps, generateTeamScenarios } from '../utils/matchingEngine';

interface SkillGapViewProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  registeredUsers: UserProfile[];
  onDeployTeamToDashboard: (project: Project, scenario: TeamScenario) => void;
  onNavigateToCreateProfile: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  registeredUsers,
  onDeployTeamToDashboard,
  onNavigateToCreateProfile
}) => {
  const currentProject = selectedProject || (projects.length > 0 ? projects[0] : null);

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        No project selected.
      </div>
    );
  }

  // Get current active best team or generate for analysis
  const scenarios = generateTeamScenarios(registeredUsers, currentProject);
  const primaryTeam = scenarios.length > 0 ? scenarios[0] : null;

  const currentMembers = primaryTeam ? primaryTeam.members.map(m => m.user) : [];

  // Detect gaps
  const gapAnalysis = detectSkillGaps(currentMembers, currentProject, registeredUsers);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddTeammate = (user: UserProfile) => {
    setSuccessMsg(`Candidate ${user.name} queued for team inclusion!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-semibold border border-indigo-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Skill Gap Detection & Teammate Gap Filler
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Analyzing squad competencies against project deliverables to identify and resolve missing technical coverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Project:</span>
          <select
            value={currentProject.id}
            onChange={(e) => {
              const p = projects.find(proj => proj.id === e.target.value);
              if (p) onSelectProject(p);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-xs"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {registeredUsers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matching users found.</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto mb-6">
            Register team members in the database to run automated skill gap detection.
          </p>
          <button
            onClick={onNavigateToCreateProfile}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100"
          >
            + Register Profiles
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Banner Card */}
          <div className="bg-[#1e1b4b] rounded-2xl p-6 sm:p-8 text-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Competency Audit Report
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Skill Coverage Analysis
                </h3>
                <p className="text-indigo-200/80 text-sm max-w-3xl leading-relaxed">
                  {gapAnalysis.summaryText}
                </p>
              </div>

              {/* Visual Coverage Gauge */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex items-center gap-4 self-start md:self-auto">
                <div className="text-center">
                  <span className="text-3xl font-black text-white font-mono">
                    {gapAnalysis.coveredSkills.length}/{currentProject.requiredSkills.length}
                  </span>
                  <span className="text-[10px] text-indigo-200 uppercase font-bold block mt-0.5">
                    Skills Covered
                  </span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <span className={`text-3xl font-black font-mono ${gapAnalysis.missingSkills.length === 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {gapAnalysis.missingSkills.length}
                  </span>
                  <span className="text-[10px] text-indigo-200 uppercase font-bold block mt-0.5">
                    Gaps Identified
                  </span>
                </div>
              </div>
            </div>

            {/* Covered vs Missing Pill Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-indigo-800/80">
              
              {/* Covered Skills */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Skills The Team Already Has ({gapAnalysis.coveredSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gapAnalysis.coveredSkills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs font-medium">
                      ✓ {s}
                    </span>
                  ))}
                  {gapAnalysis.coveredSkills.length === 0 && (
                    <span className="text-xs text-indigo-300 italic">No skills covered yet.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Missing or Underrepresented Skills ({gapAnalysis.missingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gapAnalysis.missingSkills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30 text-xs font-medium">
                      ⚠ {s}
                    </span>
                  ))}
                  {gapAnalysis.missingSkills.length === 0 && (
                    <span className="text-xs text-emerald-300 font-semibold">100% Skill Coverage Achieved!</span>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Missing Skills Deep-Dive & Registered Candidates Finder */}
          {gapAnalysis.gaps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Find Registered Database Candidates to Fill Gaps
              </h3>

              <div className="space-y-4">
                {gapAnalysis.gaps.map((gap) => (
                  <div 
                    key={gap.skill}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold uppercase border border-rose-200">
                            {gap.severity} Gap
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">Skill Gap: {gap.skill}</h4>
                        </div>
                        <p className="text-xs text-indigo-600 font-semibold mt-1">
                          Recommended Candidate Profile: {gap.neededTeammateType}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {gap.explanation}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block font-medium">Matching Database Profiles:</span>
                        <span className="text-sm font-bold text-indigo-600 font-mono">
                          {gap.matchingRegisteredUsers.length} found
                        </span>
                      </div>
                    </div>

                    {/* Matching Candidate Cards from Database */}
                    <div>
                      {gap.matchingRegisteredUsers.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                          <p className="mb-2">
                            <strong>No matching users found</strong> in the database with verified expertise in "{gap.skill}".
                          </p>
                          <button
                            onClick={onNavigateToCreateProfile}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-xs"
                          >
                            + Register Candidate with {gap.skill}
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                          {gap.matchingRegisteredUsers.map(candidate => (
                            <div 
                              key={candidate.id}
                              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 flex flex-col justify-between transition-all"
                            >
                              <div>
                                <div className="flex items-center gap-2.5 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center">
                                    {candidate.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-slate-900 text-xs">{candidate.name}</h5>
                                    <p className="text-[11px] text-indigo-600">{candidate.preferredRole}</p>
                                  </div>
                                </div>

                                <div className="space-y-1 text-[11px] text-slate-500 mb-3">
                                  <div>Level: <strong className="text-slate-700">{candidate.skillLevel}</strong> • {candidate.yearsExperience}</div>
                                  <div className="text-emerald-600 font-medium">Availability: {candidate.availabilityHours}h/wk ({candidate.availabilityType})</div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {candidate.skills.slice(0, 4).map(s => (
                                      <span key={s} className="px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-700 border border-slate-200 font-medium">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddTeammate(candidate)}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Add to Squad Queue</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
