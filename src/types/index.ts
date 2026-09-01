export type UserRole = 'CUSTOMER' | 'SUPPORT_AGENT' | 'ADMIN' | 'SUPER_ADMIN';

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'BUSINESS' | 'INVESTMENT';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'DORMANT' | 'CLOSED';

export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string; // e.g. "4821" or "0948219034"
  routingNumber: string;
  iban: string;
  swift: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  status: AccountStatus;
  isPrimary?: boolean;
  interestRate?: number;
  creditLimit?: number;
  minDailyWithdrawal?: number;
  maxDailyWithdrawal?: number | null;
  dailyWithdrawalLimit?: string;
  createdAt: string;
}

export type TransactionStatus = 'Completed' | 'Posted' | 'Pending' | 'Failed' | 'Reversed';
export type TransactionCategory = 
  | 'Salary' 
  | 'Income' 
  | 'Deposit'
  | 'Transfer' 
  | 'Groceries' 
  | 'Utilities' 
  | 'Subscription' 
  | 'Dining' 
  | 'Shopping' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Health' 
  | 'Travel' 
  | 'Investment'
  | 'Cash & ATM'
  | 'Fees';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  accountName: string;
  description: string;
  merchantName?: string;
  sender?: string;
  type?: string;
  category: TransactionCategory;
  amount: number; // positive = credit/income, negative = debit/expense
  currency: string;
  status: TransactionStatus;
  date: string;
  reference: string;
  recipientOrSender?: string;
  fee?: number;
  riskScore?: 'Low' | 'Medium' | 'High';
  note?: string;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  bankName: string;
  accountNumber: string;
  nickname: string;
  country: string;
  currency: string;
  routingOrSwift: string;
  isFavorite: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export type CardType = 'DEBIT' | 'CREDIT' | 'VIRTUAL';
export type CardTier = 'HSBC Titanium' | 'HSBC Premier World' | 'HSBC Business Prime' | 'Nova Titanium' | 'Nova Sapphire' | 'Nova Business Prime';
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'BLOCKED' | 'EXPIRED';

export interface Card {
  id: string;
  userId: string;
  accountId: string;
  cardNumber: string; // formatted masked: "4821 •••• •••• 9210"
  fullMaskedNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardType: CardType;
  tier: CardTier;
  status: CardStatus;
  spendingLimit: number;
  monthlySpent: number;
  controls: {
    onlinePayments: boolean;
    contactless: boolean;
    internationalUsage: boolean;
    atmWithdrawals: boolean;
  };
  colorTheme: 'black' | 'navy' | 'emerald' | 'platinum';
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  color: string;
  icon: string;
  autoSaveEnabled: boolean;
  autoSaveMonthlyAmount?: number;
  createdAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  title: string;
  type: 'Personal Loan' | 'Auto Loan' | 'Home Mortgage' | 'Business Line of Credit';
  principal: number;
  remainingBalance: number;
  interestRate: number; // in %
  monthlyPayment: number;
  nextPaymentDate: string;
  startDate: string;
  termMonths: number;
  status: 'ACTIVE' | 'PAID_OFF' | 'DELINQUENT';
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    principalPaid: number;
    interestPaid: number;
    status: 'PAID' | 'SCHEDULED';
  }[];
}

export interface BillPayment {
  id: string;
  userId: string;
  billerName: string;
  billerCategory: 'Electricity' | 'Internet' | 'Water' | 'Mobile' | 'Insurance' | 'Streaming' | 'Government';
  accountNumber: string;
  amountDue: number;
  dueDate: string;
  status: 'PAID' | 'DUE' | 'OVERDUE' | 'SCHEDULED';
  autoPay: boolean;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

export interface StatementRecord {
  id: string;
  accountId: string;
  month: string;
  year: number;
  totalInflow: number;
  totalOutflow: number;
  startingBalance: number;
  endingBalance: number;
  transactionCount: number;
  generatedDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TRANSFER' | 'PAYMENT' | 'SECURITY' | 'CARD' | 'SYSTEM' | 'SUPPORT';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface LoginSession {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  type: string;
  description: string;
  ipAddress: string;
  location: string;
  device: string;
  timestamp: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Accounts' | 'Transfers' | 'Cards' | 'Security' | 'Technical' | 'General';
  status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'agent' | 'system';
    senderName: string;
    content: string;
    timestamp: string;
  }[];
}

export interface FraudAlert {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  status: 'Active' | 'Under Investigation' | 'Resolved' | 'Dismissed';
  recommendedAction: string;
  relatedTransactionId?: string;
  location?: string;
  ipAddress?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  targetEntity: string;
  timestamp: string;
  ipAddress: string;
}

export type Account = BankAccount;
export type Bill = BillPayment;
export type User = any;

export interface UserProfile {
  id: string;
  name?: string;
  accountNumber?: string;
  availableBalance?: number;
  customerId: string; // e.g. "HSBC-CUST-482019"
  username: string; // e.g. "gregoriolind"
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth: string;
  avatarUrl: string;
  status: 'Active' | 'Suspended' | 'Pending Verification';
  twoFactorEnabled: boolean;
  biometricsEnabled: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    language: string;
    timeZone: string;
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushAlerts: boolean;
    marketingEmails: boolean;
  };
  securityScore: number; // e.g. 96
  createdAt: string;
  lastLogin: string;
  lastPasswordChange?: string;
  memberSince?: string;
}
