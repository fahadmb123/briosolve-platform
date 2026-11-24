import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateReviewRequestDto } from "../../application/dtos/request/create-review.request.dto";
import { GetProviderReviewsRequestDto } from "../../application/dtos/request/get-provider-reviews.request.dto";
import { GetCustomerReviewsRequestDto } from "../../application/dtos/request/get-customer-reviews.request.dto";
import { ReplyReviewRequestDto } from "../../application/dtos/request/reply-review.request.dto";
import { GetAdminReviewsRequestDto } from "../../application/dtos/request/get-admin-reviews.request.dto";
import { ModerateReviewRequestDto } from "../../application/dtos/request/moderate-review.request.dto";
import { ReviewResponseDto } from "../../application/dtos/response/review-response.dto";
import { ProviderReviewsSummaryResponseDto } from "../../application/dtos/response/provider-reviews-summary-response.dto";
import { CustomerReviewsResponseDto } from "../../application/dtos/response/customer-reviews-response.dto";
import { AdminReviewsResponseDto } from "../../application/dtos/response/admin-reviews-response.dto";

export class ReviewController extends BaseController {
  constructor(
    private readonly _createReviewUseCase: IUseCase<CreateReviewRequestDto, ReviewResponseDto>,
    private readonly _getProviderReviewsUseCase: IUseCase<GetProviderReviewsRequestDto, ProviderReviewsSummaryResponseDto>,
    private readonly _getCustomerReviewsUseCase: IUseCase<GetCustomerReviewsRequestDto, CustomerReviewsResponseDto>,
    private readonly _replyToReviewUseCase: IUseCase<ReplyReviewRequestDto, ReviewResponseDto>,
    private readonly _getAdminReviewsUseCase: IUseCase<GetAdminReviewsRequestDto, AdminReviewsResponseDto>,
    private readonly _moderateReviewUseCase: IUseCase<ModerateReviewRequestDto, ReviewResponseDto>,
    private readonly _getBookingReviewUseCase: IUseCase<{ bookingId: string }, ReviewResponseDto | null>
  ) {
    super();
  }

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user?.userId;
      const { bookingId, rating, title, comment, aspectRatings } = req.body;

      const response = await this._createReviewUseCase.execute({
        customerId: customerId!,
        bookingId,
        rating: Number(rating),
        title,
        comment,
        aspectRatings
      });

      return this.sendSuccess(res, "Review submitted successfully", response, 201);
    } catch (error) {
      next(error);
    }
  };

  getProviderReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const providerId = String(req.params.providerId);
      const rating = req.query.rating ? Number(req.query.rating) : undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await this._getProviderReviewsUseCase.execute({
        providerId,
        rating,
        page,
        limit
      });

      return this.sendSuccess(res, "Provider reviews retrieved successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };

  getMyReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user?.userId;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await this._getCustomerReviewsUseCase.execute({
        customerId: customerId!,
        page,
        limit
      });

      return this.sendSuccess(res, "Customer reviews retrieved successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };

  replyToReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = String(req.params.id);
      const providerId = req.user?.userId;
      const { replyText } = req.body;

      const response = await this._replyToReviewUseCase.execute({
        reviewId,
        providerId: providerId!,
        replyText
      });

      return this.sendSuccess(res, "Reply posted successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };

  getAdminReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search ? String(req.query.search) : undefined;
      const rating = req.query.rating ? Number(req.query.rating) : undefined;
      const isReported = req.query.isReported !== undefined ? req.query.isReported === "true" : undefined;
      const isHidden = req.query.isHidden !== undefined ? req.query.isHidden === "true" : undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      const response = await this._getAdminReviewsUseCase.execute({
        search,
        rating,
        isReported,
        isHidden,
        page,
        limit
      });

      return this.sendSuccess(res, "Admin reviews retrieved successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };

  moderateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = String(req.params.id);
      const { isHidden, isReported } = req.body;

      const response = await this._moderateReviewUseCase.execute({
        reviewId,
        isHidden,
        isReported
      });

      return this.sendSuccess(res, "Review moderation updated successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };

  reportReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = String(req.params.id);

      const response = await this._moderateReviewUseCase.execute({
        reviewId,
        isReported: true
      });

      return this.sendSuccess(res, "Review reported successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };

  getBookingReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = String(req.params.bookingId);
      const response = await this._getBookingReviewUseCase.execute({ bookingId });
      return this.sendSuccess(res, "Booking review retrieved successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };
}
