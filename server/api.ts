import { Router, Request, Response } from 'express';
import { db } from './db.ts';

const router = Router();

// ----------------------------------------------------
// AUTH & CURRENT SESSION
// ----------------------------------------------------
router.get('/auth/me', (req: Request, res: Response) => {
  const user = db.getCurrentUser();
  res.json({ success: true, user });
});

router.post('/auth/switch-role', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }
  const user = db.switchUser(userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, user });
});

router.patch('/auth/profile', (req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const updated = db.updateUserProfile(currentUser.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, user: updated });
});

// ----------------------------------------------------
// LOCATION DISCOVERY ENDPOINTS
// GET /api/v1/locations/cities
// GET /api/v1/locations/localities
// ----------------------------------------------------
router.get('/locations/cities', (_req: Request, res: Response) => {
  const cities = db.getCities();
  res.json({ success: true, data: cities });
});

router.get('/locations/localities', (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'Visakhapatnam';
  const localities = db.getLocalities(city);
  res.json({ success: true, data: localities });
});

// ----------------------------------------------------
// OWNER PROPERTIES MANAGEMENT
// GET /api/v1/owner/properties
// POST /api/v1/owner/properties
// PATCH /api/v1/owner/properties/:id
// DELETE /api/v1/owner/properties/:id
// ----------------------------------------------------
router.get('/owner/properties', (req: Request, res: Response) => {
  try {
    const currentUser = db.getCurrentUser();
    const ownerId = req.query.all === 'true' ? undefined : (currentUser.role === 'owner' ? currentUser.id : undefined);

    const {
      search,
      locality,
      city,
      propertyType,
      rentalPeriod,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnishingStatus,
      bachelorFriendly,
      familySuitable,
      foodAvailable,
      amenities,
      status,
      verifiedOnly,
      page,
      pageSize,
      sortBy
    } = req.query;

    const parsedAmenities = amenities
      ? (typeof amenities === 'string' ? amenities.split(',').map(s => s.trim()) : (amenities as string[]))
      : undefined;

    const result = db.getProperties({
      ownerId,
      search: search as string,
      locality: locality as string,
      city: city as string,
      propertyType: propertyType as string,
      rentalPeriod: rentalPeriod as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      minArea: minArea ? Number(minArea) : undefined,
      maxArea: maxArea ? Number(maxArea) : undefined,
      furnishingStatus: furnishingStatus as string,
      bachelorFriendly: bachelorFriendly === 'true',
      familySuitable: familySuitable === 'true',
      foodAvailable: foodAvailable === 'true',
      amenities: parsedAmenities,
      status: status as string,
      verifiedOnly: verifiedOnly === 'true',
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 8,
      sortBy: sortBy as string
    });

    res.json({
      success: true,
      data: result.properties,
      meta: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching owner properties:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch owner properties' });
  }
});

router.post('/owner/properties', (req: Request, res: Response) => {
  try {
    const currentUser = db.getCurrentUser();
    const {
      title,
      description,
      propertyType,
      rentalPeriod,
      price,
      dailyRent,
      securityDeposit,
      utilityCharges,
      bedrooms,
      bathrooms,
      balconies,
      totalRooms,
      areaSqFt,
      furnishingStatus,
      floorNumber,
      totalFloors,
      parkingAvailability,
      liftAvailable,
      propertyAge,
      genderPreference,
      tenantPreferences,
      foodAvailable,
      foodType,
      thumbnailUrl,
      images,
      imageDetails,
      location,
      amenities,
      roomTypes,
      houseRules
    } = req.body;

    if (!title || !propertyType || !price || !location?.address || !location?.locality) {
      return res.status(400).json({ success: false, error: 'Missing required property information (title, type, rent, address, locality).' });
    }

    // Default city: Visakhapatnam, State: Andhra Pradesh
    const city = location.city || 'Visakhapatnam';
    const state = location.state || 'Andhra Pradesh';

    const newProperty = db.createProperty({
      title,
      description: description || '',
      propertyType,
      rentalPeriod: rentalPeriod || 'Monthly',
      status: currentUser.role === 'admin' ? 'Published' : 'Pending verification', // Requires admin verification
      isVerified: currentUser.role === 'admin',
      price: Number(price),
      pricePerUnit: rentalPeriod === 'Daily' ? '/day' : '/mo',
      dailyRent: dailyRent ? Number(dailyRent) : undefined,
      securityDeposit: securityDeposit ? Number(securityDeposit) : Number(price) * 2,
      utilityCharges: utilityCharges || {
        maintenanceCharges: 0,
        electricityCharges: 'As per meter',
        waterCharges: 'Included',
        otherAdditionalFees: 0
      },
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      balconies: Number(balconies) || 1,
      totalRooms: Number(totalRooms) || 3,
      areaSqFt: Number(areaSqFt) || 850,
      furnishingStatus: furnishingStatus || 'Semi Furnished',
      floorNumber: Number(floorNumber) || 1,
      totalFloors: Number(totalFloors) || 4,
      parkingAvailability: parkingAvailability || 'Car & 2-Wheeler',
      liftAvailable: Boolean(liftAvailable),
      propertyAge: propertyAge || '1-5 years',
      genderPreference: genderPreference || 'All',
      tenantPreferences: tenantPreferences || {
        boysAllowed: true,
        girlsAllowed: true,
        familiesAllowed: true,
        studentsAllowed: true,
        professionalsAllowed: true,
        bachelorFriendly: true,
        petsAllowed: false,
        smokingAllowed: false
      },
      foodAvailable: Boolean(foodAvailable),
      foodType,
      thumbnailUrl: thumbnailUrl || images?.[0] || '/src/assets/images/stay_modern_apartment_1793966389648.jpg',
      images: images?.length ? images : ['/src/assets/images/stay_modern_apartment_1793966389648.jpg'],
      imageDetails: imageDetails || [],
      location: {
        address: location.address,
        locality: location.locality,
        city,
        state,
        pincode: location.pincode || '530017',
        latitude: location.latitude || 17.7423,
        longitude: location.longitude || 83.3338,
        landmark: location.landmark,
        nearbyColleges: location.nearbyColleges,
        nearbyTechParks: location.nearbyTechParks
      },
      amenities: amenities || ['Wi-Fi', 'Security', 'Water supply', 'Power backup'],
      roomTypes: roomTypes || [
        {
          id: `rt-${Date.now()}`,
          name: `${bedrooms || 1} BHK Residential Unit`,
          type: 'Entire Flat',
          priceMonthly: Number(price),
          securityDeposit: securityDeposit ? Number(securityDeposit) : Number(price) * 2,
          capacity: (Number(bedrooms) || 1) * 2,
          totalRooms: 1,
          availableRooms: 1,
          hasAttachedBath: true,
          hasBalcony: true,
          isAC: false
        }
      ],
      houseRules: houseRules || ['Standard residential society bylaws apply', 'Advance notice of 1 month before vacating'],
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      ownerEmail: currentUser.email,
      rating: 5.0,
      reviewsCount: 1
    });

    res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ success: false, error: 'Failed to create property' });
  }
});

