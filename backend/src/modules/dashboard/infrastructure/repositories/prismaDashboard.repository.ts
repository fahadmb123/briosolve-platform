import { db } from "../../../../shared/database/client";
import { IDashboardRepository, RawAuditLogSources, RawAnalyticsSources } from "../../domain/repositories/IDashboard.repository";
import { ProviderDashboardResponseDto } from "../../application/dtos/response/provider-dashboard-response.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/response/admin-dashboard-response.dto";
import {
  DashboardMapper,
  ProviderDashboardRawData,
  AdminDashboardRawData,
} from "../../application/mappers/dashboard.mapper";

export class PrismaDashboardRepository implements IDashboardRepository {
  async getProviderDashboardData(userId: string): Promise<ProviderDashboardResponseDto> {
    const raw = await this.fetchProviderRawData(userId);
    return DashboardMapper.toProviderDashboard(raw);
  }

  async getAdminDashboardData(): Promise<AdminDashboardResponseDto> {
    const raw = await this.fetchAdminRawData();
    return DashboardMapper.toAdminDashboard(raw);
  }

  async getRawAuditLogSources(): Promise<RawAuditLogSources> {
    let bookings: any[] = [];
    try {
      bookings = await db.orm.public.bookings.orderBy((b) => b.created_at.desc()).limit(100).all();
    } catch {
      bookings = [];
    }

    let requests: any[] = [];
    try {
      requests = await db.orm.public.service_requests.orderBy((r) => r.created_at.desc()).limit(100).all();
    } catch {
      requests = [];
    }

    let quotations: any[] = [];
    try {
      quotations = await db.orm.public.quotations.orderBy((q) => q.created_at.desc()).limit(100).all();
    } catch {
      quotations = [];
    }

    let tickets: any[] = [];
    try {
      tickets = await db.orm.public.support_tickets.orderBy((t) => t.created_at.desc()).limit(50).all();
    } catch {
      tickets = [];
    }

    let profiles: any[] = [];
    try {
      profiles = await db.orm.public.provider_profiles.limit(100).all();
    } catch {
      profiles = [];
    }

    let notifications: any[] = [];
    try {
      notifications = await db.orm.public.notifications.orderBy((n) => n.created_at.desc()).limit(50).all();
    } catch {
      notifications = [];
    }

    const customerIds = Array.from(new Set(bookings.map((b) => b.customer_id).filter(Boolean)));
    let customers: any[] = [];
    try {
      customers = customerIds.length
        ? await db.orm.public.users.where((u) => u.id.in(customerIds as never)).all()
        : [];
    } catch {
      customers = [];
    }

    return {
      bookings,
      requests,
      quotations,
      tickets,
      profiles,
      notifications,
      customers,
    };
  }

  async getRawAnalyticsSources(): Promise<RawAnalyticsSources> {
    return this.fetchAdminAnalyticsRawData();
  }

  private async fetchAdminAnalyticsRawData(): Promise<RawAnalyticsSources> {
    let users: any[] = [];
    try {
      users = await db.orm.public.users.all();
    } catch {
      users = [];
    }

    let providerProfiles: any[] = [];
    try {
      providerProfiles = await db.orm.public.provider_profiles.all();
    } catch {
      providerProfiles = [];
    }

    let requests: any[] = [];
    try {
      requests = await db.orm.public.service_requests.all();
    } catch {
      requests = [];
    }

    let quotations: any[] = [];
    try {
      quotations = await db.orm.public.quotations.all();
    } catch {
      quotations = [];
    }

    let bookings: any[] = [];
    try {
      bookings = await db.orm.public.bookings.all();
    } catch {
      bookings = [];
    }

    let categories: any[] = [];
    try {
      categories = await db.orm.public.categories.all();
    } catch {
      categories = [];
    }

    let addresses: any[] = [];
    try {
      addresses = await db.orm.public.addresses.all();
    } catch {
      addresses = [];
    }

    let tickets: any[] = [];
    try {
      tickets = await db.orm.public.support_tickets.all();
    } catch {
      tickets = [];
    }

    return {
      users,
      providerProfiles,
      requests,
      quotations,
      bookings,
      categories,
      addresses,
      tickets,
    };
  }

