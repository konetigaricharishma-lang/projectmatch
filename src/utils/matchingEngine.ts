import { UserProfile, Project, IndividualMatchScore, TeamScenario, SkillGap } from '../types';

// Helper to normalize strings for comparison
function norm(str: string): string {
  return str.toLowerCase().trim().replace(/[-_]/g, ' ');
}

// Compute individual match score against a project
export function calculateIndividualMatch(user: UserProfile, project: Project): IndividualMatchScore {
  const reqSkillsNorm = project.requiredSkills.map(norm);
  const userSkillsNorm = user.skills.map(norm);
  const reqRolesNorm = project.requiredRoles.map(norm);
  const userInterestsNorm = user.interests.map(norm);

  // 1. Skill Match (30%)
  const matchedSkills: string[] = [];
  const complementarySkills: string[] = [];

  user.skills.forEach(skill => {
    const sNorm = norm(skill);
    const isDirect = reqSkillsNorm.some(req => sNorm.includes(req) || req.includes(sNorm));
    if (isDirect) {
      matchedSkills.push(skill);
    } else {
      // Complementary skills like Docker, Git, CI/CD, Figma, Testing, etc.
      complementarySkills.push(skill);
    }
  });

  const skillCoverageRatio = reqSkillsNorm.length > 0
    ? matchedSkills.length / reqSkillsNorm.length
    : 0.8;
  
  let skillMatchBase = Math.min(100, Math.round(skillCoverageRatio * 90));
  if (user.skillLevel === 'Expert') skillMatchBase = Math.min(100, skillMatchBase + 10);
  else if (user.skillLevel === 'Advanced') skillMatchBase = Math.min(100, skillMatchBase + 5);
  else if (user.skillLevel === 'Beginner') skillMatchBase = Math.max(30, skillMatchBase - 15);

  // 2. Complementary Skills (20%)
  // Scores diversity of adjacent tech/tools
  const compCount = complementarySkills.length;
  let complementaryScore = Math.min(100, 50 + compCount * 12);
  if (user.skills.length >= 5) complementaryScore = Math.min(100, complementaryScore + 10);

  // 3. Availability (15%)
  const reqAvail = project.availabilityRequirement || 10;
  let availRatio = user.availabilityHours / Math.max(1, reqAvail);
  let availScore = Math.min(100, Math.round(availRatio * 90));
  if (user.availabilityType === 'Full-time Sprint' || (project.isHackathon && user.availabilityType === 'Flexible')) {
    availScore = Math.min(100, availScore + 15);
  }

  // 4. Experience (15%)
  let expScore = 75;
  if (user.yearsExperience === '4+ years') expScore = 98;
  else if (user.yearsExperience === '2-4 years') expScore = 90;
  else if (user.yearsExperience === '1-2 years') expScore = 78;
  else expScore = 65;

  if (project.experienceRequirement === 'Experienced' && (user.yearsExperience === '0-1 year' || user.yearsExperience === '1-2 years')) {
    expScore = Math.max(40, expScore - 25);
  } else if (project.experienceRequirement === 'Any') {
    expScore = Math.min(100, expScore + 10);
  }

  // 5. Interest Match (10%)
  const categoryNorm = norm(project.category || '');
  const themeNorm = norm(project.hackathonTheme || '');
  const projDescNorm = norm(project.description || '');

  let interestHits = 0;
  user.interests.forEach(interest => {
    const iNorm = norm(interest);
    if (categoryNorm.includes(iNorm) || themeNorm.includes(iNorm) || projDescNorm.includes(iNorm) || iNorm.includes(categoryNorm)) {
      interestHits++;
    }
  });

  let interestScore = 60;
  if (interestHits >= 2) interestScore = 98;
  else if (interestHits === 1) interestScore = 88;
  else if (user.interests.length > 0) interestScore = 70;

  // 6. Role Suitability (10%)
  const preferredNorm = norm(user.preferredRole || '');
  const isDirectRoleMatch = reqRolesNorm.some(r => preferredNorm.includes(r) || r.includes(preferredNorm));
  const isSecondaryRoleMatch = (user.secondaryRoles || []).some(sec => {
    const sNorm = norm(sec);
    return reqRolesNorm.some(r => sNorm.includes(r) || r.includes(sNorm));
  });

  let roleScore = 60;
  let assignedRole = user.preferredRole;

  if (isDirectRoleMatch) {
    roleScore = 98;
    const matchingReqRole = project.requiredRoles.find(r => norm(r).includes(preferredNorm) || preferredNorm.includes(norm(r)));
    if (matchingReqRole) assignedRole = matchingReqRole;
  } else if (isSecondaryRoleMatch) {
    roleScore = 85;
    const matchSec = (user.secondaryRoles || []).find(sec => reqRolesNorm.some(r => norm(sec).includes(r) || r.includes(norm(sec))));
    if (matchSec) assignedRole = matchSec;
  } else {
    // Find closest or keep preferred
    roleScore = 65;
  }

  // Calculate Weighted Overall Score
  // Weights: Skill match 30%, Complementary 20%, Availability 15%, Experience 15%, Interest 10%, Role suitability 10%
  const weightedScore = Math.round(
    (skillMatchBase * 0.30) +
    (complementaryScore * 0.20) +
    (availScore * 0.15) +
    (expScore * 0.15) +
    (interestScore * 0.10) +
    (roleScore * 0.10)
  );

  // Generate crisp, contextual reasoning why this person was selected
  let selectionReason = '';
  if (matchedSkills.length > 0 && isDirectRoleMatch) {
    selectionReason = `Strong role alignment as ${assignedRole} with direct coverage in ${matchedSkills.slice(0, 3).join(', ')}.`;
  } else if (matchedSkills.length > 0) {
    selectionReason = `Provides essential technical capability in ${matchedSkills.slice(0, 2).join(', ')} with ${user.skillLevel} proficiency.`;
  } else if (isDirectRoleMatch) {
    selectionReason = `Specialized background as ${assignedRole} with high availability (${user.availabilityHours}h/wk) and domain synergy.`;
  } else if (complementarySkills.length > 0) {
    selectionReason = `Adds high-value complementary expertise in ${complementarySkills.slice(0, 2).join(', ')} and ${user.yearsExperience} experience.`;
  } else {
    selectionReason = `Brings energetic domain contribution and collaborative ${user.teamPreferences.workStyle} style.`;
  }

  return {
    userId: user.id,
    user,
    assignedRole,
    overallScore: Math.min(99, Math.max(50, weightedScore)),
    breakdown: {
      skillMatch: skillMatchBase,
      complementarySkills: complementaryScore,
      availability: availScore,
      experience: expScore,
      interestMatch: interestScore,
      roleSuitability: roleScore
    },
    matchedSkills,
    complementarySkills,
    selectionReason
  };
}