// Support both PATCH and PUT for updates
router.patch('/owner/properties/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProperty(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update property' });
  }
});

router.put('/owner/properties/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProperty(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update property' });
  }
});

router.delete('/owner/properties/:id', (req: Request, res: Response) => {
  try {
    const success = db.deleteProperty(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, message: 'Property removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete property' });
  }
});

// ----------------------------------------------------
// PUBLIC PROPERTIES SEARCH & DISCOVERY
// GET /api/v1/properties
// GET /api/v1/properties/:id
// GET /api/v1/properties/nearby
// ----------------------------------------------------
router.get('/properties', (req: Request, res: Response) => {
  try {
    const {
      search,
      locality,
      city = 'Visakhapatnam',
      propertyType,
      rentalPeriod,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnishingStatus,
      bachelorFriendly,
      familySuitable,
      foodAvailable,
      amenities,
      status,
      verifiedOnly,
      latitude,
      longitude,
      radiusKm,
      page,
      pageSize,
      sortBy
    } = req.query;

    const parsedAmenities = amenities
      ? (typeof amenities === 'string' ? amenities.split(',').map(s => s.trim()) : (amenities as string[]))
      : undefined;

    const result = db.getProperties({
      search: search as string,
      locality: locality as string,
      city: city as string,
      propertyType: propertyType as string,
      rentalPeriod: rentalPeriod as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      furnishingStatus: furnishingStatus as string,
      bachelorFriendly: bachelorFriendly === 'true',
      familySuitable: familySuitable === 'true',
      foodAvailable: foodAvailable === 'true',
      amenities: parsedAmenities,
      status: (status as string) || 'Published',
      verifiedOnly: verifiedOnly === 'true',
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      radiusKm: radiusKm ? Number(radiusKm) : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 12,
      sortBy: sortBy as string
    });

    res.json({
      success: true,
      data: result.properties,
      meta: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search properties' });
  }
});

router.get('/properties/nearby', (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 10;
    const limit = req.query.limit ? Number(req.query.limit) : 6;

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ success: false, error: 'Valid lat and lon query parameters required.' });
    }

    const nearby = db.getNearbyProperties(lat, lon, radiusKm, limit);
    res.json({ success: true, data: nearby });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch nearby properties' });
  }
});

