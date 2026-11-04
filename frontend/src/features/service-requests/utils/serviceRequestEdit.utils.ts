import type { CustomerServiceRequestItem } from "../types/serviceRequest.types";

export interface RequestEditPermission {
  canEdit: boolean;
  isRestricted: boolean;
  statusLabel: string;
  badgeText?: string;
  reason?: string;
}

export function checkRequestEditPermission(request: CustomerServiceRequestItem): RequestEditPermission {
  const status = request.status;
  const quotesCount = request.quotations_count ?? 0;

  if (status === "DRAFT") {
    return {
      canEdit: true,
      isRestricted: false,
      statusLabel: "Draft"
    };
  }

  if (status === "PENDING" || status === "ACTIVE") {
    if (quotesCount === 0) {
      return {
        canEdit: true,
        isRestricted: false,
        statusLabel: "Open (No quotations)"
      };
    }
    return {
      canEdit: true,
      isRestricted: true,
      statusLabel: "Open (Quotations received)",
      badgeText: "Editable with restrictions",
      reason: "Providers have already submitted price quotes for this job. Category, subservice, and service address are locked to protect quotation estimates. You may update description, timing, budget amount, and photos."
    };
  }

  if (status === "ACCEPTED") {
    return {
      canEdit: false,
      isRestricted: false,
      statusLabel: "Quotation Accepted",
      reason: "Editing is not allowed once a quotation has been accepted."
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      canEdit: false,
      isRestricted: false,
      statusLabel: "In Progress",
      reason: "Editing is not allowed while work is in progress."
    };
  }

  if (status === "COMPLETED") {
    return {
      canEdit: false,
      isRestricted: false,
      statusLabel: "Completed",
      reason: "Editing is not allowed for completed requests."
    };
  }

  if (status === "CANCELLED") {
    return {
      canEdit: false,
      isRestricted: false,
      statusLabel: "Cancelled",
      reason: "Editing is not allowed for cancelled requests."
    };
  }

  return {
    canEdit: false,
    isRestricted: false,
    statusLabel: status,
    reason: `Editing is not permitted for requests in ${status} status.`
  };
}

