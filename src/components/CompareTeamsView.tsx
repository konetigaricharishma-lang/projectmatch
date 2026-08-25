import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  BarChart2, 
  ArrowRight, 
  ShieldAlert, 
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { Project, UserProfile, TeamScenario } from '../types';
import { generateTeamScenarios } from '../utils/matchingEngine';

interface CompareTeamsViewProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  registeredUsers: UserProfile[];
  onDeployTeamToDashboard: (project: Project, scenario: TeamScenario) => void;
  onNavigateToSkillGap: () => void;
  onNavigateToCreateProfile: () => void;
}

export const CompareTeamsView: React.FC<CompareTeamsViewProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  registeredUsers,
  onDeployTeamToDashboard,
  onNavigateToSkillGap,
  onNavigateToCreateProfile
}) => {
  const currentProject = selectedProject || (projects.length > 0 ? projects[0] : null);

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h2>
      </div>
    );
  }

  const scenarios = generateTeamScenarios(registeredUsers, currentProject);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    scenarios.length > 0 ? scenarios[0].id : ''
  );

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  if (scenarios.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Insufficient Candidates to Compare</h3>
          <p className="text-slate-500 text-sm max-w-lg mx-auto mb-6">
            At least 1 registered candidate is required to generate comparative team scenarios. Register users or load the demo squad to view lineup variations.
          </p>
          <button
            onClick={onNavigateToCreateProfile}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 mx-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Profile</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Project Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Team Scenario Comparator
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Evaluate distinct lineup configurations across skill coverage, availability sync, and role distribution.
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

      {/* 3 Teams Top Cards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {scenarios.map((scenario) => {
          const isSelected = activeScenario.id === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenarioId(scenario.id)}
              className={`cursor-pointer rounded-2xl p-5 sm:p-6 border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-2 border-indigo-600 shadow-lg'
                  : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {scenario.isBestTeam && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Best Match
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-base">{scenario.name}</h3>
                  <div className="w-11 h-11 rounded-full border-4 border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                    {scenario.overallScore}%
                  </div>
                </div>

                <p className="text-xs text-indigo-600 font-semibold mb-2">
                  {scenario.tagline}
                </p>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {scenario.recommendationReason}
                </p>
              </div>

              {/* Mini metrics pill */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Skill Coverage:</span>
                  <span className="font-bold text-slate-800">{scenario.metrics.skillCoverage}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Availability Sync:</span>
                  <span className="font-bold text-slate-800">{scenario.metrics.availabilitySync}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Role Coverage:</span>
                  <span className="font-bold text-slate-800">{scenario.metrics.roleCoverage}%</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{scenario.members.length} Members</span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Selected' : 'View Details →'}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparative Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-600" />
          Side-by-Side Dimensional Comparison
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Comparing {scenarios.length} combinations against "{currentProject.name}" requirements.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Evaluation Dimension</th>
                {scenarios.map(s => (
                  <th key={s.id} className="py-3 px-4 text-center">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-indigo-600 font-mono font-semibold">{s.overallScore}% Synergy</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Skill Coverage (30% weight)</td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-center">
                    <span className="font-bold text-indigo-600 font-mono">{s.metrics.skillCoverage}%</span>
                    <div className="text-[10px] text-slate-400">{s.coveredSkills.length} of {currentProject.requiredSkills.length} skills</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Availability & Sprint Sync (15% weight)</td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-center">
                    <span className="font-bold text-blue-600 font-mono">{s.metrics.availabilitySync}%</span>
                    <div className="text-[10px] text-slate-400">
                      {s.members.reduce((a, m) => a + m.user.availabilityHours, 0)} combined hrs/wk
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Experience Depth (15% weight)</td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-center">
                    <span className="font-bold text-emerald-600 font-mono">{s.metrics.experienceDepth}%</span>
                    <div className="text-[10px] text-slate-400">Seniority alignment</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Interest & Domain Affinity (10% weight)</td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-center">
                    <span className="font-bold text-amber-600 font-mono">{s.metrics.interestAlignment}%</span>
                    <div className="text-[10px] text-slate-400">Shared domain passion</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Role Coverage (10% weight)</td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-center">
                    <span className="font-bold text-purple-600 font-mono">{s.metrics.roleCoverage}%</span>
                    <div className="text-[10px] text-slate-400">Distinct ownership</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Missing Skill Gaps</td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-center">
                    {s.missingSkills.length === 0 ? (
                      <span className="text-emerald-600 font-semibold text-[11px]">0 Gaps (Full Coverage)</span>
                    ) : (
                      <span className="text-amber-600 font-semibold text-[11px]">{s.missingSkills.join(', ')}</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Selected Teammates</td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {s.members.map(m => (
                        <span key={m.userId} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium">
                          {m.user.name.split(' ')[0]} ({m.assignedRole.split(' ')[0]})
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Team In-Depth Spotlight & Deploy */}
      <div className="bg-[#1e1b4b] rounded-2xl p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-indigo-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                Active Selection:
              </span>
              {activeScenario.isBestTeam && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  AI TOP PICK
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">
              {activeScenario.name} — {activeScenario.tagline}
            </h3>
            <p className="text-indigo-200/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {activeScenario.recommendationReason}
            </p>
          </div>

          <button
            id="btn-deploy-selected-scenario"
            onClick={() => onDeployTeamToDashboard(currentProject, activeScenario)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-950 flex items-center gap-2 self-start md:self-auto transition-all whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Select & Launch {activeScenario.name} in Workspace</span>
          </button>
        </div>

        {/* Member Cards in Selected Scenario */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {activeScenario.members.map(member => (
            <div key={member.userId} className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white font-bold text-sm flex items-center justify-center">
                  {member.user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">{member.user.name}</h4>
                  <p className="text-[11px] text-indigo-200 font-medium">{member.assignedRole}</p>
                </div>
              </div>

              <div className="text-[11px] text-indigo-100/80 bg-black/20 p-2.5 rounded-lg">
                {member.selectionReason}
              </div>

              <div className="flex items-center justify-between text-[10px] text-indigo-200 pt-1">
                <span>Match: <strong className="text-white">{member.overallScore}%</strong></span>
                <span className="text-emerald-300 font-medium">{member.user.availabilityHours}h/wk</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
