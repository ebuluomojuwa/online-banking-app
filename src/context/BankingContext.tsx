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

interface BankingContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
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
  login: (identifier: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;

  // Account & Financial Actions
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
  
  toggleFreezeCard: (cardId: string) => void;
  updateCardLimits: (cardId: string, limit: number, controls: Card['controls']) => void;
  replaceCard: (cardId: string) => void;
  
  createSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => void;
  depositToSavingsGoal: (goalId: string, fromAccountId: string, amount: number) => Promise<boolean>;
  withdrawFromSavingsGoal: (goalId: string, toAccountId: string, amount: number) => Promise<boolean>;
  
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

  // Admin Actions
  adminUpdateUserStatus: (userId: string, status: 'Active' | 'Suspended' | 'Pending Verification') => void;
  adminUpdateFraudAlert: (alertId: string, status: FraudAlert['status'], resolutionNote: string) => void;
  adminReverseTransaction: (transactionId: string) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const STORAGE_PREFIX = 'hsbc_banking_v2_';

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use initial seed
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    return saved || 'usr_gregorio_lind';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'auth_state');
    return saved ? JSON.parse(saved) : true; // default logged in for prototype convenience
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'beneficiaries');
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
  });

  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'savings');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'loans');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [bills, setBills] = useState<BillPayment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [loginSessions, setLoginSessions] = useState<LoginSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'sessions');
    return saved ? JSON.parse(saved) : INITIAL_LOGIN_SESSIONS;
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'security_events');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_EVENTS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'support_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'fraud_alerts');
    return saved ? JSON.parse(saved) : INITIAL_FRAUD_ALERTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [hideBalances, setHideBalances] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'hide_balances');
    return saved ? JSON.parse(saved) : false;
  });

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'theme');
    return (saved as any) || 'dark';
  });

  // Synced current user object
  const currentUser = useMemo(() => {
    const found = allUsers.find(u => u.id === currentUserId);
    return found || allUsers[0];
  }, [allUsers, currentUserId]);

  // Dynamically scoped data for the authenticated customer
  const userAccounts = useMemo(() => accounts.filter(a => a.userId === currentUser.id), [accounts, currentUser.id]);
  const userTransactions = useMemo(() => transactions.filter(t => t.userId === currentUser.id), [transactions, currentUser.id]);
  const userCards = useMemo(() => cards.filter(c => c.userId === currentUser.id), [cards, currentUser.id]);
  const userBeneficiaries = useMemo(() => beneficiaries.filter(b => b.userId === currentUser.id), [beneficiaries, currentUser.id]);
  const userSavingsGoals = useMemo(() => savingsGoals.filter(s => s.userId === currentUser.id), [savingsGoals, currentUser.id]);
  const userLoans = useMemo(() => loans.filter(l => l.userId === currentUser.id), [loans, currentUser.id]);
  const userBills = useMemo(() => bills.filter(b => b.userId === currentUser.id), [bills, currentUser.id]);
  const userNotifications = useMemo(() => notifications.filter(n => n.userId === currentUser.id), [notifications, currentUser.id]);
  const userLoginSessions = useMemo(() => loginSessions.filter(s => s.userId === currentUser.id), [loginSessions, currentUser.id]);
  const userSecurityEvents = useMemo(() => securityEvents.filter(s => s.userId === currentUser.id), [securityEvents, currentUser.id]);
  const userSupportTickets = useMemo(() => 
    currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT_AGENT'
      ? supportTickets
      : supportTickets.filter(t => t.userId === currentUser.id),
    [supportTickets, currentUser.id, currentUser.role]
  );

  const unreadNotificationCount = useMemo(() => {
    return userNotifications.filter(n => !n.isRead).length;
  }, [userNotifications]);

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

  // Save to LocalStorage helpers
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(allUsers));
    localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUserId);
    localStorage.setItem(STORAGE_PREFIX + 'auth_state', JSON.stringify(isAuthenticated));
    localStorage.setItem(STORAGE_PREFIX + 'accounts', JSON.stringify(accounts));
    localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(transactions));
    localStorage.setItem(STORAGE_PREFIX + 'beneficiaries', JSON.stringify(beneficiaries));
    localStorage.setItem(STORAGE_PREFIX + 'cards', JSON.stringify(cards));
    localStorage.setItem(STORAGE_PREFIX + 'savings', JSON.stringify(savingsGoals));
    localStorage.setItem(STORAGE_PREFIX + 'loans', JSON.stringify(loans));
    localStorage.setItem(STORAGE_PREFIX + 'bills', JSON.stringify(bills));
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
    localStorage.setItem(STORAGE_PREFIX + 'sessions', JSON.stringify(loginSessions));
    localStorage.setItem(STORAGE_PREFIX + 'security_events', JSON.stringify(securityEvents));
    localStorage.setItem(STORAGE_PREFIX + 'support_tickets', JSON.stringify(supportTickets));
    localStorage.setItem(STORAGE_PREFIX + 'fraud_alerts', JSON.stringify(fraudAlerts));
    localStorage.setItem(STORAGE_PREFIX + 'audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem(STORAGE_PREFIX + 'hide_balances', JSON.stringify(hideBalances));
    localStorage.setItem(STORAGE_PREFIX + 'theme', theme);
  }, [
    allUsers, currentUserId, isAuthenticated, accounts, transactions, beneficiaries, 
    cards, savingsGoals, loans, bills, notifications, loginSessions, securityEvents, 
    supportTickets, fraudAlerts, auditLogs, hideBalances, theme
  ]);

  const toggleHideBalances = () => setHideBalances(prev => !prev);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      setIsAuthenticated(true);
      
      // Log switch security event
      const newEvent: SecurityEvent = {
        id: 'sec_' + Date.now(),
        userId: user.id,
        type: 'Session Active',
        description: `Switched active profile to ${user.firstName} ${user.lastName} (${user.role})`,
        ipAddress: '198.51.100.42',
        location: `${user.address.city}, ${user.address.state}, ${user.address.country}`,
        device: 'Web Client / Secure Portal',
        timestamp: new Date().toISOString(),
        riskLevel: 'LOW',
      };
      setSecurityEvents(prev => [newEvent, ...prev]);
    }
  };

  const login = (identifier: string, password?: string): { success: boolean; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, error: 'Please enter your username or email address.' };
    }

    const user = allUsers.find(u => 
      (u.username && u.username.toLowerCase() === cleanId) || 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.customerId && u.customerId.toLowerCase() === cleanId)
    );

    if (!user) {
      return { 
        success: false, 
        error: 'No account found matching this username or email. Please check your credentials.' 
      };
    }

    if (user.status === 'Suspended') {
      return { 
        success: false, 
        error: 'This account has been temporarily locked by HSBC Security. Please contact Premier Support.' 
      };
    }

    // Password verification with demo friendly tolerance
    if (password && user.password) {
      const isMatching = password === user.password || password === 'Password123!' || password === 'demo' || password === 'admin';
      if (!isMatching) {
        return { 
          success: false, 
          error: 'Incorrect password entered. Please check your password and try again.' 
        };
      }
    }

    setCurrentUserId(user.id);
    setIsAuthenticated(true);

    const nowIso = new Date().toISOString();
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastLogin: nowIso } : u));

    // Record login session
    const newSession: LoginSession = {
      id: 'ses_' + Date.now(),
      userId: user.id,
      device: 'MacBook Pro 16" (macOS)',
      browser: 'Google Chrome 128.0',
      ipAddress: '198.51.100.42',
      location: `${user.address.city}, ${user.address.state}, ${user.address.country}`,
      lastActive: 'Just now (Active)',
      isCurrent: true,
    };
    setLoginSessions(prev => [newSession, ...prev.map(s => ({ ...s, isCurrent: false }))]);

    // Record security event
    const newEvent: SecurityEvent = {
      id: 'sec_' + Date.now(),
      userId: user.id,
      type: 'Successful Login',
      description: `Authenticated via secure portal as ${user.firstName} ${user.lastName} (@${user.username || user.email})`,
      ipAddress: '198.51.100.42',
      location: `${user.address.city}, ${user.address.state}, ${user.address.country}`,
      device: 'Google Chrome / macOS',
      timestamp: nowIso,
      riskLevel: 'LOW',
    };
    setSecurityEvents(prev => [newEvent, ...prev]);

    return { success: true };
  };

  const logout = () => {
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
    setAccounts(prev => prev.map(acc => {
      if (acc.id === params.fromAccountId) {
        return {
          ...acc,
          balance: acc.balance - params.amount,
          availableBalance: acc.availableBalance - params.amount,
        };
      }
      return acc;
    }));

    // If internal transfer between user's own accounts:
    let destAcc = accounts.find(a => a.accountNumber === params.recipientAccount || a.id === params.recipientAccount);
    if (params.transferType === 'INTERNAL' && destAcc) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === destAcc!.id) {
          return {
            ...acc,
            balance: acc.balance + params.amount,
            availableBalance: acc.availableBalance + params.amount,
          };
        }
        return acc;
      }));

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
      setTransactions(prev => [destTx, ...prev]);
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

    setTransactions(prev => [sourceTx, ...prev]);

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
    setNotifications(prev => [newNotif, ...prev]);

    // Create Audit Log
    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      actorRole: currentUser.role,
      action: 'TRANSFER_SUBMITTED',
      details: `Transferred $${params.amount.toFixed(2)} to ${params.recipientName} (${params.transferType})`,
      targetEntity: fromAcc.id,
      timestamp: nowIso,
      ipAddress: '198.51.100.42',
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    return { success: true, transactionId: txId };
  };

  const addBeneficiary = (ben: Omit<Beneficiary, 'id' | 'createdAt' | 'userId'>) => {
    const newBen: Beneficiary = {
      ...ben,
      id: 'ben_' + Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setBeneficiaries(prev => [newBen, ...prev]);
  };

  const editBeneficiary = (id: string, updates: Partial<Beneficiary>) => {
    setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBeneficiary = (id: string) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
  };

  const toggleFavoriteBeneficiary = (id: string) => {
    setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const payBill = async (billId: string, fromAccountId: string, amount: number) => {
    const bill = bills.find(b => b.id === billId);
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    if (!bill || !fromAcc || fromAcc.availableBalance < amount) return false;

    const nowIso = new Date().toISOString();

    // Deduct account
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        return {
          ...acc,
          balance: acc.balance - amount,
          availableBalance: acc.availableBalance - amount,
        };
      }
      return acc;
    }));

    // Update bill
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          status: 'PAID',
          amountDue: 0,
          lastPaymentDate: nowIso,
          lastPaymentAmount: amount,
        };
      }
      return b;
    }));

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
    setTransactions(prev => [newTx, ...prev]);

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
    setNotifications(prev => [newNotif, ...prev]);

    return true;
  };

  const toggleFreezeCard = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const updateCardLimits = (cardId: string, limit: number, controls: Card['controls']) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, spendingLimit: limit, controls };
      }
      return c;
    }));
  };

  const replaceCard = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const randomLast4 = Math.floor(1000 + Math.random() * 9000).toString();
        return {
          ...c,
          cardNumber: `4821 •••• •••• ${randomLast4}`,
          fullMaskedNumber: `4821 5590 1204 ${randomLast4}`,
          cvv: Math.floor(100 + Math.random() * 900).toString(),
          status: 'ACTIVE',
        };
      }
      return c;
    }));
  };

  const createSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'svg_' + Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setSavingsGoals(prev => [newGoal, ...prev]);
  };

  const depositToSavingsGoal = async (goalId: string, fromAccountId: string, amount: number) => {
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!fromAcc || !goal || fromAcc.availableBalance < amount) return false;

    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: acc.balance - amount, availableBalance: acc.availableBalance - amount };
      }
      return acc;
    }));

    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));

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
    setTransactions(prev => [newTx, ...prev]);

    return true;
  };

  const withdrawFromSavingsGoal = async (goalId: string, toAccountId: string, amount: number) => {
    const toAcc = accounts.find(a => a.id === toAccountId);
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!toAcc || !goal || goal.currentAmount < amount) return false;

    setAccounts(prev => prev.map(acc => {
      if (acc.id === toAccountId) {
        return { ...acc, balance: acc.balance + amount, availableBalance: acc.availableBalance + amount };
      }
      return acc;
    }));

    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount - amount };
      }
      return g;
    }));

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
    setTransactions(prev => [newTx, ...prev]);

    return true;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const createSupportTicket = (
    subject: string, 
    category: SupportTicket['category'], 
    message: string, 
    priority: SupportTicket['priority']
  ) => {
    const newTicket: SupportTicket = {
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
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
          senderName: `${currentUser.firstName} ${currentUser.lastName}`,
          content: message,
          timestamp: new Date().toISOString(),
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const replyToSupportTicket = (ticketId: string, message: string, senderType: 'user' | 'agent' = 'user') => {
    const nowIso = new Date().toISOString();
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: nowIso,
          status: senderType === 'agent' ? 'Waiting for Customer' : 'In Progress',
          messages: [
            ...t.messages,
            {
              id: 'msg_' + Date.now(),
              sender: senderType,
              senderName: senderType === 'agent' ? `${currentUser.firstName} (Support Agent)` : `${currentUser.firstName} ${currentUser.lastName}`,
              content: message,
              timestamp: nowIso,
            }
          ]
        };
      }
      return t;
    }));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
  };

  const revokeSession = (sessionId: string) => {
    setLoginSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const revokeAllOtherSessions = () => {
    setLoginSessions(prev => prev.filter(s => s.isCurrent));
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUserId('usr_gregorio_lind');
    setIsAuthenticated(true);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setCards(INITIAL_CARDS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setLoans(INITIAL_LOANS);
    setBills(INITIAL_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setLoginSessions(INITIAL_LOGIN_SESSIONS);
    setSecurityEvents(INITIAL_SECURITY_EVENTS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setFraudAlerts(INITIAL_FRAUD_ALERTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setHideBalances(false);
  };

  const adminUpdateUserStatus = (userId: string, status: 'Active' | 'Suspended' | 'Pending Verification') => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    
    // Create Audit Log
    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      actorRole: currentUser.role,
      action: 'CUSTOMER_STATUS_MODIFIED',
      details: `Updated status for user ${userId} to ${status}`,
      targetEntity: userId,
      timestamp: new Date().toISOString(),
      ipAddress: '12.204.91.10',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const adminUpdateFraudAlert = (alertId: string, status: FraudAlert['status'], resolutionNote: string) => {
    setFraudAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status, recommendedAction: resolutionNote } : a));
    
    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      actorRole: currentUser.role,
      action: 'FRAUD_ALERT_RESOLVED',
      details: `Alert ${alertId} updated to ${status}. Notes: ${resolutionNote}`,
      targetEntity: alertId,
      timestamp: new Date().toISOString(),
      ipAddress: '12.204.91.10',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const adminReverseTransaction = (transactionId: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx || tx.status === 'Reversed') return;

    // Flip transaction status
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: 'Reversed' } : t));

    // Refund or debit the related account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        return {
          ...acc,
          balance: acc.balance - tx.amount,
          availableBalance: acc.availableBalance - tx.amount,
        };
      }
      return acc;
    }));

    const newAudit: AuditLog = {
      id: 'aud_' + Date.now(),
      actorId: currentUser.id,
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      actorRole: currentUser.role,
      action: 'TRANSACTION_ADMIN_REVERSED',
      details: `Reversed transaction ${transactionId} ($${Math.abs(tx.amount).toFixed(2)}) for reason: Admin reversal intervention`,
      targetEntity: transactionId,
      timestamp: new Date().toISOString(),
      ipAddress: '12.204.91.10',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  return (
    <BankingContext.Provider
      value={{
        currentUser,
        allUsers,
        accounts: currentUser.role === 'ADMIN' ? accounts : userAccounts,
        transactions: currentUser.role === 'ADMIN' ? transactions : userTransactions,
        beneficiaries: userBeneficiaries,
        cards: currentUser.role === 'ADMIN' ? cards : userCards,
        savingsGoals: userSavingsGoals,
        loans: userLoans,
        bills: userBills,
        notifications: userNotifications,
        unreadNotificationCount,
        loginSessions: userLoginSessions,
        securityEvents: userSecurityEvents,
        supportTickets: userSupportTickets,
        fraudAlerts,
        auditLogs,
        allAccounts: accounts,
        allTransactions: transactions,
        allCards: cards,
        hideBalances,
        theme,
        isDarkMode,
        toggleHideBalances,
        setTheme,
        switchUser,
        login,
        logout,
        isAuthenticated,
        transferFunds,
        addBeneficiary,
        editBeneficiary,
        deleteBeneficiary,
        toggleFavoriteBeneficiary,
        payBill,
        toggleFreezeCard,
        updateCardLimits,
        replaceCard,
        createSavingsGoal,
        depositToSavingsGoal,
        withdrawFromSavingsGoal,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        createSupportTicket,
        replyToSupportTicket,
        updateUserProfile,
        revokeSession,
        revokeAllOtherSessions,
        resetAllDemoData,
        adminUpdateUserStatus,
        adminUpdateFraudAlert,
        adminReverseTransaction,
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
