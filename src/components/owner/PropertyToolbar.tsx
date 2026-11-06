import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface PropertyToolbarProps {
  activeStatusTab: string; // 'All' | 'For Sale' | 'For Rent' | 'Sold'
  onStatusTabChange: (tab: string) => void;
  onToggleFilterDrawer: () => void;
  activeFiltersCount: number;
  sortBy: string;
  onSortByChange: (sort: string) => void;
}

export const PropertyToolbar: React.FC<PropertyToolbarProps> = ({
  activeStatusTab,
  onStatusTabChange,
  onToggleFilterDrawer,
  activeFiltersCount,
  sortBy,
  onSortByChange
}) => {
  const tabs = [
    { id: 'All', label: 'All' },
    { id: 'For Sale', label: 'For Sale' },
    { id: 'For Rent', label: 'For Rent' },
    { id: 'Sold', label: 'Sold' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left Tabs & More Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-[#151C26] rounded-xl border border-[#303A49]">
          {tabs.map((tab) => {
            const isActive = activeStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusTabChange(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-[#A1AAB8] hover:text-white hover:bg-[#1B222D]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* More Filters Button */}
        <button
          onClick={onToggleFilterDrawer}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
            activeFiltersCount > 0
              ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-[#60A5FA]'
              : 'bg-[#151C26] border-[#303A49] text-[#A1AAB8] hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>More Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Right Sort By Dropdown */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="text-xs text-[#737F90]">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="appearance-none bg-[#151C26] border border-[#303A49] rounded-xl px-3.5 py-1.5 pr-8 text-xs text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="newest" className="bg-[#1B222D] text-white">Newest First</option>
            <option value="price_asc" className="bg-[#1B222D] text-white">Price: Low to High</option>
            <option value="price_desc" className="bg-[#1B222D] text-white">Price: High to Low</option>
            <option value="rating" className="bg-[#1B222D] text-white">Highest Rated</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#737F90] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
