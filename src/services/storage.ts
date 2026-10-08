import { AYPOCase, SyncQueueItem, AuditLog, NotificationItem, UserProfile } from '../types';
import { INITIAL_CASES, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, INITIAL_USERS } from './seedData';
import { firestoreService } from './firestoreService';

const STORAGE_KEYS = {
  CASES: 'aypo_cases_v1',
  SYNC_QUEUE: 'aypo_sync_queue_v1',
  AUDIT_LOGS: 'aypo_audit_logs_v1',
  NOTIFICATIONS: 'aypo_notifications_v1',
  CONNECTIVITY: 'aypo_connectivity_v1',
  EMERGENCY_MODE: 'aypo_emergency_mode_v1',
  USERS: 'aypo_users_v1',
  SESSION: 'aypo_auth_session_v1'
};

export const storageService = {
  // --- CASES ---
  getCases(): AYPOCase[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASES);
      if (!data) {
        this.saveCases(INITIAL_CASES);
        return INITIAL_CASES;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_CASES;
    }
  },

  saveCases(cases: AYPOCase[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
      cases.forEach(c => firestoreService.saveCase(c));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }
  },

  // --- SYNC QUEUE (Offline First) ---
  getSyncQueue(): SyncQueueItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'status'>): SyncQueueItem {
    const queue = this.getSyncQueue();
    const newItem: SyncQueueItem = {
      ...item,
      id: `SYNC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      retryCount: 0,
      status: 'QUEUED'
    };
    queue.push(newItem);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    return newItem;
  },

  updateSyncQueue(queue: SyncQueueItem[]): void {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  },

  clearSyncQueue(): void {
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (!data) {
        this.saveAuditLogs(INITIAL_AUDIT_LOGS);
        return INITIAL_AUDIT_LOGS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_AUDIT_LOGS;
    }
  },

  saveAuditLogs(logs: AuditLog[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    logs.forEach(l => firestoreService.saveAuditLog(l));
  },

  addAuditLog(log: Omit<AuditLog, 'id' | 'when'>): AuditLog {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Date.now()}`,
      when: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    logs.unshift(newLog); // newest first
    this.saveAuditLogs(logs);
    return newLog;
  },

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!data) {
        this.saveNotifications(INITIAL_NOTIFICATIONS);
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.getNotifications();
    const newItem: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    list.unshift(newItem);
    this.saveNotifications(list);
    return newItem;
  },

  // --- USER PROFILES & AUTHENTICATION ---
  getUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        this.saveUsers(INITIAL_USERS);
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: UserProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  registerUser(user: UserProfile): UserProfile {
    const users = this.getUsers();
    const existingIdx = users.findIndex(u => (user.email && u.email === user.email) || (user.phone && u.phone === user.phone));
    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...user };
    } else {
      users.push(user);
    }
    this.saveUsers(users);
    return user;
  },

  getSession(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveSession(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  // --- RESET TO FACTORY DEMO STATE ---
  resetAllDemoData(): void {
    localStorage.clear();
    this.saveCases(INITIAL_CASES);
    this.saveAuditLogs(INITIAL_AUDIT_LOGS);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    this.saveUsers(INITIAL_USERS);
  }
};
