import { QuotationComparisonBidPayload } from "./quotation-comparison.types";

export function buildQuotationComparisonUserPrompt(
    bids: QuotationComparisonBidPayload[],
    topN: number
): string {
    return `Compare these ${bids.length} provider quotations and provide recommendations for the top ${topN}:

${JSON.stringify(bids, null, 2)}`;
}
