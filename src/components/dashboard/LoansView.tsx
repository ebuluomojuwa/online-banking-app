import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  Calculator, 
  CheckCircle2, 
  Calendar, 
  TrendingDown, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Percent,
  DollarSign
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Loan } from '../../types';
import { Badge, Modal } from '../ui';

export const LoansView: React.FC = () => {
  const { loans, accounts, currentUser, makeLoanPayment, hideBalances } = useBanking();

  // Active Loans for current user
  const userLoans = loans.filter(l => l.userId === currentUser.id);

  // Payment modal state
  const [selectedLoanForPay, setSelectedLoanForPay] = useState<Loan | null>(null);
  const [payAccountId, setPayAccountId] = useState(accounts[0]?.id || '');
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  // Interactive Loan Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(35000);
  const [calcTermYears, setCalcTermYears] = useState<number>(5);
  const [calcRate, setCalcRate] = useState<number>(5.49);

  // Calculator Math
  const calculatedLoan = useMemo(() => {
    const principal = calcAmount;
    const monthlyRate = calcRate / 100 / 12;
    const numberOfPayments = calcTermYears * 12;

    if (monthlyRate === 0) {
      const monthlyPayment = principal / numberOfPayments;
      return {
        monthlyPayment,
        totalPayment: principal,
        totalInterest: 0,
      };
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
    };
  }, [calcAmount, calcTermYears, calcRate]);

  // Amortization Schedule preview (first 5 years)
  const amortizationSchedule = useMemo(() => {
    let balance = calcAmount;
    const monthlyRate = calcRate / 100 / 12;
    const monthlyPayment = calculatedLoan.monthlyPayment;
    const schedule = [];

    for (let year = 1; year <= Math.min(calcTermYears, 5); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let m = 1; m <= 12; m++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        yearlyInterest += interest;
        yearlyPrincipal += principal;
        balance -= principal;
        if (balance < 0) balance = 0;
      }

      schedule.push({
        year,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        remainingBalance: balance,
      });
    }
    return schedule;
  }, [calcAmount, calcTermYears, calcRate, calculatedLoan.monthlyPayment]);

  const handlePayInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanForPay) return;

    makeLoanPayment(selectedLoanForPay.id, selectedLoanForPay.monthlyPayment, payAccountId);
    setPaySuccessMsg(`Successfully processed installment of $${selectedLoanForPay.monthlyPayment.toFixed(2)}`);
    setTimeout(() => {
      setSelectedLoanForPay(null);
      setPaySuccessMsg('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Loans & Credit Facilities
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Review active simulated lending facilities, interest amortization, and simulate financing
          </p>
        </div>

        <Badge variant="success">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Fixed Institutional Rates
        </Badge>
      </div>

      {/* Active Loans Section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
          Active Lending Accounts ({userLoans.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userLoans.map(loan => {
            const progressPaid = ((loan.originalAmount - loan.remainingBalance) / loan.originalAmount) * 100;

            return (
              <div
                key={loan.id}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{loan.name}</h3>
                        <span className="text-[11px] text-zinc-400">
                          {loan.type} • {loan.interestRate}% APR Fixed
                        </span>
                      </div>
                    </div>

                    <Badge variant={loan.status === 'CURRENT' ? 'success' : 'warning'}>
                      {loan.status}
                    </Badge>
                  </div>

                  {/* Balances */}
                  <div className="mt-5 grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Remaining Balance</span>
                      <strong className="text-xl font-bold text-zinc-950 dark:text-white">
                        {hideBalances ? '••••••' : `$${loan.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Monthly Due</span>
                      <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ${loan.monthlyPayment.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Paid Principal: ${(loan.originalAmount - loan.remainingBalance).toLocaleString()}</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{progressPaid.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-zinc-900 dark:bg-white h-full rounded-full transition-all"
                        style={{ width: `${progressPaid}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                    <span>Next Due Date: <strong>{new Date(loan.nextPaymentDate).toLocaleDateString()}</strong></span>
                    <span>Maturity: <strong>{new Date(loan.maturityDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</strong></span>
                  </div>
                </div>

                {/* Make Payment Button */}
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Auto-Debit: <strong>Active</strong></span>
                  <button
                    onClick={() => setSelectedLoanForPay(loan)}
                    className="px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
                  >
                    Pay Installment (${loan.monthlyPayment.toFixed(2)})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Loan & Amortization Calculator */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Institutional Loan & Mortgage Calculator
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Calculate projected monthly repayments and interest breakdown with custom parameters
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Sliders Area (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Principal Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Borrowing Principal</span>
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                  ${calcAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={calcAmount}
                onChange={e => setCalcAmount(Number(e.target.value))}
                className="w-full accent-zinc-950 dark:accent-white cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>$5,000</span>
                <span>$250,000</span>
                <span>$500,000</span>
              </div>
            </div>

            {/* Term Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Loan Term (Years)</span>
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                  {calcTermYears} Years ({calcTermYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={calcTermYears}
                onChange={e => setCalcTermYears(Number(e.target.value))}
                className="w-full accent-zinc-950 dark:accent-white cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Annual Interest Rate (APR)</span>
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {calcRate.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min="1.99"
                max="18.99"
                step="0.1"
                value={calcRate}
                onChange={e => setCalcRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>1.99%</span>
                <span>9.99%</span>
                <span>18.99%</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-800/60 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-700 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Estimated Monthly Payment
              </span>
              <div className="text-3xl font-extrabold text-zinc-950 dark:text-white mt-1">
                ${calculatedLoan.monthlyPayment.toFixed(2)}
                <span className="text-xs text-zinc-400 font-normal font-sans ml-1">/ month</span>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-zinc-200/60 dark:divide-zinc-700/60">
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Total Principal:</span>
                <strong className="text-zinc-900 dark:text-white">${calcAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Total Interest Paid:</span>
                <strong className="text-rose-600 dark:text-rose-400">
                  ${calculatedLoan.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Total Lifetime Cost:</span>
                <strong className="text-zinc-900 dark:text-white">
                  ${calculatedLoan.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            </div>

            <div className="text-[10px] text-zinc-400">
              * Rates simulated for demonstration. Subject to credit underwriting and tier qualification.
            </div>
          </div>
        </div>

        {/* Amortization Schedule Table */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3">
            Amortization Schedule Preview (Annual Breakdown)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 text-[10px] uppercase">
                  <th className="py-2">Year</th>
                  <th className="py-2">Principal Paid</th>
                  <th className="py-2">Interest Paid</th>
                  <th className="py-2 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                {amortizationSchedule.map(row => (
                  <tr key={row.year} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-2 font-sans font-semibold text-zinc-800 dark:text-zinc-200">Year {row.year}</td>
                    <td className="py-2 text-emerald-600 dark:text-emerald-400">${row.principalPaid.toFixed(2)}</td>
                    <td className="py-2 text-rose-500">${row.interestPaid.toFixed(2)}</td>
                    <td className="py-2 text-right text-zinc-900 dark:text-white font-bold">${row.remainingBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pay Installment Modal */}
      {selectedLoanForPay && (
        <Modal
          isOpen={!!selectedLoanForPay}
          onClose={() => setSelectedLoanForPay(null)}
          title={`Pay ${selectedLoanForPay.name} Installment`}
          description={`Amount due: $${selectedLoanForPay.monthlyPayment.toFixed(2)}`}
        >
          <form onSubmit={handlePayInstallment} className="space-y-4 text-xs">
            {paySuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">{paySuccessMsg}</span>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300">Debit Source Account</label>
                  <select
                    value={payAccountId}
                    onChange={e => setPayAccountId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                  >
                    {accounts.filter(a => a.userId === currentUser.id && a.type !== 'CREDIT').map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (**{acc.accountNumber}) — Available: ${acc.availableBalance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Installment Amount:</span>
                    <strong className="text-zinc-900 dark:text-white font-bold">${selectedLoanForPay.monthlyPayment.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Principal Remaining After Payment:</span>
                    <span className="text-zinc-900 dark:text-white font-mono">
                      ${(selectedLoanForPay.remainingBalance - (selectedLoanForPay.monthlyPayment * 0.7)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLoanForPay(null)}
                    className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    Authorize Payment
                  </button>
                </div>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};
