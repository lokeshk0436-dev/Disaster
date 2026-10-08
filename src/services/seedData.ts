import { AYPOCase, Shelter, Hospital, AuditLog, NotificationItem, UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-family-1',
    name: 'Anita Kumar',
    email: 'family@aypo.org',
    phone: '+91 98401 22341',
    role: 'FAMILY',
    organizationName: 'Affected Public / Family',
    badgeId: 'FAM-2026-8812',
    authorizedClearance: 'Verified Family Member',
    authProvider: 'phone'
  },
  {
    id: 'user-pub-1',
    name: 'Dr. Vigneshwar M. (Chief Triage Officer)',
    email: 'hospital@aypo.org',
    phone: '+91 94440 12345',
    role: 'PUBLIC_SERVICE',
    organizationName: 'Coimbatore General Trauma Centre',
    badgeId: 'PUB-MED-042',
    authorizedClearance: 'Level-2 Medical Command',
    authProvider: 'email'
  },
  {
    id: 'user-pvt-1',
    name: 'Selvi Meenakshi (Field Operations Lead)',
    email: 'ngo@aypo.org',
    phone: '+91 98941 00213',
    role: 'PRIVATE_ORG',
    organizationName: 'Red Cross Disaster Relief Wing',
    badgeId: 'NGO-RC-109',
    authorizedClearance: 'Field Coordinator Clearance',
    authProvider: 'google'
  },
  {
    id: 'user-gov-1',
    name: 'Dr. K. Ravichandran, IAS (Disaster Commissioner)',
    email: 'government@aypo.org',
    phone: '+91 94430 00001',
    role: 'GOVERNMENT',
    organizationName: 'National Disaster Management Command (NDMC)',
    badgeId: 'GOV-EOC-001',
    authorizedClearance: 'Level-4 State Incident Commander',
    authProvider: 'microsoft'
  }
];

export const INITIAL_SHELTERS: Shelter[] = [
  {
    id: 'SHELTER-03',
    name: 'Relief Centre 03 (Indoor Stadium Hub)',
    sector: 'Coimbatore Central Sector',
    location: 'Nehru Stadium Complex, Coimbatore',
    lat: 11.0065,
    lng: 76.9664,
    capacity: 450,
    occupancy: 312,
    contact: '+91 422 2301982',
    foodStatus: 'ADEQUATE',
    waterStatus: 'ADEQUATE',
    medicalTeamPresent: true
  },
  {
    id: 'SHELTER-01',
    name: 'Camp Victoria Refuge',
    sector: 'Peelamedu Sector',
    location: 'PSG Tech Convention Ground, Coimbatore',
    lat: 11.0253,
    lng: 77.0028,
    capacity: 350,
    occupancy: 285,
    contact: '+91 422 2572177',
    foodStatus: 'ADEQUATE',
    waterStatus: 'RESTOCKING',
    medicalTeamPresent: true
  },
  {
    id: 'SHELTER-02',
    name: 'St. Jude Community Relief Hub',
    sector: 'Ramanathapuram Sector',
    location: 'St. Jude Parish Complex, Trichy Road',
    lat: 10.9984,
    lng: 76.9941,
    capacity: 200,
    occupancy: 138,
    contact: '+91 422 2314550',
    foodStatus: 'ADEQUATE',
    waterStatus: 'ADEQUATE',
    medicalTeamPresent: false
  },
  {
    id: 'SHELTER-04',
    name: 'Govt Arts College Relief Camp',
    sector: 'Race Course Sector',
    location: 'Arts College Road, Coimbatore',
    lat: 11.0025,
    lng: 76.9723,
    capacity: 600,
    occupancy: 412,
    contact: '+91 422 2100987',
    foodStatus: 'CRITICAL',
    waterStatus: 'ADEQUATE',
    medicalTeamPresent: true
  },
  {
    id: 'SHELTER-05',
    name: 'Singanallur Bus Stand Temporary Hub',
    sector: 'Singanallur Sector',
    location: 'Singanallur Main Terminal',
    lat: 10.9989,
    lng: 77.0255,
    capacity: 300,
    occupancy: 295,
    contact: '+91 422 2554432',
    foodStatus: 'RESTOCKING',
    waterStatus: 'RESTOCKING',
    medicalTeamPresent: false
  },
  {
    id: 'SHELTER-06',
    name: 'Vadavalli Community Hall',
    sector: 'Vadavalli Sector',
    location: 'Marudhamalai Road, Vadavalli',
    lat: 11.0332,
    lng: 76.9011,
    capacity: 250,
    occupancy: 80,
    contact: '+91 422 2420999',
    foodStatus: 'ADEQUATE',
    waterStatus: 'ADEQUATE',
    medicalTeamPresent: true
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP-01',
    name: 'Coimbatore General Trauma Centre',
    location: 'Trichy Road, Medical College Campus',
    lat: 11.0016,
    lng: 76.9678,
    contact: '+91 422 2301393',
    triageBedsTotal: 120,
    triageBedsAvailable: 19,
    icuBedsAvailable: 4,
    bloodStockStatus: 'OPTIMAL',
    traumaSurgeonsOnDuty: 8
  },
  {
    id: 'HOSP-02',
    name: 'Apollo Disaster Emergency Facility',
    location: 'Avinashi Road, Civil Aerodrome Post',
    lat: 11.0319,
    lng: 77.0345,
    contact: '+91 422 2603000',
    triageBedsTotal: 85,
    triageBedsAvailable: 8,
    icuBedsAvailable: 2,
    bloodStockStatus: 'LOW_O_NEG',
    traumaSurgeonsOnDuty: 5
  },
  {
    id: 'HOSP-03',
    name: 'GKNM Hospital - Emergency Wing',
    location: 'Avinashi Road, PN Palayam',
    lat: 11.0118,
    lng: 76.9851,
    contact: '+91 422 2245000',
    triageBedsTotal: 90,
    triageBedsAvailable: 12,
    icuBedsAvailable: 6,
    bloodStockStatus: 'OPTIMAL',
    traumaSurgeonsOnDuty: 4
  },
  {
    id: 'HOSP-04',
    name: 'KG Hospital Medical Camp',
    location: 'Arts College Road',
    lat: 11.0049,
    lng: 76.9710,
    contact: '+91 422 2222222',
    triageBedsTotal: 150,
    triageBedsAvailable: 45,
    icuBedsAvailable: 1,
    bloodStockStatus: 'CRITICAL',
    traumaSurgeonsOnDuty: 10
  }
];

