import { db } from "../../../../shared/database/client";
import { Review } from "../../domain/entities/review.entity";
import {
  IReviewRepository,
  CreateReviewRepoParams,
  GetProviderReviewsParams,
  ProviderReviewsResult,
  GetCustomerReviewsParams,
  CustomerReviewsResult,
  GetAdminReviewsParams,
  AdminReviewsResult,
  ReviewBookingEligibility
} from "../../domain/repositories/IReview.repository";
import { ReviewMapper } from "../mappers/review.mapper";
import { ReviewRatingService } from "../../application/services/review-rating.service";

export class PrismaReviewRepository implements IReviewRepository {
  async findBookingEligibility(bookingId: string): Promise<ReviewBookingEligibility | null> {
    try {
      const record = await db.orm.public.bookings
        .where({ id: bookingId as never })
        .first();

      if (!record) return null;

      let serviceTitle: string | null = null;
      if (record.service_request_id) {
        const sr = await db.orm.public.service_requests
          .where({ id: record.service_request_id as never })
          .first();
        if (sr && (sr as any).title) {
          serviceTitle = (sr as any).title;
        }
      }

      return {
        id: record.id,
        customerId: record.customer_id,
        providerId: record.provider_id,
        status: record.status,
        bookingNumber: record.booking_number,
        serviceTitle
      };
    } catch {
      return null;
    }
  }

  async createReview(params: CreateReviewRepoParams): Promise<Review> {
    const data = ReviewMapper.toPersistence(params);
    const created = await db.orm.public.reviews.create(data as never);
    const populated = await this.populateExtras([created]);
    return populated[0] || ReviewMapper.toDomain(created);
  }

  async findById(id: string): Promise<Review | null> {
    try {
      const record = await db.orm.public.reviews
        .where({ id: id as never })
        .first();

      if (!record) return null;
      const populated = await this.populateExtras([record]);
      return populated[0] || ReviewMapper.toDomain(record);
    } catch {
      return null;
    }
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    try {
      const record = await db.orm.public.reviews
        .where({ booking_id: bookingId as never })
        .first();

      if (!record) return null;
      const populated = await this.populateExtras([record]);
      return populated[0] || ReviewMapper.toDomain(record);
    } catch {
      return null;
    }
  }

  async findProviderReviews(params: GetProviderReviewsParams): Promise<ProviderReviewsResult> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    let query = db.orm.public.reviews.where({ provider_id: params.providerId as never });

    if (!params.includeHidden) {
      query = query.where({ is_hidden: false });
    }

    if (params.rating) {
      query = query.where({ rating: params.rating });
    }

