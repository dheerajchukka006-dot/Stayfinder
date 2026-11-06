import React from 'react';
import {
  LayoutGrid,
  Building2,
  TrendingUp,
  Radio,
  Users,
  MessageSquare,
  Tag,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface OwnerSidebarProps {
  activeItem: string;
  onSelectItem: (item: string) => void;
  currentUser: {
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    isVerifiedOwner: boolean;
  };
  onOpenUpgradeModal?: () => void;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  activeItem,
  onSelectItem,
  currentUser,
  onOpenUpgradeModal
}) => {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'Analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'Outreach', label: 'Outreach', icon: Radio },
    { id: 'Buyers', label: 'Buyers', icon: Users },
    { id: 'Properties', label: 'Properties', icon: Building2 },
    { id: 'Inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'Offers', label: 'Offers', icon: Tag },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#151A22] border-r border-[#303A49] flex flex-col justify-between shrink-0 min-h-screen text-[#F8FAFC]">
      {/* Brand Header */}
      <div>
        <div className="h-18 px-5 flex items-center gap-3 border-b border-[#303A49]/50">
          <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>StayFinder</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#3B82F6]/20 text-[#60A5FA]">
                PRO
              </span>
            </div>
            <p className="text-xs text-[#737F90]">Owner Workspace</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="px-3 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#737F90] px-3 mb-2">
            Menu
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30 shadow-sm'
                      : 'text-[#A1AAB8] hover:text-white hover:bg-[#1B222D]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#60A5FA]' : 'text-[#737F90] group-hover:text-white'
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.id === 'Inquiries' && (
                    <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#202936] text-[#A1AAB8] border border-[#303A49]">
                      3
                    </span>
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* General Navigation */}
        <div className="px-3 pt-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#737F90] px-3 mb-2">
            General
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectItem('Settings')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium text-[#A1AAB8] hover:text-white hover:bg-[#1B222D] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#737F90]" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => onSelectItem('Help')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium text-[#A1AAB8] hover:text-white hover:bg-[#1B222D] transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#737F90]" />
              <span>Help & FAQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Area: Upgrade Card & User Profile */}
      <div className="p-3 space-y-3">
        {/* Upgrade to Pro Card from reference layout */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#1B222D] to-[#151C26] border border-[#303A49] shadow-inner">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-md bg-[#3B82F6]/20 flex items-center justify-center text-[#60A5FA]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold text-white">Upgrade to Pro</h4>
          </div>
          <p className="text-[11px] text-[#A1AAB8] leading-relaxed mb-3">
            Unlock AI vacancy predictions, verified trust badge, and unlimited listing slots.
          </p>
          <div className="space-y-1.5">
            <button
              onClick={onOpenUpgradeModal}
              className="w-full py-1.5 px-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium transition-colors text-center shadow"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => alert('StayFinder Pro includes priority search ranking, tenant KYC automation, and direct Razorpay settlements.')}
              className="w-full py-1 px-3 rounded-lg bg-[#202936] hover:bg-[#2A3444] text-[#A1AAB8] hover:text-white text-xs font-medium transition-colors text-center"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="pt-2 border-t border-[#303A49]/60 flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-[#303A49]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
                }}
              />
              {currentUser.isVerifiedOwner && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6] absolute -bottom-0.5 -right-0.5 bg-[#151A22] rounded-full" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate flex items-center gap-1">
                <span>{currentUser.name}</span>
              </div>
              <p className="text-[11px] text-[#737F90] truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            title="Account Options"
            onClick={() => alert(`Logged in as: ${currentUser.name} (${currentUser.role})`)}
            className="p-1 rounded-md text-[#737F90] hover:text-white hover:bg-[#202936]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
