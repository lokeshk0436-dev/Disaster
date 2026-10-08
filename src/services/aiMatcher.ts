import { AYPOCase, AIMatchCandidate, MatchFactorBreakdown } from '../types';

/**
 * Calculates string similarity using Levenshtein distance (0 to 100)
 */
export function calculateStringSimilarity(s1: string, s2: string): number {
  const str1 = s1.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const str2 = s2.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  if (str1 === str2) return 100;
  if (!str1.length || !str2.length) return 0;

  // Check substring contains
  if (str1.includes(str2) || str2.includes(str1)) {
    const minLen = Math.min(str1.length, str2.length);
    const maxLen = Math.max(str1.length, str2.length);
    return Math.round((minLen / maxLen) * 95);
  }

  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[str2.length][str1.length];
  const maxLen = Math.max(str1.length, str2.length);
  const similarity = Math.max(0, 1 - distance / maxLen);
  return Math.round(similarity * 100);
}

/**
 * Compares two cases and computes multi-factor AI match breakdown
 */
export function evaluateCaseMatch(missingCase: AYPOCase, foundCase: AYPOCase): AIMatchCandidate | null {
  // If either is already resolved to someone else, skip
  if (missingCase.id === foundCase.id) return null;

  // Name similarity (comparing main name and aliases)
  let bestNameScore = calculateStringSimilarity(missingCase.personName, foundCase.personName);
  for (const alias of [...missingCase.aliases, ...foundCase.aliases]) {
    const aliasScore1 = calculateStringSimilarity(missingCase.personName, alias);
    const aliasScore2 = calculateStringSimilarity(foundCase.personName, alias);
    bestNameScore = Math.max(bestNameScore, aliasScore1, aliasScore2);
  }

  // Age score
  const ageDiff = Math.abs(missingCase.age - foundCase.age);
  let ageScore = 100;
  if (ageDiff === 0) ageScore = 100;
  else if (ageDiff === 1) ageScore = 95;
  else if (ageDiff <= 3) ageScore = 80;
  else if (ageDiff <= 5) ageScore = 60;
  else if (ageDiff <= 10) ageScore = 30;
  else ageScore = 10;

  // Gender match
  let genderMatch = false;
  let genderScore = 0;
  if (missingCase.gender === foundCase.gender) {
    genderMatch = true;
    genderScore = 100;
  } else if (missingCase.gender === 'Unknown' || foundCase.gender === 'Unknown') {
    genderMatch = true;
    genderScore = 60;
  } else {
    genderMatch = false;
    genderScore = 0;
  }

  // Location proximity score
  const loc1 = (missingCase.lastSeenLocation + ' ' + missingCase.currentLocation).toLowerCase();
  const loc2 = (foundCase.lastSeenLocation + ' ' + foundCase.currentLocation).toLowerCase();
  let locationScore = 40;
  if (loc1.includes('coimbatore') && loc2.includes('coimbatore')) locationScore += 45;
  if (loc1.includes('relief centre') || loc2.includes('relief centre')) locationScore += 10;
  if (loc1.includes('nilgiris') && loc2.includes('nilgiris')) locationScore += 45;
  locationScore = Math.min(100, locationScore);

  // Physical features comparison
  const desc1Tokens = (missingCase.physicalDescription || '').toLowerCase().split(/[\s,.-]+/);
  const desc2Tokens = (foundCase.physicalDescription || '').toLowerCase().split(/[\s,.-]+/);
  const commonFeatures = desc1Tokens.filter(t => t.length > 3 && desc2Tokens.includes(t));
  let physicalFeaturesScore = 50;
  if (commonFeatures.length > 0) {
    physicalFeaturesScore = Math.min(100, 50 + commonFeatures.length * 20);
  }

  // Weighted Overall Confidence
  // Name 35%, Age 20%, Gender 15%, Location 15%, Physical 15%
  const overallConfidence = Math.round(
    (bestNameScore * 0.35) +
    (ageScore * 0.20) +
    (genderScore * 0.15) +
    (locationScore * 0.15) +
    (physicalFeaturesScore * 0.15)
  );

  // Filter out low scores (only candidate matches >= 60%)
  if (overallConfidence < 60) return null;

  const breakdown: MatchFactorBreakdown = {
    nameSimilarity: bestNameScore,
    ageScore: ageScore,
    genderMatch: genderMatch,
    locationProximityScore: locationScore,
    physicalFeaturesScore: physicalFeaturesScore
  };

  const rationale = `AI multi-attribute evaluation: ${bestNameScore}% name phonetic alignment ('${missingCase.personName}' ↔ '${foundCase.personName}'), age delta ±${ageDiff} yr, ${genderMatch ? 'concordant' : 'discordant'} gender, ${locationScore}% sector proximity. Key physical overlap: ${commonFeatures.length > 0 ? commonFeatures.join(', ') : 'standard emergency triage'}. Human verification required.`;

  return {
    id: `MATCH-${missingCase.id}-${foundCase.id}`,
    missingCaseId: missingCase.id,
    foundCaseId: foundCase.id,
    missingCaseName: missingCase.personName,
    foundCaseName: foundCase.personName,
    overallConfidence,
    breakdown,
    rationale,
    status: 'PENDING_HUMAN_REVIEW',
    reviewedBy: null,
    reviewedAt: null
  };
}

/**
 * Scans all missing and found cases across the disaster registry to find candidates
 */
export function scanForAIMatches(cases: AYPOCase[]): AIMatchCandidate[] {
  const missing = cases.filter(c => c.status === 'REPORTED_MISSING' && !c.mergedIntoId);
  const found = cases.filter(c => 
    c.status !== 'REPORTED_MISSING' && 
    c.status !== 'REUNITED' && 
    !c.mergedIntoId
  );

  const results: AIMatchCandidate[] = [];

  for (const m of missing) {
    for (const f of found) {
      const candidate = evaluateCaseMatch(m, f);
      if (candidate) {
        results.push(candidate);
      }
    }
  }

  return results.sort((a, b) => b.overallConfidence - a.overallConfidence);
}
