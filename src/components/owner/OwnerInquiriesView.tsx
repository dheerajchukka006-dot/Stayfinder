import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Archive,
  RefreshCw,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';
import { Enquiry } from '../../types/index.ts';

export const OwnerInquiriesView: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getEnquiries();
      if (res.success && res.data) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    setActionLoadingId(id);
    try {
      const res = await apiClient.updateEnquiryStatus(id, newStatus);
      if (res.success && res.data) {
        setEnquiries(prev => prev.map(e => (e.id === id ? res.data! : e)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = enquiries.filter(e => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.customerName.toLowerCase().includes(q) ||
        e.propertyTitle.toLowerCase().includes(q) ||
        e.propertyLocality.toLowerCase().includes(q) ||
        e.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
            <span>Tenant Inquiries</span>
          </h2>
          <p className="text-xs text-[#737F90] mt-0.5">
            Manage physical visit requests and tenant leads for your Visakhapatnam properties.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs font-semibold text-[#A1AAB8] hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Toolbar: Search & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#151A22] p-3 rounded-2xl border border-[#303A49]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#737F90] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by tenant name, property, or locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs text-white placeholder-[#737F90] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['All', 'New', 'Contacted', 'Closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                statusFilter === tab
                  ? 'bg-[#3B82F6] text-white shadow-sm'
                  : 'bg-[#1B222D] text-[#A1AAB8] hover:text-white border border-[#303A49]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-[#1B222D] rounded-2xl border border-[#303A49] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#151A22] rounded-2xl border border-[#303A49] p-8">
          <MessageSquare className="w-10 h-10 text-[#737F90] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">No inquiries found</h3>
          <p className="text-xs text-[#737F90] mt-1">
            {search ? 'Try clearing your search query' : 'When prospective tenants enquire about your listings, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(enq => (
            <div
              key={enq.id}
              className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 hover:border-[#3B82F6]/40 transition-colors shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Tenant Details & Message */}
                <div className="space-y-2.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-sm text-white">{enq.customerName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1B222D] text-[#A1AAB8] border border-[#303A49]">
                      {enq.tenantType}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        enq.status === 'New'
                          ? 'bg-blue-500/20 text-[#60A5FA] border border-blue-500/30'
                          : enq.status === 'Contacted'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-700/50 text-[#A1AAB8] border border-zinc-600'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-[11px] text-[#737F90] font-mono ml-auto">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-[#60A5FA] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{enq.propertyTitle} ({enq.propertyLocality})</span>
                  </div>

                  <p className="text-xs text-[#CBD5E1] bg-[#101318] p-3 rounded-xl border border-[#303A49]/70 leading-relaxed font-sans">
                    "{enq.message}"
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-[#737F90] flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                      Target Move-in: <strong className="text-white">{enq.expectedMoveInDate}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                      Occupants: <strong className="text-white">{enq.occupancyCount}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[#A1AAB8]">
                      <Phone className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {enq.customerPhone}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[#A1AAB8]">
                      <Mail className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {enq.customerEmail}
                    </span>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#303A49]/60">
                  <a
                    href={`tel:${enq.customerPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-semibold text-white shadow transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Tenant</span>
                  </a>

                  {enq.status !== 'Contacted' && (
                    <button
                      disabled={actionLoadingId === enq.id}
                      onClick={() => handleUpdateStatus(enq.id, 'Contacted')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-[#202936] border border-[#303A49] text-xs font-medium text-[#A1AAB8] hover:text-white transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Mark Contacted</span>
                    </button>
                  )}

                  {enq.status !== 'Closed' && (
                    <button
                      disabled={actionLoadingId === enq.id}
                      onClick={() => handleUpdateStatus(enq.id, 'Closed')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-[#202936] border border-[#303A49] text-xs font-medium text-[#737F90] hover:text-white transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Close Inquiry</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