// Generate 3 distinct comparative team scenarios
export function generateTeamScenarios(registeredUsers: UserProfile[], project: Project): TeamScenario[] {
  if (!registeredUsers || registeredUsers.length === 0) {
    return [];
  }

  // Score all registered users
  const scoredUsers = registeredUsers.map(u => calculateIndividualMatch(u, project));
  const teamSize = Math.max(2, Math.min(project.requiredTeamSize || 4, registeredUsers.length));

  // Scenario 1: Team A (Optimal Balanced Synergy)
  // Greedily pick users that maximize unique role and skill coverage
  const teamAUsers: IndividualMatchScore[] = [];
  const remainingForA = [...scoredUsers].sort((a, b) => b.overallScore - a.overallScore);

  const coveredRolesA = new Set<string>();
  const reqRoles = project.requiredRoles || [];

  // First pass: Fill distinct required roles
  reqRoles.forEach(role => {
    if (teamAUsers.length < teamSize) {
      const matchIdx = remainingForA.findIndex(u => 
        norm(u.assignedRole).includes(norm(role)) || 
        norm(role).includes(norm(u.assignedRole)) ||
        norm(u.user.preferredRole).includes(norm(role))
      );
      if (matchIdx !== -1) {
        teamAUsers.push(remainingForA[matchIdx]);
        coveredRolesA.add(role);
        remainingForA.splice(matchIdx, 1);
      }
    }
  });

  // Fill remaining slots with highest overall scores
  while (teamAUsers.length < teamSize && remainingForA.length > 0) {
    teamAUsers.push(remainingForA.shift()!);
  }

  // Scenario 2: Team B (Deep Tech & Architecture Mastery)
  // Sort by highest skill match + experience
  const teamBUsers: IndividualMatchScore[] = [];
  const remainingForB = [...scoredUsers].sort((a, b) => 
    (b.breakdown.skillMatch * 0.5 + b.breakdown.experience * 0.5) - 
    (a.breakdown.skillMatch * 0.5 + a.breakdown.experience * 0.5)
  );

  while (teamBUsers.length < teamSize && remainingForB.length > 0) {
    teamBUsers.push(remainingForB.shift()!);
  }

  // Scenario 3: Team C (Rapid Sprint & High Availability Velocity)
  // Sort by highest availability + collaborative work style
  const teamCUsers: IndividualMatchScore[] = [];
  const remainingForC = [...scoredUsers].sort((a, b) => 
    (b.breakdown.availability * 0.6 + b.breakdown.complementarySkills * 0.4) - 
    (a.breakdown.availability * 0.6 + a.breakdown.complementarySkills * 0.4)
  );

  while (teamCUsers.length < teamSize && remainingForC.length > 0) {
    teamCUsers.push(remainingForC.shift()!);
  }

  const scenarioA = buildScenarioObject(
    'team_a',
    'Team A',
    'High-Synergy Balanced (AI Recommended)',
    teamAUsers,
    project,
    true,
    'Selected as the premier team configuration due to balanced role distribution, high skill intersection, and synchronized working cadence.'
  );

  const scenarioB = buildScenarioObject(
    'team_b',
    'Team B',
    'Deep Technical Specialization',
    teamBUsers,
    project,
    false,
    'Strongest technical mastery and deep architectural experience, ideal for complex algorithm implementations and rigorous system design.'
  );

  const scenarioC = buildScenarioObject(
    'team_c',
    'Team C',
    'Sprint Velocity & Maximum Availability',
    teamCUsers,
    project,
    false,
    'Highest cumulative weekly commitment and rapid turnaround capability, ideal for aggressive deadlines and 24-48h hackathon sprints.'
  );

  return [scenarioA, scenarioB, scenarioC];
}

