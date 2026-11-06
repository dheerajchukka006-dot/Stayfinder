import React, { useState, useEffect } from 'react';
import { TopNavigation } from './components/common/TopNavigation.tsx';
import { OwnerPropertiesView } from './components/owner/OwnerPropertiesView.tsx';
import { PublicExplore } from './components/public/PublicExplore.tsx';
import { LivingEcosystem } from './components/living/LivingEcosystem.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { CustomerBookingsView } from './components/public/CustomerBookingsView.tsx';
import { PropertyDetailModal } from './components/owner/PropertyDetailModal.tsx';
import { BookingModal } from './components/public/BookingModal.tsx';
import { apiClient } from './services/apiClient.ts';
import { Property } from './types/index.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'owner_properties' | 'public_discovery' | 'my_bookings' | 'living' | 'admin'>('owner_properties');
  const [currentUser, setCurrentUser] = useState({
    id: 'owner-vizag-1',
    name: 'Suresh Varma',
    email: 'suresh.varma@stayfinder.in',
    role: 'owner' as any,
    avatarUrl: '/src/assets/images/avatar_property_owner_1793966391994.jpg',
    phone: '+91 94401 23456',
    isVerifiedOwner: true
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyToBook, setPropertyToBook] = useState<Property | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await apiClient.getCurrentUser();
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await apiClient.switchRole(userId);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (res.user.role === 'customer' && currentView === 'owner_properties') {
          setCurrentView('public_discovery');
        } else if (res.user.role === 'admin' && currentView === 'owner_properties') {
          setCurrentView('admin');
        } else if (res.user.role === 'owner') {
          setCurrentView('owner_properties');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#101318] text-[#F8FAFC] flex flex-col font-sans">
      {/* Top Portal Navigation & Role Switcher */}
      <TopNavigation
        currentView={currentView}
        onChangeView={setCurrentView}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main View Router */}
      <div className="flex-1 min-h-0 flex flex-col">
        {currentView === 'owner_properties' && (
          <OwnerPropertiesView currentUser={currentUser} />
        )}

        {currentView === 'public_discovery' && (
          <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
            <PublicExplore
              onSelectProperty={(p) => setSelectedProperty(p)}
              onBookProperty={(p) => setPropertyToBook(p)}
            />
          </div>
        )}

        {currentView === 'my_bookings' && (
          <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-1">
            <CustomerBookingsView
              onSelectProperty={(p) => setSelectedProperty(p)}
              onBookProperty={(p) => setPropertyToBook(p)}
            />
          </div>
        )}

        {currentView === 'living' && (
          <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-1">
            <LivingEcosystem />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-1">
            <AdminDashboard />
          </div>
        )}
      </div>

      {/* Shared Modals for Public & Living Views */}
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

      <BookingModal
        property={propertyToBook}
        isOpen={Boolean(propertyToBook)}
        onClose={() => setPropertyToBook(null)}
        onBookingSuccess={() => {
          alert('Booking recorded successfully!');
        }}
      />
    </div>
  );
}
