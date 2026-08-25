import React from 'react';
import { 
  Sparkles, 
  Users, 
  Target, 
  Cpu, 
  GitMerge, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import { Project } from '../types';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  registeredUsersCount: number;
  projects: Project[];
  onLoadDemoProfiles: () => void;
  onSelectProjectForMatch: (proj: Project) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  registeredUsersCount,
  projects,
  onLoadDemoProfiles,
  onSelectProjectForMatch
}) => {
  return (
    <div className="bg-[#f8fafc] text-slate-800 pb-16">
      
      {/* Top Test Notice Banner if empty DB */}
      {registeredUsersCount === 0 && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3 text-indigo-900">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>
                <strong>Database Ready:</strong> Only verified registered candidates will be matched.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-load-competition-profiles-home"
                onClick={onLoadDemoProfiles}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Competition Test Squad (Rahul, Ananya, Priya, Kiran, Arjun)</span>
              </button>
              <button
                onClick={() => setActiveTab('create-profile')}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors"
              >
                Register Custom Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Driven Team Formation & Synergy Architecture</span>
          </div>

          {/* Title & Tagline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-5 leading-tight">
            Find the right people.{' '}
            <span className="text-indigo-600">
              Build the right team.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            ProjectMatch is an AI-powered platform for students and professionals to form high-impact project & hackathon teams, analyzing multi-dimensional mathematical compatibility across skills, availability, and domain depth.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
            <button
              id="hero-btn-create-profile"
              onClick={() => setActiveTab('create-profile')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-100 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Create Profile</span>
            </button>

            <button
              id="hero-btn-create-project"
              onClick={() => setActiveTab('create-project')}
              className="px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Create Project</span>
            </button>

            <button
              id="hero-btn-hackathon-mode"
              onClick={() => setActiveTab('create-project')}
              className="px-5 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-semibold text-sm shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Hackathon Mode</span>
            </button>
          </div>

          {/* Platform Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">{registeredUsersCount}</div>
              <div className="text-xs text-slate-500 font-medium">Registered in DB</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-0.5">6-Factor</div>
              <div className="text-xs text-slate-500 font-medium">Weighted AI Match Matrix</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">3 Scenarios</div>
              <div className="text-xs text-slate-500 font-medium">Comparative Lineups</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-0.5">100% Real</div>
              <div className="text-xs text-slate-500 font-medium">Verified Candidate Pool</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6-Factor AI Matching Algorithm Breakdown */}
      <section className="py-14 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1.5">
              Mathematical Precision
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              AI Team Compatibility Formula
            </h3>
            <p className="text-slate-500 text-sm">
              ProjectMatch evaluates candidates through a calibrated 6-dimensional weighting system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-indigo-600">30%</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Skill Match</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Direct overlap between candidate’s verified technical capabilities and project requirements.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                  <GitMerge className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-purple-600">20%</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Complementary Skills</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Rewards adjacent skills (DevOps, UI/UX, Cloud, Pitching) that expand squad breadth.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-blue-600">15%</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Availability & Cadence</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Matches weekly commitment hours and timezone alignment to ensure sprint velocity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-emerald-600">15%</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Relevant Experience</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Evaluates years of active project delivery, hackathon awards, and portfolio track record.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-amber-600">10%</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Domain Interests</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Aligns personal passion and sector enthusiasm (Healthcare AI, Web3, FinTech, EdTech).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-rose-600">10%</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Role Suitability</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Guarantees unambiguous ownership across engineering, design, marketing, and leadership.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1.5">
              Engineered for Results
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Comprehensive Team Architecture Features
            </h3>
            <p className="text-slate-500 text-sm">
              Tools to transform individual applicants into a unified, high-performance squad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">AI Team Matching</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Recommends optimal lineups with individual match percentages, designated roles, and transparent reasoning.
              </p>
              <button
                onClick={() => setActiveTab('ai-matching')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Launch AI Matcher <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Compare 3 Teams</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Evaluates 3 distinct combinations (Balanced Synergy 93%, Deep Tech 87%, Rapid Velocity 81%) side-by-side.
              </p>
              <button
                onClick={() => setActiveTab('compare-teams')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Compare Scenarios <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Skill Gap Detection</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Pinpoints unrepresented competencies (e.g. Marketing, Cloud) and searches registered database users to fill the vacancy.
              </p>
              <button
                onClick={() => setActiveTab('skill-gap')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                Analyze Skill Gaps <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Dedicated Hackathon Mode</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Fast-track mode for 24h & 48h competitions with sprint track themes, rapid matchmaking, and sprint deadlines.
              </p>
              <button
                onClick={() => setActiveTab('create-project')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                Start Hackathon Project <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Team Workspace</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Live operational hub with interactive Kanban task board, meeting sync schedules, and milestone tracking.
              </p>
              <button
                onClick={() => setActiveTab('team-dashboard')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Strict Database Mode</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Zero fake synthetic bots. Recommendations strictly query verified profiles registered in the system.
              </p>
              <button
                onClick={() => setActiveTab('create-profile')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Manage Profiles <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Sample Project Banner */}
      {projects.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1b4b] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Sample Featured Project
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">{projects[0].name}</h4>
              <p className="text-indigo-200/80 text-xs sm:text-sm max-w-xl leading-relaxed">
                {projects[0].description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {projects[0].requiredSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-200 text-xs border border-indigo-700/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <button
              id="btn-match-sample-project"
              onClick={() => {
                onSelectProjectForMatch(projects[0]);
                setActiveTab('ai-matching');
              }}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Run AI Match Engine</span>
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
