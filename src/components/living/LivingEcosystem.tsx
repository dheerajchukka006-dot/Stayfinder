import React, { useState, useEffect } from 'react';
import { Users, Receipt, Wrench, Plus, CheckCircle, Clock, MapPin, IndianRupee } from 'lucide-react';
import { RoommateProfile, HouseholdExpense, MaintenanceTicket } from '../../types/index.ts';
import { apiClient } from '../../services/apiClient.ts';

export const LivingEcosystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roommates' | 'expenses' | 'maintenance'>('roommates');
  const [roommates, setRoommates] = useState<RoommateProfile[]>([]);
  const [expenses, setExpenses] = useState<HouseholdExpense[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(false);

  // New ticket form
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<'Plumbing' | 'Electrical' | 'Air Conditioning' | 'Wi-Fi' | 'Carpentry' | 'Cleaning'>('Plumbing');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');
  const [ticketDescription, setTicketDescription] = useState('');

  // New expense form
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'Rent' | 'Groceries' | 'Electricity' | 'Wi-Fi' | 'Cook/Maid' | 'Other'>('Groceries');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'roommates') {
        const res = await apiClient.getRoommates();
        if (res.success) setRoommates(res.data);
      } else if (activeTab === 'expenses') {
        const res = await apiClient.getExpenses();
        if (res.success) setExpenses(res.data);
      } else if (activeTab === 'maintenance') {
        const res = await apiClient.getMaintenanceTickets();
        if (res.success) setTickets(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDescription.trim()) return;
    await apiClient.createMaintenanceTicket({
      propertyTitle: 'Indiranagar Urban Studio',
      roomNumber: 'Room 102',
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDescription
    });
    setTicketDescription('');
    setShowNewTicket(false);
    loadData();
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;
    await apiClient.addExpense({
      title: expenseTitle,
      amount: Number(expenseAmount),
      category: expenseCategory,
      paidBy: 'Rohan Sharma',
      splitWith: ['Rohan Sharma', 'Aditya Roy', 'Nikhil Gupta']
    });
    setExpenseTitle('');
    setExpenseAmount('');
    setShowNewExpense(false);
    loadData();
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Living Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#151C26] rounded-xl border border-[#303A49] w-fit">
        <button
          onClick={() => setActiveTab('roommates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'roommates'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#A1AAB8] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Roommate Finder</span>
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'expenses'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#A1AAB8] hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Household Split & Expenses</span>
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'maintenance'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#A1AAB8] hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance & Repairs</span>
        </button>
      </div>

      {/* 1. ROOMMATE FINDER */}
      {activeTab === 'roommates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Find Compatible Flatmates</h3>
              <p className="text-xs text-[#737F90]">Connect with verified professionals and students in your city</p>
            </div>
            <button
              onClick={() => alert('Opening Roommate Profile Registration')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1B222D] hover:bg-[#202936] text-white text-xs font-medium border border-[#303A49]"
            >
              <Plus className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Create My Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roommates.map((rm) => (
              <div
                key={rm.id}
                className="p-5 bg-[#1B222D] border border-[#303A49] rounded-2xl flex flex-col justify-between hover:border-[#3B82F6]/50 transition-colors"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={rm.avatarUrl}
                      alt={rm.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#303A49]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{rm.name}, {rm.age}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                          Looking for {rm.lookingForGender}
                        </span>
                      </h4>
                      <p className="text-xs text-[#60A5FA] mt-0.5">{rm.occupation}</p>
                      <p className="text-[11px] text-[#737F90] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {rm.preferredLocality}, {rm.city}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#A1AAB8] mt-3 leading-relaxed">
                    "{rm.bio}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#151C26] text-[#A1AAB8] border border-[#303A49]">
                      Diet: {rm.lifestyle.dietary}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#151C26] text-[#A1AAB8] border border-[#303A49]">
                      {rm.lifestyle.earlyBird ? 'Early Bird' : 'Night Owl'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#151C26] text-[#A1AAB8] border border-[#303A49]">
                      {rm.lifestyle.petsAllowed ? 'Pet Friendly' : 'No Pets'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#303A49]/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#737F90] block">Budget Target</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatINR(rm.budgetMin)} — {formatINR(rm.budgetMax)}/mo
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Connect request sent to ${rm.name}!`)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HOUSEHOLD EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Shared Household Ledger</h3>
              <p className="text-xs text-[#737F90]">Track shared rent, maids, utilities, and grocery bills with roommates</p>
            </div>
            <button
              onClick={() => setShowNewExpense(!showNewExpense)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Shared Expense</span>
            </button>
          </div>

          {showNewExpense && (
            <form onSubmit={handleCreateExpense} className="p-4 bg-[#1B222D] border border-[#303A49] rounded-2xl space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-white block mb-1">Expense Title</label>
                  <input
                    type="text"
                    required
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="e.g. Milk & Daily Groceries"
                    className="w-full bg-[#151C26] border border-[#303A49] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-white block mb-1">Amount (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 1850"
                    className="w-full bg-[#151C26] border border-[#303A49] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-white block mb-1">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-[#151C26] border border-[#303A49] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                    <option value="Cook/Maid">Cook / Maid</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewExpense(false)}
                  className="px-3 py-1 text-xs text-[#A1AAB8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
                >
                  Save & Split Evenly
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 bg-[#1B222D] border border-[#303A49] rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{exp.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#202936] text-[#A1AAB8] border border-[#303A49]">
                      {exp.category}
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#737F90] mt-0.5">
                    Paid by <strong className="text-white">{exp.paidBy}</strong> • Split across {exp.splitWith.length} people ({formatINR(Math.round(exp.amount / exp.splitWith.length))} each)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-white block">
                    {formatINR(exp.amount)}
                  </span>
                  <span className={`text-[10px] font-medium ${exp.isSettled ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {exp.isSettled ? 'Settled' : 'Pending Settle-up'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAINTENANCE TICKETS */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Maintenance & Repair Requests</h3>
              <p className="text-xs text-[#737F90]">Report repairs directly to property owners and certified service technicians</p>
            </div>
            <button
              onClick={() => setShowNewTicket(!showNewTicket)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Ticket</span>
            </button>
          </div>

          {showNewTicket && (
            <form onSubmit={handleCreateTicket} className="p-4 bg-[#1B222D] border border-[#303A49] rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white block mb-1">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full bg-[#151C26] border border-[#303A49] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Air Conditioning">Air Conditioning</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white block mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full bg-[#151C26] border border-[#303A49] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-white block mb-1">Description of Issue</label>
                <textarea
                  required
                  rows={2}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="e.g. Bathroom faucet leaking water, need plumber assistance..."
                  className="w-full bg-[#151C26] border border-[#303A49] rounded-xl p-2.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="px-3 py-1 text-xs text-[#A1AAB8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-[#1B222D] border border-[#303A49] rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{t.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      t.priority === 'High' || t.priority === 'Emergency'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-[#202936] text-[#A1AAB8]'
                    }`}>
                      {t.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-[#A1AAB8] mt-1">{t.description}</p>
                  <p className="text-[11px] text-[#737F90] mt-0.5">
                    {t.propertyTitle} • Tenant: {t.tenantName}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
