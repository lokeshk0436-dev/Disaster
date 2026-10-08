import { AYPOCase, UserRole } from '../types';

/**
 * AYPO DATA ISOLATION & LEAST-PRIVILEGE SECURITY LAYER
 * 
 * "RIGHT DATA -> RIGHT ORGANIZATION -> RIGHT USER"
 * Strictly prevents data leakage across portals.
 */

export function maskPhoneNumber(phone?: string): string {
  if (!phone) return 'Confidential';
  const cleaned = phone.trim();
  if (cleaned.length < 8) return '***-***-****';
  return cleaned.slice(0, 3) + ' •••••• ' + cleaned.slice(-2);
}

export function sanitizeCaseForRole(caseRecord: AYPOCase, userRole: UserRole): AYPOCase {
  // Deep copy to prevent mutation
  const safeCopy: AYPOCase = JSON.parse(JSON.stringify(caseRecord));

  switch (userRole) {
    case 'FAMILY':
      // Redact confidential internal fields
      delete safeCopy.medicalNotes;
      delete safeCopy.triageLevel;
      delete safeCopy.internalGovernmentNotes;
      
      // Mask phone numbers to avoid harassment/scams during crises
      safeCopy.reporterContact = maskPhoneNumber(safeCopy.reporterContact);
      
      // Filter internal operational timeline events (keep only family-relevant checkpoints)
      safeCopy.timeline = safeCopy.timeline.filter(t => 
        t.title.includes('Reported') ||
        t.title.includes('Sighting') ||
        t.title.includes('Shelter') ||
        t.title.includes('Hospital') ||
        t.title.includes('Verification') ||
        t.title.includes('Notified') ||
        t.title.includes('REUNITED')
      );
      break;

    case 'PRIVATE_ORG':
      // NGOs do not receive confidential patient medical records or classified gov notes
      delete safeCopy.medicalNotes;
      delete safeCopy.internalGovernmentNotes;
      safeCopy.reporterContact = maskPhoneNumber(safeCopy.reporterContact);
      break;

    case 'PUBLIC_SERVICE':
      // Hospitals & shelters need medical notes and triage info, but not classified gov intelligence
      delete safeCopy.internalGovernmentNotes;
      break;

    case 'GOVERNMENT':
      // Government authorities have full cross-sector visibility for verification & coordination
      break;

    default:
      // Fail closed
      delete safeCopy.medicalNotes;
      delete safeCopy.triageLevel;
      delete safeCopy.internalGovernmentNotes;
      safeCopy.reporterContact = 'Restricted';
      break;
  }

  return safeCopy;
}

export function filterCasesForRole(cases: AYPOCase[], userRole: UserRole, activeOrgName?: string): AYPOCase[] {
  // First, isolate datasets based on portal authorization boundaries
  const isolatedCases = cases.filter(c => {
    // Hide merged duplicate records from all active operational rosters
    if (c.mergedIntoId) return false;

    switch (userRole) {
      case 'FAMILY':
        // Family Portal Dataset:
        // 1. All missing person petitions filed by families
        // 2. Officially publicized shelter/hospital found persons & certified verified cases
        return (
          c.registeredBySector === 'FAMILY' ||
          c.status === 'REPORTED_MISSING' ||
          c.status === 'AWAITING_FAMILY_VERIFICATION' ||
          c.status === 'REUNITED' ||
          c.verificationStatus === 'VERIFIED' ||
          c.verificationStatus === 'PARTIALLY_VERIFIED'
        );

      case 'PUBLIC_SERVICE':
        // Public Service Dataset:
        // Medical admissions, emergency triage, hospital beds, and municipal shelter evacuees
        return (
          c.registeredBySector === 'PUBLIC_SERVICE' ||
          c.status === 'HOSPITALIZED' ||
          c.status === 'IN_SHELTER' ||
          c.status === 'RESCUED' ||
          c.status === 'TRANSFERRED' ||
          c.status === 'AWAITING_FAMILY_VERIFICATION' ||
          c.status === 'REUNITED' ||
          c.status === 'REPORTED_MISSING'
        );

      case 'PRIVATE_ORG':
        // Private Organization / NGO Dataset:
        // Field relief cases handled by NGOs, volunteer sightings, and assigned search sectors
        return (
          c.registeredBySector === 'PRIVATE_ORG' ||
          c.organizationName.toLowerCase().includes('red cross') ||
          c.organizationName.toLowerCase().includes('ngo') ||
          c.organizationName.toLowerCase().includes('volunteer') ||
          c.status === 'IN_SHELTER' ||
          c.status === 'REPORTED_MISSING' ||
          c.status === 'REUNITED'
        );

      case 'GOVERNMENT':
        // Government Command Dataset:
        // Full cross-sector oversight for incident verification, duplicate merging, and coordination
        return true;

      default:
        return false;
    }
  });

  // Second, sanitize fields (redact sensitive internal memos, medical notes, phone numbers)
  return isolatedCases.map(c => sanitizeCaseForRole(c, userRole));
}

