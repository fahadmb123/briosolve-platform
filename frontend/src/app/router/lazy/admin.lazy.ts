import React from 'react';

export const AdminDashboard = React.lazy(() => import('../../../features/dashboard/pages/AdminDashboard/Dashboard'));
export const AdminUsers = React.lazy(() => import('../../../features/profiles/pages/AdminUsers/Users'));
export const AdminRequests = React.lazy(() => import('../../../features/admin/pages/AdminRequests/AdminRequests'));
export const AdminCustomers = React.lazy(() => import('../../../features/profiles/pages/AdminCustomers/Customers'));
export const AdminProviders = React.lazy(() => import('../../../features/profiles/pages/AdminProviders/Providers'));
export const AdminProviderDetails = React.lazy(() => import('../../../features/profiles/pages/AdminProviderDetails/ProviderDetails'));
export const AdminVerification = React.lazy(() => import('../../../features/verification/pages/AdminVerification/AdminVerification'));
export const AdminSettings = React.lazy(() => import('../../../features/settings/pages/AdminSettings/Settings'));
export const AdminNotifications = React.lazy(() => import('../../../features/notifications/pages/NotificationsCenter/NotificationsCenter'));
export const AdminCategories = React.lazy(() => import('../../../features/service-catalog/pages/Categories/Categories'));
export const AdminServices = React.lazy(() => import('../../../features/service-catalog/pages/Services/Services'));
export const AdminReactivations = React.lazy(() => import('../../../features/account-reactivation/pages/Reactivations/Reactivations'));
export const AdminSupport = React.lazy(() => import('../../../features/support/pages/AdminSupportTicketsPage/AdminSupportTicketsPage'));
export const AdminBookings = React.lazy(() => import('../../../features/bookings/pages/AdminBookingsPage/AdminBookingsPage'));
export const AdminAuditLogs = React.lazy(() => import('../../../features/admin/pages/AdminAuditLogs/AdminAuditLogs'));
export const AdminAnalytics = React.lazy(() => import('../../../features/admin/pages/AdminAnalytics/AdminAnalytics'));
export const AdminReviews = React.lazy(() => import('../../../features/reviews/pages/AdminReviewsPage/AdminReviewsPage'));