function buildScenarioObject(
  id: string,
  name: string,
  tagline: string,
  members: IndividualMatchScore[],
  project: Project,
  isBestTeam: boolean,
  recommendationReason: string
): TeamScenario {
  if (members.length === 0) {
    return {
      id,
      name,
      tagline,
      overallScore: 0,
      members: [],
      metrics: {
        skillCoverage: 0,
        availabilitySync: 0,
        experienceDepth: 0,
        interestAlignment: 0,
        roleCoverage: 0
      },
      coveredSkills: [],
      missingSkills: project.requiredSkills,
      strengths: [],
      recommendationReason: 'No registered candidates available.',
      isBestTeam
    };
  }

  // Aggregate all skills possessed by members
  const allTeamSkills = new Set<string>();
  members.forEach(m => {
    m.user.skills.forEach(s => allTeamSkills.add(s));
  });

  const coveredSkills: string[] = [];
  const missingSkills: string[] = [];

  project.requiredSkills.forEach(req => {
    const reqN = norm(req);
    const hasSkill = Array.from(allTeamSkills).some(s => {
      const sN = norm(s);
      return sN.includes(reqN) || reqN.includes(sN);
    });
    if (hasSkill) coveredSkills.push(req);
    else missingSkills.push(req);
  });

  const skillCoveragePct = project.requiredSkills.length > 0
    ? Math.round((coveredSkills.length / project.requiredSkills.length) * 100)
    : 90;

  // Compute metrics
  const avgAvailability = Math.round(members.reduce((acc, m) => acc + m.breakdown.availability, 0) / members.length);
  const avgExp = Math.round(members.reduce((acc, m) => acc + m.breakdown.experience, 0) / members.length);
  const avgInterest = Math.round(members.reduce((acc, m) => acc + m.breakdown.interestMatch, 0) / members.length);

  // Role coverage
  const reqRoles = project.requiredRoles || [];
  const coveredRoles = reqRoles.filter(role => 
    members.some(m => norm(m.assignedRole).includes(norm(role)) || norm(role).includes(norm(m.assignedRole)))
  );
  const roleCoveragePct = reqRoles.length > 0
    ? Math.round((coveredRoles.length / reqRoles.length) * 100)
    : 85;

  // Overall scenario score
  let overallScore = Math.round(
    (skillCoveragePct * 0.35) +
    (avgAvailability * 0.20) +
    (avgExp * 0.15) +
    (roleCoveragePct * 0.15) +
    (avgInterest * 0.15)
  );

  // Bonus for Best Team scenario
  if (isBestTeam) {
    overallScore = Math.max(91, Math.min(96, overallScore + 4));
  } else if (id === 'team_b') {
    overallScore = Math.min(overallScore, 88);
  } else {
    overallScore = Math.min(overallScore, 82);
  }

  const strengths: string[] = [];
  if (skillCoveragePct >= 80) strengths.push(`${skillCoveragePct}% required technical skills covered out of the box.`);
  if (avgAvailability >= 80) strengths.push(`High availability alignment with over ${members.reduce((a, m) => a + m.user.availabilityHours, 0)} combined hrs/week.`);
  if (roleCoveragePct >= 80) strengths.push(`Comprehensive multi-disciplinary role coverage across engineering, product, and design.`);
  if (strengths.length < 3) strengths.push(`Strong shared interest in ${project.category} domain.`);

  return {
    id,
    name,
    tagline,
    overallScore,
    members,
    metrics: {
      skillCoverage: skillCoveragePct,
      availabilitySync: avgAvailability,
      experienceDepth: avgExp,
      interestAlignment: avgInterest,
      roleCoverage: roleCoveragePct
    },
    coveredSkills,
    missingSkills,
    strengths,
    recommendationReason,
    isBestTeam
  };
}

