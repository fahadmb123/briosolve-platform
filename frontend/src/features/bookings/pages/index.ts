import React from "react";
import { BookingsPage } from "./BookingsPage/BookingsPage";
import { BookingDetailsPage } from "./BookingDetailsPage/BookingDetailsPage";

export { BookingsPage } from "./BookingsPage/BookingsPage";
export { BookingDetailsPage } from "./BookingDetailsPage/BookingDetailsPage";

export const CustomerBookings: React.FC = () =>
  React.createElement(BookingsPage, { role: "customer" });
export const ProviderBookings: React.FC = () =>
  React.createElement(BookingsPage, { role: "provider" });

export const CustomerBookingDetails: React.FC = () =>
  React.createElement(BookingDetailsPage, { role: "customer" });
export const ProviderBookingDetails: React.FC = () =>
  React.createElement(BookingDetailsPage, { role: "provider" });