export const INITIAL_CASES: AYPOCase[] = [
  // --- 1. RAJ KUMAR (Primary Demo Target - Missing) ---
  {
    id: 'AY-2026-000124',
    personName: 'Raj Kumar',
    aliases: ['Rajkumar', 'Raj'],
    age: 24,
    gender: 'Male',
    status: 'REPORTED_MISSING',
    verificationStatus: 'PENDING_VERIFICATION',
    photoUrl: '/raj.jpg',
    physicalDescription: "Height 5'9, slim build, dark hair, prominent faint scar above left eyebrow. Wearing dark navy jacket and blue denim jeans.",
    medicalNotes: 'No chronic diseases. Penicillin allergy noted by family.',
    triageLevel: 'GREEN',
    reporterName: 'Anita Kumar',
    reporterRelation: 'Spouse',
    reporterContact: '+91 98401 22341',
    currentLocation: 'Last registered near Avinashi Road Bus Stand',
    locationCoordinates: { lat: 11.0183, lng: 76.9743 },
    lastSeenLocation: 'Avinashi Road Bus Terminal during flood evacuation',
    registeredBySector: 'FAMILY',
    organizationName: 'Direct Family Reporting',
    internalGovernmentNotes: 'Family filed missing petition at 10:15 AM. Match alert queued in AI engine.',
    timeline: [
      {
        id: 'tl-1',
        timestamp: '10:15 AM',
        title: 'Missing Person Report Filed',
        description: 'Anita Kumar filed missing report with photograph and physical identifiers.',
        actor: 'Anita Kumar (Family)',
        sector: 'FAMILY',
        badge: 'FAMILY REPORT'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: ['AY-2026-000133'],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T10:15:00Z',
    updatedAt: '2026-10-08T10:15:00Z'
  },

  // --- 2. PRIYA SUNDARAM (Missing) ---
  {
    id: 'AY-2026-000125',
    personName: 'Priya Sundaram',
    aliases: ['Priya S.'],
    age: 19,
    gender: 'Female',
    status: 'REPORTED_MISSING',
    verificationStatus: 'UNVERIFIED',
    photoUrl: '/priya.jpg',
    physicalDescription: "Height 5'3, long hair, yellow kurti, college backpack with student ID card.",
    medicalNotes: 'No known issues.',
    triageLevel: 'GREEN',
    reporterName: 'Sundaram R.',
    reporterRelation: 'Father',
    reporterContact: '+91 94432 10982',
    currentLocation: 'Race Course Road Sector',
    locationCoordinates: { lat: 11.0042, lng: 76.9781 },
    lastSeenLocation: 'Race Course Road Evacuation Point',
    registeredBySector: 'FAMILY',
    organizationName: 'Family Registration',
    internalGovernmentNotes: 'Student reported missing from college hostel evacuation bus.',
    timeline: [
      {
        id: 'tl-2',
        timestamp: '10:45 AM',
        title: 'Report Submitted',
        description: 'Father reported student missing during college bus rerouting.',
        actor: 'Sundaram R.',
        sector: 'FAMILY'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: [],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T10:45:00Z',
    updatedAt: '2026-10-08T10:45:00Z'
  },

  // --- 3. ANANDH V. (Missing) ---
  {
    id: 'AY-2026-000126',
    personName: 'Anandh V.',
    aliases: ['Anandhan'],
    age: 42,
    gender: 'Male',
    status: 'REPORTED_MISSING',
    verificationStatus: 'UNVERIFIED',
    photoUrl: '/anandh.jpg',
    physicalDescription: 'Medium build, rectangular spectacles, blue checked shirt, gold ring on left hand.',
    medicalNotes: 'Hypertensive medication required.',
    triageLevel: 'YELLOW',
    reporterName: 'Revathi Anandh',
    reporterRelation: 'Spouse',
    reporterContact: '+91 98840 91283',
    currentLocation: 'Singanallur Junction Waterlogged Area',
    locationCoordinates: { lat: 10.9981, lng: 77.0212 },
    lastSeenLocation: 'Singanallur Metro Station underpass',
    registeredBySector: 'FAMILY',
    organizationName: 'Family Portal',
    timeline: [
      {
        id: 'tl-3',
        timestamp: '11:10 AM',
        title: 'Missing Intake',
        description: 'Case registered following flash flood in Singanallur low-lying zone.',
        actor: 'Revathi Anandh',
        sector: 'FAMILY'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: [],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T11:10:00Z',
    updatedAt: '2026-10-08T11:10:00Z'
  },

  // --- 4. MEENA KRISHNAN (Missing) ---
  {
    id: 'AY-2026-000127',
    personName: 'Meena Krishnan',
    aliases: ['Meenammal'],
    age: 68,
    gender: 'Female',
    status: 'REPORTED_MISSING',
    verificationStatus: 'PARTIALLY_VERIFIED',
    photoUrl: '/meena.jpg',
    physicalDescription: 'Elderly lady, silver hair tied back, green silk saree with gold border, diabetic.',
    medicalNotes: 'Type-2 diabetic, insulin dependent. High dehydration risk.',
    triageLevel: 'RED',
    reporterName: 'Suresh Krishnan',
    reporterRelation: 'Son',
    reporterContact: '+91 99400 81239',
    currentLocation: 'Mettupalayam Nilgiris Foothills',
    locationCoordinates: { lat: 11.2991, lng: 76.9412 },
    lastSeenLocation: 'Mettupalayam Railway Station Shelter',
    registeredBySector: 'FAMILY',
    organizationName: 'Direct Reporting',
    timeline: [
      {
        id: 'tl-4',
        timestamp: '09:30 AM',
        title: 'Missing Elderly Alert',
        description: 'Critical insulin dependency flagged by attending family member.',
        actor: 'Suresh K.',
        sector: 'FAMILY'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: [],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T09:30:00Z',
    updatedAt: '2026-10-08T09:30:00Z'
  },

  // --- 5. KARTHIK RAMAN (Missing Child) ---
  {
    id: 'AY-2026-000128',
    personName: 'Karthik Raman',
    aliases: ['Karthi'],
    age: 8,
    gender: 'Male',
    status: 'REPORTED_MISSING',
    verificationStatus: 'PENDING_VERIFICATION',
    photoUrl: '/karthik.jpg',
    physicalDescription: 'Child, 8 years, white polo shirt, red school backpack with cartoon sticker.',
    medicalNotes: 'No pre-existing conditions. Child unaccompanied.',
    triageLevel: 'YELLOW',
    reporterName: 'Lakshmi Raman',
    reporterRelation: 'Mother',
    reporterContact: '+91 97900 12839',
    currentLocation: 'RS Puram Relief Point',
    locationCoordinates: { lat: 11.0091, lng: 76.9512 },
    lastSeenLocation: 'RS Puram Primary School Evacuation assembly',
    registeredBySector: 'FAMILY',
    organizationName: 'Family Submission',
    timeline: [
      {
        id: 'tl-5',
        timestamp: '11:20 AM',
        title: 'Child Missing Alert Filed',
        description: 'Separated during emergency school bus boarding.',
        actor: 'Lakshmi Raman',
        sector: 'FAMILY'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: [],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T11:20:00Z',
    updatedAt: '2026-10-08T11:20:00Z'
  },

  // --- 6. "RAJKUMAR" (Found in Field - Matches Raj Kumar 91%) ---
  {
    id: 'AY-2026-000129',
    personName: 'Rajkumar',
    aliases: ['Raj Kumar', 'Unknown Riverbank Rescuee'],
    age: 25,
    gender: 'Male',
    status: 'IN_SHELTER',
    verificationStatus: 'PENDING_VERIFICATION',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    physicalDescription: "Adult male, approximately 24-25 years old. Faint scar above left eyebrow. Wearing dark jacket. Oriented to place and person.",
    medicalNotes: 'Superficial abrasions on forearms. First aid applied. Tetanus shot given.',
    triageLevel: 'GREEN',
    reporterName: 'Field Rescue Unit 04',
    reporterRelation: 'Authorized Rescue Team',
    reporterContact: '+91 422 2309191',
    currentLocation: 'Relief Centre 03',
    locationCoordinates: { lat: 11.0065, lng: 76.9664 },
    lastSeenLocation: 'Rescued from Noyyal Riverbank Causeway',
    registeredBySector: 'PUBLIC_SERVICE',
    organizationName: 'Tamil Nadu Fire & Rescue Services (TNFRS)',
    internalGovernmentNotes: 'Registered offline via field PWA during network black-out. Auto-synced upon satellite relay.',
    timeline: [
      {
        id: 'tl-6a',
        timestamp: '11:40 AM',
        title: 'Rescue & Extraction',
        description: 'Extricated from flooded river causeway by Boat Rescue Team 04.',
        actor: 'TNFRS Squad Bravo',
        sector: 'PUBLIC_SERVICE',
        badge: 'RESCUED'
      },
      {
        id: 'tl-6b',
        timestamp: '12:05 PM',
        title: 'Admitted to Shelter Roster',
        description: 'Registered into offline intake at Relief Centre 03. Bed #142 assigned.',
        actor: 'Relief Centre 03 Staff',
        sector: 'PUBLIC_SERVICE',
        badge: 'SHELTERED'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: ['AY-2026-000133'],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T12:05:00Z',
    updatedAt: '2026-10-08T12:05:00Z'
  },

  // --- 7. ELDERLY WOMAN (Found - Matches Meena Krishnan) ---
  {
    id: 'AY-2026-000130',
    personName: 'Unidentified Elderly Woman (Meena)',
    aliases: ['Meena', 'Grandmother Green Saree'],
    age: 67,
    gender: 'Female',
    status: 'IN_SHELTER',
    verificationStatus: 'PARTIALLY_VERIFIED',
    photoUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=600&q=80',
    physicalDescription: 'Elderly woman wearing green traditional saree, responds to name Meena. Mild confusion.',
    medicalNotes: 'Hypothermia warmed, blood sugar 210 mg/dL. Insulin administered by mobile medical van.',
    triageLevel: 'YELLOW',
    reporterName: 'Selvi Meenakshi',
    reporterRelation: 'NGO Field Officer',
    reporterContact: '+91 98941 00213',
    currentLocation: 'Camp Victoria Refuge',
    locationCoordinates: { lat: 11.0253, lng: 77.0028 },
    lastSeenLocation: 'Found sheltering under bus stand awning in Peelamedu',
    registeredBySector: 'PRIVATE_ORG',
    organizationName: 'Red Cross Disaster Relief Wing',
    timeline: [
      {
        id: 'tl-7',
        timestamp: '12:30 PM',
        title: 'Found & Sheltered by Volunteers',
        description: 'Escorted to Camp Victoria by Red Cross mobile outreach.',
        actor: 'Red Cross Team',
        sector: 'PRIVATE_ORG',
        badge: 'ASSISTED'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: [],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T12:30:00Z',
    updatedAt: '2026-10-08T12:30:00Z'
  },

  // --- 8. CHILD "KARTHIK" (Found - Matches Karthik Raman) ---
  {
    id: 'AY-2026-000131',
    personName: 'Karthik (Minor)',
    aliases: ['Karthik Raman'],
    age: 8,
    gender: 'Male',
    status: 'IN_SHELTER',
    verificationStatus: 'PENDING_VERIFICATION',
    photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=400&q=80',
    physicalDescription: '8-year-old boy in white shirt with red backpack containing school notebooks with name Karthik.',
    medicalNotes: 'Healthy, stable, provided child nutrition ration.',
    triageLevel: 'GREEN',
    reporterName: 'Sister Maria (Shelter Warden)',
    reporterRelation: 'Authorized Shelter Staff',
    reporterContact: '+91 422 2314550',
    currentLocation: 'St. Jude Community Relief Hub',
    locationCoordinates: { lat: 10.9984, lng: 76.9941 },
    lastSeenLocation: 'Brought in by municipal rescue bus',
    registeredBySector: 'PUBLIC_SERVICE',
    organizationName: 'St. Jude Relief Organization',
    timeline: [
      {
        id: 'tl-8',
        timestamp: '12:45 PM',
        title: 'Child Safeguarding Intake',
        description: 'Enrolled into Child Protective Custody room at St. Jude Hub.',
        actor: 'Sister Maria',
        sector: 'PUBLIC_SERVICE',
        badge: 'SAFEGUARDED'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: [],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T12:45:00Z',
    updatedAt: '2026-10-08T12:45:00Z'
  },

  // --- 9. PRIYA S. (Hospitalized - Matches Priya Sundaram) ---
  {
    id: 'AY-2026-000132',
    personName: 'Priya S.',
    aliases: ['Priya Sundaram'],
    age: 20,
    gender: 'Female',
    status: 'HOSPITALIZED',
    verificationStatus: 'VERIFIED',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    physicalDescription: 'Female in yellow kurti, college student ID partial scan matches Priya Sundaram.',
    medicalNotes: 'Fractured right lateral malleolus (ankle), cast applied, analgesics administered.',
    triageLevel: 'YELLOW',
    reporterName: 'Dr. Vigneshwar M.',
    reporterRelation: 'Admitting Physician',
    reporterContact: '+91 422 2301393',
    currentLocation: 'Coimbatore General Trauma Centre (Ward 4B, Bed 12)',
    locationCoordinates: { lat: 11.0016, lng: 76.9678 },
    lastSeenLocation: 'Ambulance transport from Race Course bus depot',
    registeredBySector: 'PUBLIC_SERVICE',
    organizationName: 'Coimbatore General Hospital Emergency Dept',
    internalGovernmentNotes: 'Official hospital admission record verified by emergency registry.',
    timeline: [
      {
        id: 'tl-9',
        timestamp: '01:15 PM',
        title: 'Emergency Admission & X-Ray',
        description: 'Triage tag #Y-402, right ankle immobilized in plaster.',
        actor: 'Dr. Vigneshwar M.',
        sector: 'PUBLIC_SERVICE',
        badge: 'ADMITTED'
      }
    ],
    isDuplicate: false,
    mergedIntoId: null,
    duplicateCandidates: [],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T13:15:00Z',
    updatedAt: '2026-10-08T13:15:00Z'
  },

  // --- 10. "R. KUMAR" (Duplicate candidate of Raj Kumar) ---
  {
    id: 'AY-2026-000133',
    personName: 'R. Kumar',
    aliases: ['Raj Kumar', 'Rajkumar'],
    age: 24,
    gender: 'Male',
    status: 'HOSPITALIZED',
    verificationStatus: 'PENDING_VERIFICATION',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    physicalDescription: 'Male, 24 years, scar on eyebrow, admitted following riverbank flood rescue.',
    medicalNotes: 'Triage check: Mild hypothermia resolved, outpatient release scheduled.',
    triageLevel: 'GREEN',
    reporterName: 'Apollo Emergency Desk',
    reporterRelation: 'Hospital Intake',
    reporterContact: '+91 422 2603000',
    currentLocation: 'Apollo Disaster Emergency Facility',
    locationCoordinates: { lat: 11.0319, lng: 77.0345 },
    lastSeenLocation: 'Brought in via private ambulance',
    registeredBySector: 'PUBLIC_SERVICE',
    organizationName: 'Apollo Emergency Care',
    internalGovernmentNotes: 'Possible duplicate of AY-2026-000129 / AY-2026-000124. Ready for authority merge.',
    timeline: [
      {
        id: 'tl-10',
        timestamp: '01:45 PM',
        title: 'Admitted for Observation',
        description: 'Cross-registered at Apollo outpatient disaster camp.',
        actor: 'Apollo Triage Team',
        sector: 'PUBLIC_SERVICE',
        badge: 'OBSERVATION'
      }
    ],
    isDuplicate: true,
    mergedIntoId: null,
    duplicateCandidates: ['AY-2026-000124', 'AY-2026-000129'],
    syncStatus: 'SYNCED',
    createdAt: '2026-10-08T13:45:00Z',
    updatedAt: '2026-10-08T13:45:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-901',
    who: 'Anita Kumar',
    sector: 'FAMILY',
    what: 'Created Missing Report for Raj Kumar',
    when: '10:15 AM',
    action: 'CASE_CREATED',
    caseId: 'AY-2026-000124',
    details: 'Initial missing person intake via Family Portal'
  },
  {
    id: 'AUD-902',
    who: 'Field Rescue Unit 04',
    sector: 'PUBLIC_SERVICE',
    what: 'Created Found Record (Offline Storage)',
    when: '11:40 AM',
    action: 'OFFLINE_CASE_CACHED',
    caseId: 'AY-2026-000129',
    details: 'Saved locally in IndexedDB queue during no-tower blackout'
  },
  {
    id: 'AUD-903',
    who: 'AYPO Sync Engine',
    sector: 'PUBLIC_SERVICE',
    what: 'Synchronized Offline Record AY-2026-000129',
    when: '12:05 PM',
    action: 'RECORD_SYNCHRONIZED',
    caseId: 'AY-2026-000129',
    details: 'Relief Centre 03 uplink restored; queued records committed'
  },
  {
    id: 'AUD-904',
    who: 'AYPO Responsible AI Engine',
    sector: 'GOVERNMENT',
    what: 'Detected Match Candidate (91% Confidence)',
    when: '12:06 PM',
    action: 'AI_MATCH_GENERATED',
    caseId: 'AY-2026-000124',
    details: 'Matched AY-2026-000124 ↔ AY-2026-000129 based on phonetic name, age, eyebrow scar'
  },
  {
    id: 'AUD-905',
    who: 'Dr. Vigneshwar M.',
    sector: 'PUBLIC_SERVICE',
    what: 'Updated Medical Triage for AY-2026-000132',
    when: '01:15 PM',
    action: 'MEDICAL_STATUS_UPDATED',
    caseId: 'AY-2026-000132',
    details: 'Confidential medical record attached to patient chart'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    caseId: 'AY-2026-000124',
    targetRole: 'FAMILY',
    title: 'Case Registered with AYPO',
    message: 'Your case for Raj Kumar (AY-2026-000124) has been broadcast to all rescue teams.',
    type: 'DISASTER_UPDATE',
    timestamp: '10:16 AM',
    read: true,
    channels: ['IN_APP', 'SMS']
  },
  {
    id: 'NOTIF-2',
    caseId: 'AY-2026-000124',
    targetRole: 'GOVERNMENT',
    title: 'AI High-Confidence Match Pending Verification',
    message: 'AI matched Raj Kumar (Missing) with Rajkumar at Relief Centre 03 (91% confidence). Human verification required.',
    type: 'MATCH_DETECTED',
    timestamp: '12:06 PM',
    read: false,
    channels: ['IN_APP']
  }
];
