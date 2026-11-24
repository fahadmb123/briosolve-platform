import { RatingBreakdownItemDto } from "../dtos/response/provider-reviews-summary-response.dto";

export class ReviewRatingService {
  public static calculateAverageRating(counts: Record<number, number>): number {
    let totalScore = 0;
    let totalVotes = 0;

    for (let star = 1; star <= 5; star++) {
      const count = counts[star] || 0;
      totalScore += star * count;
      totalVotes += count;
    }

    if (totalVotes === 0) return 0;
    return Math.round((totalScore / totalVotes) * 10) / 10;
  }

  public static buildBreakdown(counts: Record<number, number>, total: number): RatingBreakdownItemDto[] {
    const items: RatingBreakdownItemDto[] = [];

    for (let star = 5; star >= 1; star--) {
      const count = counts[star] || 0;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      items.push({
        stars: star,
        count,
        percentage
      });
    }

    return items;
  }

  public static toIsoDateString(val: unknown): string {
    if (!val) return new Date().toISOString();
    if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
      return new Date(Number((val as { epochMilliseconds: number }).epochMilliseconds)).toISOString();
    }
    if (val instanceof Date) return val.toISOString();
    try {
      return new Date(val as string | number).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
}
