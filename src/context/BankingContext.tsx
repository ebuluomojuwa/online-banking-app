import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  LoginSession, 
  SecurityEvent, 
  SupportTicket, 
  FraudAlert, 
  AuditLog, 
  UserRole 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ACCOUNTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_BENEFICIARIES, 
  INITIAL_CARDS, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_LOANS, 
  INITIAL_BILLS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_LOGIN_SESSIONS, 
  INITIAL_SECURITY_EVENTS, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_FRAUD_ALERTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import { 
  db, 
  auth, 
  collection, 
  doc, 
  getDoc, 
  setDoc,
  query,
  where,
  onSnapshot, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from '../lib/firebase';
import { 
  seedFirestoreIfEmpty,
  syncAllDataToFirestore,
  getUserProfileFromFirestore,
  findUserByEmailOrUsername,
  saveUserToFirestore,
  saveAccountToFirestore,
  saveTransactionToFirestore,
  saveBeneficiaryToFirestore,
  deleteBeneficiaryFromFirestore,
  saveCardToFirestore,
  saveSavingsGoalToFirestore,
  deleteSavingsGoalFromFirestore,
  saveBillPaymentToFirestore,
  saveNotificationToFirestore,
  deleteNotificationFromFirestore,
  saveSupportTicketToFirestore,
  saveFraudAlertToFirestore,
  saveAuditLogToFirestore
} from '../lib/firestoreService';

export interface BankingContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  users: UserProfile[];
  role: UserRole;
  accounts: BankAccount[];
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  cards: Card[];
  savingsGoals: SavingsGoal[];
  loans: Loan[];
  bills: BillPayment[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  loginSessions: LoginSession[];
  securityEvents: SecurityEvent[];
  supportTickets: SupportTicket[];
  fraudAlerts: FraudAlert[];
  auditLogs: AuditLog[];
  
  // Master lists for admin/auditing
  allAccounts: BankAccount[];
  allTransactions: Transaction[];
  allCards: Card[];

  // Display Preferences
  hideBalances: boolean;
  theme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  toggleHideBalances: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Authentication & Role Switching
  switchUser: (userId: string) => void;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (params: {
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password?: string;
    accountType?: 'CHECKING' | 'SAVINGS' | 'BUSINESS';
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  // Financial & Management Actions
  transferFunds: (params: {
    fromAccountId: string;
    recipientName: string;
    recipientAccount: string;
    amount: number;
    transferType: 'INTERNAL' | 'OTHER_CUSTOMER' | 'DOMESTIC_WIRE' | 'INTERNATIONAL_SWIFT';
    reference: string;
    note?: string;
  }) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  
  addBeneficiary: (ben: Omit<Beneficiary, 'id' | 'createdAt' | 'userId'>) => void;
  editBeneficiary: (id: string, updates: Partial<Beneficiary>) => void;
  deleteBeneficiary: (id: string) => void;
  toggleFavoriteBeneficiary: (id: string) => void;
  
  payBill: (billId: string, fromAccountId: string, amount: number) => Promise<boolean>;
  addBill?: (bill: Omit<BillPayment, 'id' | 'userId'>) => void;
  toggleAutoPay?: (billId: string) => void;
  
  toggleFreezeCard: (cardId: string) => void;
  updateCardLimits: (cardId: string, limit: number, controls: Card['controls']) => void;
  replaceCard: (cardId: string) => void;
  
  createSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => void;
  depositToSavingsGoal: (goalId: string, fromAccountId: string, amount: number) => Promise<boolean>;
  withdrawFromSavingsGoal: (goalId: string, toAccountId: string, amount: number) => Promise<boolean>;
  contributeToGoal?: (goalId: string, amount: number) => void;
  withdrawFromGoal?: (goalId: string, amount: number) => void;

  makeLoanPayment?: (loanId: string, fromAccountId: string, amount: number) => Promise<boolean>;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Support
  createSupportTicket: (subject: string, category: SupportTicket['category'], message: string, priority: SupportTicket['priority']) => void;
  replyToSupportTicket: (ticketId: string, message: string, senderType?: 'user' | 'agent') => void;

  // Security & Profile
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  revokeSession: (sessionId: string) => void;
  revokeAllOtherSessions: () => void;
  resetAllDemoData: () => void;
  resetAllData: () => void;

  // Admin Actions
  toggleFreezeUser: (userId: string) => void;
  adminUpdateUserStatus: (userId: string, status: 'Active' | 'Suspended' | 'Pending Verification') => void;
  adminUpdateFraudAlert: (alertId: string, status: FraudAlert['status'], resolutionNote: string) => void;
  adminReverseTransaction: (transactionId: string) => void;
  reverseTransaction: (transactionId: string) => void;

  // Cloud Firestore Sync
  syncToFirestoreNow: () => Promise<{ success: boolean; totalSynced: number; error?: string }>;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const BLANK_USER: UserProfile = {
  id: '',
  customerId: '',
  username: '',
  email: '',
  firstName: 'Premier',
  lastName: 'Customer',
  role: 'CUSTOMER',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  dateOfBirth: '',
  avatarUrl: '',
  status: 'Active',
  twoFactorEnabled: false,
  biometricsEnabled: false,
  preferences: {
    theme: 'dark',
    currency: 'USD',
    language: 'English',
    timeZone: 'America/New_York',
    emailAlerts: true,
    smsAlerts: true,
    pushAlerts: true,
    marketingEmails: false,
  },
  securityScore: 95,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure Firestore-driven State: never use localStorage or hardcoded mock users as source of truth for accounts
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [bills, setBills] = useState<BillPayment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Admin Master State (populated when viewing as Admin)
  const [adminAllAccounts, setAdminAllAccounts] = useState<BankAccount[]>([]);
  const [adminAllTransactions, setAdminAllTransactions] = useState<Transaction[]>([]);
  const [adminAllCards, setAdminAllCards] = useState<Card[]>([]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Client UI Preferences
  const [hideBalances, setHideBalances] = useState<boolean>(() => {
    const saved = localStorage.getItem('hsbc_hide_balances');
    return saved ? JSON.parse(saved) : false;
  });

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('hsbc_theme');
    return (saved as any) || 'dark';
  });

  // Current authenticated user object strictly derived from Firestore document
  const currentUser = useMemo<UserProfile>(() => {
    if (currentUserProfile) return currentUserProfile;
    return BLANK_USER;
  }, [currentUserProfile]);

  const role = currentUser.role;

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Dark mode effect
  const isDarkMode = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('hsbc_hide_balances', JSON.stringify(hideBalances));
  }, [hideBalances]);

  useEffect(() => {
    localStorage.setItem('hsbc_theme', theme);
  }, [theme]);

  // Primary Firebase Authentication and Real-time Firestore Lifecycle
  useEffect(() => {
    let unsubUserDoc: (() => void) | null = null;
    let unsubAccounts: (() => void) | null = null;
    let unsubTx: (() => void) | null = null;
    let unsubCards: (() => void) | null = null;
    let unsubBen: (() => void) | null = null;
    let unsubGoals: (() => void) | null = null;
    let unsubLoans: (() => void) | null = null;
    let unsubBills: (() => void) | null = null;
    let unsubNotifs: (() => void) | null = null;
    let unsubTickets: (() => void) | null = null;
    let unsubSessions: (() => void) | null = null;
    let unsubSecEvents: (() => void) | null = null;
    let unsubAdminUsers: (() => void) | null = null;
    let unsubAdminAccounts: (() => void) | null = null;
    let unsubAdminTx: (() => void) | null = null;
    let unsubAdminCards: (() => void) | null = null;
    let unsubAdminFraud: (() => void) | null = null;
    let unsubAdminAudit: (() => void) | null = null;

    const cleanupSubscribers = () => {
      unsubUserDoc?.();
      unsubAccounts?.();
      unsubTx?.();
      unsubCards?.();
      unsubBen?.();
      unsubGoals?.();
      unsubLoans?.();
      unsubBills?.();
      unsubNotifs?.();
      unsubTickets?.();
      unsubSessions?.();
      unsubSecEvents?.();
      unsubAdminUsers?.();
      unsubAdminAccounts?.();
      unsubAdminTx?.();
      unsubAdminCards?.();
      unsubAdminFraud?.();
      unsubAdminAudit?.();
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      cleanupSubscribers();

      if (fbUser) {
        const uid = fbUser.uid;
        const userRef = doc(db, 'users', uid);

        // 1. Subscribe to the logged-in user's Firestore profile doc in real-time
        unsubUserDoc = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            const profile: UserProfile = { ...data, id: uid };
            setCurrentUserProfile(profile);
            setAllUsers(prev => {
              const idx = prev.findIndex(u => u.id === uid);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = profile;
                return next;
              }
              return [profile, ...prev];
            });

            // If user is Admin, subscribe to master administrative collections
            if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN') {
              if (!unsubAdminUsers) {
                unsubAdminUsers = onSnapshot(collection(db, 'users'), snap => {
                  if (!snap.empty) {
                    setAllUsers(snap.docs.map(d => ({ ...d.data(), id: d.id } as UserProfile)));
                  }
                });
              }
              if (!unsubAdminAccounts) {
                unsubAdminAccounts = onSnapshot(collection(db, 'accounts'), snap => {
                  if (!snap.empty) {
                    setAdminAllAccounts(snap.docs.map(d => ({ ...d.data(), id: d.id } as BankAccount)));
                  }
                });
              }
              if (!unsubAdminTx) {
                unsubAdminTx = onSnapshot(collection(db, 'transactions'), snap => {
                  if (!snap.empty) {
                    const txs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Transaction));
                    txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setAdminAllTransactions(txs);
                  }
                });
              }
              if (!unsubAdminCards) {
                unsubAdminCards = onSnapshot(collection(db, 'cards'), snap => {
                  if (!snap.empty) {
                    setAdminAllCards(snap.docs.map(d => ({ ...d.data(), id: d.id } as Card)));
                  }
                });
              }
              if (!unsubAdminFraud) {
                unsubAdminFraud = onSnapshot(collection(db, 'fraudAlerts'), snap => {
                  if (!snap.empty) {
                    setFraudAlerts(snap.docs.map(d => ({ ...d.data(), id: d.id } as FraudAlert)));
                  }
                });
              }
              if (!unsubAdminAudit) {
                unsubAdminAudit = onSnapshot(collection(db, 'auditLogs'), snap => {
                  if (!snap.empty) {
                    const logs = snap.docs.map(d => ({ ...d.data(), id: d.id } as AuditLog));
                    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    setAuditLogs(logs);
                  }
                });
              }
            }
          } else {
            // Profile document doesn't exist yet: initialize user profile and primary account in Firestore under UID
            const cleanEmail = fbUser.email?.toLowerCase() || '';
            const customerId = 'HSBC-CUST-' + Math.floor(100000 + Math.random() * 900000);
            const nowIso = new Date().toISOString();
            const initialProfile: UserProfile = {
              id: uid,
              customerId,
              username: cleanEmail.split('@')[0] || `user_${uid.slice(0, 5)}`,
              email: cleanEmail,
              firstName: fbUser.displayName?.split(' ')[0] || 'Premier',
              lastName: fbUser.displayName?.split(' ').slice(1).join(' ') || 'Customer',
              role: 'CUSTOMER',
              phone: '+1 (555) 392-8104',
              address: {
                street: '450 Lexington Avenue',
                city: 'New York',
                state: 'NY',
                postalCode: '10017',
                country: 'United States',
              },
              dateOfBirth: '1992-04-18',
              avatarUrl: fbUser.photoURL || '',
              status: 'Active',
              twoFactorEnabled: true,
              biometricsEnabled: true,
              preferences: {
                theme: 'dark',
                currency: 'USD',
                language: 'English',
                timeZone: 'America/New_York',
                emailAlerts: true,
                smsAlerts: true,
                pushAlerts: true,
                marketingEmails: false,
              },
              securityScore: 95,
              createdAt: nowIso,
              lastLogin: nowIso,
            };

            await setDoc(userRef, initialProfile, { merge: true });

            // Check if primary account exists in Firestore
            const accDocId = `acc_${uid}_primary`;
            const accRef = doc(db, 'accounts', accDocId);
            const accSnap = await getDoc(accRef);
            if (!accSnap.exists()) {
              const accNumber = Math.floor(1000 + Math.random() * 9000).toString();
              const newAcc: BankAccount = {
                id: accDocId,
                userId: uid,
                name: 'HSBC Premier Checking',
                accountNumber: accNumber,
                routingNumber: '021000089',
                iban: `GB29MIDL400515${Math.floor(10000000 + Math.random() * 90000000)}`,
                swift: 'HBUKGB41400',
                type: 'CHECKING',
                balance: 10000.00,
                availableBalance: 10000.00,
                pendingBalance: 0,
                currency: 'USD',
                isPrimary: true,
                status: 'ACTIVE',
                interestRate: 0.005,
                createdAt: nowIso,
              };
              await setDoc(accRef, newAcc, { merge: true });

              const initialTx: Transaction = {
                id: `tx_${uid}_init`,
                userId: uid,
                accountId: accDocId,
                accountName: `HSBC Premier Checking **${accNumber}`,
                description: 'Account Opening Welcome Credit',
                merchantName: 'HSBC Premier Banking',
                category: 'Deposit',
                amount: 10000.00,
                currency: 'USD',
                status: 'Completed',
                date: nowIso,
                reference: 'INIT-DEP-' + Math.floor(100000 + Math.random() * 900000),
                recipientOrSender: 'HSBC Premier Welcome Bonus',
                riskScore: 'Low',
                note: 'Initial account opening welcome deposit',
              };
              await setDoc(doc(db, 'transactions', initialTx.id), initialTx, { merge: true });

              const newCard: Card = {
                id: `crd_${uid}_primary`,
                userId: uid,
                accountId: accDocId,
                cardNumber: `4532 •••• •••• ${accNumber}`,
                fullMaskedNumber: `•••• •••• •••• ${accNumber}`,
                cardholderName: `${initialProfile.firstName} ${initialProfile.lastName}`.toUpperCase(),
                expiryMonth: '09',
                expiryYear: '2029',
                cvv: '829',
                cardType: 'DEBIT',
                tier: 'HSBC Premier World',
                status: 'ACTIVE',
                spendingLimit: 5000,
                monthlySpent: 0,
                controls: {
                  onlinePayments: true,
                  contactless: true,
                  internationalUsage: true,
                  atmWithdrawals: true,
                },
                colorTheme: 'black',
                createdAt: nowIso,
              };
              await setDoc(doc(db, 'cards', newCard.id), newCard, { merge: true });

              const welcomeNotif: NotificationItem = {
                id: `notif_${uid}_welcome`,
                userId: uid,
                title: 'Welcome to HSBC Premier',
                message: `Welcome, ${initialProfile.firstName}! Your Premier account **${accNumber} is active with $10,000.00 opening balance.`,
                type: 'SECURITY',
                isRead: false,
                createdAt: nowIso,
              };
              await setDoc(doc(db, 'notifications', welcomeNotif.id), welcomeNotif, { merge: true });
            }
          }
        }, (err) => {
          console.warn('Error listening to user profile doc:', err);
        });

        // 2. Real-time Firestore query subscriptions strictly filtered by the authenticated user's UID
        const qAcc = query(collection(db, 'accounts'), where('userId', '==', uid));
        unsubAccounts = onSnapshot(qAcc, snap => {
          setAccounts(snap.docs.map(d => ({ ...d.data(), id: d.id } as BankAccount)));
        }, err => console.warn('accounts listener error:', err));

        const qTx = query(collection(db, 'transactions'), where('userId', '==', uid));
        unsubTx = onSnapshot(qTx, snap => {
          const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as Transaction));
          items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setTransactions(items);
        }, err => console.warn('tx listener error:', err));

        const qCards = query(collection(db, 'cards'), where('userId', '==', uid));
        unsubCards = onSnapshot(qCards, snap => {
          setCards(snap.docs.map(d => ({ ...d.data(), id: d.id } as Card)));
        }, err => console.warn('cards listener error:', err));

        const qBen = query(collection(db, 'beneficiaries'), where('userId', '==', uid));
        unsubBen = onSnapshot(qBen, snap => {
          setBeneficiaries(snap.docs.map(d => ({ ...d.data(), id: d.id } as Beneficiary)));
        }, err => console.warn('beneficiaries listener error:', err));

        const qGoals = query(collection(db, 'savingsGoals'), where('userId', '==', uid));
        unsubGoals = onSnapshot(qGoals, snap => {
          setSavingsGoals(snap.docs.map(d => ({ ...d.data(), id: d.id } as SavingsGoal)));
        }, err => console.warn('goals listener error:', err));

        const qLoans = query(collection(db, 'loans'), where('userId', '==', uid));
        unsubLoans = onSnapshot(qLoans, snap => {
          setLoans(snap.docs.map(d => ({ ...d.data(), id: d.id } as Loan)));
        }, err => console.warn('loans listener error:', err));

        const qBills = query(collection(db, 'billPayments'), where('userId', '==', uid));
        unsubBills = onSnapshot(qBills, snap => {
          setBills(snap.docs.map(d => ({ ...d.data(), id: d.id } as BillPayment)));
        }, err => console.warn('bills listener error:', err));

        const qNotifs = query(collection(db, 'notifications'), where('userId', '==', uid));
        unsubNotifs = onSnapshot(qNotifs, snap => {
          const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as NotificationItem));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotifications(items);
        }, err => console.warn('notifications listener error:', err));

        const qTickets = query(collection(db, 'supportTickets'), where('userId', '==', uid));
        unsubTickets = onSnapshot(qTickets, snap => {
          const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as SupportTicket));
          items.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
          setSupportTickets(items);
        }, err => console.warn('supportTickets listener error:', err));

        const qSessions = query(collection(db, 'loginSessions'), where('userId', '==', uid));
        unsubSessions = onSnapshot(qSessions, snap => {
          setLoginSessions(snap.docs.map(d => ({ ...d.data(), id: d.id } as LoginSession)));
        }, err => console.warn('loginSessions listener error:', err));

        const qSec = query(collection(db, 'securityEvents'), where('userId', '==', uid));
        unsubSecEvents = onSnapshot(qSec, snap => {
          const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as SecurityEvent));
          items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setSecurityEvents(items);
        }, err => console.warn('securityEvents listener error:', err));

        setIsAuthenticated(true);
      } else {
        // User is logged out: clear all active customer data
        setCurrentUserProfile(null);
        setAccounts([]);
        setTransactions([]);
        setCards([]);
        setBeneficiaries([]);
        setSavingsGoals([]);
        setLoans([]);
        setBills([]);
        setNotifications([]);
        setSupportTickets([]);
        setLoginSessions([]);
        setSecurityEvents([]);
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });

    return () => {
      cleanupSubscribers();
      unsubscribeAuth();
    };
  }, []);

  const toggleHideBalances = () => setHideBalances(prev => !prev);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserProfile(user);
      setIsAuthenticated(true);
    }
  };

  const login = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, error: 'Please enter your username or email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your account password.' };
    }

    let emailToUse = cleanId;

    // If identifier is not an email, resolve registered email from Firestore
    if (!cleanId.includes('@')) {
      const userDoc = await findUserByEmailOrUsername(cleanId);
      if (userDoc && userDoc.email) {
        emailToUse = userDoc.email.toLowerCase();
      } else {
        return { 
          success: false, 
          error: 'No registered account found matching this username or customer ID.' 
        };
      }
    }

    try {
      // Authenticate with Firebase Authentication
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      const fbUser = cred.user;

      // Update last login timestamp in Firestore
      const nowIso = new Date().toISOString();
      const profile = await getUserProfileFromFirestore(fbUser.uid);
      if (profile) {
        if (profile.status === 'Suspended') {
          await signOut(auth);
          return { 
            success: false, 
            error: 'This account has been temporarily locked by HSBC Security. Please contact Premier Support.' 
          };
        }
        await saveUserToFirestore({ ...profile, lastLogin: nowIso });
      }

      // Record login session in Firestore
      const newSession: LoginSession = {
        id: 'ses_' + Date.now(),
        userId: fbUser.uid,
        device: 'Web Client (Secure Session)',
        browser: 'Google Chrome',
        ipAddress: '198.51.100.42',
        location: profile?.address?.city ? `${profile.address.city}, ${profile.address.state}, ${profile.address.country}` : 'New York, NY, United States',
        lastActive: 'Just now (Active)',
        isCurrent: true,
      };
      await setDoc(doc(db, 'loginSessions', newSession.id), newSession, { merge: true });

      // Record security event in Firestore
      const newEvent: SecurityEvent = {
        id: 'sec_' + Date.now(),
        userId: fbUser.uid,
        type: 'Successful Login',
        description: `Authenticated via secure portal as ${profile?.firstName || 'Customer'} ${profile?.lastName || ''} (@${profile?.username || emailToUse})`,
        ipAddress: '198.51.100.42',
        location: profile?.address?.city ? `${profile.address.city}, ${profile.address.state}, ${profile.address.country}` : 'New York, NY, United States',
        device: 'Secure Web Client',
        timestamp: nowIso,
        riskLevel: 'LOW',
      };
      await setDoc(doc(db, 'securityEvents', newEvent.id), newEvent, { merge: true });

      return { success: true };
    } catch (authErr: any) {
      console.warn('Firebase signIn error:', authErr);
      if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
        return { 
          success: false, 
          error: 'Invalid credentials. Please verify your email and password, or open a new account.' 
        };
      }
      if (authErr.code === 'auth/wrong-password') {
        return { 
          success: false, 
          error: 'Incorrect password entered. Please check your password and try again.' 
        };
      }
      if (authErr.code === 'auth/too-many-requests') {
        return { 
          success: false, 
          error: 'Access temporarily locked due to multiple failed login attempts. Please try again later.' 
        };
      }
      return { 
        success: false, 
        error: authErr.message || 'Authentication failed. Please verify your credentials.' 
      };
    }
  };

  const register = async (params: {
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password?: string;
    accountType?: 'CHECKING' | 'SAVINGS' | 'BUSINESS';
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanUsername = (params.username || params.email.split('@')[0]).trim().toLowerCase();
    const rawPassword = params.password || 'Password123!';

    if (rawPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      // 1. Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, rawPassword);
      const fbUser = userCredential.user;

      // 2. Update display name in Firebase Auth
      await updateProfile(fbUser, {
        displayName: `${params.firstName} ${params.lastName}`.trim()
      });

      const newUserId = fbUser.uid;
      const customerId = 'HSBC-CUST-' + Math.floor(100000 + Math.random() * 900000);
      const nowIso = new Date().toISOString();

      // 3. User Profile Document Stored Under UID
      const newUser: UserProfile = {
        id: newUserId,
        firstName: params.firstName,
        lastName: params.lastName,
        email: cleanEmail,
        username: cleanUsername,
        password: rawPassword,
        role: 'CUSTOMER',
        customerId,
        phone: '+1 (555) 392-8104',
        address: {
          street: '450 Lexington Avenue',
          city: 'New York',
          state: 'NY',
          postalCode: '10017',
          country: 'United States',
        },
        dateOfBirth: '1992-04-18',
        avatarUrl: '',
        status: 'Active',
        twoFactorEnabled: true,
        biometricsEnabled: true,
        preferences: {
          theme: 'dark',
          currency: 'USD',
          language: 'English',
          timeZone: 'America/New_York',
          emailAlerts: true,
          smsAlerts: true,
          pushAlerts: true,
          marketingEmails: false,
        },
        securityScore: 94,
        createdAt: nowIso,
        lastLogin: nowIso,
      };

      // 4. Provision Primary Bank Account in Firestore
      const newAccId = `acc_${newUserId}_primary`;
      const accNumber = Math.floor(1000 + Math.random() * 9000).toString();
      const accType = params.accountType || 'CHECKING';
      const accName = accType === 'SAVINGS' 
        ? 'High-Yield Reserve Savings' 
        : accType === 'BUSINESS' 
          ? 'Executive Commercial Vault' 
          : 'HSBC Premier Checking';

      const newAccount: BankAccount = {
        id: newAccId,
        userId: newUserId,
        name: accName,
        accountNumber: accNumber,
        routingNumber: '021000089',
        iban: `GB29MIDL400515${Math.floor(10000000 + Math.random() * 90000000)}`,
        swift: 'HBUKGB41400',
        type: accType,
        balance: 10000.00,
        availableBalance: 10000.00,
        pendingBalance: 0,
        currency: 'USD',
        isPrimary: true,
        status: 'ACTIVE',
        interestRate: accType === 'SAVINGS' ? 0.0475 : 0.005,
        createdAt: nowIso,
      };

      // 5. Initial Deposit Transaction
      const initialTx: Transaction = {
        id: `tx_${newUserId}_init`,
        userId: newUserId,
        accountId: newAccId,
        accountName: `${accName} **${accNumber}`,
        description: 'Account Opening Welcome Credit',
        merchantName: 'HSBC Premier Banking',
        category: 'Deposit',
        amount: 10000.00,
        currency: 'USD',
        status: 'Completed',
        date: nowIso,
        reference: 'INIT-DEP-' + Math.floor(100000 + Math.random() * 900000),
        recipientOrSender: 'HSBC Premier Welcome Bonus',
        riskScore: 'Low',
        note: 'Initial account opening welcome deposit',
      };

      // 6. Provision Premier Debit Card
      const newCard: Card = {
        id: `crd_${newUserId}_primary`,
        userId: newUserId,
        accountId: newAccId,
        cardNumber: `4532 •••• •••• ${accNumber}`,
        fullMaskedNumber: `•••• •••• •••• ${accNumber}`,
        cardholderName: `${params.firstName} ${params.lastName}`.toUpperCase(),
        expiryMonth: '09',
        expiryYear: '2029',
        cvv: '829',
        cardType: 'DEBIT',
        tier: 'HSBC Premier World',
        status: 'ACTIVE',
        spendingLimit: 5000,
        monthlySpent: 0,
        controls: {
          onlinePayments: true,
          contactless: true,
          internationalUsage: true,
          atmWithdrawals: true,
        },
        colorTheme: 'black',
        createdAt: nowIso,
      };

      // 7. Welcome Notification
      const welcomeNotif: NotificationItem = {
        id: `notif_${newUserId}_welcome`,
        userId: newUserId,
        title: 'Welcome to HSBC Premier',
        message: `Welcome, ${params.firstName}! Your Premier account **${accNumber} is active with $10,000.00 opening balance.`,
        type: 'SECURITY',
        isRead: false,
        createdAt: nowIso,
      };

      // Save directly to Cloud Firestore under UID
      await saveUserToFirestore(newUser);
      await saveAccountToFirestore(newAccount);
      await saveTransactionToFirestore(initialTx);
      await saveCardToFirestore(newCard);
      await saveNotificationToFirestore(welcomeNotif);

      return { success: true };
    } catch (authErr: any) {
      console.warn('Registration caught exception:', authErr);
      const isEmailInUse = 
        authErr.code === 'auth/email-already-in-use' || 
        authErr.code === 'auth/email-already-exists' ||
        authErr.message?.includes('email-already-in-use') ||
        authErr.message?.includes('email-already-exists');

      if (isEmailInUse) {
        // If account already exists in Firebase Auth, attempt immediate sign-in with provided password
        try {
          const cred = await signInWithEmailAndPassword(auth, cleanEmail, rawPassword);
          const fbUser = cred.user;
          const profile = await getUserProfileFromFirestore(fbUser.uid);
          if (!profile) {
            const newUser: UserProfile = {
              id: fbUser.uid,
              firstName: params.firstName,
              lastName: params.lastName,
              email: cleanEmail,
              username: cleanUsername,
              role: 'CUSTOMER',
              customerId: 'HSBC-CUST-' + Math.floor(100000 + Math.random() * 900000),
              phone: '+1 (555) 392-8104',
              address: {
                street: '450 Lexington Avenue',
                city: 'New York',
                state: 'NY',
                postalCode: '10017',
                country: 'United States',
              },
              dateOfBirth: '1992-04-18',
              avatarUrl: '',
              status: 'Active',
              twoFactorEnabled: true,
              biometricsEnabled: true,
              preferences: {
                theme: 'dark',
                currency: 'USD',
                language: 'English',
                timeZone: 'America/New_York',
                emailAlerts: true,
                smsAlerts: true,
                pushAlerts: true,
                marketingEmails: false,
              },
              securityScore: 94,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };
            await saveUserToFirestore(newUser);
          }
          return { success: true };
        } catch (signInErr: any) {
          return { 
            success: false, 
            error: 'An account with this email address already exists. Please sign in with your password.' 
          };
        }
      }

      if (authErr.code === 'auth/invalid-email' || authErr.message?.includes('invalid-email')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (authErr.code === 'auth/weak-password' || authErr.message?.includes('weak-password')) {
        return { success: false, error: 'Password is too weak. Please use at least 6 characters.' };
      }
      return { 
        success: false, 
        error: authErr.message?.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, '').trim() || 'Registration failed.' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setCurrentUserProfile(null);
    setIsAuthenticated(false);
  };

  const transferFunds = async (params: {
    fromAccountId: string;
    recipientName: string;
    recipientAccount: string;
    amount: number;
    transferType: 'INTERNAL' | 'OTHER_CUSTOMER' | 'DOMESTIC_WIRE' | 'INTERNATIONAL_SWIFT';
    reference: string;
    note?: string;
  }) => {
    if (!currentUser.id) {
      return { success: false, error: 'User is not authenticated' };
    }
    const fromAcc = accounts.find(a => a.id === params.fromAccountId);
    if (!fromAcc) {
      return { success: false, error: 'Source account not found' };
    }
    if (fromAcc.availableBalance < params.amount) {
      return { success: false, error: `Insufficient funds. Available: $${fromAcc.availableBalance.toFixed(2)}` };
    }

    const txId = 'tx_' + Date.now();
    const nowIso = new Date().toISOString();

    // Deduct source account
    const updatedFromAcc = {
      ...fromAcc,
      balance: fromAcc.balance - params.amount,
      availableBalance: fromAcc.availableBalance - params.amount,
    };
    await saveAccountToFirestore(updatedFromAcc);

    // If internal transfer between user's own accounts:
    const destAcc = accounts.find(a => a.accountNumber === params.recipientAccount || a.id === params.recipientAccount);
    if (params.transferType === 'INTERNAL' && destAcc) {
      const updatedDestAcc = {
        ...destAcc,
        balance: destAcc.balance + params.amount,
        availableBalance: destAcc.availableBalance + params.amount,
      };
      await saveAccountToFirestore(updatedDestAcc);

      // Destination credit transaction
      const destTx: Transaction = {
        id: 'tx_dst_' + Date.now(),
        userId: currentUser.id,
        accountId: destAcc.id,
        accountName: `${destAcc.name} **${destAcc.accountNumber}`,
        description: `Deposit from ${fromAcc.name} **${fromAcc.accountNumber}`,
        merchantName: fromAcc.name,
        category: 'Transfer',
        amount: params.amount,
        currency: 'USD',
        status: 'Completed',
        date: nowIso,
        reference: params.reference || `INT-TRF-${Date.now().toString().slice(-6)}`,
        recipientOrSender: `${fromAcc.name} **${fromAcc.accountNumber}`,
        riskScore: 'Low',
        note: params.note,
      };
      await saveTransactionToFirestore(destTx);
    }

    // Source debit transaction
    const sourceTx: Transaction = {
      id: txId,
      userId: currentUser.id,
      accountId: fromAcc.id,
      accountName: `${fromAcc.name} **${fromAcc.accountNumber}`,
      description: `Transfer to ${params.recipientName}`,
      merchantName: params.recipientName,
      category: 'Transfer',
      amount: -params.amount,
      currency: 'USD',
      status: 'Completed',
      date: nowIso,
      reference: params.reference || `TRF-HSBC-${Date.now().toString().slice(-6)}`,
      recipientOrSender: `${params.recipientName} **${params.recipientAccount.slice(-4)}`,
      fee: 0.00,
      riskScore: params.amount > 5000 ? 'Medium' : 'Low',
      note: params.note,
    };
    await saveTransactionToFirestore(sourceTx);

    // Send notification
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId: currentUser.id,
      title: 'Transfer Completed',
      message: `Successfully transferred $${params.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} to ${params.recipientName}.`,
      type: 'TRANSFER',
      isRead: false,
      createdAt: nowIso,
      linkUrl: '/dashboard/transactions',
    };
    await saveNotificationToFirestore(newNotif);

    // Create Audit Log in Firestore
    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Premier Customer',
      actorRole: currentUser.role,
      action: 'TRANSFER_SUBMITTED',
      details: `Transferred $${params.amount.toFixed(2)} to ${params.recipientName} (${params.transferType})`,
      targetEntity: fromAcc.id,
      timestamp: nowIso,
      ipAddress: '198.51.100.42',
    };
    await saveAuditLogToFirestore(newAudit);

    return { success: true, transactionId: txId };
  };

  const addBeneficiary = async (ben: Omit<Beneficiary, 'id' | 'createdAt' | 'userId'>) => {
    if (!currentUser.id) return;
    const newBen: Beneficiary = {
      ...ben,
      id: 'ben_' + Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    await saveBeneficiaryToFirestore(newBen);
  };

  const editBeneficiary = async (id: string, updates: Partial<Beneficiary>) => {
    const target = beneficiaries.find(b => b.id === id);
    if (target) {
      const updated = { ...target, ...updates };
      await saveBeneficiaryToFirestore(updated);
    }
  };

  const deleteBeneficiary = async (id: string) => {
    await deleteBeneficiaryFromFirestore(id);
  };

  const toggleFavoriteBeneficiary = async (id: string) => {
    const target = beneficiaries.find(b => b.id === id);
    if (target) {
      const updated = { ...target, isFavorite: !target.isFavorite };
      await saveBeneficiaryToFirestore(updated);
    }
  };

  const payBill = async (billId: string, fromAccountId: string, amount: number) => {
    const bill = bills.find(b => b.id === billId);
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    if (!bill || !fromAcc || fromAcc.availableBalance < amount || !currentUser.id) return false;

    const nowIso = new Date().toISOString();

    // Deduct account
    const updatedAcc = {
      ...fromAcc,
      balance: fromAcc.balance - amount,
      availableBalance: fromAcc.availableBalance - amount,
    };
    await saveAccountToFirestore(updatedAcc);

    // Update bill
    const updatedBill: BillPayment = {
      ...bill,
      status: 'PAID',
      amountDue: 0,
      lastPaymentDate: nowIso,
      lastPaymentAmount: amount,
    };
    await saveBillPaymentToFirestore(updatedBill);

    // Add transaction
    const newTx: Transaction = {
      id: 'tx_bil_' + Date.now(),
      userId: currentUser.id,
      accountId: fromAcc.id,
      accountName: `${fromAcc.name} **${fromAcc.accountNumber}`,
      description: `Bill Payment - ${bill.billerName}`,
      merchantName: bill.billerName,
      category: 'Utilities',
      amount: -amount,
      currency: 'USD',
      status: 'Completed',
      date: nowIso,
      reference: `BIL-PMT-${Date.now().toString().slice(-6)}`,
      riskScore: 'Low',
    };
    await saveTransactionToFirestore(newTx);

    // Add notification
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId: currentUser.id,
      title: 'Bill Payment Processed',
      message: `Paid $${amount.toFixed(2)} to ${bill.billerName}.`,
      type: 'PAYMENT',
      isRead: false,
      createdAt: nowIso,
      linkUrl: '/dashboard/bills',
    };
    await saveNotificationToFirestore(newNotif);

    return true;
  };

  const addBill = async (bill: Omit<BillPayment, 'id' | 'userId'>) => {
    if (!currentUser.id) return;
    const newBill: BillPayment = {
      ...bill,
      id: 'bil_' + Date.now(),
      userId: currentUser.id,
    };
    await saveBillPaymentToFirestore(newBill);
  };

  const toggleAutoPay = async (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      await saveBillPaymentToFirestore({ ...bill, autoPay: !bill.autoPay });
    }
  };

  const toggleFreezeCard = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      const nextStatus = card.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
      await saveCardToFirestore({ ...card, status: nextStatus as any });
    }
  };

  const updateCardLimits = async (cardId: string, limit: number, controls: Card['controls']) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      await saveCardToFirestore({ ...card, spendingLimit: limit, controls });
    }
  };

  const replaceCard = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      const randomLast4 = Math.floor(1000 + Math.random() * 9000).toString();
      const updatedCard: Card = {
        ...card,
        cardNumber: `4821 •••• •••• ${randomLast4}`,
        fullMaskedNumber: `4821 5590 1204 ${randomLast4}`,
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        status: 'ACTIVE',
      };
      await saveCardToFirestore(updatedCard);
    }
  };

  const createSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser.id) return;
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'svg_' + Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    await saveSavingsGoalToFirestore(newGoal);
  };

  const depositToSavingsGoal = async (goalId: string, fromAccountId: string, amount: number) => {
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!fromAcc || !goal || fromAcc.availableBalance < amount || !currentUser.id) return false;

    const updatedAcc = { ...fromAcc, balance: fromAcc.balance - amount, availableBalance: fromAcc.availableBalance - amount };
    await saveAccountToFirestore(updatedAcc);

    const updatedGoal = { ...goal, currentAmount: goal.currentAmount + amount };
    await saveSavingsGoalToFirestore(updatedGoal);

    const nowIso = new Date().toISOString();
    const newTx: Transaction = {
      id: 'tx_svg_' + Date.now(),
      userId: currentUser.id,
      accountId: fromAcc.id,
      accountName: `${fromAcc.name} **${fromAcc.accountNumber}`,
      description: `Deposit to Goal: ${goal.name}`,
      merchantName: 'HSBC Savings Vault',
      category: 'Transfer',
      amount: -amount,
      currency: 'USD',
      status: 'Completed',
      date: nowIso,
      reference: `GOAL-DEP-${Date.now().toString().slice(-6)}`,
      riskScore: 'Low',
    };
    await saveTransactionToFirestore(newTx);

    return true;
  };

  const contributeToGoal = (goalId: string, amount: number) => {
    const primaryAcc = accounts[0];
    if (primaryAcc) {
      depositToSavingsGoal(goalId, primaryAcc.id, amount);
    }
  };

  const withdrawFromSavingsGoal = async (goalId: string, toAccountId: string, amount: number) => {
    const toAcc = accounts.find(a => a.id === toAccountId);
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!toAcc || !goal || goal.currentAmount < amount || !currentUser.id) return false;

    const updatedAcc = { ...toAcc, balance: toAcc.balance + amount, availableBalance: toAcc.availableBalance + amount };
    await saveAccountToFirestore(updatedAcc);

    const updatedGoal = { ...goal, currentAmount: goal.currentAmount - amount };
    await saveSavingsGoalToFirestore(updatedGoal);

    const nowIso = new Date().toISOString();
    const newTx: Transaction = {
      id: 'tx_svg_w_' + Date.now(),
      userId: currentUser.id,
      accountId: toAcc.id,
      accountName: `${toAcc.name} **${toAcc.accountNumber}`,
      description: `Withdrawal from Goal: ${goal.name}`,
      merchantName: 'HSBC Savings Vault',
      category: 'Transfer',
      amount: amount,
      currency: 'USD',
      status: 'Completed',
      date: nowIso,
      reference: `GOAL-WTH-${Date.now().toString().slice(-6)}`,
      riskScore: 'Low',
    };
    await saveTransactionToFirestore(newTx);

    return true;
  };

  const withdrawFromGoal = (goalId: string, amount: number) => {
    const primaryAcc = accounts[0];
    if (primaryAcc) {
      withdrawFromSavingsGoal(goalId, primaryAcc.id, amount);
    }
  };

  const makeLoanPayment = async (loanId: string, fromAccountId: string, amount: number) => {
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const loan = loans.find(l => l.id === loanId);
    if (!fromAcc || !loan || fromAcc.availableBalance < amount || !currentUser.id) return false;

    const updatedAcc = { ...fromAcc, balance: fromAcc.balance - amount, availableBalance: fromAcc.availableBalance - amount };
    await saveAccountToFirestore(updatedAcc);

    const updatedLoan: Loan = {
      ...loan,
      remainingBalance: Math.max(0, loan.remainingBalance - amount),
      paymentHistory: [
        {
          id: 'pay_' + Date.now(),
          date: new Date().toISOString(),
          amount: amount,
          principalPaid: amount * 0.85,
          interestPaid: amount * 0.15,
          status: 'PAID',
        },
        ...loan.paymentHistory,
      ]
    };
    await setDoc(doc(db, 'loans', loan.id), updatedLoan, { merge: true });

    const nowIso = new Date().toISOString();
    const newTx: Transaction = {
      id: 'tx_loan_' + Date.now(),
      userId: currentUser.id,
      accountId: fromAcc.id,
      accountName: `${fromAcc.name} **${fromAcc.accountNumber}`,
      description: `Loan Repayment - ${loan.title}`,
      merchantName: 'HSBC Credit & Lending',
      category: 'Transfer',
      amount: -amount,
      currency: 'USD',
      status: 'Completed',
      date: nowIso,
      reference: `LOAN-PAY-${Date.now().toString().slice(-6)}`,
      riskScore: 'Low',
    };
    await saveTransactionToFirestore(newTx);

    return true;
  };

  const markNotificationRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      await saveNotificationToFirestore({ ...notif, isRead: true });
    }
  };

  const markAllNotificationsRead = async () => {
    for (const n of notifications) {
      if (n.userId === currentUser.id && !n.isRead) {
        await saveNotificationToFirestore({ ...n, isRead: true });
      }
    }
  };

  const deleteNotification = async (id: string) => {
    await deleteNotificationFromFirestore(id);
  };

  const createSupportTicket = async (
    subject: string, 
    category: SupportTicket['category'], 
    message: string, 
    priority: SupportTicket['priority']
  ) => {
    if (!currentUser.id) return;
    const newTicket: SupportTicket = {
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Premier Customer',
      userEmail: currentUser.email,
      subject,
      category,
      status: 'Open',
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_' + Date.now(),
          sender: 'user',
          senderName: `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Premier Customer',
          content: message,
          timestamp: new Date().toISOString(),
        }
      ]
    };
    await saveSupportTicketToFirestore(newTicket);
  };

  const replyToSupportTicket = async (ticketId: string, message: string, senderType: 'user' | 'agent' = 'user') => {
    const target = supportTickets.find(t => t.id === ticketId);
    if (!target) return;

    const nowIso = new Date().toISOString();
    const updatedTicket: SupportTicket = {
      ...target,
      updatedAt: nowIso,
      status: senderType === 'agent' ? 'Waiting for Customer' : 'In Progress',
      messages: [
        ...target.messages,
        {
          id: 'msg_' + Date.now(),
          sender: senderType,
          senderName: senderType === 'agent' ? `${currentUser.firstName} (Support Agent)` : `${currentUser.firstName} ${currentUser.lastName}`,
          content: message,
          timestamp: nowIso,
        }
      ]
    };
    await saveSupportTicketToFirestore(updatedTicket);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser.id) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUserProfile(updatedUser);
    await saveUserToFirestore(updatedUser);
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await setDoc(doc(db, 'loginSessions', sessionId), { isCurrent: false }, { merge: true });
    } catch (err) {
      console.warn('revokeSession error:', err);
    }
  };

  const revokeAllOtherSessions = async () => {
    for (const s of loginSessions) {
      if (!s.isCurrent) {
        await revokeSession(s.id);
      }
    }
  };

  const resetAllDemoData = async () => {
    await seedFirestoreIfEmpty(
      INITIAL_USERS,
      INITIAL_ACCOUNTS,
      INITIAL_TRANSACTIONS,
      INITIAL_BENEFICIARIES,
      INITIAL_CARDS,
      INITIAL_SAVINGS_GOALS,
      INITIAL_LOANS,
      INITIAL_BILLS,
      INITIAL_NOTIFICATIONS,
      INITIAL_SUPPORT_TICKETS,
      INITIAL_FRAUD_ALERTS,
      INITIAL_AUDIT_LOGS
    );
  };

  const toggleFreezeUser = async (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      const nextStatus = target.status === 'Suspended' ? 'Active' : 'Suspended';
      await saveUserToFirestore({ ...target, status: nextStatus });
    }
  };

  const adminUpdateUserStatus = async (userId: string, status: 'Active' | 'Suspended' | 'Pending Verification') => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      await saveUserToFirestore({ ...target, status });
    }
    
    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Admin',
      actorRole: currentUser.role,
      action: 'CUSTOMER_STATUS_MODIFIED',
      details: `Updated status for user ${userId} to ${status}`,
      targetEntity: userId,
      timestamp: new Date().toISOString(),
      ipAddress: '12.204.91.10',
    };
    await saveAuditLogToFirestore(newAudit);
  };

  const adminUpdateFraudAlert = async (alertId: string, status: FraudAlert['status'], resolutionNote: string) => {
    const target = fraudAlerts.find(a => a.id === alertId);
    if (target) {
      await saveFraudAlertToFirestore({ ...target, status, recommendedAction: resolutionNote });
    }
    
    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Admin',
      actorRole: currentUser.role,
      action: 'FRAUD_ALERT_RESOLVED',
      details: `Alert ${alertId} updated to ${status}. Notes: ${resolutionNote}`,
      targetEntity: alertId,
      timestamp: new Date().toISOString(),
      ipAddress: '12.204.91.10',
    };
    await saveAuditLogToFirestore(newAudit);
  };

  const adminReverseTransaction = async (transactionId: string) => {
    const tx = (currentUser.role === 'ADMIN' ? adminAllTransactions : transactions).find(t => t.id === transactionId);
    if (!tx || tx.status === 'Reversed') return;

    const updatedTx: Transaction = { ...tx, status: 'Reversed' };
    await saveTransactionToFirestore(updatedTx);

    const relatedAcc = (currentUser.role === 'ADMIN' ? adminAllAccounts : accounts).find(a => a.id === tx.accountId);
    if (relatedAcc) {
      const updatedAcc = {
        ...relatedAcc,
        balance: relatedAcc.balance - tx.amount,
        availableBalance: relatedAcc.availableBalance - tx.amount,
      };
      await saveAccountToFirestore(updatedAcc);
    }

    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Admin',
      actorRole: currentUser.role,
      action: 'TRANSACTION_ADMIN_REVERSED',
      details: `Reversed transaction ${transactionId} ($${Math.abs(tx.amount).toFixed(2)})`,
      targetEntity: transactionId,
      timestamp: new Date().toISOString(),
      ipAddress: '12.204.91.10',
    };
    await saveAuditLogToFirestore(newAudit);
  };

  const syncToFirestoreNow = async () => {
    return await syncAllDataToFirestore(
      allUsers,
      accounts,
      transactions,
      beneficiaries,
      cards,
      savingsGoals,
      loans,
      bills,
      notifications,
      supportTickets,
      fraudAlerts,
      auditLogs
    );
  };

  return (
    <BankingContext.Provider
      value={{
        currentUser,
        allUsers,
        users: allUsers,
        role,
        accounts: currentUser.role === 'ADMIN' ? adminAllAccounts : accounts,
        transactions: currentUser.role === 'ADMIN' ? adminAllTransactions : transactions,
        beneficiaries,
        cards: currentUser.role === 'ADMIN' ? adminAllCards : cards,
        savingsGoals,
        loans,
        bills,
        notifications,
        unreadNotificationCount,
        loginSessions,
        securityEvents,
        supportTickets,
        fraudAlerts,
        auditLogs,
        allAccounts: currentUser.role === 'ADMIN' ? adminAllAccounts : accounts,
        allTransactions: currentUser.role === 'ADMIN' ? adminAllTransactions : transactions,
        allCards: currentUser.role === 'ADMIN' ? adminAllCards : cards,
        hideBalances,
        theme,
        isDarkMode,
        toggleHideBalances,
        setTheme,
        switchUser,
        login,
        register,
        logout,
        isAuthenticated,
        isAuthLoading,
        transferFunds,
        addBeneficiary,
        editBeneficiary,
        deleteBeneficiary,
        toggleFavoriteBeneficiary,
        payBill,
        addBill,
        toggleAutoPay,
        toggleFreezeCard,
        updateCardLimits,
        replaceCard,
        createSavingsGoal,
        depositToSavingsGoal,
        withdrawFromSavingsGoal,
        contributeToGoal,
        withdrawFromGoal,
        makeLoanPayment,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        createSupportTicket,
        replyToSupportTicket,
        updateUserProfile,
        revokeSession,
        revokeAllOtherSessions,
        resetAllDemoData,
        resetAllData: resetAllDemoData,
        toggleFreezeUser,
        adminUpdateUserStatus,
        adminUpdateFraudAlert,
        adminReverseTransaction,
        reverseTransaction: adminReverseTransaction,
        syncToFirestoreNow,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
