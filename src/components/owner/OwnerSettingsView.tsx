import React, { useState } from 'react';
import {
  Settings,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';

interface OwnerSettingsViewProps {
  currentUser: any;
  onUserUpdated?: (updated: any) => void;
}

export const OwnerSettingsView: React.FC<OwnerSettingsViewProps> = ({
  currentUser,
  onUserUpdated
}) => {
  const [name, setName] = useState(currentUser.name || 'Suresh Varma');
  const [email, setEmail] = useState(currentUser.email || 'suresh.varma@stayfinder.in');
  const [phone, setPhone] = useState(currentUser.phone || '+91 94401 23456');
  const [address, setAddress] = useState(
    currentUser.address || 'Plot 42, Sector 6, MVP Colony, Visakhapatnam, AP'
  );
  const [upiId, setUpiId] = useState(currentUser.upiId || 'suresh.varma@okaxis');
  const [bankAccount, setBankAccount] = useState(currentUser.bankAccount || 'SBIN0001234 — 98765432101');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await apiClient.updateProfile({
        name,
        email,
        phone,
        address,
        upiId,
        bankAccount
      });

      if (res.success && res.user) {
        setSuccess(true);
        if (onUserUpdated) onUserUpdated(res.user);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error || 'Failed to update profile settings');
      }
    } catch (err: any) {
      setError(err.message || 'Network error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#3B82F6]" />
          <span>Owner Account & Settlement Settings</span>
        </h2>
        <p className="text-xs text-[#737F90] mt-0.5">
          Configure verified contact information and Razorpay bank settlement details for Visakhapatnam rental payouts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 bg-[#151A22] border border-[#303A49] rounded-2xl p-6 shadow-sm">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#60A5FA] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Owner profile and settlement details saved successfully!</span>
          </div>
        )}

        {/* Section 1: Personal & Business Profile */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#3B82F6]" />
            <span>Owner Identity & Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#3B82F6]" /> Contact Phone (WhatsApp Verified)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#3B82F6]" /> Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#3B82F6]" /> Visakhapatnam Office / Residence Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Payouts & Settlement Accounts */}
        <div className="pt-4 border-t border-[#303A49]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#3B82F6]" />
            <span>Payout & Direct Rental Settlement</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">UPI VPA ID for Rent Credits</label>
              <input
                type="text"
                placeholder="e.g. name@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Bank Account (IFSC & A/C)</label>
              <input
                type="text"
                placeholder="e.g. HDFC0001234 - 501002345678"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        {/* Verified Status Badge */}
        <div className="p-3 rounded-xl bg-[#101318] border border-[#303A49] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
            <div>
              <div className="text-xs font-bold text-white">Verified Visakhapatnam Host</div>
              <div className="text-[11px] text-[#737F90]">Aadhaar / Property Deed KYC Status: Approved</div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-[#60A5FA] border border-blue-500/30">
            Active
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-bold text-white shadow transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
