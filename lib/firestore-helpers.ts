import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  addDoc,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  increment,
  getDocFromCache,
} from 'firebase/firestore';
import { db, auth } from './firebase';

// ============================================================
// TYPE DEFINITIONS — Database Schema
// ============================================================

export type UserRole = 'client' | 'provider' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  country?: string;
  city?: string;
  bio?: string;
  // Provider-specific
  solanaWallet?: string;
  companyName?: string;
  verified?: boolean;
  averageRating?: number;
  reviewCount?: number;
  totalBookings?: number;
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ServiceListing {
  id?: string;
  providerId: string;
  providerName: string;
  providerContact?: { email: string; phone?: string };
  providerAvatar?: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  // Pricing
  packages: ServicePackage[];
  // Location
  country: string;
  city: string;
  // serviceArea can represent whether the provider serves a whole state or a specific city
  serviceArea?: {
    type: 'city' | 'state';
    value: string;
  };
  isRemote: boolean;
  // Media
  portfolio: string[]; // URLs
  coverImage?: string;
  // Status
  status: 'active' | 'pending' | 'suspended' | 'draft';
  featured: boolean;
  // Stats
  totalBookings: number;
  averageRating: number;
  reviewCount: number;
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ServicePackage {
  name: string; // e.g., "Basic", "Standard", "Premium"
  description: string;
  price: number; // in RENTX tokens
  deliveryDays: number;
  features: string[];
}

export interface Booking {
  id?: string;
  serviceId: string;
  serviceTitle: string;
  providerId: string;
  providerName: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  // Booking details
  packageName: string;
  packagePrice: number;
  bookingDate: Timestamp;
  startDate: Timestamp;
  endDate?: Timestamp;
  notes?: string;
  // Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  clientConfirmed: boolean;
  providerConfirmed: boolean;
  buyerConfirmed?: boolean;
  isReviewed?: boolean;
  // Contact (revealed after booking)
  providerContact?: {
    email: string;
    phone?: string;
  };
  clientContact?: {
    email: string;
    phone?: string;
  };
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Payment {
  id?: string;
  bookingId: string;
  serviceId: string;
  clientId: string;
  payerId?: string; // Optional alias for clientId
  providerId: string;
  amount: number; // RENTX tokens
  platformFee: number;
  providerAmount: number;
  type?: 'escrow' | 'release' | 'refund'; // Payment type
  // Solana
  transactionSignature?: string;
  escrowAccount?: string;
  // Status
  status: 'pending' | 'held' | 'released' | 'refunded' | 'withdrawn' | 'confirmed';
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Availability {
  id?: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
  isFullDay: boolean;
  isAvailable: boolean;
}

export interface TimeSlot {
  start: string; // HH:MM
  end: string;
  booked: boolean;
  bookingId?: string;
}

export interface Review {
  id?: string;
  serviceId: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
}

export interface Withdrawal {
  id?: string;
  providerId: string;
  amount: number;
  solanaWallet: string;
  transactionSignature?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

export interface Notification {
  id?: string;
  userId: string;
  type: 'booking' | 'payment' | 'review' | 'system' | 'withdrawal';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Timestamp;
}

// ============================================================
// USER FUNCTIONS
// ============================================================

export async function createUser(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUser(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  return updateUser(uid, data);
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ ...d.data(), uid: d.id } as UserProfile));
}

// ============================================================
// SERVICE FUNCTIONS
// ============================================================

export async function createService(data: Partial<ServiceListing>): Promise<string> {
  const ref = await addDoc(collection(db, 'services'), {
    ...data,
    status: 'active',
    featured: false,
    totalBookings: 0,
    averageRating: 0,
    reviewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getService(id: string): Promise<ServiceListing | null> {
  const snap = await getDoc(doc(db, 'services', id));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as ServiceListing) : null;
}

export async function updateService(id: string, data: Partial<ServiceListing>) {
  await updateDoc(doc(db, 'services', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteService(id: string) {
  await deleteDoc(doc(db, 'services', id));
}

export async function getProviderServices(providerId: string): Promise<ServiceListing[]> {
  const q = query(collection(db, 'services'), where('providerId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ServiceListing));
}

export async function getAllServices(constraints: QueryConstraint[] = []): Promise<ServiceListing[]> {
  const q = query(collection(db, 'services'), where('status', '==', 'active'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ServiceListing));
}

export async function getServicesByCategory(category: string): Promise<ServiceListing[]> {
  const q = query(
    collection(db, 'services'),
    where('status', '==', 'active'),
    where('category', '==', category)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ServiceListing));
}

// ============================================================
// BOOKING FUNCTIONS
// ============================================================

export async function createBooking(data: Partial<Booking>): Promise<string> {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'pending',
    clientConfirmed: false,
    providerConfirmed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getBooking(id: string): Promise<Booking | null> {
  const snap = await getDoc(doc(db, 'bookings', id));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as Booking) : null;
}

export async function updateBooking(id: string, data: Partial<Booking>) {
  await updateDoc(doc(db, 'bookings', id), { ...data, updatedAt: serverTimestamp() });
}

export async function getClientBookings(clientId: string): Promise<Booking[]> {
  const q = query(collection(db, 'bookings'), where('clientId', '==', clientId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Booking)).sort((a, b) => {
    const aTime = a.createdAt && typeof a.createdAt === 'object' && 'seconds' in (a.createdAt as any) ? (a.createdAt as any).seconds : 0;
    const bTime = b.createdAt && typeof b.createdAt === 'object' && 'seconds' in (b.createdAt as any) ? (b.createdAt as any).seconds : 0;
    return bTime - aTime;
  });
}

export async function getProviderBookings(providerId: string): Promise<Booking[]> {
  const q = query(collection(db, 'bookings'), where('providerId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Booking)).sort((a, b) => {
    const aTime = a.createdAt && typeof a.createdAt === 'object' && 'seconds' in (a.createdAt as any) ? (a.createdAt as any).seconds : 0;
    const bTime = b.createdAt && typeof b.createdAt === 'object' && 'seconds' in (b.createdAt as any) ? (b.createdAt as any).seconds : 0;
    return bTime - aTime;
  });
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  const bookingRef = doc(db, 'bookings', id);
  const snap = await getDoc(bookingRef);

  if (snap.exists()) {
    const booking = snap.data() as Booking;
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp()
    });

    // Notify Client
    await createNotification({
      userId: booking.clientId,
      type: 'booking',
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking for "${booking.serviceTitle}" has been marked as ${status}.`,
      link: `/marketplace/dashboard/client/bookings`,
    });
  }
}

// ============================================================
// PAYMENT FUNCTIONS
// ============================================================

export async function createPayment(data: Partial<Payment>): Promise<string> {
  const ref = await addDoc(collection(db, 'payments'), {
    ...data,
    status: data.status || 'held',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPayment(id: string): Promise<Payment | null> {
  const snap = await getDoc(doc(db, 'payments', id));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as Payment) : null;
}

export async function updatePayment(id: string, data: Partial<Payment>) {
  await updateDoc(doc(db, 'payments', id), { ...data, updatedAt: serverTimestamp() });
}

export async function getProviderPayments(providerId: string): Promise<Payment[]> {
  const q = query(collection(db, 'payments'), where('providerId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Payment)).sort((a, b) => {
    const aTime = a.createdAt && typeof a.createdAt === 'object' && 'seconds' in (a.createdAt as any) ? (a.createdAt as any).seconds : 0;
    const bTime = b.createdAt && typeof b.createdAt === 'object' && 'seconds' in (b.createdAt as any) ? (b.createdAt as any).seconds : 0;
    return bTime - aTime;
  });
}

export async function releasePayment(bookingId: string) {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) throw new Error('User not authenticated');

  console.log("Starting releasePayment for booking:", bookingId);

  // 1. Update Booking to confirmed (delivery accepted)
  const bookingRef = doc(db, 'bookings', bookingId);
  await updateDoc(bookingRef, { 
    status: 'confirmed', 
    buyerConfirmed: true, 
    updatedAt: serverTimestamp() 
  });

  // 2. Find and update Payment(s) to released
  const q = query(
    collection(db, 'payments'), 
    where('bookingId', '==', bookingId)
  );
  const snap = await getDocs(q);
  
  if (snap.empty) {
    console.warn("No payment documents found for booking:", bookingId);
    return;
  }

  console.log(`Found ${snap.docs.length} payment(s) to release.`);

  for (const paymentDoc of snap.docs) {
    const paymentData = paymentDoc.data() as Payment;
    
    // Only update if not already released
    if (paymentData.status !== 'released') {
      await updateDoc(doc(db, 'payments', paymentDoc.id), {
        status: 'released',
        updatedAt: serverTimestamp()
      });

      // 3. Notify Provider (for each payment released)
      await createNotification({
        userId: paymentData.providerId,
        type: 'payment',
        title: 'Payment Released!',
        message: `Your payment of ${paymentData.amount} RENTX for booking #${bookingId.slice(-6)} has been released and is now available for withdrawal.`,
        link: '/marketplace/dashboard/provider/wallet',
      });
    }
  }
}

// ============================================================
// AVAILABILITY FUNCTIONS
// ============================================================

export async function setAvailability(providerId: string, date: string, data: Partial<Availability>) {
  const id = `${providerId}_${date}`;
  await setDoc(doc(db, 'availability', id), {
    ...data,
    providerId,
    date,
  }, { merge: true });
}

export async function getAvailability(providerId: string, dates: string[]): Promise<Availability[]> {
  const results: Availability[] = [];
  for (const date of dates) {
    const id = `${providerId}_${date}`;
    const snap = await getDoc(doc(db, 'availability', id));
    if (snap.exists()) {
      results.push({ ...snap.data(), id: snap.id } as Availability);
    }
  }
  return results;
}

export async function getProviderAvailabilityRange(providerId: string, startDate: string, endDate: string): Promise<Availability[]> {
  const q = query(
    collection(db, 'availability'),
    where('providerId', '==', providerId),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Availability));
}

// ============================================================
// REVIEW FUNCTIONS
// ============================================================

export async function createReview(data: Partial<Review>): Promise<string> {
  const ref = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  });

  // Mark booking as reviewed
  if (data.bookingId) {
    const bookingRef = doc(db, 'bookings', data.bookingId);
    await updateDoc(bookingRef, {
      isReviewed: true,
      updatedAt: serverTimestamp()
    });
  }

  // Aggregate ratings on the service listing
  if (data.serviceId && data.rating) {
    const serviceRef = doc(db, 'services', data.serviceId);
    const serviceSnap = await getDoc(serviceRef);

    if (serviceSnap.exists()) {
      const service = serviceSnap.data() as ServiceListing;
      const oldCount = service.reviewCount || 0;
      const oldRating = service.averageRating || 0;

      const newCount = oldCount + 1;
      const newRating = ((oldRating * oldCount) + data.rating) / newCount;

      await updateDoc(serviceRef, {
        reviewCount: newCount,
        averageRating: parseFloat(newRating.toFixed(1)),
        updatedAt: serverTimestamp()
      });
    }
  }

  // Notify Provider about new review
  if (data.providerId) {
    // Aggregate on Provider Profile
    const providerRef = doc(db, 'users', data.providerId);
    const providerSnap = await getDoc(providerRef);
    if (providerSnap.exists()) {
      const provider = providerSnap.data() as UserProfile;
      const oldCount = provider.reviewCount || 0;
      const oldRating = provider.averageRating || 0;
      const newCount = oldCount + 1;
      const newRating = ((oldRating * oldCount) + (data.rating || 0)) / newCount;

      await updateDoc(providerRef, {
        reviewCount: newCount,
        averageRating: parseFloat(newRating.toFixed(1)),
        updatedAt: serverTimestamp()
      });
    }

    await createNotification({
      userId: data.providerId,
      type: 'review',
      title: 'New Review Received!',
      message: `${data.clientName} left you a ${data.rating}-star review.`,
      link: `/marketplace/service/${data.serviceId}`,
    });
  }

  return ref.id;
}

export async function getServiceReviews(serviceId: string): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), where('serviceId', '==', serviceId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Review));
}

