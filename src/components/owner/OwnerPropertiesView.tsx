import React, { useState, useEffect } from 'react';
import { OwnerSidebar } from './OwnerSidebar.tsx';
import { OwnerHeader } from './OwnerHeader.tsx';
import { PropertyToolbar } from './PropertyToolbar.tsx';
import { PropertyCard } from './PropertyCard.tsx';
import { AdvancedFilterDrawer } from './AdvancedFilterDrawer.tsx';
import { AddPropertyModal } from './AddPropertyModal.tsx';
import { PropertyDetailModal } from './PropertyDetailModal.tsx';
import { EditPropertyModal } from './EditPropertyModal.tsx';
import { OwnerInquiriesView } from './OwnerInquiriesView.tsx';
import { OwnerAnalyticsView } from './OwnerAnalyticsView.tsx';
import { OwnerOffersView } from './OwnerOffersView.tsx';
import { OwnerSettingsView } from './OwnerSettingsView.tsx';
import { BookingModal } from '../public/BookingModal.tsx';
import { apiClient } from '../../services/apiClient.ts';
import { Property, PropertyFilterParams } from '../../types/index.ts';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Building2, Radio, Users, HelpCircle } from 'lucide-react';

interface OwnerPropertiesViewProps {
  currentUser: any;
}

