import { db } from '../config/firebase';
import { collection, doc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AYPOCase, AuditLog, NotificationItem } from '../types';

export const firestoreService = {
  // CASES
  subscribeToCases(callback: (cases: AYPOCase[]) => void) {
    const q = query(collection(db, 'cases'));
    return onSnapshot(q, (snapshot) => {
      const cases = snapshot.docs.map(doc => doc.data() as AYPOCase);
      callback(cases);
    }, (error) => console.error("Firestore sync error:", error));
  },

  async saveCase(c: AYPOCase) {
    try {
      const docRef = doc(db, 'cases', c.id);
      await setDoc(docRef, c);
    } catch (e) {
      console.error("Failed to save case", e);
    }
  },

  // AUDIT LOGS
  subscribeToAuditLogs(callback: (logs: AuditLog[]) => void) {
    // Note: for production, order by timestamp. For now, simple fetch.
    const q = query(collection(db, 'audit_logs'));
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => doc.data() as AuditLog);
      // Sort in memory for simplicity (newest first based on id or time)
      logs.sort((a, b) => b.id.localeCompare(a.id));
      callback(logs);
    });
  },

  async saveAuditLog(log: AuditLog) {
    try {
      const docRef = doc(db, 'audit_logs', log.id);
      await setDoc(docRef, log);
    } catch (e) {
      console.error("Failed to save audit log", e);
    }
  }
};
