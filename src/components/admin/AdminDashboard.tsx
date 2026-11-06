import React, { useState, useEffect } from 'react';
import { ShieldCheck, Building2, CreditCard, AlertTriangle, CheckCircle, XCircle, Clock, Eye, Send, MapPin, Flag } from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';
import { Property, Enquiry, PropertyReport } from '../../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [reports, setReports] = useState<PropertyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending verification' | 'Approved' | 'Published'>('All');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, propsRes, enqRes, reportsRes] = await Promise.all([
        apiClient.getAdminOverview(),
        apiClient.getOwnerProperties({ pageSize: 100, city: 'All' }),
        apiClient.getEnquiries(),
        apiClient.getReports()
      ]);
      if (overviewRes.success) setStats(overviewRes.data);
      if (propsRes.success) setProperties(propsRes.data);
      if (enqRes.success) setEnquiries(enqRes.data);
      if (reportsRes.success && reportsRes.data) setReports(reportsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (prop: Property) => {
    await apiClient.updateProperty(prop.id, {
      status: 'Approved',
      isVerified: true
    });
    loadAdminData();
  };

  const handleRejectProperty = async (prop: Property) => {
    const reason = prompt('Please specify rejection reason for property owner:', 'Incomplete ownership documents or incorrect photos');
    if (reason) {
      await apiClient.updateProperty(prop.id, {
        status: 'Rejected',
        isVerified: false
      });
      loadAdminData();
    }
  };

  const handleRevokeVerification = async (prop: Property) => {
    await apiClient.updateProperty(prop.id, {
      status: 'Suspended',
      isVerified: false
    });
    loadAdminData();
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const filteredProperties = properties.filter((p) => {
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Visakhapatnam Trust & Moderation Console
          </h2>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-[#60A5FA]">
            Admin Authorizations
          </span>
        </div>
        <p className="text-xs text-[#737F90] mt-0.5">
          Review owner submissions in Vizag, grant verified badges, monitor enquiries, and audit tenant protection
        </p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#1B222D] border border-[#303A49] rounded-2xl">
            <span className="text-xs text-[#737F90] block">Total Properties</span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">{stats.totalProperties}</span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Visakhapatnam Network</span>
          </div>

          <div className="p-4 bg-[#1B222D] border border-[#303A49] rounded-2xl">
            <span className="text-xs text-[#737F90] block">Pending Verification</span>
            <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
              {stats.pendingVerificationCount || 0}
            </span>
            <span className="text-[10px] text-amber-400 mt-1 block">Awaiting Document Audit</span>
          </div>

          <div className="p-4 bg-[#1B222D] border border-[#303A49] rounded-2xl">
            <span className="text-xs text-[#737F90] block">Customer Enquiries</span>
            <span className="text-2xl font-bold font-mono text-[#60A5FA] mt-1 block">
              {enquiries.length}
            </span>
            <span className="text-[10px] text-[#60A5FA] mt-1 block">Direct Owner Messages</span>
          </div>

          <div className="p-4 bg-[#1B222D] border border-[#303A49] rounded-2xl">
            <span className="text-xs text-[#737F90] block">Platform Volume</span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">{formatINR(stats.grossVolumeINR)}</span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Direct Razorpay Escrow</span>
          </div>
        </div>
      )}

      {/* Property Moderation & Verification Queue */}
      <div className="bg-[#1B222D] border border-[#303A49] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[#303A49] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151C26]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              <span>Listing Verification Queue (Vizag)</span>
            </h3>
            <p className="text-[11px] text-[#737F90]">
              Audit owner details, municipal tax/electricity bills, and approve public visibility
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#101318] rounded-xl border border-[#303A49] text-xs">
            {(['All', 'Pending verification', 'Approved', 'Published'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === filter
                    ? 'bg-[#3B82F6] text-white font-medium shadow-sm'
                    : 'text-[#A1AAB8] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101318] text-[#737F90] uppercase tracking-wider border-b border-[#303A49]">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Locality & City</th>
                <th className="px-6 py-3">Owner Contact</th>
                <th className="px-6 py-3">Monthly Rent</th>
                <th className="px-6 py-3">Listing Status</th>
                <th className="px-6 py-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#303A49]/50 text-[#A1AAB8]">
              {filteredProperties.map((p) => (
                <tr key={p.id} className="hover:bg-[#202936]/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-white flex items-center gap-2.5">
                    <img
                      src={p.thumbnailUrl}
                      alt={p.title}
                      className="w-9 h-9 rounded-lg object-cover border border-[#303A49]"
                    />
                    <div>
                      <span className="font-semibold block truncate max-w-[220px]">{p.title}</span>
                      <span className="text-[10px] text-[#737F90]">{p.propertyType} • {p.bedrooms} BHK</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1 text-white">
                      <MapPin className="w-3 h-3 text-[#3B82F6]" />
                      <span>{p.location.locality}</span>
                    </div>
                    <span className="text-[10px] text-[#737F90] block">{p.location.city}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-white font-medium block">{p.ownerName}</span>
                    <span className="text-[11px] text-[#737F90] font-mono">{p.ownerPhone}</span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-white font-medium">{formatINR(p.price)}/mo</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                        p.isVerified || p.status === 'Approved' || p.status === 'Published'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : p.status === 'Pending verification'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      {p.isVerified ? '✓ Verified & Published' : p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-2">
                    {!p.isVerified ? (
                      <>
                        <button
                          onClick={() => handleApproveProperty(p)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                        >
                          Approve & Verify
                        </button>
                        <button
                          onClick={() => handleRejectProperty(p)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRevokeVerification(p)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#202936] hover:bg-rose-500/20 text-[#A1AAB8] hover:text-rose-300 transition-all"
                      >
                        Suspend / Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Enquiries Activity */}
      <div className="bg-[#1B222D] border border-[#303A49] rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-[#303A49] mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#3B82F6]" />
              <span>Customer Rental Enquiries Audit Log</span>
            </h3>
            <p className="text-[11px] text-[#737F90]">
              Direct communication audit between tenants and property owners in Visakhapatnam
            </p>
          </div>
          <span className="text-xs font-mono text-[#60A5FA]">{enquiries.length} Enquiries Logged</span>
        </div>

        <div className="space-y-3">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-3.5 bg-[#151C26] border border-[#303A49] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{enq.customerName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#202936] text-[#A1AAB8] border border-[#303A49]">
                    {enq.tenantType}
                  </span>
                  <span className="text-[11px] text-[#737F90] font-mono">{enq.customerPhone}</span>
                </div>
                <p className="text-[#A1AAB8] mt-1">"{enq.message}"</p>
                <p className="text-[11px] text-[#737F90] mt-0.5">
                  Property: <strong className="text-white">{enq.propertyTitle}</strong> ({enq.propertyLocality}, Vizag)
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#737F90] block">Expected Move-in</span>
                <span className="font-mono text-white font-medium">{enq.expectedMoveInDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Integrity & Policy Reports */}
      <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-400" />
              <span>Listing Integrity Reports ({reports.length})</span>
            </h3>
            <p className="text-[11px] text-[#737F90]">
              User-submitted reports on inaccurate rent, fake photos, or occupied properties.
            </p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#737F90] bg-[#101318] rounded-xl border border-[#303A49]">
            No reports filed. Visakhapatnam listing integrity is 100% verified.
          </div>
        ) : (
          <div className="space-y-2.5">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-3 bg-[#101318] border border-[#303A49] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rep.propertyTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                      {rep.reason}
                    </span>
                    <span className="text-[10px] text-[#737F90]">{rep.status}</span>
                  </div>
                  {rep.details && <p className="text-[#A1AAB8] mt-1 text-[11px]">"{rep.details}"</p>}
                  <p className="text-[10px] text-[#737F90] mt-0.5">
                    Reported by: <span className="text-white">{rep.reporterName}</span> ({rep.reporterEmail})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#737F90] font-mono">
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
