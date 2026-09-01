import { 
  db, 
  auth, 
  doc, 
  getDoc,
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  collection, 
  writeBatch,
  query,
  where,
  limit
} from './firebase';
import { 
  UserProfile, 
  BankAccount, 
  Transaction, 
  Beneficiary, 
  Card, 
  SavingsGoal, 
  Loan, 
  BillPayment, 
  NotificationItem, 
  SupportTicket, 
  FraudAlert, 
  AuditLog 
} from '../types';

/**
 * Seeds or force-syncs all banking datasets into Firestore with batch chunking.
 */
export async function syncAllDataToFirestore(
  users: UserProfile[],
  accounts: BankAccount[],
  transactions: Transaction[],
  beneficiaries: Beneficiary[],
  cards: Card[],
  savingsGoals: SavingsGoal[],
  loans: Loan[],
  bills: BillPayment[],
  notifications: NotificationItem[],
  tickets: SupportTicket[],
  fraudAlerts: FraudAlert[],
  auditLogs: AuditLog[]
): Promise<{ success: boolean; totalSynced: number; error?: string }> {
  try {
    const itemsToSave: { collectionName: string; id: string; data: any }[] = [];

    users.forEach(u => itemsToSave.push({ collectionName: 'users', id: u.id, data: u }));
    accounts.forEach(a => itemsToSave.push({ collectionName: 'accounts', id: a.id, data: a }));
    transactions.forEach(t => itemsToSave.push({ collectionName: 'transactions', id: t.id, data: t }));
    beneficiaries.forEach(b => itemsToSave.push({ collectionName: 'beneficiaries', id: b.id, data: b }));
    cards.forEach(c => itemsToSave.push({ collectionName: 'cards', id: c.id, data: c }));
    savingsGoals.forEach(g => itemsToSave.push({ collectionName: 'savingsGoals', id: g.id, data: g }));
    loans.forEach(l => itemsToSave.push({ collectionName: 'loans', id: l.id, data: l }));
    bills.forEach(b => itemsToSave.push({ collectionName: 'billPayments', id: b.id, data: b }));
    notifications.forEach(n => itemsToSave.push({ collectionName: 'notifications', id: n.id, data: n }));
    tickets.forEach(t => itemsToSave.push({ collectionName: 'supportTickets', id: t.id, data: t }));
    fraudAlerts.forEach(f => itemsToSave.push({ collectionName: 'fraudAlerts', id: f.id, data: f }));
    auditLogs.forEach(l => itemsToSave.push({ collectionName: 'auditLogs', id: l.id, data: l }));

    // Chunk into batches of 400 (Firestore limit is 500 per batch)
    const chunkSize = 400;
    for (let i = 0; i < itemsToSave.length; i += chunkSize) {
      const chunk = itemsToSave.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach(item => {
        const ref = doc(db, item.collectionName, item.id);
        batch.set(ref, item.data, { merge: true });
      });
      await batch.commit();
    }

    console.log(`[Firestore] Successfully synced all ${itemsToSave.length} records across 12 collections.`);
    return { success: true, totalSynced: itemsToSave.length };
  } catch (err: any) {
    console.error('[Firestore] Error syncing data:', err);
    return { success: false, totalSynced: 0, error: err?.message || 'Sync failed' };
  }
}

/**
 * Seeds initial mock data into Firestore if collections are empty.
 */
export async function seedFirestoreIfEmpty(
  initialUsers: UserProfile[],
  initialAccounts: BankAccount[],
  initialTransactions: Transaction[],
  initialBeneficiaries: Beneficiary[],
  initialCards: Card[],
  initialSavingsGoals: SavingsGoal[],
  initialLoans: Loan[],
  initialBills: BillPayment[],
  initialNotifications: NotificationItem[],
  initialTickets: SupportTicket[],
  initialFraudAlerts: FraudAlert[],
  initialAuditLogs: AuditLog[]
): Promise<void> {
  try {
    const userSnapshot = await getDocs(query(collection(db, 'users'), limit(1)));
    if (!userSnapshot.empty) {
      return; // Already initialized in Firestore
    }
    await syncAllDataToFirestore(
      initialUsers,
      initialAccounts,
      initialTransactions,
      initialBeneficiaries,
      initialCards,
      initialSavingsGoals,
      initialLoans,
      initialBills,
      initialNotifications,
      initialTickets,
      initialFraudAlerts,
      initialAuditLogs
    );
  } catch (err) {
    console.warn('Firestore initial seeding note:', err);
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching user profile from Firestore:', err);
    return null;
  }
}