router.get('/properties/:id', (req: Request, res: Response) => {
  const property = db.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, error: 'Property not found' });
  }
  res.json({ success: true, data: property });
});

// ----------------------------------------------------
// ENQUIRIES (Direct Customer -> Owner Communication)
// POST /api/v1/enquiries
// GET /api/v1/enquiries
// ----------------------------------------------------
router.post('/enquiries', (req: Request, res: Response) => {
  try {
    const currentUser = db.getCurrentUser();
    const {
      propertyId,
      customerName,
      customerPhone,
      customerEmail,
      tenantType,
      expectedMoveInDate,
      occupancyCount,
      message
    } = req.body;

    const property = db.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const enquiry = db.createEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocality: property.location.locality,
      ownerId: property.ownerId,
      customerId: currentUser.id,
      customerName: customerName || currentUser.name,
      customerPhone: customerPhone || currentUser.phone,
      customerEmail: customerEmail || currentUser.email,
      tenantType: tenantType || 'Working Professional',
      expectedMoveInDate: expectedMoveInDate || 'Immediate',
      occupancyCount: Number(occupancyCount) || 1,
      message: message || 'Interested in this property. Please contact me with visit details.'
    });

    res.status(201).json({ success: true, data: enquiry, message: 'Enquiry sent to property owner successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send enquiry' });
  }
});

router.get('/enquiries', (req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const ownerId = currentUser.role === 'owner' ? currentUser.id : undefined;
  const customerId = currentUser.role === 'customer' ? currentUser.id : undefined;

  const enquiries = db.getEnquiries(ownerId, customerId);
  res.json({ success: true, data: enquiries });
});

router.patch('/enquiries/:id', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['New', 'Contacted', 'Closed'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Valid status (New, Contacted, Closed) required' });
  }
  const updated = db.updateEnquiryStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }
  res.json({ success: true, data: updated });
});

// ----------------------------------------------------
// OWNER ANALYTICS & OFFERS
// ----------------------------------------------------
router.get('/owner/analytics', (_req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const analytics = db.getOwnerAnalytics(currentUser.id);
  res.json({ success: true, data: analytics });
});

router.get('/owner/offers', (_req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const ownerId = currentUser.role === 'owner' ? currentUser.id : undefined;
  const customerId = currentUser.role === 'customer' ? currentUser.id : undefined;
  const offers = db.getOffers(ownerId, customerId);
  res.json({ success: true, data: offers });
});