  private async fetchProviderRawData(userId: string): Promise<ProviderDashboardRawData> {
    const user = await db.orm.public.users.where({ id: userId as never }).first();
    const profile = await db.orm.public.provider_profiles
      .where({ user_id: userId as never })
      .first();

    if (!profile) {
      return {
        user,
        profile: null,
        allCategories: [],
        allBookings: [],
        allQuotations: [],
        availableRequests: [],
        customers: [],
        addresses: [],
        reqQuotes: [],
        notifications: [],
        bookingRequests: [],
        bookingCustomers: [],
        bookingAddresses: [],
      };
    }

    const allCategories = await db.orm.public.categories.all();

    const allBookings = await db.orm.public.bookings
      .where({ provider_id: profile.id as never })
      .orderBy((b) => b.created_at.desc())
      .all();

    const allQuotations = await db.orm.public.quotations
      .where({ provider_id: profile.id as never })
      .all();

    const availableRequests = await db.orm.public.service_requests
      .where((r) => r.status.in(["PENDING", "ACTIVE"]))
      .orderBy((r) => r.created_at.desc())
      .limit(10)
      .all();

    const customerIds = Array.from(new Set(availableRequests.map((r) => r.customer_id)));
    const customers = customerIds.length
      ? await db.orm.public.users.where((u) => u.id.in(customerIds as never)).all()
      : [];

    const addressIds = Array.from(new Set(availableRequests.map((r) => r.address_id)));
    const addresses = addressIds.length
      ? await db.orm.public.addresses.where((a) => a.id.in(addressIds as never)).all()
      : [];

    const requestIds = availableRequests.map((r) => r.id);
    const reqQuotes = requestIds.length
      ? await db.orm.public.quotations.where((q) => q.service_request_id.in(requestIds as never)).all()
      : [];

    const notifications = await db.orm.public.notifications
      .where({ recipient_id: userId as never })
      .orderBy((n) => n.created_at.desc())
      .limit(5)
      .all();

    const acceptedBookings = allBookings.filter((b) =>
      ["CONFIRMED", "EN_ROUTE", "INSPECTION", "IN_PROGRESS", "PAYMENT_PENDING"].includes(b.status)
    );

    const bookingRequestIds = Array.from(new Set(acceptedBookings.map((b) => b.service_request_id).filter(Boolean)));
    const bookingRequests = bookingRequestIds.length
      ? await db.orm.public.service_requests.where((r) => r.id.in(bookingRequestIds as never)).all()
      : [];

    const bookingCustomerIds = Array.from(new Set(acceptedBookings.map((b) => b.customer_id).filter(Boolean)));
    const bookingCustomers = bookingCustomerIds.length
      ? await db.orm.public.users.where((u) => u.id.in(bookingCustomerIds as never)).all()
      : [];

    const bookingAddressIds = Array.from(new Set(bookingRequests.map((r) => r.address_id).filter(Boolean)));
    const bookingAddresses = bookingAddressIds.length
      ? await db.orm.public.addresses.where((a) => a.id.in(bookingAddressIds as never)).all()
      : [];

    return {
      user,
      profile,
      allCategories,
      allBookings,
      allQuotations,
      availableRequests,
      customers,
      addresses,
      reqQuotes,
      notifications,
      bookingRequests,
      bookingCustomers,
      bookingAddresses,
    };
  }

  private async fetchAdminRawData(): Promise<AdminDashboardRawData> {
    let allUsers: any[] = [];
    try {
      allUsers = await db.orm.public.users.all();
    } catch {
      allUsers = [];
    }

    let providerProfiles: any[] = [];
    try {
      providerProfiles = await db.orm.public.provider_profiles.all();
    } catch {
      providerProfiles = [];
    }

    let allRequests: any[] = [];
    try {
      allRequests = await db.orm.public.service_requests.all();
    } catch {
      allRequests = [];
    }

    let allQuotations: any[] = [];
    try {
      allQuotations = await db.orm.public.quotations.all();
    } catch {
      allQuotations = [];
    }

    let allBookings: any[] = [];
    try {
      allBookings = await db.orm.public.bookings.all();
    } catch {
      allBookings = [];
    }

    let openInvestigations = 0;
    try {
      const tickets = await db.orm.public.support_tickets
        .where((t) => t.status.in(["OPEN", "UNDER_REVIEW"]))
        .all();
      openInvestigations = tickets.length;
    } catch {
      openInvestigations = 0;
    }

    let latestBookings: any[] = [];
    try {
      latestBookings = await db.orm.public.bookings
        .orderBy((b) => b.created_at.desc())
        .limit(6)
        .all();
    } catch {
      latestBookings = allBookings.slice(0, 6);
    }

    const customerIds = Array.from(new Set(latestBookings.map((b) => b.customer_id).filter(Boolean)));
    let customers: any[] = [];
    try {
      customers = customerIds.length
        ? await db.orm.public.users.where((u) => u.id.in(customerIds as never)).all()
        : [];
    } catch {
      customers = [];
    }

    const requestIds = Array.from(new Set(latestBookings.map((b) => b.service_request_id).filter(Boolean)));
    let requests: any[] = [];
    try {
      requests = requestIds.length
        ? await db.orm.public.service_requests.where((r) => r.id.in(requestIds as never)).all()
        : [];
    } catch {
      requests = [];
    }

    let notifications: any[] = [];
    try {
      notifications = await db.orm.public.notifications
        .orderBy((n) => n.created_at.desc())
        .limit(8)
        .all();
    } catch {
      notifications = [];
    }

    return {
      allUsers,
      providerProfiles,
      allRequests,
      allQuotations,
      allBookings,
      openInvestigations,
      latestBookings,
      customers,
      requests,
      notifications,
    };
  }
}