export async function findUserByEmailOrUsername(identifier: string): Promise<UserProfile | null> {
  const trimmed = identifier.trim();
  const cleanLower = trimmed.toLowerCase();
  try {
    if (trimmed.includes('@')) {
      // 1. Try lowercase email match
      const qLower = query(collection(db, 'users'), where('email', '==', cleanLower), limit(1));
      const snapLower = await getDocs(qLower);
      if (!snapLower.empty) {
        return snapLower.docs[0].data() as UserProfile;
      }
      // 2. Try raw email match if different from lower
      if (trimmed !== cleanLower) {
        const qRaw = query(collection(db, 'users'), where('email', '==', trimmed), limit(1));
        const snapRaw = await getDocs(qRaw);
        if (!snapRaw.empty) {
          return snapRaw.docs[0].data() as UserProfile;
        }
      }
    } else {
      // 1. Try lowercase username match
      const qUserLower = query(collection(db, 'users'), where('username', '==', cleanLower), limit(1));
      const snapUserLower = await getDocs(qUserLower);
      if (!snapUserLower.empty) {
        return snapUserLower.docs[0].data() as UserProfile;
      }
      // 2. Try raw username match
      if (trimmed !== cleanLower) {
        const qUserRaw = query(collection(db, 'users'), where('username', '==', trimmed), limit(1));
        const snapUserRaw = await getDocs(qUserRaw);
        if (!snapUserRaw.empty) {
          return snapUserRaw.docs[0].data() as UserProfile;
        }
      }
      // 3. Try customerId match
      const qCust = query(collection(db, 'users'), where('customerId', '==', trimmed), limit(1));
      const snapCust = await getDocs(qCust);
      if (!snapCust.empty) {
        return snapCust.docs[0].data() as UserProfile;
      }
    }
  } catch (err) {
    console.warn('Error finding user in Firestore:', err);
  }
  return null;
}

export async function saveUserToFirestore(user: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (err) {
    console.warn('Error saving user to Firestore:', err);
  }
}

export async function saveAccountToFirestore(account: BankAccount): Promise<void> {
  try {
    await setDoc(doc(db, 'accounts', account.id), account, { merge: true });
  } catch (err) {
    console.warn('Error saving account to Firestore:', err);
  }
}

export async function saveTransactionToFirestore(transaction: Transaction): Promise<void> {
  try {
    await setDoc(doc(db, 'transactions', transaction.id), transaction, { merge: true });
  } catch (err) {
    console.warn('Error saving transaction to Firestore:', err);
  }
}

export async function saveBeneficiaryToFirestore(beneficiary: Beneficiary): Promise<void> {
  try {
    await setDoc(doc(db, 'beneficiaries', beneficiary.id), beneficiary, { merge: true });
  } catch (err) {
    console.warn('Error saving beneficiary to Firestore:', err);
  }
}

export async function deleteBeneficiaryFromFirestore(beneficiaryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'beneficiaries', beneficiaryId));
  } catch (err) {
    console.warn('Error deleting beneficiary from Firestore:', err);
  }
}

export async function saveCardToFirestore(card: Card): Promise<void> {
  try {
    await setDoc(doc(db, 'cards', card.id), card, { merge: true });
  } catch (err) {
    console.warn('Error saving card to Firestore:', err);
  }
}

export async function saveSavingsGoalToFirestore(goal: SavingsGoal): Promise<void> {
  try {
    await setDoc(doc(db, 'savingsGoals', goal.id), goal, { merge: true });
  } catch (err) {
    console.warn('Error saving savings goal to Firestore:', err);
  }
}

export async function deleteSavingsGoalFromFirestore(goalId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'savingsGoals', goalId));
  } catch (err) {
    console.warn('Error deleting savings goal from Firestore:', err);
  }
}

export async function saveBillPaymentToFirestore(bill: BillPayment): Promise<void> {
  try {
    await setDoc(doc(db, 'billPayments', bill.id), bill, { merge: true });
  } catch (err) {
    console.warn('Error saving bill payment to Firestore:', err);
  }
}

export async function saveNotificationToFirestore(notification: NotificationItem): Promise<void> {
  try {
    await setDoc(doc(db, 'notifications', notification.id), notification, { merge: true });
  } catch (err) {
    console.warn('Error saving notification to Firestore:', err);
  }
}

export async function deleteNotificationFromFirestore(notificationId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (err) {
    console.warn('Error deleting notification from Firestore:', err);
  }
}

export async function saveSupportTicketToFirestore(ticket: SupportTicket): Promise<void> {
  try {
    await setDoc(doc(db, 'supportTickets', ticket.id), ticket, { merge: true });
  } catch (err) {
    console.warn('Error saving support ticket to Firestore:', err);
  }
}

export async function saveFraudAlertToFirestore(alert: FraudAlert): Promise<void> {
  try {
    await setDoc(doc(db, 'fraudAlerts', alert.id), alert, { merge: true });
  } catch (err) {
    console.warn('Error saving fraud alert to Firestore:', err);
  }
}

export async function saveAuditLogToFirestore(log: AuditLog): Promise<void> {
  try {
    await setDoc(doc(db, 'auditLogs', log.id), log, { merge: true });
  } catch (err) {
    console.warn('Error saving audit log to Firestore:', err);
  }
}
