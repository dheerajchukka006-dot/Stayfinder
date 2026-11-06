import { Property, Booking, RoommateProfile, HouseholdExpense, MaintenanceTicket, PropertyFilterParams, Enquiry, RentalOffer, PropertyReport } from '../types/index.ts';

const API_BASE = '/api/v1';

export const apiClient = {
  // Auth
  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  },

  async switchRole(userId: string) {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async updateProfile(updates: any) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Locations
  async getCities() {
    const res = await fetch(`${API_BASE}/locations/cities`);
    return res.json() as Promise<{ success: boolean; data: { name: string; state: string; isPrimaryLaunch: boolean }[] }>;
  },

  async getLocalities(city: string = 'Visakhapatnam') {
    const res = await fetch(`${API_BASE}/locations/localities?city=${encodeURIComponent(city)}`);
    return res.json() as Promise<{ success: boolean; data: { name: string; pincode: string; latitude: number; longitude: number; description: string }[] }>;
  },

  // Owner Properties
  async getOwnerProperties(params: PropertyFilterParams = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.locality && params.locality !== 'All') query.append('locality', params.locality);
    if (params.city && params.city !== 'All') query.append('city', params.city);
    if (params.propertyType && params.propertyType !== 'All') query.append('propertyType', params.propertyType);
    if (params.rentalPeriod && params.rentalPeriod !== 'All') query.append('rentalPeriod', params.rentalPeriod);
    if (params.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params.bedrooms) query.append('bedrooms', params.bedrooms.toString());
    if (params.bathrooms) query.append('bathrooms', params.bathrooms.toString());
    if (params.minArea) query.append('minArea', params.minArea.toString());
    if (params.maxArea) query.append('maxArea', params.maxArea.toString());
    if (params.furnishingStatus && params.furnishingStatus !== 'All') query.append('furnishingStatus', params.furnishingStatus);
    if (params.bachelorFriendly) query.append('bachelorFriendly', 'true');
    if (params.familySuitable) query.append('familySuitable', 'true');
    if (params.foodAvailable) query.append('foodAvailable', 'true');
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.verifiedOnly) query.append('verifiedOnly', 'true');
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.page) query.append('page', params.page.toString());
    if (params.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params.amenities && params.amenities.length > 0) {
      query.append('amenities', params.amenities.join(','));
    }

    const res = await fetch(`${API_BASE}/owner/properties?${query.toString()}`);
    return res.json() as Promise<{
      success: boolean;
      data: Property[];
      meta: { total: number; page: number; pageSize: number; totalPages: number };
    }>;
  },

  async createProperty(propertyData: any) {
    const res = await fetch(`${API_BASE}/owner/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    return res.json() as Promise<{ success: boolean; data: Property; error?: string }>;
  },

  async updateProperty(id: string, updates: Partial<Property>) {
    const res = await fetch(`${API_BASE}/owner/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json() as Promise<{ success: boolean; data: Property; error?: string }>;
  },

  async deleteProperty(id: string) {
    const res = await fetch(`${API_BASE}/owner/properties/${id}`, {
      method: 'DELETE'
    });
    return res.json() as Promise<{ success: boolean; message?: string; error?: string }>;
  },

  // Public Properties Search
  async getPublicProperties(params: any = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== 'All') {
        query.append(k, String(v));
      }
    });
    const res = await fetch(`${API_BASE}/properties?${query.toString()}`);
    return res.json() as Promise<{
      success: boolean;
      data: Property[];
      meta: { total: number; page: number; pageSize: number; totalPages: number };
    }>;
  },

  async getNearbyProperties(lat: number, lon: number, radiusKm: number = 10) {
    const res = await fetch(`${API_BASE}/properties/nearby?lat=${lat}&lon=${lon}&radiusKm=${radiusKm}`);
    return res.json() as Promise<{ success: boolean; data: Property[] }>;
  },

  async getPropertyById(id: string) {
    const res = await fetch(`${API_BASE}/properties/${id}`);
    return res.json() as Promise<{ success: boolean; data: Property }>;
  },

  // Enquiries
  async sendEnquiry(data: {
    propertyId: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    tenantType?: string;
    expectedMoveInDate?: string;
    occupancyCount?: number;
    message?: string;
  }) {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json() as Promise<{ success: boolean; data?: Enquiry; message?: string; error?: string }>;
  },

  async getEnquiries() {
    const res = await fetch(`${API_BASE}/enquiries`);
    return res.json() as Promise<{ success: boolean; data: Enquiry[] }>;
  },

  async updateEnquiryStatus(enquiryId: string, status: 'New' | 'Contacted' | 'Closed') {
    const res = await fetch(`${API_BASE}/enquiries/${enquiryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json() as Promise<{ success: boolean; data?: Enquiry; error?: string }>;
  },

  // Owner Analytics
  async getOwnerAnalytics() {
    const res = await fetch(`${API_BASE}/owner/analytics`);
    return res.json() as Promise<{
      success: boolean;
      data: {
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
      };
    }>;
  },

  // Offers
  async getOffers() {
    const res = await fetch(`${API_BASE}/owner/offers`);
    return res.json() as Promise<{ success: boolean; data: RentalOffer[] }>;
  },

  async updateOfferStatus(offerId: string, status: 'Accepted' | 'Rejected' | 'Countered') {
    const res = await fetch(`${API_BASE}/owner/offers/${offerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json() as Promise<{ success: boolean; data?: RentalOffer; error?: string }>;
  },

  async createOffer(offerData: {
    propertyId: string;
    offeredMonthlyRent: number;
    proposedTenancyMonths: number;
    proposedMoveInDate: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    return res.json() as Promise<{ success: boolean; data?: RentalOffer; error?: string }>;
  },

  // Favourites
  async getFavourites() {
    const res = await fetch(`${API_BASE}/favourites`);
    return res.json() as Promise<{ success: boolean; data: string[] }>;
  },

  async toggleFavourite(propertyId: string) {
    const res = await fetch(`${API_BASE}/favourites/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId })
    });
    return res.json() as Promise<{ success: boolean; isFavourited: boolean }>;
  },

  // Reports
  async reportProperty(propertyId: string, reason: string, details?: string) {
    const res = await fetch(`${API_BASE}/properties/${propertyId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, details })
    });
    return res.json() as Promise<{ success: boolean; data?: PropertyReport; error?: string }>;
  },

  async getReports() {
    const res = await fetch(`${API_BASE}/reports`);
    return res.json() as Promise<{ success: boolean; data: PropertyReport[] }>;
  },

  // Bookings
  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    return res.json() as Promise<{ success: boolean; data: Booking[] }>;
  },

  async cancelBooking(bookingId: string, reason?: string) {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json() as Promise<{ success: boolean; data?: Booking; message?: string; error?: string }>;
  },

  async createBooking(data: {
    propertyId: string;
    roomTypeId: string;
    checkInDate: string;
    stayDurationMonths?: number;
    guestsCount?: number;
  }) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json() as Promise<{ success: boolean; data?: Booking; error?: string }>;
  },

  async createPaymentOrder(bookingId: string, amount: number) {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, amount })
    });
    return res.json();
  },

  async verifyPayment(bookingId: string, razorpayPaymentId: string, razorpayOrderId: string) {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, razorpayPaymentId, razorpayOrderId })
    });
    return res.json();
  },

  // Living
  async getRoommates(city: string = 'Visakhapatnam') {
    const res = await fetch(`${API_BASE}/roommates?city=${encodeURIComponent(city)}`);
    return res.json() as Promise<{ success: boolean; data: RoommateProfile[] }>;
  },

  async getExpenses() {
    const res = await fetch(`${API_BASE}/households/expenses`);
    return res.json() as Promise<{ success: boolean; data: HouseholdExpense[] }>;
  },

  async addExpense(data: any) {
    const res = await fetch(`${API_BASE}/households/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json() as Promise<{ success: boolean; data: HouseholdExpense }>;
  },

  async getMaintenanceTickets(propertyId?: string) {
    const res = await fetch(`${API_BASE}/maintenance${propertyId ? `?propertyId=${propertyId}` : ''}`);
    return res.json() as Promise<{ success: boolean; data: MaintenanceTicket[] }>;
  },

  async createMaintenanceTicket(data: any) {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json() as Promise<{ success: boolean; data: MaintenanceTicket }>;
  },

  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`);
    return res.json();
  }
};
