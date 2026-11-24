import React from 'react';

export const ProviderRegister = React.lazy(() => import('../../../features/auth/pages/ProviderRegister/ProviderRegister'));
export const ProviderDashboard = React.lazy(() => import('../../../features/dashboard/pages/ProviderDashboard/Dashboard'));
export const ProviderProfile = React.lazy(() => import('../../../features/profiles/pages/ProviderProfile/Profile'));
export const ProviderVerification = React.lazy(() => import('../../../features/verification/pages/Verification/Verification'));
export const ProviderKyc = ProviderVerification;
export const ProviderSettings = React.lazy(() => import('../../../features/settings/pages/ProviderSettings/Settings'));
export const ProviderNotifications = React.lazy(() => import('../../../features/notifications/pages/NotificationsCenter/NotificationsCenter'));
export const ProviderServiceRequests = React.lazy(() => import('../../../features/service-requests/pages/ProviderServiceRequests/ProviderServiceRequests'));
export const ProviderServiceRequestDetails = React.lazy(() => import('../../../features/service-requests/pages/ProviderServiceRequestDetails/ProviderServiceRequestDetails'));
export const ProviderChat = React.lazy(() => import('../../../features/chat/pages/ProviderChat/ProviderChat'));
export const ProviderSubmitQuotation = React.lazy(() => import('../../../features/quotations/pages/SubmitQuotation/SubmitQuotation'));
export const ProviderMyQuotations = React.lazy(() => import('../../../features/quotations/pages/MyQuotations/MyQuotations'));
export const ProviderBookings = React.lazy(() => import('../../../features/bookings/pages/BookingsPage/BookingsPage').then(m => ({ default: m.BookingsPage })));
export const ProviderBookingDetails = React.lazy(() => import('../../../features/bookings/pages/BookingDetailsPage/BookingDetailsPage').then(m => ({ default: m.BookingDetailsPage })));
export const ProviderWallet = React.lazy(() => import('../../../features/wallet/pages/WalletPage/WalletPage'));
export const ProviderSupport = React.lazy(() => import('../../../features/support/pages/SupportTicketsPage/SupportTicketsPage').then(m => ({ default: m.SupportTicketsPage })));
export const ProviderReviews = React.lazy(() => import('../../../features/reviews/pages/ProviderReviewsPage/ProviderReviewsPage'));
