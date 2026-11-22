import { Route } from 'react-router-dom';
import {
  CustomerDashboard,
  CustomerNotifications,
  CustomerProfile,
  CustomerSettings,
  CustomerNearbyProviders,
  CustomerRequestService,
  CustomerMyRequests,
  CustomerServiceRequestDetails,
  CustomerChat,
  CustomerPaymentSuccess,
  CustomerPaymentCancelled,
  CustomerBookings,
  CustomerBookingDetails,
  CustomerSupport
} from '../lazy/customer.lazy';
import ProtectedRoute from '../guards/ProtectedRoute';
import RoleRoute from '../guards/RoleRoute';

export const customerRoutes = (
  <>
    <Route path="request-service" element={<CustomerRequestService />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={["CUSTOMER"]} />}>
        <Route path="settings" element={<CustomerSettings />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="nearby-providers" element={<CustomerNearbyProviders />} />
        <Route path="nearby-providers/:providerId" element={<CustomerNearbyProviders />} />
        <Route path="my-requests" element={<CustomerMyRequests />} />
        <Route path="my-requests/:requestId" element={<CustomerServiceRequestDetails />} />
        <Route path="service-requests/:requestId" element={<CustomerServiceRequestDetails />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="bookings/:bookingId" element={<CustomerBookingDetails />} />
        <Route path="my-bookings" element={<CustomerBookings />} />
        <Route path="my-bookings/:bookingId" element={<CustomerBookingDetails />} />
        <Route path="payment/success" element={<CustomerPaymentSuccess />} />
        <Route path="payment/cancelled" element={<CustomerPaymentCancelled />} />
        <Route path="customer/payment/success" element={<CustomerPaymentSuccess />} />
        <Route path="customer/payment/cancelled" element={<CustomerPaymentCancelled />} />
        <Route path="messages" element={<CustomerChat />} />
        <Route path="chat" element={<CustomerChat />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="tickets" element={<CustomerSupport />} />
      </Route>
    </Route>
  </>
);