export async function getBookingReview(bookingId: string): Promise<Review | null> {
  const q = query(collection(db, 'reviews'), where('bookingId', '==', bookingId), limit(1));
  const snap = await getDocs(q);
  return !snap.empty ? ({ ...snap.docs[0].data(), id: snap.docs[0].id } as Review) : null;
}

// ============================================================
// WITHDRAWAL FUNCTIONS
// ============================================================

export async function createWithdrawal(data: Partial<Withdrawal>): Promise<string> {
  const ref = await addDoc(collection(db, 'withdrawals'), {
    status: 'pending',
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getProviderWithdrawals(providerId: string): Promise<Withdrawal[]> {
  const q = query(collection(db, 'withdrawals'), where('providerId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Withdrawal)).sort((a, b) => {
    const aTime = a.createdAt && typeof a.createdAt === 'object' && 'seconds' in (a.createdAt as any) ? (a.createdAt as any).seconds : 0;
    const bTime = b.createdAt && typeof b.createdAt === 'object' && 'seconds' in (b.createdAt as any) ? (b.createdAt as any).seconds : 0;
    return bTime - aTime;
  });
}

// ============================================================
// NOTIFICATION FUNCTIONS
// ============================================================

export async function createNotification(data: Partial<Notification>): Promise<string> {
  const ref = await addDoc(collection(db, 'notifications'), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Notification));
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(db, 'notifications', id), { read: true });
}

// ============================================================
// ADMIN FUNCTIONS
// ============================================================

export async function getAllBookings(): Promise<Booking[]> {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Booking));
}

export async function getAllPayments(): Promise<Payment[]> {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Payment));
}

export async function getAllServicesAdmin(): Promise<ServiceListing[]> {
  const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ServiceListing));
}

export async function getWithdrawalRequests(): Promise<Withdrawal[]> {
  const q = query(collection(db, 'withdrawals'), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Withdrawal));
}

export async function updateWithdrawalStatus(id: string, status: Withdrawal['status']) {
  await updateDoc(doc(db, 'withdrawals', id), { status });
}

export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snap) => {
    const notifications = snap.docs.map(d => ({ ...d.data(), id: d.id } as Notification));
    callback(notifications);
  });
}

// export async function createNotification(userId: string, title: string, message: string, type: Notification['type'] = 'info') {
//   await addDoc(collection(db, 'notifications'), {
//     userId,
//     title,
//     message,
//     type,
//     read: false,
//     createdAt: serverTimestamp()
//   });
// }

// export async function getAllBookings(): Promise<Booking[]> {
//   const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Booking));
// }

// export async function markNotificationRead(id: string) {
//   await updateDoc(doc(db, 'notifications', id), { read: true });
// }
