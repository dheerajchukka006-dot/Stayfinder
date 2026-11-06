import React, { useState } from 'react';
import { Search, Plus, Bell, ChevronDown, Check, Shield, UserCheck } from 'lucide-react';

interface OwnerHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onAddProperty: () => void;
  currentUser: {
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    isVerifiedOwner: boolean;
  };
  unreadNotificationsCount?: number;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddProperty,
  currentUser,
  unreadNotificationsCount = 2
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  return (
    <header className="h-20 px-8 border-b border-[#303A49] bg-[#101318] flex items-center justify-between gap-6 shrink-0 z-10">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Properties</h1>
        <p className="text-xs text-[#A1AAB8] mt-0.5">Manage and view all your property listings</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global/Property Search Bar */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[#737F90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by property, location, or client"
            className="w-full bg-[#151C26] border border-[#303A49] rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-[#737F90] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737F90] hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Add Property Button (Primary) */}
        <button
          onClick={onAddProperty}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="w-10 h-10 rounded-xl bg-[#1B222D] border border-[#303A49] flex items-center justify-center text-[#A1AAB8] hover:text-white hover:border-[#4B5563] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#101318]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#1B222D] border border-[#303A49] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#303A49] mb-2">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-[#3B82F6] cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#202936] text-[#A1AAB8]">
                  <p className="font-medium text-white">New Rental Enquiry</p>
                  <p className="text-[11px] text-[#737F90] mt-0.5">Rohan Sharma enquired about MVP Colony 2 BHK Flat.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#202936] text-[#A1AAB8]">
                  <p className="font-medium text-white">Maintenance Ticket Filed</p>
                  <p className="text-[11px] text-[#737F90] mt-0.5">Geyser servicing requested for Rushikonda Studio.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-[#1B222D] border border-[#303A49] hover:border-[#4B5563] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 text-[#60A5FA] font-bold text-xs flex items-center justify-center overflow-hidden border border-[#3B82F6]/30">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                <span>{currentUser.name}</span>
                {currentUser.isVerifiedOwner && (
                  <UserCheck className="w-3 h-3 text-[#3B82F6]" />
                )}
              </div>
              <p className="text-[10px] text-[#737F90] leading-tight truncate max-w-[120px]">
                {currentUser.email}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#737F90]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1B222D] border border-[#303A49] shadow-xl py-2 z-50">
              <div className="px-3 py-2 border-b border-[#303A49]">
                <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-[#737F90]">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/20 text-[#60A5FA] font-medium uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                  {currentUser.isVerifiedOwner && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  alert('Navigating to Owner Profile & KYC Verification settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#A1AAB8] hover:text-white hover:bg-[#202936]"
              >
                Owner Profile & Documents
              </button>
              <button
                onClick={() => {
                  alert('Bank Account & Payout settings for direct INR transfers');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#A1AAB8] hover:text-white hover:bg-[#202936]"
              >
                Bank Account & Razorpay Payouts
              </button>
              <div className="border-t border-[#303A49] my-1" />
              <button
                onClick={() => {
                  alert('StayFinder Session Active');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-[#202936]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
