import React from "react";
import { BookingsPage } from "./BookingsPage/BookingsPage";

export { BookingsPage } from "./BookingsPage/BookingsPage";
export const CustomerBookings: React.FC = () =>
  React.createElement(BookingsPage, { role: "customer" });
export const ProviderBookings: React.FC = () =>
  React.createElement(BookingsPage, { role: "provider" });
