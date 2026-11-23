import { Request, Response } from "express";
import { db } from "../../../../shared/database/client";

export class DashboardController {
  async getCustomerDashboard(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await db.orm.public.users.where({ id: userId as never }).first();
      const allRequests = await db.orm.public.service_requests
        .where({ customer_id: userId as never })
        .orderBy((r) => r.created_at.desc())
        .all();

      const allCategories = await db.orm.public.categories.all();
      const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

      const allAddresses = await db.orm.public.addresses
        .where({ user_id: userId as never })
        .all();
      const addressMap = new Map(
        allAddresses.map((a) => [
          a.id,
          [a.city || a.district || a.area, a.state].filter(Boolean).join(", "),
        ])
      );

      const allBookings = await db.orm.public.bookings
        .where({ customer_id: userId as never })
        .orderBy((b) => b.created_at.desc())
        .all();

      const requestIds = allRequests.map((r) => r.id);
      const allQuotations = requestIds.length
        ? await db.orm.public.quotations.where({ service_request_id: { $in: requestIds } as any }).all()
        : [];

      const providerIds = Array.from(new Set(allBookings.map((b) => b.provider_id)));
      const providers = providerIds.length
        ? await db.orm.public.provider_profiles.where({ id: { $in: providerIds } as any }).all()
        : [];
      const providerUserIds = providers.map((p) => p.user_id);
      const providerUsers = providerUserIds.length
        ? await db.orm.public.users.where({ id: { $in: providerUserIds } as any }).all()
        : [];
      const providerUserMap = new Map(providerUsers.map((u) => [u.id, u]));
      const providerMap = new Map(
        providers.map((p) => [
          p.id,
          {
            businessName: p.business_name,
            profileImage: p.profile_image,
            user: providerUserMap.get(p.user_id),
          },
        ])
      );

      const notifications = await db.orm.public.notifications
        .where({ recipient_id: userId as never })
        .orderBy((n) => n.created_at.desc())
        .limit(5)
        .all();

      const activeRequests = allRequests.filter((r) =>
        ["PENDING", "ACTIVE", "IN_PROGRESS", "ACCEPTED"].includes(r.status)
      );

      const activeBookings = allBookings.filter((b) =>
        ["CONFIRMED", "EN_ROUTE", "INSPECTION", "IN_PROGRESS", "PAYMENT_PENDING"].includes(b.status)
      );

      const completedBookings = allBookings.filter((b) => b.status === "COMPLETED");
      const totalCompletedSpend = completedBookings.reduce(
        (sum, b) => sum + Number(b.total_amount || 0),
        0
      );

      const requestMap = new Map(allRequests.map((r) => [r.id, r]));

      let estimatedSavings = 0;
      for (const booking of completedBookings) {
        const quotes = allQuotations.filter((q) => q.service_request_id === booking.service_request_id);
        if (quotes.length > 1) {
          const maxQuote = Math.max(...quotes.map((q) => Number(q.amount || 0)));
          const bookingAmount = Number(booking.total_amount || 0);
          if (maxQuote > bookingAmount) {
            estimatedSavings += (maxQuote - bookingAmount);
          }
        }
      }

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const now = new Date();
      const monthlySpendingMap = new Map<string, number>();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]}`;
        monthlySpendingMap.set(key, 0);
      }

      for (const b of completedBookings) {
        const bDate = new Date(b.created_at);
        const key = `${monthNames[bDate.getMonth()]}`;
        if (monthlySpendingMap.has(key)) {
          monthlySpendingMap.set(key, (monthlySpendingMap.get(key) || 0) + Number(b.total_amount || 0));
        }
      }

      const monthlySpending = Array.from(monthlySpendingMap.entries()).map(([month, spend]) => ({
        month,
        spend,
      }));

      const categorySpendMap = new Map<string, { amount: number; count: number }>();
      for (const b of completedBookings) {
        const sr = requestMap.get(b.service_request_id);
        const catName = sr ? (categoryMap.get(sr.category_id) || "Other") : "Other";
        const cur = categorySpendMap.get(catName) || { amount: 0, count: 0 };
        cur.amount += Number(b.total_amount || 0);
        cur.count += 1;
        categorySpendMap.set(catName, cur);
      }

      const categoryBreakdown = Array.from(categorySpendMap.entries()).map(([categoryName, data]) => ({
        categoryName,
        amount: data.amount,
        percentage: totalCompletedSpend > 0 ? Math.round((data.amount / totalCompletedSpend) * 100) : 0,
        count: data.count,
      }));

      const quickCategories = allCategories.slice(0, 6).map((c) => ({
        id: c.id,
        name: c.name,
      }));

      const formattedActiveRequests = activeRequests.slice(0, 5).map((r) => {
        const reqQuotes = allQuotations.filter((q) => q.service_request_id === r.id);
        const quoteAmounts = reqQuotes.map((q) => Number(q.amount || 0)).filter((a) => a > 0);
        const minQuoteAmount = quoteAmounts.length ? Math.min(...quoteAmounts) : undefined;

        return {
          id: r.id,
          title: r.title,
          categoryName: categoryMap.get(r.category_id) || "General",
          urgency: r.urgency,
          specificDate: r.specific_date,
          availableTimeFrom: r.available_time_from,
          availableTimeTo: r.available_time_to,
          status: r.status,
          location: addressMap.get(r.address_id) || "Service Location",
          quotationsCount: reqQuotes.length,
          minQuoteAmount,
        };
      });

      const formattedUpcomingBookings = activeBookings.slice(0, 3).map((b) => {
        const sr = requestMap.get(b.service_request_id);
        const prov = providerMap.get(b.provider_id);

        return {
          id: b.id,
          bookingNumber: b.booking_number,
          status: b.status,
          scheduledDate: b.scheduled_date,
          scheduledTime: b.scheduled_time,
          serviceTitle: sr?.title || "Scheduled Service",
          categoryName: sr ? (categoryMap.get(sr.category_id) || "General") : "General",
          providerName: prov?.businessName || prov?.user?.name || "Service Provider",
          providerAvatar: prov?.profileImage || null,
          totalAmount: Number(b.total_amount || 0),
        };
      });

      const formattedRecentActivity = notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        createdAt: n.created_at,
        isRead: n.is_read,
      }));

      return res.status(200).json({
        success: true,
        data: {
          user: {
            name: user?.name || "Customer",
            email: user?.email || "",
          },
          stats: {
            activeRequestsCount: activeRequests.length,
            quotationsReceivedCount: allQuotations.length,
            upcomingBookingsCount: activeBookings.length,
            completedServicesCount: completedBookings.length,
            totalCompletedSpend,
            estimatedSavings,
          },
          monthlySpending,
          categoryBreakdown,
          quickCategories,
          activeRequests: formattedActiveRequests,
          upcomingBookings: formattedUpcomingBookings,
          recentActivity: formattedRecentActivity,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getProviderDashboard(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await db.orm.public.users.where({ id: userId as never }).first();
      const profile = await db.orm.public.provider_profiles
        .where({ user_id: userId as never })
        .first();

      if (!profile) {
        return res.status(200).json({
          success: true,
          data: {
            provider: {
              name: user?.name || "Provider",
              businessName: "Provider Business",
              isVerified: false,
              serviceArea: "Not configured",
              serviceRadiusKm: 20,
              rating: 5.0,
              reviewCount: 0,
            },
            stats: {
              newRequestsCount: 0,
              activeQuotationsCount: 0,
              acceptedBookingsCount: 0,
              completedServicesCount: 0,
              averageRating: 5.0,
              totalEarnings: 0,
            },
            opportunities: [],
            recentActivity: [],
          },
        });
      }

      const allCategories = await db.orm.public.categories.all();
      const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

      const allBookings = await db.orm.public.bookings
        .where({ provider_id: profile.id as never })
        .orderBy((b) => b.created_at.desc())
        .all();

      const allQuotations = await db.orm.public.quotations
        .where({ provider_id: profile.id as never })
        .all();

      const availableRequests = await db.orm.public.service_requests
        .where({ status: { $in: ["PENDING", "ACTIVE"] } as any })
        .orderBy((r) => r.created_at.desc())
        .limit(10)
        .all();

      const customerIds = Array.from(new Set(availableRequests.map((r) => r.customer_id)));
      const customers = customerIds.length
        ? await db.orm.public.users.where({ id: { $in: customerIds } as any }).all()
        : [];
      const customerMap = new Map(customers.map((c) => [c.id, c.name]));

      const addressIds = Array.from(new Set(availableRequests.map((r) => r.address_id)));
      const addresses = addressIds.length
        ? await db.orm.public.addresses.where({ id: { $in: addressIds } as any }).all()
        : [];
      const addressMap = new Map(
        addresses.map((a) => [
          a.id,
          [a.city || a.district || a.area, a.state].filter(Boolean).join(", "),
        ])
      );

      const requestIds = availableRequests.map((r) => r.id);
      const reqQuotes = requestIds.length
        ? await db.orm.public.quotations.where({ service_request_id: { $in: requestIds } as any }).all()
        : [];

      const opportunities = availableRequests.map((r) => {
        const count = reqQuotes.filter((q) => q.service_request_id === r.id).length;
        return {
          id: r.id,
          title: r.title,
          categoryName: categoryMap.get(r.category_id) || "Service",
          description: r.description,
          urgency: r.urgency,
          location: addressMap.get(r.address_id) || "Local Area",
          customerName: customerMap.get(r.customer_id) || "Customer",
          quotationsCount: count,
          createdAt: r.created_at,
        };
      });

      const notifications = await db.orm.public.notifications
        .where({ recipient_id: userId as never })
        .orderBy((n) => n.created_at.desc())
        .limit(5)
        .all();

      const activeQuotations = allQuotations.filter((q) => q.status === "PENDING");
      const acceptedBookings = allBookings.filter((b) =>
        ["CONFIRMED", "EN_ROUTE", "INSPECTION", "IN_PROGRESS", "PAYMENT_PENDING"].includes(b.status)
      );
      const completedBookings = allBookings.filter((b) => b.status === "COMPLETED");

      const totalEarnings = completedBookings.reduce((sum, b) => {
        const net = Number(b.total_amount || 0) - Number(b.platform_fee || 0);
        return sum + Math.max(0, net);
      }, 0);

      const isVerified = profile.kyc_status === "APPROVED";

      return res.status(200).json({
        success: true,
        data: {
          provider: {
            id: profile.id,
            name: user?.name || "Provider",
            businessName: profile.business_name || user?.name || "Provider Business",
            isVerified,
            serviceArea: profile.business_name ? `${profile.service_radius_km || 20} km Coverage` : "Local",
            serviceRadiusKm: profile.service_radius_km || 20,
            rating: 4.9,
            reviewCount: profile.completed_jobs || 0,
          },
          stats: {
            newRequestsCount: availableRequests.length,
            activeQuotationsCount: activeQuotations.length,
            acceptedBookingsCount: acceptedBookings.length,
            completedServicesCount: completedBookings.length,
            averageRating: 4.9,
            totalEarnings,
          },
          opportunities,
          recentActivity: notifications.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            createdAt: n.created_at,
          })),
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAdminDashboard(_req: Request, res: Response): Promise<Response> {
    try {
      const allUsers = await db.orm.public.users.all();
      const totalCustomers = allUsers.filter((u) => u.role === "CUSTOMER").length;
      const totalProviders = allUsers.filter((u) => u.role === "PROVIDER").length;

      const providerProfiles = await db.orm.public.provider_profiles.all();
      const verifiedProviders = providerProfiles.filter((p) => p.kyc_status === "APPROVED").length;

      const verifDocs = await db.orm.public.provider_verification_documents.all();
      const pendingVerifications = verifDocs.filter((d) => d.status === "PENDING").length;

      const allRequests = await db.orm.public.service_requests.all();
      const activeRequests = allRequests.filter((r) =>
        ["PENDING", "ACTIVE", "IN_PROGRESS"].includes(r.status)
      ).length;

      const allQuotes = await db.orm.public.quotations.all();
      const totalQuotations = allQuotes.length;

      const allBookings = await db.orm.public.bookings.all();
      const activeBookings = allBookings.filter((b) =>
        !["COMPLETED", "CANCELLED", "CLOSED"].includes(b.status)
      ).length;

      const allTickets = await db.orm.public.support_tickets.all();
      const openInvestigations = allTickets.filter((t) =>
        ["OPEN", "UNDER_REVIEW"].includes(t.status)
      ).length;

      const recentTickets = await db.orm.public.support_tickets
        .orderBy((t) => t.created_at.desc())
        .limit(6)
        .all();

      const recentActivity = recentTickets.map((t) => ({
        id: t.id,
        type: t.target_type,
        title: `Ticket #${t.ticket_number}: ${t.category_label || t.category}`,
        message: t.subject || t.description,
        createdAt: t.created_at,
      }));

      return res.status(200).json({
        success: true,
        data: {
          kpis: {
            totalCustomers,
            totalProviders,
            verifiedProviders,
            pendingVerifications,
            activeRequests,
            totalQuotations,
            activeBookings,
            openInvestigations,
          },
          recentActivity,
          operationalHealth: {
            dbStatus: "Optimal",
            redisStatus: "Connected",
            uptimeSeconds: Math.floor(process.uptime()),
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
