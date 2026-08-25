import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  PlusCircle, 
  UserPlus, 
  LayoutDashboard, 
  Compass, 
  Zap, 
  Layers,
  AlertTriangle,
  Flame,
  Award,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Project } from '../types';

interface NavbarProps {
  currentPage?: string;
  activeTab?: string;
  onNavigate?: (page: string) => void;
  setActiveTab?: (tab: string) => void;
  registeredUsersCount: number;
  projectsCount?: number;
  activeProject: Project | null;
  onOpenQuickProfiles?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activeTab,
  onNavigate,
  setActiveTab,
  registeredUsersCount,
  activeProject,
}) => {
  const current = currentPage || activeTab || 'home';
  const handleNav = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (setActiveTab) setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Breadcrumb label based on active route
  const getPageTitle = () => {
    switch (current) {
      case 'home': return 'Platform Hub';
      case 'create-profile': return 'Profile Management';
      case 'create-project': return activeProject?.isHackathon ? 'Hackathon Sprint Config' : 'Project Definition';
      case 'ai-matching': return 'AI Team Recommendations';
      case 'compare-teams': return '3-Team Scenario Analysis';
      case 'skill-gap': return 'Skill Gap & Teammate Gap Filler';
      case 'team-dashboard': return 'Team Workspace Dashboard';
      case 'registered-users': return 'Registered Candidates Directory';
      default: return 'Team Optimization';
    }
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-profile', label: 'Profile', icon: UserPlus },
    { id: 'create-project', label: 'Create Project', icon: PlusCircle },
    { id: 'ai-matching', label: 'AI Matching', icon: Zap },
    { id: 'compare-teams', label: 'Compare Teams', icon: Layers },
    { id: 'skill-gap', label: 'Skill Gaps', icon: AlertTriangle },
    { id: 'team-dashboard', label: 'My Teams', icon: Users },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#1e1b4b] text-white flex-col fixed inset-y-0 left-0 z-30 select-none">
        {/* Brand Header */}
        <div className="p-6">
          <div 
            id="nav-logo"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 mb-8 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-md shadow-indigo-900/50 group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">ProjectMatch</h1>
              <p className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">AI Team Matcher</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = current === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-800/50 text-indigo-100 font-semibold shadow-inner'
                      : 'text-indigo-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'opacity-70 text-indigo-300'}`} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-300" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Project Widget at bottom */}
        <div className="mt-auto p-6">
          <div 
            onClick={() => handleNav('ai-matching')}
            className="bg-indigo-800/30 rounded-xl p-4 border border-indigo-700/50 hover:border-indigo-500/70 cursor-pointer transition-colors"
          >
            <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold mb-1">Active Project</p>
            <p className="text-sm font-medium text-white truncate">
              {activeProject ? activeProject.name : 'AI Healthcare Assistant'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-emerald-300 uppercase tracking-wide font-medium">Matching Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Mobile menu trigger + Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span 
              onClick={() => handleNav('home')}
              className="text-slate-400 hover:text-slate-600 cursor-pointer font-medium"
            >
              Projects
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800 uppercase tracking-tight text-xs sm:text-sm">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Right: Hackathon pill + Registered users pill + quick avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeProject?.isHackathon && (
            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 border border-orange-200 shadow-xs">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">HACKATHON MODE ACTIVE</span>
              <span className="sm:hidden">HACKATHON</span>
            </div>
          )}

          <button
            id="btn-registered-users-badge"
            onClick={() => handleNav('create-profile')}
            className="flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors font-medium shadow-xs"
            title="View Registered Candidate Database"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold text-slate-900">{registeredUsersCount}</span>
            <span className="hidden sm:inline text-slate-500">Users in DB</span>
          </button>

          <div 
            onClick={() => handleNav('create-profile')}
            className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
            title="Candidate Profile"
          >
            PM
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#1e1b4b] text-white h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl text-white">
                  P
                </div>
                <div>
                  <h2 className="font-bold text-xl tracking-tight text-white">ProjectMatch</h2>
                  <p className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">AI Team Matcher</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-indigo-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-800/50 text-indigo-100 font-semibold'
                        : 'text-indigo-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="bg-indigo-800/30 rounded-xl p-4 border border-indigo-700/50 mt-4">
              <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold mb-1">Active Project</p>
              <p className="text-sm font-medium text-white truncate">
                {activeProject ? activeProject.name : 'AI Healthcare Assistant'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-emerald-300 uppercase font-medium">Matching Active</span>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
