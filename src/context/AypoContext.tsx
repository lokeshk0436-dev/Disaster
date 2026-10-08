import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  UserProfile,
  AYPOCase,
  Shelter,
  Hospital,
  AIMatchCandidate,
  ConnectivityStatus,
  SyncQueueItem,
  AuditLog,
  NotificationItem,
  CaseStatus,
  VerificationStatus
} from '../types';
import { INITIAL_USERS, INITIAL_SHELTERS, INITIAL_HOSPITALS } from '../services/seedData';
import { storageService } from '../services/storage';
import { scanForAIMatches } from '../services/aiMatcher';
import { sanitizeCaseForRole, filterCasesForRole } from '../services/dataIsolation';
import { audioAlert } from '../services/audioAlert';

interface AypoContextType {
  // Roles & Authentication
  isAuthenticated: boolean;
  currentRole: UserRole;
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  login: (credentials: {
    identifier: string;
    password?: string;
    role?: UserRole;
    authProvider?: 'phone' | 'email' | 'google' | 'facebook' | 'apple' | 'microsoft';
  }) => Promise<boolean>;
  signup: (userData: {
    name: string;
    emailOrPhone: string;
    role: UserRole;
    password?: string;
    organizationName?: string;
    location?: { lat: number; lng: number; address?: string };
    authProvider?: 'phone' | 'email' | 'google' | 'facebook' | 'apple' | 'microsoft';
  }) => Promise<boolean>;
  socialLogin: (
    provider: 'google' | 'facebook' | 'apple' | 'microsoft',
    targetRole?: UserRole
  ) => Promise<void>;
  logout: () => void;

  // Data
  cases: AYPOCase[];
  visibleCases: AYPOCase[];
  shelters: Shelter[];
  hospitals: Hospital[];
  aiMatches: AIMatchCandidate[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  unreadNotifCount: number;

  // Connectivity & Offline
  connectivity: ConnectivityStatus;
  setConnectivity: (status: ConnectivityStatus) => void;
  syncQueue: SyncQueueItem[];
  triggerSync: () => Promise<void>;

  // Emergency Mode & UI
  isEmergencyMode: boolean;
  toggleEmergencyMode: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;

  // Actions
  createCase: (caseData: Partial<AYPOCase>) => Promise<AYPOCase>;
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, location?: string, note?: string) => Promise<void>;
  verifyCase: (caseId: string, decision: VerificationStatus, note?: string) => Promise<void>;
  verifyAIMatch: (matchId: string, approved: boolean) => Promise<void>;
  mergeDuplicateCases: (primaryId: string, duplicateId: string) => Promise<void>;
  confirmFamilyReunification: (caseId: string) => Promise<void>;
  markNotificationRead: (id: string) => void;

  // Simulation Scenario Walkthrough
  demoStep: number;
  setDemoStep: (step: number) => void;
  advanceDemoStep: () => void;
  resetDemo: () => void;

  // Modal celebration
  reunionModalCase: AYPOCase | null;
  closeReunionModal: () => void;
}

const AypoContext = createContext<AypoContextType | undefined>(undefined);

