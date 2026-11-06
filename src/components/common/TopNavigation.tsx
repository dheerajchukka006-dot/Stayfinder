import React from 'react';
import { Building2, Compass, Home, Shield, Users, Calendar } from 'lucide-react';
import { UserRole } from '../../types/index.ts';

interface TopNavigationProps {
  currentView: 'owner_properties' | 'public_discovery' | 'my_bookings' | 'living' | 'admin';
  onChangeView: (view: 'owner_properties' | 'public_discovery' | 'my_bookings' | 'living' | 'admin') => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string;
  };
  onSwitchUser: (userId: string) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentView,
  onChangeView,
  currentUser,
  onSwitchUser
}) => {
  return (
    <div className="h-11 bg-[#0B0D11] border-b border-[#303A49] px-6 flex items-center justify-between text-xs text-[#A1AAB8] z-40 shrink-0">
      {/* Ecosystem Portal View Switcher */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#737F90] mr-2 hidden sm:inline">
          View:
        </span>
        <button
          onClick={() => onChangeView('owner_properties')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentView === 'owner_properties'
              ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
              : 'hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Owner Properties (Blueprint)</span>
        </button>

        <button
          onClick={() => onChangeView('public_discovery')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentView === 'public_discovery'
              ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
              : 'hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Public Discovery & Book</span>
        </button>

        <button
          onClick={() => onChangeView('my_bookings')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentView === 'my_bookings'
              ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
              : 'hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Bookings & Saved</span>
        </button>

        <button
          onClick={() => onChangeView('living')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentView === 'living'
              ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
              : 'hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Living Ecosystem</span>
        </button>

        <button
          onClick={() => onChangeView('admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentView === 'admin'
              ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
              : 'hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Moderation</span>
        </button>
      </div>

      {/* Role Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#737F90] hidden md:inline">Current Role:</span>
        <select
          value={currentUser.id}
          onChange={(e) => onSwitchUser(e.target.value)}
          className="bg-[#151C26] border border-[#303A49] rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
        >
          <option value="owner-vizag-1">Suresh Varma (Vizag Owner)</option>
          <option value="cust-vizag-1">Rohan Sharma (Customer / Tenant)</option>
          <option value="admin-vizag-1">StayFinder Admin (Staff)</option>
        </select>
      </div>
    </div>
  );
};