router.patch('/owner/offers/:id', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['Accepted', 'Rejected', 'Countered'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Valid offer status required' });
  }
  const updated = db.updateOfferStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Offer not found' });
  }
  res.json({ success: true, data: updated });
});

router.post('/offers', (req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const { propertyId, offeredMonthlyRent, proposedTenancyMonths, proposedMoveInDate, notes } = req.body;
  const property = db.getPropertyById(propertyId);
  if (!property) {
    return res.status(404).json({ success: false, error: 'Property not found' });
  }

  const offer = db.createOffer({
    propertyId: property.id,
    propertyTitle: property.title,
    propertyLocality: property.location.locality,
    ownerId: property.ownerId,
    customerId: currentUser.id,
    customerName: currentUser.name,
    customerPhone: currentUser.phone,
    offeredMonthlyRent: Number(offeredMonthlyRent) || property.price,
    originalMonthlyRent: property.price,
    proposedTenancyMonths: Number(proposedTenancyMonths) || 11,
    proposedMoveInDate: proposedMoveInDate || new Date().toISOString().split('T')[0],
    notes: notes || ''
  });

  res.status(201).json({ success: true, data: offer });
});

// ----------------------------------------------------
// SAVED FAVOURITES & LISTING REPORTS
// ----------------------------------------------------
router.get('/favourites', (_req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const favIds = db.getFavourites(currentUser.id);
  res.json({ success: true, data: favIds });
});

router.post('/favourites/toggle', (req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const { propertyId } = req.body;
  if (!propertyId) {
    return res.status(400).json({ success: false, error: 'Property ID is required' });
  }
  const isFavourited = db.toggleFavourite(currentUser.id, propertyId);
  res.json({ success: true, isFavourited });
});

router.post('/properties/:id/report', (req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const property = db.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, error: 'Property not found' });
  }
  const { reason, details } = req.body;
  if (!reason) {
    return res.status(400).json({ success: false, error: 'Reason is required' });
  }
  const report = db.createReport({
    propertyId: property.id,
    propertyTitle: property.title,
    reporterName: currentUser.name,
    reporterEmail: currentUser.email,
    reason,
    details: details || ''
  });
  res.status(201).json({ success: true, data: report });
});

router.get('/reports', (_req: Request, res: Response) => {
  const reports = db.getReports();
  res.json({ success: true, data: reports });
});

// ----------------------------------------------------
// BOOKINGS & RESERVATION ENGINE
// ----------------------------------------------------
router.get('/bookings', (_req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const customerId = currentUser.role === 'customer' ? currentUser.id : undefined;
  const ownerId = currentUser.role === 'owner' ? currentUser.id : undefined;

  const bookings = db.getBookings(customerId, ownerId);
  res.json({ success: true, data: bookings });
});