    const allProviderReviews = await db.orm.public.reviews
      .where({ provider_id: params.providerId as never, is_hidden: false })
      .all();

    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of allProviderReviews) {
      const star = r.rating;
      if (star >= 1 && star <= 5) {
        ratingCounts[star] = (ratingCounts[star] || 0) + 1;
      }
    }

    const averageRating = ReviewRatingService.calculateAverageRating(ratingCounts);

    const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
    const totalCount = Number(totalResult?.total || 0);
    const records = await query
      .orderBy((r) => r.created_at.desc())
      .offset(skip)
      .limit(limit)
      .all();

    const populated = await this.populateExtras(records);

    return {
      reviews: populated,
      total: totalCount,
      averageRating,
      ratingCounts
    };
  }

  async findCustomerReviews(params: GetCustomerReviewsParams): Promise<CustomerReviewsResult> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const query = db.orm.public.reviews.where({ customer_id: params.customerId as never });
    const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
    const totalCount = Number(totalResult?.total || 0);

    const records = await query
      .orderBy((r) => r.created_at.desc())
      .offset(skip)
      .limit(limit)
      .all();

    const populated = await this.populateExtras(records);

    return {
      reviews: populated,
      total: totalCount
    };
  }

  async findAdminReviews(params: GetAdminReviewsParams): Promise<AdminReviewsResult> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    let query = db.orm.public.reviews;

    if (params.isReported !== undefined) {
      query = query.where({ is_reported: params.isReported }) as never;
    }

    if (params.isHidden !== undefined) {
      query = query.where({ is_hidden: params.isHidden }) as never;
    }

    if (params.rating) {
      query = query.where({ rating: params.rating }) as never;
    }

    const reportedResult = await db.orm.public.reviews.where({ is_reported: true }).aggregate((agg) => ({ total: agg.count() }));
    const reportedCount = Number(reportedResult?.total || 0);
    const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
    const totalCount = Number(totalResult?.total || 0);

    const records = await query
      .orderBy((r) => r.created_at.desc())
      .offset(skip)
      .limit(limit)
      .all();

    let populated = await this.populateExtras(records);

    if (params.search && params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      populated = populated.filter((rev) => {
        return (
          (rev.title && rev.title.toLowerCase().includes(term)) ||
          rev.comment.toLowerCase().includes(term) ||
          (rev.customerName && rev.customerName.toLowerCase().includes(term)) ||
          (rev.providerName && rev.providerName.toLowerCase().includes(term)) ||
          (rev.providerBusinessName && rev.providerBusinessName.toLowerCase().includes(term)) ||
          (rev.bookingNumber && rev.bookingNumber.toLowerCase().includes(term))
        );
      });
    }

    return {
      reviews: populated,
      total: totalCount,
      reportedCount
    };
  }

  async replyToReview(reviewId: string, replyText: string): Promise<Review | null> {
    try {
      const updated = await db.orm.public.reviews
        .where({ id: reviewId as never })
        .update({
          provider_reply: replyText as never,
          provider_replied_at: new Date()
        });

      if (!updated) return null;
      const populated = await this.populateExtras([updated]);
      return populated[0] || ReviewMapper.toDomain(updated);
    } catch {
      return null;
    }
  }

  async updateModeration(reviewId: string, data: { isHidden?: boolean; isReported?: boolean }): Promise<Review | null> {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.isHidden !== undefined) {
        updateData.is_hidden = data.isHidden;
      }
      if (data.isReported !== undefined) {
        updateData.is_reported = data.isReported;
      }

      const updated = await db.orm.public.reviews
        .where({ id: reviewId as never })
        .update(updateData as never);

      if (!updated) return null;
      const populated = await this.populateExtras([updated]);
      return populated[0] || ReviewMapper.toDomain(updated);
    } catch {
      return null;
    }
  }

  async getProviderRatingSummary(providerId: string): Promise<{ averageRating: number; totalReviews: number; ratingCounts: Record<number, number> }> {
    const records = await db.orm.public.reviews
      .where({ provider_id: providerId as never, is_hidden: false })
      .all();

    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of records) {
      const star = r.rating;
      if (star >= 1 && star <= 5) {
        ratingCounts[star] = (ratingCounts[star] || 0) + 1;
      }
    }

    const averageRating = ReviewRatingService.calculateAverageRating(ratingCounts);
    return {
      averageRating,
      totalReviews: records.length,
      ratingCounts
    };
  }

  private async populateExtras(records: any[]): Promise<Review[]> {
    if (!records || records.length === 0) return [];

    const customerIds = Array.from(new Set(records.map((r) => r.customer_id).filter(Boolean)));
    const providerIds = Array.from(new Set(records.map((r) => r.provider_id).filter(Boolean)));
    const bookingIds = Array.from(new Set(records.map((r) => r.booking_id).filter(Boolean)));

    const customerMap = new Map<string, { name: string; avatar: string | null }>();
    const providerMap = new Map<string, { name: string; businessName: string | null }>();
    const bookingMap = new Map<string, { bookingNumber: string; serviceTitle: string | null }>();

    await Promise.all([
      this.populateCustomers(customerIds, customerMap),
      this.populateProviders(providerIds, providerMap),
      this.populateBookings(bookingIds, bookingMap)
    ]);

    return records.map((r) => {
      const c = customerMap.get(r.customer_id);
      const p = providerMap.get(r.provider_id);
      const b = bookingMap.get(r.booking_id);

      return ReviewMapper.toDomain(r, {
        customerName: c?.name || "Customer",
        customerAvatar: c?.avatar || null,
        providerName: p?.name || "Provider",
        providerBusinessName: p?.businessName || null,
        bookingNumber: b?.bookingNumber || null,
        serviceTitle: b?.serviceTitle || null
      });
    });
  }

  private async populateCustomers(customerIds: string[], map: Map<string, { name: string; avatar: string | null }>): Promise<void> {
    if (customerIds.length === 0) return;
    try {
      const users = await db.orm.public.users.all();
      for (const u of users) {
        if (customerIds.includes(u.id)) {
          map.set(u.id, {
            name: (u as any).name || (u as any).email || "Customer",
            avatar: (u as any).avatar_url || (u as any).avatar || null
          });
        }
      }
    } catch {}
  }

  private async populateProviders(providerIds: string[], map: Map<string, { name: string; businessName: string | null }>): Promise<void> {
    if (providerIds.length === 0) return;
    try {
      const profiles = await db.orm.public.provider_profiles.all();
      for (const p of profiles) {
        if (providerIds.includes(p.id)) {
          let name = "Provider";
          if (p.user_id) {
            try {
              const u = await db.orm.public.users.where({ id: p.user_id as never }).first();
              if (u) name = (u as any).name || (u as any).email || "Provider";
            } catch {}
          }
          map.set(p.id, {
            name,
            businessName: (p as any).business_name || null
          });
        }
      }
    } catch {}
  }

  private async populateBookings(bookingIds: string[], map: Map<string, { bookingNumber: string; serviceTitle: string | null }>): Promise<void> {
    if (bookingIds.length === 0) return;
    try {
      const allBookings = await db.orm.public.bookings.all();
      for (const b of allBookings) {
        if (bookingIds.includes(b.id)) {
          let serviceTitle: string | null = null;
          if (b.service_request_id) {
            try {
              const sr = await db.orm.public.service_requests.where({ id: b.service_request_id as never }).first();
              if (sr) serviceTitle = (sr as any).title || null;
            } catch {}
          }
          map.set(b.id, {
            bookingNumber: b.booking_number,
            serviceTitle
          });
        }
      }
    } catch {}
  }
}
