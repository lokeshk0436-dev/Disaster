export type UserRole = 'FAMILY' | 'PUBLIC_SERVICE' | 'PRIVATE_ORG' | 'GOVERNMENT';

export type CaseStatus = 
  | 'REPORTED_MISSING'
  | 'RESCUED'
  | 'IN_SHELTER'
  | 'HOSPITALIZED'
  | 'TRANSFERRED'
  | 'FOUND_UNVERIFIED'
  | 'AWAITING_FAMILY_VERIFICATION'
  | 'REUNITED'
  | 'CONFLICTING';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'PENDING_VERIFICATION'
  | 'PARTIALLY_VERIFIED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CONFLICTING';

export type TriageLevel = 'GREEN' | 'YELLOW' | 'RED' | 'BLACK';

export type ConnectivityStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  sector: UserRole | string;
  badge?: string;
  location?: string;
}

export interface AYPOCase {
  id: string; // e.g. "AY-2026-000124"
  personName: string;
  aliases: string[];
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Unknown';
  status: CaseStatus;
  verificationStatus: VerificationStatus;
  photoUrl: string;
  physicalDescription: string;
  
  // Sensitive/Confidential medical & triage data (Restricted by Role)
  medicalNotes?: string;
  triageLevel?: TriageLevel;
  
  // Reporter info
  reporterName: string;
  reporterRelation: string;
  reporterContact: string; // Masked for non-authorities
  
  // Location telemetry
  currentLocation: string;
  locationCoordinates: { lat: number; lng: number };
  lastSeenLocation: string;
  
  // Organization attribution
  registeredBySector: UserRole | string;
  organizationName: string;
  
  // Internal notes (Restricted to Government/Authorities)
  internalGovernmentNotes?: string;
  
  // Audit & Timelines
  timeline: TimelineEvent[];
  
  // Duplicate tracking
  isDuplicate: boolean;
  mergedIntoId: string | null;
  duplicateCandidates: string[];
  
  // Match link if linked to another record
  matchedWithCaseId?: string;
  
  // Offline sync flags
  syncStatus: 'SYNCED' | 'QUEUED_LOCAL' | 'SYNCING';
  
  createdAt: string;
  updatedAt: string;
}

export interface MatchFactorBreakdown {
  nameSimilarity: number;        // 0 to 100
  ageScore: number;              // 0 to 100
  genderMatch: boolean;          // true / false
  locationProximityScore: number;// 0 to 100
  physicalFeaturesScore: number; // 0 to 100
}

export interface AIMatchCandidate {
  id: string;
  missingCaseId: string;
  foundCaseId: string;
  missingCaseName: string;
  foundCaseName: string;
  overallConfidence: number; // e.g. 91%
  breakdown: MatchFactorBreakdown;
  rationale: string;
  status: 'PENDING_HUMAN_REVIEW' | 'VERIFIED_BY_AUTHORITY' | 'REJECTED';
  reviewedBy: string | null;
  reviewedAt: string | null;
  notes?: string;
}

export interface Shelter {
  id: string;
  name: string;
  sector: string;
  location: string;
  lat: number;
  lng: number;
  capacity: number;
  occupancy: number;
  contact: string;
  foodStatus: 'ADEQUATE' | 'CRITICAL' | 'RESTOCKING';
  waterStatus: 'ADEQUATE' | 'CRITICAL' | 'RESTOCKING';
  medicalTeamPresent: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  contact: string;
  triageBedsTotal: number;
  triageBedsAvailable: number;
  icuBedsAvailable: number;
  bloodStockStatus: 'OPTIMAL' | 'LOW_O_NEG' | 'CRITICAL';
  traumaSurgeonsOnDuty: number;
}

export interface AuditLog {
  id: string;
  who: string;
  sector: UserRole;
  what: string;
  when: string;
  action: string;
  caseId: string;
  details?: string;
}

export interface NotificationItem {
  id: string;
  caseId: string;
  targetRole: UserRole | 'ALL';
  title: string;
  message: string;
  type: 'VERIFICATION_ALERT' | 'MATCH_DETECTED' | 'REUNIFICATION_SUCCESS' | 'DISASTER_UPDATE';
  timestamp: string;
  read: boolean;
  channels: ('IN_APP' | 'SMS' | 'PUSH')[];
}

export interface SyncQueueItem {
  id: string;
  action: 'CREATE_CASE' | 'UPDATE_CASE' | 'UPDATE_STATUS' | 'ADD_TIMELINE' | 'VERIFY_CASE';
  payload: any;
  timestamp: string;
  retryCount: number;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  error?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  organizationName: string;
  badgeId: string;
  authorizedClearance: string;
  authProvider?: 'phone' | 'email' | 'google' | 'facebook' | 'apple' | 'microsoft';
  location?: { lat: number; lng: number; address?: string };
}

