import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  IndianRupee,
  Clock,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';
import { RentalOffer } from '../../types/index.ts';

export const OwnerOffersView: React.FC = () => {
  const [offers, setOffers] = useState<RentalOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Rejected'>('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getOffers();
      if (res.success && res.data) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (offerId: string, status: 'Accepted' | 'Rejected') => {
    setActionLoadingId(offerId);
    try {
      const res = await apiClient.updateOfferStatus(offerId, status);
      if (res.success && res.data) {
        setOffers(prev => prev.map(o => (o.id === offerId ? res.data! : o)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = offers.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#3B82F6]" />
            <span>Rental Negotiations & Offers</span>
          </h2>
          <p className="text-xs text-[#737F90] mt-0.5">
            Review and negotiate proposed monthly rents submitted by prospective tenants.
          </p>
        </div>

        <button
          onClick={fetchOffers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs font-semibold text-[#A1AAB8] hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-[#151A22] p-2 rounded-2xl border border-[#303A49] self-start w-fit">
        {(['All', 'Pending', 'Accepted', 'Rejected'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === tab
                ? 'bg-[#3B82F6] text-white shadow-sm'
                : 'text-[#A1AAB8] hover:text-white hover:bg-[#1B222D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Offers Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-28 bg-[#1B222D] rounded-2xl border border-[#303A49] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#151A22] rounded-2xl border border-[#303A49] p-8">
          <Tag className="w-10 h-10 text-[#737F90] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">No rental offers</h3>
          <p className="text-xs text-[#737F90] mt-1">
            When tenants submit customized rental price proposals, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(offer => {
            const difference = offer.offeredMonthlyRent - offer.originalMonthlyRent;
            const diffPercent = Math.round((difference / offer.originalMonthlyRent) * 100);

            return (
              <div
                key={offer.id}
                className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 hover:border-[#3B82F6]/40 transition-colors shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Tenant and Property info */}
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-sm text-white">{offer.customerName}</span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                          offer.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : offer.status === 'Accepted'
                            ? 'bg-blue-500/20 text-[#60A5FA] border border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {offer.status}
                      </span>
                      <span className="text-[11px] text-[#737F90] font-mono ml-auto">
                        ID: {offer.id}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-[#60A5FA] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{offer.propertyTitle} ({offer.propertyLocality})</span>
                    </div>

                    {/* Price Comparison Box */}
                    <div className="flex items-center gap-4 bg-[#101318] p-3 rounded-xl border border-[#303A49]/70 flex-wrap">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#737F90]">Listed Rent</div>
                        <div className="text-sm font-bold text-[#A1AAB8] font-mono line-through">
                          ₹{offer.originalMonthlyRent.toLocaleString('en-IN')}/mo
                        </div>
                      </div>

                      <div className="text-[#737F90]">→</div>

                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#60A5FA]">Offered Rent</div>
                        <div className="text-base font-bold text-white font-mono flex items-center gap-1.5">
                          <span>₹{offer.offeredMonthlyRent.toLocaleString('en-IN')}/mo</span>
                          <span
                            className={`text-xs px-1.5 py-0.2 rounded font-mono ${
                              diffPercent < 0
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-[#60A5FA]'
                            }`}
                          >
                            {diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`}
                          </span>
                        </div>
                      </div>

                      <div className="border-l border-[#303A49] pl-4 ml-auto text-[11px] text-[#CBD5E1]">
                        <div>Tenancy Duration: <strong className="text-white">{offer.proposedTenancyMonths} months</strong></div>
                        <div>Target Move-in: <strong className="text-white">{offer.proposedMoveInDate}</strong></div>
                      </div>
                    </div>

                    {offer.notes && (
                      <p className="text-xs text-[#A1AAB8] italic">
                        "{offer.notes}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-[#737F90]">
                      <span className="flex items-center gap-1 font-mono text-[#CBD5E1]">
                        <Phone className="w-3.5 h-3.5 text-[#3B82F6]" />
                        {offer.customerPhone}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  {offer.status === 'Pending' && (
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#303A49]/60">
                      <button
                        disabled={actionLoadingId === offer.id}
                        onClick={() => handleUpdateStatus(offer.id, 'Accepted')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-semibold text-white shadow transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Offer</span>
                      </button>

                      <button
                        disabled={actionLoadingId === offer.id}
                        onClick={() => handleUpdateStatus(offer.id, 'Rejected')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B222D] hover:bg-red-500/20 border border-[#303A49] text-xs font-semibold text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline Offer</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
