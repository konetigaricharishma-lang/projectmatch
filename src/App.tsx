import React, { useState, useEffect } from 'react';
import { 
  getRegisteredUsers, 
  saveUserProfile, 
  updateUserProfile, 
  deleteUserProfile, 
  getProjects, 
  saveProject, 
  loadCompetitionDemoProfiles, 
  saveFormedTeam,
  getCurrentUserId,
  setCurrentUserId as storeCurrentUserId
} from './data/storage';
import { UserProfile, Project, TeamScenario, FormedTeamState } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CreateProfileView } from './components/CreateProfileView';
import { CreateProjectView } from './components/CreateProjectView';
import { AiMatchingView } from './components/AiMatchingView';
import { CompareTeamsView } from './components/CompareTeamsView';
import { SkillGapView } from './components/SkillGapView';
import { TeamDashboardView } from './components/TeamDashboardView';
import { Sparkles, Check, Heart, Github } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'create-profile' | 'create-project' | 'ai-matching' | 'compare-teams' | 'skill-gap' | 'team-dashboard'>('home');
  
  // Data state
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => getRegisteredUsers());
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    const list = getProjects();
    return list.length > 0 ? list[0] : null;
  });
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() => getCurrentUserId());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSetCurrentUserId = (id: string) => {
    setCurrentUserIdState(id);
    storeCurrentUserId(id);
  };

  const handleSaveProfile = (profileData: Omit<UserProfile, 'id' | 'createdAt' | 'isRegistered'>): UserProfile => {
    const newProfile = saveUserProfile(profileData);
    const updatedUsers = getRegisteredUsers();
    setRegisteredUsers(updatedUsers);
    showToast(`Profile for ${newProfile.name} registered into database.`);
    return newProfile;
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    updateUserProfile(profile);
    const updatedUsers = getRegisteredUsers();
    setRegisteredUsers(updatedUsers);
    showToast(`Profile for ${profile.name} updated.`);
  };

  const handleDeleteProfile = (userId: string) => {
    deleteUserProfile(userId);
    const updatedUsers = getRegisteredUsers();
    setRegisteredUsers(updatedUsers);
    showToast('Profile removed from database.');
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'status'>): Project => {
    const newProject = saveProject(projectData);
    const updatedProjects = getProjects();
    setProjects(updatedProjects);
    setSelectedProject(newProject);
    showToast(`Project "${newProject.name}" saved.`);
    return newProject;
  };

  const handleLoadDemoProfiles = () => {
    const demoProfiles = loadCompetitionDemoProfiles();
    setRegisteredUsers(demoProfiles);
    if (demoProfiles.length > 0) {
      handleSetCurrentUserId(demoProfiles[0].id);
    }
    showToast('Loaded competition test squad (Rahul, Ananya, Priya, Kiran, Arjun).');
  };

  const handleDeployTeamToDashboard = (project: Project, scenario: TeamScenario) => {
    const formedState: FormedTeamState = {
      projectId: project.id,
      project,
      teamScenario: scenario,
      tasks: [
        {
          id: 'task_1',
          title: 'Lock System Architecture & API Schemas',
          assigneeName: scenario.members[0]?.user.name || 'Team Lead',
          status: 'Done',
          priority: 'Urgent'
        },
        {
          id: 'task_2',
          title: 'Design UI Prototypes in Figma / Tailwind',
          assigneeName: scenario.members[1]?.user.name || 'UI/UX Designer',
          status: 'In Progress',
          priority: 'High'
        },
        {
          id: 'task_3',
          title: 'Deploy Model Ingestion & Verification Pipeline',
          assigneeName: scenario.members[0]?.user.name || 'ML Engineer',
          status: 'In Progress',
          priority: 'High'
        },
        {
          id: 'task_4',
          title: 'Conduct Domain Clinical Validation & User Testing',
          assigneeName: scenario.members[2]?.user.name || 'Domain Expert',
          status: 'Todo',
          priority: 'Medium'
        }
      ],
      meetings: [
        {
          id: 'm_1',
          title: 'Sprint Planning & Goal Kickoff',
          date: 'Tomorrow',
          time: '11:00 AM EDT',
          type: 'Sprint Planning',
          agenda: 'Review 48h deliverables, assign Github issues, and clarify API requirements.'
        },
        {
          id: 'm_2',
          title: 'Daily Standup & Blocker Sync',
          date: 'Wednesday',
          time: '04:00 PM EDT',
          type: 'Daily Standup',
          agenda: 'Review demo build progress and test cross-browser responsiveness.'
        }
      ],
      progressPercent: 40,
      formedAt: new Date().toISOString()
    };

    saveFormedTeam(formedState);
    setSelectedProject(project);
    setCurrentPage('team-dashboard');
    showToast(`Team "${scenario.name}" deployed to Team Dashboard!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-indigo-500 animate-in fade-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation (Sidebar & Top Bar) */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        registeredUsersCount={registeredUsers.length}
        activeProject={selectedProject}
      />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1">
          {currentPage === 'home' && (
            <HomeView
              setActiveTab={(page) => {
                setCurrentPage(page as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoadDemoProfiles={handleLoadDemoProfiles}
              registeredUsersCount={registeredUsers.length}
              projects={projects}
              onSelectProjectForMatch={(p) => {
                setSelectedProject(p);
                setCurrentPage('ai-matching');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentPage === 'create-profile' && (
            <CreateProfileView
              onSaveProfile={handleSaveProfile}
              onUpdateProfile={handleUpdateProfile}
              onDeleteProfile={handleDeleteProfile}
              registeredUsers={registeredUsers}
              currentUserId={currentUserId}
              setCurrentUserId={handleSetCurrentUserId}
              onNavigateToMatching={() => {
                setCurrentPage('ai-matching');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentPage === 'create-project' && (
            <CreateProjectView
              onSaveProject={handleSaveProject}
              onNavigateToMatching={(proj) => {
                setSelectedProject(proj);
                setCurrentPage('ai-matching');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentPage === 'ai-matching' && (
            <AiMatchingView
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={(p) => setSelectedProject(p)}
              registeredUsers={registeredUsers}
              onNavigateToCompare={() => {
                setCurrentPage('compare-teams');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToSkillGap={() => {
                setCurrentPage('skill-gap');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDeployTeamToDashboard={handleDeployTeamToDashboard}
              onNavigateToCreateProfile={() => {
                setCurrentPage('create-profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoadDemoProfiles={handleLoadDemoProfiles}
            />
          )}

          {currentPage === 'compare-teams' && (
            <CompareTeamsView
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={(p) => setSelectedProject(p)}
              registeredUsers={registeredUsers}
              onDeployTeamToDashboard={handleDeployTeamToDashboard}
              onNavigateToSkillGap={() => {
                setCurrentPage('skill-gap');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToCreateProfile={() => {
                setCurrentPage('create-profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentPage === 'skill-gap' && (
            <SkillGapView
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={(p) => setSelectedProject(p)}
              registeredUsers={registeredUsers}
              onDeployTeamToDashboard={handleDeployTeamToDashboard}
              onNavigateToCreateProfile={() => {
                setCurrentPage('create-profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentPage === 'team-dashboard' && (
            <TeamDashboardView
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={(p) => setSelectedProject(p)}
              registeredUsers={registeredUsers}
              onNavigateToMatching={() => {
                setCurrentPage('ai-matching');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToSkillGap={() => {
                setCurrentPage('skill-gap');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToCreateProfile={() => {
                setCurrentPage('create-profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 px-6 sm:px-8 text-xs text-slate-500 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                P
              </div>
              <div>
                <span className="font-semibold text-slate-800 text-sm block">ProjectMatch</span>
                <span className="text-slate-400 text-[11px]">“Find the right people. Build the right team.”</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 text-slate-500 text-xs">
              <button onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-600 transition-colors">Dashboard</button>
              <button onClick={() => { setCurrentPage('create-profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-600 transition-colors">My Profile</button>
              <button onClick={() => { setCurrentPage('create-project'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-600 transition-colors">Create Project</button>
              <button onClick={() => { setCurrentPage('ai-matching'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-600 transition-colors">AI Matching</button>
              <button onClick={() => { setCurrentPage('compare-teams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-600 transition-colors">Compare Teams</button>
              <button onClick={() => { setCurrentPage('skill-gap'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-600 transition-colors">Skill Gaps</button>
              <button onClick={() => { setCurrentPage('team-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-600 transition-colors">Workspace</button>
            </div>

            <div className="text-center md:text-right text-[11px] text-slate-400">
              <span>6-Factor Mathematical Synergy Engine</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}
