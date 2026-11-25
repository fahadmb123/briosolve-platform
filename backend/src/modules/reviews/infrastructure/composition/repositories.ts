import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { PrismaReviewRepository } from "../repositories/prismaReview.repository";

export function createReviewRepository(): IReviewRepository {
  return new PrismaReviewRepository();
}