router.post('/bookings', (req: Request, res: Response) => {
  const currentUser = db.getCurrentUser();
  const { propertyId, roomTypeId, checkInDate, stayDurationMonths, guestsCount } = req.body;

  if (!propertyId || !roomTypeId || !checkInDate) {
    return res.status(400).json({ success: false, error: 'Please provide property, room type, and check-in date' });
  }

  const result = db.createBooking({
    propertyId,
    roomTypeId,
    customerId: currentUser.id,
    customerName: currentUser.name,
    customerEmail: currentUser.email,
    customerPhone: currentUser.phone,
    checkInDate,
    stayDurationMonths: stayDurationMonths ? Number(stayDurationMonths) : 1,
    guestsCount: guestsCount ? Number(guestsCount) : 1
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.status(201).json({ success: true, data: result.booking });
});

// ----------------------------------------------------
// RAZORPAY SANDBOX PAYMENTS
// ----------------------------------------------------
router.post('/payments/create-order', (req: Request, res: Response) => {
  const { bookingId, amount } = req.body;
  if (!bookingId || !amount) {
    return res.status(400).json({ success: false, error: 'Booking ID and amount are required' });
  }

  const orderId = `order_rzp_${Date.now()}`;
  res.json({
    success: true,
    order: {
      id: orderId,
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `rcpt_${bookingId}`,
      status: 'created'
    }
  });
});

router.post('/payments/verify', (req: Request, res: Response) => {
  const { bookingId, razorpayPaymentId } = req.body;
  if (!bookingId || !razorpayPaymentId) {
    return res.status(400).json({ success: false, error: 'Invalid payment payload' });
  }

  const updatedBooking = db.confirmBookingPayment(bookingId, razorpayPaymentId);
  if (!updatedBooking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  res.json({
    success: true,
    message: 'Payment verified and captured successfully via Razorpay test mode',
    booking: updatedBooking
  });
});

router.patch('/bookings/:id/cancel', (req: Request, res: Response) => {
  const { reason } = req.body;
  const cancelled = db.cancelBooking(req.params.id, reason);
  if (!cancelled) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }
  res.json({ success: true, data: cancelled, message: 'Booking cancelled and room inventory restored' });
});

// ----------------------------------------------------
// STAYFINDER LIVING: ROOMMATES, EXPENSES, MAINTENANCE
// ----------------------------------------------------
router.get('/roommates', (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'Visakhapatnam';
  const list = db.getRoommates(city);
  res.json({ success: true, data: list });
});

router.get('/households/expenses', (_req: Request, res: Response) => {
  const expenses = db.getExpenses();
  res.json({ success: true, data: expenses });
});

router.post('/households/expenses', (req: Request, res: Response) => {
  const { title, amount, category, paidBy, splitWith } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ success: false, error: 'Title and amount are required' });
  }
  const exp = db.addExpense({
    householdName: 'MVP Colony 3BHK Residence',
    title,
    amount: Number(amount),
    category: category || 'Other',
    paidBy: paidBy || 'Suresh Varma',
    splitWith: splitWith || ['Suresh Varma', 'Rohan Sharma'],
    date: new Date().toISOString().split('T')[0],
    isSettled: false
  });
  res.status(201).json({ success: true, data: exp });
});

router.get('/maintenance', (req: Request, res: Response) => {
  const propertyId = req.query.propertyId as string;
  const tickets = db.getMaintenanceTickets(propertyId);
  res.json({ success: true, data: tickets });
});

router.post('/maintenance', (req: Request, res: Response) => {
  const { propertyId, propertyTitle, roomNumber, tenantName, category, priority, description } = req.body;
  if (!propertyTitle || !category || !description) {
    return res.status(400).json({ success: false, error: 'Missing required maintenance details' });
  }

  const ticket = db.createMaintenanceTicket({
    propertyId: propertyId || 'vizag-prop-1',
    propertyTitle,
    roomNumber,
    tenantName: tenantName || 'Tenant',
    category,
    priority: priority || 'Medium',
    description
  });

  res.status(201).json({ success: true, data: ticket });
});

// ----------------------------------------------------
// ADMIN ACTIONS & MODERATION
// ----------------------------------------------------
router.get('/admin/overview', (_req: Request, res: Response) => {
  const allProps = db.getProperties({ pageSize: 1000, city: 'All' });
  const allBookings = db.getBookings();
  const allTickets = db.getMaintenanceTickets();
  const allEnquiries = db.getEnquiries();

  res.json({
    success: true,
    data: {
      totalProperties: allProps.total,
      verifiedProperties: allProps.properties.filter(p => p.isVerified).length,
      pendingVerificationCount: allProps.properties.filter(p => p.status === 'Pending verification').length,
      totalBookings: allBookings.length,
      totalEnquiries: allEnquiries.length,
      pendingTickets: allTickets.filter(t => t.status !== 'Resolved').length,
      grossVolumeINR: allBookings.reduce((sum, b) => sum + b.totalAmountDue, 0)
    }
  });
});

export default router;