export const AypoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return storageService.getSession() !== null;
  });
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const session = storageService.getSession();
    return session || INITIAL_USERS[0];
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const session = storageService.getSession();
    return session ? session.role : 'FAMILY';
  });

  const [cases, setCases] = useState<AYPOCase[]>(() => storageService.getCases());
  const [shelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [aiMatches, setAiMatches] = useState<AIMatchCandidate[]>([]);
  const [connectivity, setConnectivityState] = useState<ConnectivityStatus>('ONLINE');
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => storageService.getSyncQueue());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => storageService.getAuditLogs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.getNotifications());
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [reunionModalCase, setReunionModalCase] = useState<AYPOCase | null>(null);

  // Authentication: Login
  const login = async (credentials: {
    identifier: string;
    password?: string;
    role?: UserRole;
    authProvider?: 'phone' | 'email' | 'google' | 'facebook' | 'apple' | 'microsoft';
  }): Promise<boolean> => {
    const users = storageService.getUsers();
    const cleanIdent = credentials.identifier.trim();
    
    // Look up by email, phone, or badgeId
    let user = users.find(u => 
      (u.email && u.email.toLowerCase() === cleanIdent.toLowerCase()) ||
      (u.phone && u.phone.replace(/[\s-+()]/g, '') === cleanIdent.replace(/[\s-+()]/g, '')) ||
      (u.badgeId && u.badgeId.toLowerCase() === cleanIdent.toLowerCase())
    );

    // If role explicitly chosen during login, ensure user profile matches that portal
    if (credentials.role) {
      const roleMatch = users.find(u => 
        u.role === credentials.role &&
        ((u.email && u.email.toLowerCase() === cleanIdent.toLowerCase()) ||
         (u.phone && u.phone.replace(/[\s-+()]/g, '') === cleanIdent.replace(/[\s-+()]/g, '')))
      );
      if (roleMatch) {
        user = roleMatch;
      } else if (user) {
        // Adapt user profile to the explicitly chosen portal
        user = {
          ...user,
          role: credentials.role,
          organizationName: credentials.role === 'FAMILY' ? 'Direct Family / Public' :
                            credentials.role === 'PUBLIC_SERVICE' ? 'Emergency Medical Services' :
                            credentials.role === 'PRIVATE_ORG' ? 'Humanitarian Relief Wing' :
                            'National Disaster Management Command',
          authorizedClearance: credentials.role === 'GOVERNMENT' ? 'Level-4 Incident Command' : 'Operational Clearance'
        };
      } else {
        user = users.find(u => u.role === credentials.role);
      }
    }

    // If still not found, create new account dynamically
    if (!user) {
      const targetRole = credentials.role || 'FAMILY';
      const isPhone = !cleanIdent.includes('@');
      user = {
        id: `user-${Date.now()}`,
        name: isPhone ? `Mobile User (${cleanIdent.slice(-4)})` : cleanIdent.split('@')[0],
        email: !isPhone ? cleanIdent : undefined,
        phone: isPhone ? cleanIdent : undefined,
        role: targetRole,
        organizationName: targetRole === 'FAMILY' ? 'Direct Family / Public' :
                          targetRole === 'PUBLIC_SERVICE' ? 'Emergency Medical Services' :
                          targetRole === 'PRIVATE_ORG' ? 'Red Cross Volunteer Corps' :
                          'National Disaster Management Command',
        badgeId: `${targetRole.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
        authorizedClearance: targetRole === 'GOVERNMENT' ? 'Level-4 Incident Command' : 'Verified Portal Access',
        authProvider: credentials.authProvider || (isPhone ? 'phone' : 'email')
      };
      storageService.registerUser(user);
    }

    storageService.saveSession(user);
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthenticated(true);

    storageService.addAuditLog({
      who: user.name,
      sector: user.role,
      what: `Authenticated session initiated into ${user.role} Portal via ${credentials.authProvider || 'credentials'}`,
      action: 'USER_LOGIN',
      caseId: 'AUTH_GATE'
    });
    setAuditLogs(storageService.getAuditLogs());
    audioAlert.playTacticalPing();
    return true;
  };

  // Authentication: Sign Up
  const signup = async (userData: {
    name: string;
    emailOrPhone: string;
    role: UserRole;
    password?: string;
    organizationName?: string;
    location?: { lat: number; lng: number; address?: string };
    authProvider?: 'phone' | 'email' | 'google' | 'facebook' | 'apple' | 'microsoft';
  }): Promise<boolean> => {
    const isEmail = userData.emailOrPhone.includes('@');
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: isEmail ? userData.emailOrPhone.trim() : undefined,
      phone: !isEmail ? userData.emailOrPhone.trim() : undefined,
      role: userData.role,
      organizationName: userData.organizationName || (
        userData.role === 'FAMILY' ? 'Affected Public / Family' :
        userData.role === 'PUBLIC_SERVICE' ? 'Public Hospital & Emergency Triage' :
        userData.role === 'PRIVATE_ORG' ? 'Humanitarian Relief Organization' :
        'State Disaster Management Authority'
      ),
      badgeId: `${userData.role.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      authorizedClearance: userData.role === 'GOVERNMENT' ? 'Level-4 Incident Command' : 'Operational Clearance',
      authProvider: userData.authProvider || (isEmail ? 'email' : 'phone'),
      location: userData.location
    };

    storageService.registerUser(newUser);
    storageService.saveSession(newUser);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    setIsAuthenticated(true);

    storageService.addAuditLog({
      who: newUser.name,
      sector: newUser.role,
      what: `New account registered and routed to ${newUser.role} portal`,
      action: 'USER_REGISTRATION',
      caseId: 'AUTH_GATE'
    });
    setAuditLogs(storageService.getAuditLogs());
    audioAlert.playVerificationChime();
    return true;
  };

  // Authentication: Social OAuth
  const socialLogin = async (
    provider: 'google' | 'facebook' | 'apple' | 'microsoft',
    targetRole?: UserRole
  ) => {
    const role = targetRole || 'FAMILY';
    const providerNames: Record<string, string> = {
      google: 'Google',
      facebook: 'Facebook',
      apple: 'Apple',
      microsoft: 'Microsoft'
    };

    // Check if demo user for this role exists
    const users = storageService.getUsers();
    let existing = users.find(u => u.role === role);

    const profile: UserProfile = existing ? {
      ...existing,
      authProvider: provider
    } : {
      id: `usr-${provider}-${Date.now()}`,
      name: `${providerNames[provider]} User`,
      email: `user.${provider}@aypo.org`,
      role: role,
      organizationName: role === 'FAMILY' ? 'Direct Family / Public' :
                        role === 'PUBLIC_SERVICE' ? 'Emergency Medical Services' :
                        role === 'PRIVATE_ORG' ? 'Disaster Relief Wing' :
                        'Disaster Incident Command',
      badgeId: `${role.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      authorizedClearance: role === 'GOVERNMENT' ? 'Level-4 Commander' : 'Verified Social Identity',
      authProvider: provider
    };

    storageService.registerUser(profile);
    storageService.saveSession(profile);
    setCurrentUser(profile);
    setCurrentRole(profile.role);
    setIsAuthenticated(true);

    storageService.addAuditLog({
      who: profile.name,
      sector: profile.role,
      what: `Single Sign-On authenticated via ${providerNames[provider]}`,
      action: 'OAUTH_LOGIN',
      caseId: 'AUTH_GATE'
    });
    setAuditLogs(storageService.getAuditLogs());
    audioAlert.playVerificationChime();
  };

  // Authentication: Logout
  const logout = () => {
    storageService.clearSession();
    setIsAuthenticated(false);
    storageService.addAuditLog({
      who: currentUser.name,
      sector: currentRole,
      what: `User logged out of active session`,
      action: 'USER_LOGOUT',
      caseId: 'AUTH_GATE'
    });
    setAuditLogs(storageService.getAuditLogs());
  };

  // Sync user profile when role changes
  const setRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const users = storageService.getUsers();
    const profile = users.find(u => u.role === newRole) || {
      ...currentUser,
      role: newRole,
      organizationName: newRole === 'FAMILY' ? 'Direct Family Reporting' :
                        newRole === 'PUBLIC_SERVICE' ? 'Emergency Medical Services' :
                        newRole === 'PRIVATE_ORG' ? 'Disaster Relief Wing' :
                        'National Disaster Management Command'
    };
    setCurrentUser(profile);
    storageService.saveSession(profile);
    storageService.addAuditLog({
      who: profile.name,
      sector: newRole,
      what: `Switched active portal session to ${newRole}`,
      action: 'PORTAL_SWITCH',
      caseId: 'SYSTEM'
    });
    setAuditLogs(storageService.getAuditLogs());
  };

  // Run AI matching evaluation whenever cases change
  useEffect(() => {
    const matches = scanForAIMatches(cases);
    setAiMatches(matches);
  }, [cases]);

  // Trigger connectivity change with tactical audio feedback
  const setConnectivity = (status: ConnectivityStatus) => {
    setConnectivityState(status);
    audioAlert.playTacticalPing();
    storageService.addAuditLog({
      who: currentUser.name,
      sector: currentRole,
      what: `Network environment switched to ${status} mode`,
      action: status === 'OFFLINE' ? 'ENTER_OFFLINE_MODE' : 'RESTORE_CONNECTIVITY',
      caseId: 'NETWORK_TELEMETRY'
    });
    setAuditLogs(storageService.getAuditLogs());

    // If switching from offline to online with items in queue, auto-trigger sync!
    if (status === 'ONLINE' && syncQueue.length > 0) {
      triggerSync();
    }
  };

  // Offline Sync Queue Processor
  const triggerSync = async () => {
    if (syncQueue.length === 0) return;

    setConnectivityState('SYNCING');
    await new Promise(r => setTimeout(r, 1200)); // Simulate realistic network handshake

    // Replay queued items into live cases
    const currentQueue = storageService.getSyncQueue();
    let updatedCases = [...storageService.getCases()];

    for (const item of currentQueue) {
      if (item.action === 'CREATE_CASE') {
        const newCase = item.payload as AYPOCase;
        newCase.syncStatus = 'SYNCED';
        const existingIdx = updatedCases.findIndex(c => c.id === newCase.id);
        if (existingIdx >= 0) {
          updatedCases[existingIdx] = newCase;
        } else {
          updatedCases.unshift(newCase);
        }
      } else if (item.action === 'UPDATE_STATUS') {
        const { caseId, newStatus, location, note } = item.payload;
        updatedCases = updatedCases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              status: newStatus,
              currentLocation: location || c.currentLocation,
              syncStatus: 'SYNCED',
              updatedAt: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: `tl-sync-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  title: `Status: ${newStatus}`,
                  description: note || `Location updated to ${location || c.currentLocation}`,
                  actor: 'Offline Sync Relay',
                  sector: 'PUBLIC_SERVICE',
                  badge: 'SYNCED'
                }
              ]
            };
          }
          return c;
        });
      }
    }

    storageService.saveCases(updatedCases);
    setCases(updatedCases);

    storageService.clearSyncQueue();
    setSyncQueue([]);

    storageService.addAuditLog({
      who: 'AYPO Uplink Engine',
      sector: 'PUBLIC_SERVICE',
      what: `Synchronized ${currentQueue.length} offline records to central database`,
      action: 'BATCH_SYNC_COMPLETE',
      caseId: 'SYNC_DISPATCHER'
    });
    setAuditLogs(storageService.getAuditLogs());

    storageService.addNotification({
      caseId: 'SYSTEM',
      targetRole: 'ALL',
      title: 'Connectivity Uplink Restored',
      message: `All ${currentQueue.length} pending offline field records have synchronized successfully.`,
      type: 'DISASTER_UPDATE',
      channels: ['IN_APP']
    });
    setNotifications(storageService.getNotifications());

    audioAlert.playVerificationChime();
    setConnectivityState('ONLINE');
  };

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(prev => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        if (next) {
          document.body.classList.add('emergency-mode');
        } else {
          document.body.classList.remove('emergency-mode');
        }
      }
      return next;
    });
  };

  // Generate unique AYPO Case ID: e.g. AY-2026-000134
  const generateCaseId = (): string => {
    const existing = cases.map(c => {
      const match = c.id.match(/AY-2026-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxNum = existing.length > 0 ? Math.max(...existing, 133) : 133;
    const nextNum = maxNum + 1;
    return `AY-2026-${String(nextNum).padStart(6, '0')}`;
  };

  // Create Case (Handles both ONLINE and OFFLINE paths!)
  const createCase = async (caseData: Partial<AYPOCase>): Promise<AYPOCase> => {
    const caseId = generateCaseId();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isOffline = connectivity === 'OFFLINE';

    const newCase: AYPOCase = {
      id: caseId,
      personName: caseData.personName || 'Unidentified Person',
      aliases: caseData.aliases || [],
      age: caseData.age || 0,
      gender: caseData.gender || 'Unknown',
      status: caseData.status || (currentRole === 'FAMILY' ? 'REPORTED_MISSING' : 'IN_SHELTER'),
      verificationStatus: caseData.verificationStatus || 'PENDING_VERIFICATION',
      photoUrl: caseData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      physicalDescription: caseData.physicalDescription || '',
      medicalNotes: caseData.medicalNotes,
      triageLevel: caseData.triageLevel || 'GREEN',
      reporterName: currentUser.name,
      reporterRelation: currentRole === 'FAMILY' ? (caseData.reporterRelation || 'Family Member') : 'Authorized Officer',
      reporterContact: caseData.reporterContact || '+91 98765 43210',
      currentLocation: caseData.currentLocation || 'Coimbatore Emergency Sector',
      locationCoordinates: caseData.locationCoordinates || { lat: 11.0065, lng: 76.9664 },
      lastSeenLocation: caseData.lastSeenLocation || caseData.currentLocation || 'Unknown',
      registeredBySector: currentRole,
      organizationName: currentUser.organizationName,
      internalGovernmentNotes: caseData.internalGovernmentNotes || 'Registered in field intake',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: nowStr,
          title: currentRole === 'FAMILY' ? 'Missing Person Report Filed' : 'Person Registered in Field',
          description: `Registered at ${caseData.currentLocation || 'Disaster Reception Point'} by ${currentUser.name}`,
          actor: currentUser.name,
          sector: currentRole,
          badge: isOffline ? 'OFFLINE INTAKE' : 'REGISTERED'
        }
      ],
      isDuplicate: false,
      mergedIntoId: null,
      duplicateCandidates: [],
      syncStatus: isOffline ? 'QUEUED_LOCAL' : 'SYNCED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isOffline) {
      // Put in sync queue
      storageService.addToSyncQueue({
        action: 'CREATE_CASE',
        payload: newCase
      });
      setSyncQueue(storageService.getSyncQueue());

      // Save locally to display immediately in UI
      const updated = [newCase, ...cases];
      storageService.saveCases(updated);
      setCases(updated);

      storageService.addAuditLog({
        who: currentUser.name,
        sector: currentRole,
        what: `Created Case ${caseId} (${newCase.personName}) [OFFLINE QUEUED]`,
        action: 'OFFLINE_CASE_QUEUED',
        caseId: caseId
      });
      setAuditLogs(storageService.getAuditLogs());

      audioAlert.playTacticalPing();
    } else {
      // Online: write directly
      const updated = [newCase, ...cases];
      storageService.saveCases(updated);
      setCases(updated);

      storageService.addAuditLog({
        who: currentUser.name,
        sector: currentRole,
        what: `Created Case ${caseId} (${newCase.personName}) [ONLINE]`,
        action: 'CASE_CREATED',
        caseId: caseId
      });
      setAuditLogs(storageService.getAuditLogs());

      storageService.addNotification({
        caseId: caseId,
        targetRole: 'ALL',
        title: `New Case Registered: ${caseId}`,
        message: `${newCase.personName} registered by ${currentUser.organizationName}`,
        type: 'DISASTER_UPDATE',
        channels: ['IN_APP']
      });
      setNotifications(storageService.getNotifications());

      audioAlert.playVerificationChime();
    }

    return newCase;
  };

  const updateCaseStatus = async (caseId: string, newStatus: CaseStatus, location?: string, note?: string) => {
    const isOffline = connectivity === 'OFFLINE';
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isOffline) {
      storageService.addToSyncQueue({
        action: 'UPDATE_STATUS',
        payload: { caseId, newStatus, location, note }
      });
      setSyncQueue(storageService.getSyncQueue());
    }

    const updated = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: newStatus,
          currentLocation: location || c.currentLocation,
          syncStatus: isOffline ? ('QUEUED_LOCAL' as const) : ('SYNCED' as const),
          updatedAt: new Date().toISOString(),
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: nowStr,
              title: `Status: ${newStatus.replace(/_/g, ' ')}`,
              description: note || `Location: ${location || c.currentLocation}`,
              actor: currentUser.name,
              sector: currentRole,
              badge: newStatus
            }
          ]
        };
      }
      return c;
    });

    storageService.saveCases(updated);
    setCases(updated);

    storageService.addAuditLog({
      who: currentUser.name,
      sector: currentRole,
      what: `Updated Case ${caseId} status to ${newStatus}`,
      action: 'STATUS_UPDATED',
      caseId: caseId
    });
    setAuditLogs(storageService.getAuditLogs());
  };

  // Authority Verification
  const verifyCase = async (caseId: string, decision: VerificationStatus, note?: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = cases.map(c => {
      if (c.id === caseId) {
        const isVerified = decision === 'VERIFIED';
        return {
          ...c,
          verificationStatus: decision,
          status: isVerified ? ('AWAITING_FAMILY_VERIFICATION' as CaseStatus) : c.status,
          internalGovernmentNotes: note || `Verified by ${currentUser.name} (${currentUser.organizationName})`,
          timeline: [
            ...c.timeline,
            {
              id: `tl-ver-${Date.now()}`,
              timestamp: nowStr,
              title: `Government Authority: ${decision}`,
              description: note || `Official verification completed by ${currentUser.name}`,
              actor: currentUser.name,
              sector: 'GOVERNMENT',
              badge: decision
            }
          ]
        };
      }
      return c;
    });

    storageService.saveCases(updated);
    setCases(updated);

    storageService.addAuditLog({
      who: currentUser.name,
      sector: 'GOVERNMENT',
      what: `Authority marked Case ${caseId} as ${decision}`,
      action: 'AUTHORITY_VERIFIED',
      caseId: caseId
    });
    setAuditLogs(storageService.getAuditLogs());

    if (decision === 'VERIFIED') {
      const targetCase = updated.find(c => c.id === caseId);
      storageService.addNotification({
        caseId: caseId,
        targetRole: 'FAMILY',
        title: 'Official Government Verification Alert',
        message: `Your family member (${targetCase?.personName}) has been officially verified at ${targetCase?.currentLocation}. Please verify and initiate reunification.`,
        type: 'VERIFICATION_ALERT',
        channels: ['IN_APP', 'SMS', 'PUSH']
      });
      setNotifications(storageService.getNotifications());
      audioAlert.playVerificationChime();
    }
  };

  // AI Match Review & Approval by Authority
  const verifyAIMatch = async (matchId: string, approved: boolean) => {
    const match = aiMatches.find(m => m.id === matchId);
    if (!match) return;

    if (approved) {
      await verifyCase(
        match.missingCaseId,
        'VERIFIED',
        `AI Match approved with ${match.foundCaseName} (${match.overallConfidence}% confidence).`
      );
      await verifyCase(
        match.foundCaseId,
        'VERIFIED',
        `AI Match approved with ${match.missingCaseName} (${match.overallConfidence}% confidence).`
      );
    }

    setAiMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status: approved ? 'VERIFIED_BY_AUTHORITY' : 'REJECTED',
          reviewedBy: currentUser.name,
          reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return m;
    }));
  };

  // Merge Duplicate Cases
  const mergeDuplicateCases = async (primaryId: string, duplicateId: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dupCase = cases.find(c => c.id === duplicateId);
    if (!dupCase) return;

    const updated = cases.map(c => {
      if (c.id === primaryId) {
        return {
          ...c,
          aliases: Array.from(new Set([...c.aliases, dupCase.personName, ...dupCase.aliases])),
          duplicateCandidates: c.duplicateCandidates.filter(d => d !== duplicateId),
          timeline: [
            ...c.timeline,
            {
              id: `tl-merge-${Date.now()}`,
              timestamp: nowStr,
              title: `Duplicate Record Merged (${duplicateId})`,
              description: `Government authority merged redundant record created at ${dupCase.organizationName}.`,
              actor: currentUser.name,
              sector: 'GOVERNMENT',
              badge: 'MERGED'
            }
          ]
        };
      }
      if (c.id === duplicateId) {
        return {
          ...c,
          isDuplicate: true,
          mergedIntoId: primaryId,
          status: 'CONFLICTING' as CaseStatus
        };
      }
      return c;
    });

    storageService.saveCases(updated);
    setCases(updated);

    storageService.addAuditLog({
      who: currentUser.name,
      sector: 'GOVERNMENT',
      what: `Merged duplicate case ${duplicateId} into primary case ${primaryId}`,
      action: 'DUPLICATE_MERGED',
      caseId: primaryId
    });
    setAuditLogs(storageService.getAuditLogs());
  };

  // Final Family Reunification Action (Emotional Climax!)
  const confirmFamilyReunification = async (caseId: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetCase = cases.find(c => c.id === caseId);

    const updated = cases.map(c => {
      if (c.id === caseId || (targetCase?.matchedWithCaseId && c.id === targetCase.matchedWithCaseId)) {
        return {
          ...c,
          status: 'REUNITED' as CaseStatus,
          verificationStatus: 'VERIFIED' as VerificationStatus,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...c.timeline,
            {
              id: `tl-reunion-${Date.now()}`,
              timestamp: nowStr,
              title: 'REUNIFICATION SUCCESSFUL!',
              description: 'Family identity confirmed. Physical reunification completed at Relief Centre.',
              actor: `${c.reporterName} (Family) & ${currentUser.name}`,
              sector: 'FAMILY',
              badge: 'REUNITED'
            }
          ]
        };
      }
      return c;
    });

    storageService.saveCases(updated);
    setCases(updated);

    storageService.addAuditLog({
      who: currentUser.name,
      sector: 'FAMILY',
      what: `Reunification officially finalized for Case ${caseId} (${targetCase?.personName})`,
      action: 'REUNIFICATION_SUCCESS',
      caseId: caseId
    });
    setAuditLogs(storageService.getAuditLogs());

    storageService.addNotification({
      caseId: caseId,
      targetRole: 'ALL',
      title: 'REUNIFICATION SUCCESSFUL!',
      message: `${targetCase?.personName} has been officially reunited with family at ${targetCase?.currentLocation}.`,
      type: 'REUNIFICATION_SUCCESS',
      channels: ['IN_APP', 'SMS', 'PUSH']
    });
    setNotifications(storageService.getNotifications());

    // Play victory fanfare sound
    audioAlert.playReunificationFanfare();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch (e) {}

    // Open celebration modal
    const finalRecord = updated.find(c => c.id === caseId) || targetCase;
    if (finalRecord) {
      setReunionModalCase(finalRecord);
    }
  };

  const closeReunionModal = () => {
    setReunionModalCase(null);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    storageService.saveNotifications(updated);
    setNotifications(updated);
  };

  // Hackathon 10-Step Story Walkthrough Advance
  const advanceDemoStep = () => {
    const nextStep = demoStep < 10 ? demoStep + 1 : 1;
    setDemoStep(nextStep);

    switch (nextStep) {
      case 1:
        // Step 1: Disaster Occurs
        setRole('GOVERNMENT');
        setActiveTab('dashboard');
        break;
      case 2:
        // Step 2: Family Reports Raj Kumar missing
        setRole('FAMILY');
        setActiveTab('track');
        setSelectedCaseId('AY-2026-000124');
        break;
      case 3:
        // Step 3: Rescue Worker enters No-Tower Zone -> Switch to OFFLINE
        setRole('PUBLIC_SERVICE');
        setConnectivity('OFFLINE');
        setActiveTab('register');
        break;
      case 4:
        // Step 4: Worker registers found person locally
        setRole('PUBLIC_SERVICE');
        setActiveTab('queue');
        break;
      case 5:
        // Step 5: Worker reaches connected outpost -> CONNECTIVITY RESTORED
        setConnectivity('ONLINE');
        break;
      case 6:
        // Step 6: AYPO auto-synchronizes record
        triggerSync();
        break;
      case 7:
        // Step 7: AI identifies 91% match
        setRole('GOVERNMENT');
        setActiveTab('ai-matches');
        break;
      case 8:
        // Step 8: Government Authority verifies match
        setRole('GOVERNMENT');
        setActiveTab('verification');
        verifyAIMatch('MATCH-AY-2026-000124-AY-2026-000129', true);
        break;
      case 9:
        // Step 9: Family receives verified notification
        setRole('FAMILY');
        setActiveTab('track');
        setSelectedCaseId('AY-2026-000124');
        break;
      case 10:
        // Step 10: Family reunites -> REUNIFICATION SUCCESSFUL
        setRole('FAMILY');
        confirmFamilyReunification('AY-2026-000124');
        break;
      default:
        break;
    }
  };

  const resetDemo = () => {
    storageService.resetAllDemoData();
    setCases(storageService.getCases());
    setAuditLogs(storageService.getAuditLogs());
    setNotifications(storageService.getNotifications());
    setSyncQueue([]);
    setConnectivityState('ONLINE');
    setRole('FAMILY');
    setActiveTab('dashboard');
    setSelectedCaseId(null);
    setDemoStep(1);
    setReunionModalCase(null);
  };

  // Strictly isolate portal datasets and sanitize fields per Portal Role
  const visibleCases = filterCasesForRole(cases, currentRole, currentUser.organizationName);

  const unreadNotifCount = notifications.filter(n => !n.read && (n.targetRole === currentRole || n.targetRole === 'ALL')).length;

  return (
    <AypoContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        socialLogin,
        logout,
        currentRole,
        currentUser,
        setRole,
        cases,
        visibleCases,
        shelters,
        hospitals,
        aiMatches,
        auditLogs,
        notifications,
        unreadNotifCount,
        connectivity,
        setConnectivity,
        syncQueue,
        triggerSync,
        isEmergencyMode,
        toggleEmergencyMode,
        activeTab,
        setActiveTab,
        selectedCaseId,
        setSelectedCaseId,
        createCase,
        updateCaseStatus,
        verifyCase,
        verifyAIMatch,
        mergeDuplicateCases,
        confirmFamilyReunification,
        markNotificationRead,
        demoStep,
        setDemoStep,
        advanceDemoStep,
        resetDemo,
        reunionModalCase,
        closeReunionModal
      }}
    >
      {children}
    </AypoContext.Provider>
  );
};

export const useAypo = () => {
  const context = useContext(AypoContext);
  if (!context) {
    throw new Error('useAypo must be used within an AypoProvider');
  }
  return context;
};
