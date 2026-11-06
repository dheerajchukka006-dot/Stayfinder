import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  IndianRupee,
  CheckCircle2,
  Clock,
  PieChart,
  MapPin,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';

export const OwnerAnalyticsView: React.FC = () => {
  const [data, setData] = useState<{
    totalProperties: number;
    publishedProperties: number;
    pendingProperties: number;
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    monthlyGrossRevenue: number;
    totalEnquiries: number;
    activeOffers: number;
    localityBreakdown: Record<string, { count: number; avgRent: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getOwnerAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
            <span>Owner Portfolio Analytics</span>
          </h2>
          <p className="text-xs text-[#737F90] mt-0.5">
            Real-time occupancy metrics, rental cash flow, and Vizag locality yield analysis.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs font-semibold text-[#A1AAB8] hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading || !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#1B222D] rounded-2xl border border-[#303A49] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Monthly Revenue */}
            <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#737F90] mb-2">
                <span className="text-xs font-semibold">Monthly Gross Yield</span>
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                ₹{data.monthlyGrossRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#60A5FA] mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> From active confirmed bookings
              </p>
            </div>

            {/* 2. Occupancy Rate */}
            <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#737F90] mb-2">
                <span className="text-xs font-semibold">Portfolio Occupancy</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-[#60A5FA] flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {data.occupancyRate}%
              </div>
              <div className="w-full bg-[#1B222D] rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-[#3B82F6] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, data.occupancyRate))}%` }}
                />
              </div>
              <p className="text-[11px] text-[#737F90] mt-1.5">
                {data.occupiedRooms} of {data.totalRooms} rooms reserved
              </p>
            </div>

            {/* 3. Listed Properties */}
            <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#737F90] mb-2">
                <span className="text-xs font-semibold">Properties in Vizag</span>
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {data.totalProperties}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px]">
                <span className="text-emerald-400 font-semibold">{data.publishedProperties} Live</span>
                <span className="text-[#737F90]">•</span>
                <span className="text-amber-400 font-semibold">{data.pendingProperties} In Review</span>
              </div>
            </div>

            {/* 4. Active Inquiries & Offers */}
            <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#737F90] mb-2">
                <span className="text-xs font-semibold">Tenant Demand</span>
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 text-[#60A5FA] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {data.totalEnquiries} <span className="text-xs text-[#737F90] font-normal">inquiries</span>
              </div>
              <p className="text-[11px] text-amber-300 mt-1">
                {data.activeOffers} pending rental price offers
              </p>
            </div>
          </div>

          {/* Vizag Locality Average Rent Breakdown Table */}
          <div className="bg-[#151A22] border border-[#303A49] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#303A49] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#3B82F6]" />
                  <span>Locality Performance Breakdown</span>
                </h3>
                <p className="text-xs text-[#737F90]">
                  Visakhapatnam micromarkets where your properties are located.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#1B222D] text-[#737F90] uppercase tracking-wider text-[10px] border-b border-[#303A49]">
                    <th className="px-6 py-3 font-semibold">Vizag Locality</th>
                    <th className="px-6 py-3 font-semibold text-center">Portfolio Units</th>
                    <th className="px-6 py-3 font-semibold text-right">Average Monthly Rent</th>
                    <th className="px-6 py-3 font-semibold text-center">Yield Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#303A49]/50">
                  {Object.entries(data.localityBreakdown).map(([locality, stat]) => (
                    <tr key={locality} className="hover:bg-[#1B222D]/40 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-white flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{locality}</span>
                      </td>
                      <td className="px-6 py-3.5 text-center font-mono text-[#CBD5E1]">
                        {stat.count}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono font-bold text-[#60A5FA]">
                        ₹{stat.avgRent.toLocaleString('en-IN')}/mo
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            stat.avgRent >= 18000
                              ? 'bg-blue-500/20 text-[#60A5FA] border border-blue-500/30'
                              : stat.avgRent >= 12000
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-zinc-700/50 text-[#CBD5E1] border border-zinc-600'
                          }`}
                        >
                          {stat.avgRent >= 18000 ? 'Premium' : stat.avgRent >= 12000 ? 'Mid-Market' : 'Budget Value'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