export const OwnerPropertiesView: React.FC<OwnerPropertiesViewProps> = ({ currentUser }) => {
  // Navigation active tab
  const [activeSidebarItem, setActiveSidebarItem] = useState('Properties');

  // Listings data & state
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<PropertyFilterParams>({});

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [propertyToBook, setPropertyToBook] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [searchQuery, statusTab, sortBy, currentPage, advancedFilters, currentUser]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getOwnerProperties({
        search: searchQuery,
        status: statusTab as any,
        sortBy: sortBy as any,
        page: currentPage,
        pageSize: 8, // Matching reference: 8 cards per page
        ...advancedFilters
      });

      if (res.success) {
        setProperties(res.data);
        setTotalCount(res.meta.total);
        setTotalPages(res.meta.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load owner properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async (data: any) => {
    try {
      const res = await apiClient.createProperty(data);
      if (res.success) {
        fetchProperties();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await apiClient.deleteProperty(id);
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate active filter count for badge
  const activeFiltersCount = [
    advancedFilters.propertyType && advancedFilters.propertyType !== 'All',
    advancedFilters.rentalPeriod && advancedFilters.rentalPeriod !== 'All',
    advancedFilters.minPrice && advancedFilters.minPrice > 5000,
    advancedFilters.maxPrice && advancedFilters.maxPrice < 150000,
    advancedFilters.bedrooms && advancedFilters.bedrooms > 0,
    advancedFilters.bathrooms && advancedFilters.bathrooms > 0,
    advancedFilters.amenities && advancedFilters.amenities.length > 0
  ].filter(Boolean).length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#101318] text-[#F8FAFC]">
      {/* 1. LEFT SIDEBAR (Fixed vertical sidebar matching reference blueprint) */}
      <OwnerSidebar
        activeItem={activeSidebarItem}
        onSelectItem={(item) => {
          setActiveSidebarItem(item);
        }}
        currentUser={currentUser}
        onOpenUpgradeModal={() => alert('StayFinder Pro upgrade includes unlimited listings and verified trust status.')}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <OwnerHeader
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          onAddProperty={() => setShowAddModal(true)}
          currentUser={currentUser}
          unreadNotificationsCount={2}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {activeSidebarItem === 'Inquiries' && (
            <OwnerInquiriesView />
          )}

          {activeSidebarItem === 'Analytics' && (
            <OwnerAnalyticsView />
          )}

          {activeSidebarItem === 'Offers' && (
            <OwnerOffersView />
          )}

          {activeSidebarItem === 'Settings' && (
            <OwnerSettingsView currentUser={currentUser} />
          )}

          {activeSidebarItem === 'Outreach' && (
            <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#3B82F6]" />
                <h3 className="text-base font-bold text-white">Vizag Tenant Outreach & Broadcasting</h3>
              </div>
              <p className="text-xs text-[#737F90] leading-relaxed">
                Broadcast instant vacancy alerts to verified students and tech professionals in Visakhapatnam across GITAM University, AU Campus, and Madhurawada / Rushikonda IT SEZ.
              </p>
              <div className="p-4 rounded-xl bg-[#101318] border border-[#303A49] text-xs text-[#CBD5E1] space-y-2">
                <div className="font-semibold text-white">Active Broadcasting Channels:</div>
                <div className="flex items-center gap-2 text-[#60A5FA]">
                  <span>•</span> <span>Gitam & Gayatri Engineering WhatsApp Student Circles</span>
                </div>
                <div className="flex items-center gap-2 text-[#60A5FA]">
                  <span>•</span> <span>Rushikonda IT SEZ Tech Professional Relocation Pool</span>
                </div>
                <div className="flex items-center gap-2 text-[#60A5FA]">
                  <span>•</span> <span>Visakhapatnam Steel Plant & Port Trust Executive Network</span>
                </div>
              </div>
              <button
                onClick={() => alert('Broadcasting campaign initiated across 3 Vizag relocation channels!')}
                className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-semibold text-white shadow"
              >
                Send Instant Vacancy Blast
              </button>
            </div>
          )}

          {activeSidebarItem === 'Buyers' && (
            <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#3B82F6]" />
                <h3 className="text-base font-bold text-white">Prospective Tenants & Relocation Leads</h3>
              </div>
              <p className="text-xs text-[#737F90]">
                Pre-screened tenants currently actively searching for rental accommodation in Visakhapatnam.
              </p>
              <div className="divide-y divide-[#303A49]/60">
                {[
                  { name: 'K. Sai Kiran', budget: '₹18,000 - ₹24,000', locality: 'MVP Colony / Siripuram', type: 'Working Professional (Wipro)' },
                  { name: 'Sneha Reddy', budget: '₹12,000 - ₹16,000', locality: 'Rushikonda / Yendada', type: 'Law Student (DSNLU)' },
                  { name: 'Dr. Venkat Rao', budget: '₹30,000 - ₹45,000', locality: 'Beach Road / Seethammadhara', type: 'Family (Senior Consultant Apollo)' }
                ].map((lead, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{lead.name}</div>
                      <div className="text-[11px] text-[#737F90]">{lead.type} • Seeking: {lead.locality}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#60A5FA]">{lead.budget}</div>
                      <button
                        onClick={() => alert(`Invite sent to ${lead.name} to view your listings!`)}
                        className="text-[10px] text-[#3B82F6] hover:underline"
                      >
                        Invite to View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSidebarItem === 'Help' && (
            <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-6 space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#3B82F6]" />
                <h3 className="text-base font-bold text-white">Owner Help Center & Vizag Support</h3>
              </div>
              <p className="text-xs text-[#737F90] leading-relaxed">
                Need assistance with rental agreement templates, APEPDCL sub-meter calculations, or tenant police verification in Visakhapatnam? Our local field team is here to help.
              </p>
              <div className="space-y-2 text-xs text-[#CBD5E1]">
                <div className="p-3 rounded-xl bg-[#101318] border border-[#303A49]">
                  <strong className="text-white">Vizag Operations Desk:</strong> MVP Double Road, Near Shivaji Park, Sector 5, Visakhapatnam — 530017
                </div>
                <div className="p-3 rounded-xl bg-[#101318] border border-[#303A49]">
                  <strong className="text-white">Owner Priority Line:</strong> +91 891 400 5500 (Mon–Sat, 9 AM – 7 PM IST)
                </div>
                <div className="p-3 rounded-xl bg-[#101318] border border-[#303A49]">
                  <strong className="text-white">Email:</strong> support@stayfinder.in
                </div>
              </div>
            </div>
          )}

          {(activeSidebarItem === 'Properties' || activeSidebarItem === 'Dashboard') && (
            <>
              {/* Subheader Toolbar with Filter Tabs and Sort Dropdown */}
              <PropertyToolbar
                activeStatusTab={statusTab}
                onStatusTabChange={(tab) => {
                  setStatusTab(tab);
                  setCurrentPage(1);
                }}
                onToggleFilterDrawer={() => setFilterDrawerOpen(true)}
                activeFiltersCount={activeFiltersCount}
                sortBy={sortBy}
                onSortByChange={(s) => setSortBy(s)}
              />

              {/* Property Cards Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="bg-[#1B222D] border border-[#303A49] rounded-2xl h-80 animate-pulse"
                    />
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-20 bg-[#151A22] rounded-2xl border border-[#303A49] max-w-xl mx-auto my-8 p-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6] flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No properties match your filter</h3>
                  <p className="text-xs text-[#737F90] mt-1 max-w-sm mx-auto">
                    Try clearing active filters or create a new listing for this portfolio.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusTab('All');
                        setAdvancedFilters({});
                      }}
                      className="px-4 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs font-semibold text-white hover:bg-[#202936]"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-semibold text-white shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Property</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={(p) => setSelectedProperty(p)}
                      onEdit={(p) => setPropertyToEdit(p)}
                      onDelete={handleDeleteProperty}
                    />
                  ))}
                </div>
              )}

              {/* 3. PAGINATION FOOTER (Matching reference blueprint) */}
              <div className="mt-8 pt-5 border-t border-[#303A49]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#737F90]">
                <div>
                  Showing{' '}
                  <strong className="text-white font-mono">
                    {totalCount === 0 ? 0 : (currentPage - 1) * 8 + 1} -{' '}
                    {Math.min(currentPage * 8, totalCount)}
                  </strong>{' '}
                  of <strong className="text-white font-mono">{totalCount}</strong> properties
                </div>

                <div className="flex items-center gap-1 self-center sm:self-auto">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-lg bg-[#151C26] border border-[#303A49] text-[#A1AAB8] hover:text-white disabled:opacity-30 disabled:hover:text-[#A1AAB8] flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold font-mono transition-all ${
                          isActive
                            ? 'bg-[#3B82F6] text-white shadow-sm'
                            : 'bg-[#151C26] text-[#A1AAB8] hover:text-white border border-[#303A49]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && (
                    <>
                      <span className="px-1 text-[#737F90]">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold font-mono ${
                          currentPage === totalPages
                            ? 'bg-[#3B82F6] text-white'
                            : 'bg-[#151C26] text-[#A1AAB8] hover:text-white border border-[#303A49]'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 rounded-lg bg-[#151C26] border border-[#303A49] text-[#A1AAB8] hover:text-white disabled:opacity-30 disabled:hover:text-[#A1AAB8] flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* 4. RIGHT-SIDE ADVANCED FILTER DRAWER */}
      <AdvancedFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={advancedFilters}
        onApplyFilters={(f) => {
          setAdvancedFilters(f);
          setCurrentPage(1);
        }}
        onResetFilters={() => {
          setAdvancedFilters({});
          setCurrentPage(1);
        }}
      />

      {/* 5. ADD PROPERTY MODAL */}
      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateProperty}
      />

      {/* 5b. EDIT PROPERTY MODAL */}
      <EditPropertyModal
        property={propertyToEdit}
        isOpen={Boolean(propertyToEdit)}
        onClose={() => setPropertyToEdit(null)}
        onSuccess={() => {
          fetchProperties();
        }}
      />

      {/* 6. PROPERTY DETAIL MODAL */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        currentUser={currentUser}
        onBookNow={(p) => {
          setSelectedProperty(null);
          setPropertyToBook(p);
        }}
      />

      {/* 7. BOOKING & RAZORPAY SANDBOX MODAL */}
      <BookingModal
        property={propertyToBook}
        isOpen={Boolean(propertyToBook)}
        onClose={() => setPropertyToBook(null)}
        onBookingSuccess={() => {
          fetchProperties();
        }}
      />
    </div>
  );
};