// Detect skill gaps in a given team and find registered users to fill the gap
export function detectSkillGaps(
  teamMembers: UserProfile[],
  project: Project,
  allRegisteredUsers: UserProfile[]
): {
  coveredSkills: string[];
  missingSkills: string[];
  gaps: SkillGap[];
  summaryText: string;
} {
  const teamMemberIds = new Set(teamMembers.map(m => m.id));
  const candidatePool = allRegisteredUsers.filter(u => !teamMemberIds.has(u.id));

  const allTeamSkills = new Set<string>();
  teamMembers.forEach(m => {
    m.skills.forEach(s => allTeamSkills.add(s));
  });

  const coveredSkills: string[] = [];
  const missingSkills: string[] = [];

  project.requiredSkills.forEach(req => {
    const reqN = norm(req);
    const has = Array.from(allTeamSkills).some(s => {
      const sN = norm(s);
      return sN.includes(reqN) || reqN.includes(sN);
    });
    if (has) coveredSkills.push(req);
    else missingSkills.push(req);
  });

  // Construct structured gap items
  const gaps: SkillGap[] = missingSkills.map(skill => {
    const sN = norm(skill);
    
    // Find registered users with this exact missing skill
    const matchingUsers = candidatePool.filter(user => 
      user.skills.some(userSkill => {
        const uSN = norm(userSkill);
        return uSN.includes(sN) || sN.includes(uSN);
      })
    );

    let teammateType = 'Technical Specialist';
    let explanation = `The current team lacks dedicated expertise in ${skill}, which is critical for core project milestones.`;
    let severity: 'Critical' | 'Moderate' | 'Nice-to-have' = 'Critical';

    if (sN.includes('cloud') || sN.includes('aws') || sN.includes('docker') || sN.includes('deploy')) {
      teammateType = 'Cloud / DevOps Engineer';
      explanation = 'Needed to configure CI/CD, containerized hosting, and resilient infrastructure deployment.';
    } else if (sN.includes('ui') || sN.includes('ux') || sN.includes('figma') || sN.includes('design')) {
      teammateType = 'UI/UX & Product Designer';
      explanation = 'Needed to create responsive user flows, design systems, and interactive clickable prototypes.';
    } else if (sN.includes('health') || sN.includes('medical') || sN.includes('clinical') || sN.includes('domain')) {
      teammateType = 'Domain & Clinical Specialist';
      explanation = 'Needed to validate domain regulatory compliance, terminology, and real-world clinical workflow.';
    } else if (sN.includes('market') || sN.includes('business') || sN.includes('growth') || sN.includes('pitch')) {
      teammateType = 'Business & Marketing Strategist';
      explanation = 'Needed to craft compelling GTM presentations, user validation metrics, and judge pitch decks.';
    } else if (sN.includes('ml') || sN.includes('ai') || sN.includes('machine learning') || sN.includes('python')) {
      teammateType = 'AI/ML & Data Engineer';
      explanation = 'Needed to develop, fine-tune, and evaluate deep predictive and generative model pipelines.';
    } else {
      severity = 'Moderate';
    }

    return {
      skill,
      severity,
      category: project.category || 'General',
      neededTeammateType: teammateType,
      explanation,
      matchingRegisteredUsers: matchingUsers
    };
  });

  let summaryText = '';
  if (missingSkills.length === 0) {
    summaryText = `Your team has full 100% skill coverage across ${coveredSkills.join(', ')}. All required competencies are secured!`;
  } else {
    summaryText = `Your team has ${coveredSkills.join(', ')} skills, but lacks ${missingSkills.join(' and ')}. Consider adding a teammate with these skills.`;
  }

  return {
    coveredSkills,
    missingSkills,
    gaps,
    summaryText
  };
}
