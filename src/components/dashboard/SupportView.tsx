import React, { useState } from 'react';
import { 
  LifeBuoy, 
  MessageSquare, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  HelpCircle, 
  Sparkles,
  Bot,
  User,
  PhoneCall,
  Mail
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { SupportTicket } from '../../types';
import { Badge, Modal } from '../ui';

export const SupportView: React.FC = () => {
  const { supportTickets, currentUser, createSupportTicket } = useBanking();
  const userTickets = supportTickets.filter(t => t.userId === currentUser.id);

  // Chat simulator state
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    { sender: 'agent', text: `Hello ${currentUser.firstName}, welcome to HSBC Premier Concierge. How may I assist with your banking requirements today?`, time: '10:02 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Create ticket modal
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('TRANSFERS');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('MEDIUM');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const userMsg = { sender: 'user' as const, text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Dynamic simulated Concierge reply
    setTimeout(() => {
      let reply = "Thank you for contacting HSBC. I've noted your inquiry in our priority client log. A senior relationship manager has verified your secure session.";
      const lower = userText.toLowerCase();

      if (lower.includes('card') || lower.includes('limit')) {
        reply = "I see your inquiry regarding card management. You can adjust limits dynamically in the Cards & Limits tab, or I can submit an institutional limit increase request for your HSBC Premier card.";
      } else if (lower.includes('wire') || lower.includes('transfer') || lower.includes('swift')) {
        reply = "Domestic wires post on the same day if sent before 5:00 PM EST. SWIFT international wires take 1-2 business days with full end-to-end tracking.";
      } else if (lower.includes('rate') || lower.includes('apy') || lower.includes('interest')) {
        reply = "Your High-Yield Reserve account currently earns 4.75% APY compounding monthly. There are zero maintenance fees or minimum lockup periods.";
      }

      setMessages(prev => [...prev, {
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    createSupportTicket({
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      message: ticketMessage.trim(),
    });

    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Support Desk & Private Concierge
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            24/7 priority concierge support, real-time live assistance, and ticket management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
          >
            <Plus className="w-4 h-4" /> Open Support Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Interactive Concierge Chat (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                  NB
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                  HSBC Concierge Live Desk
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Online • Average reply time &lt; 1 min
                </span>
              </div>
            </div>

            <Badge variant="neutral" className="text-[10px]">Private Client Tier</Badge>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-br-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-zinc-400 dark:text-zinc-500 text-right' : 'text-zinc-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-200" />
                <span className="text-[11px] ml-1">Concierge is replying...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your message or inquiry..."
              className="flex-1 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Support Tickets & Knowledge Base (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Tickets List */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Your Support Tickets
              </h2>
              <span className="text-xs text-zinc-400">{userTickets.length} active</span>
            </div>

            <div className="space-y-2.5">
              {userTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-white">{ticket.subject}</span>
                    <Badge variant={ticket.status === 'RESOLVED' ? 'success' : ticket.status === 'IN_PROGRESS' ? 'warning' : 'neutral'} className="text-[10px] py-0 px-1.5">
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <span>Ref: #{ticket.id.slice(-5)}</span>
                    <span>•</span>
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span>{ticket.priority} Priority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ Articles */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
              Instant Knowledge Base
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { q: 'How long do international wire transfers take?', a: 'SWIFT transfers generally complete within 1-2 business days.' },
                { q: 'What is the maximum daily card limit?', a: 'HSBC Premier metal cards feature up to $25,000 daily spend capacity.' },
                { q: 'How does high-yield APY compound?', a: 'Interest accrues on the daily balance and posts on the 1st of every month.' },
              ].map((faq, i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{faq.q}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <Modal
          isOpen={showNewTicketModal}
          onClose={() => setShowNewTicketModal(false)}
          title="Open Concierge Support Ticket"
          description="A representative will respond directly in your portal within 15 minutes."
        >
          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Subject</label>
              <input
                type="text"
                placeholder="e.g. SWIFT Wire Routing Status"
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                required
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                <select
                  value={ticketCategory}
                  onChange={e => setTicketCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                >
                  <option value="TRANSFERS">Transfers & Wires</option>
                  <option value="CARDS">Cards & Limits</option>
                  <option value="ACCOUNT">Account Management</option>
                  <option value="SECURITY">Security & 2FA</option>
                  <option value="LOANS">Loans & Financing</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={e => setTicketPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Detailed Message</label>
              <textarea
                rows={4}
                placeholder="Describe your inquiry with relevant reference codes or transaction IDs..."
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                required
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
