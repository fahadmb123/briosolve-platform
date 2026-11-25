import React, { useState, useEffect } from "react";
import type { RequestQuotationItem, CompareQuotationsResponse } from "../../types/quotation.types";
import "./AiQuotationComparisonModal.css";

interface AiQuotationComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequestId: string;
  quotations: RequestQuotationItem[];
  comparisonData: CompareQuotationsResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
  onAcceptQuote: (quote: RequestQuotationItem) => void;
  onChatWithProvider?: (quote: RequestQuotationItem) => void;
  requestTitle?: string;
}

const THINKING_MESSAGES = [
  "Analyzing provider pricing and included items...",
  "Evaluating warranties, extra charge policies, and exclusions...",
  "Checking provider credentials and verified completion records...",
  "Synthesizing recommendations with Gemini AI..."
];

export const AiQuotationComparisonModal: React.FC<AiQuotationComparisonModalProps> = ({
  isOpen,
  onClose,
  quotations,
  comparisonData,
  isLoading,
  onRefresh,
  onAcceptQuote,
  onChatWithProvider,
  requestTitle
}) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isOpen) return null;

  const quoteMap = new Map<string, RequestQuotationItem>();
  for (const q of quotations) {
    quoteMap.set(q.id, q);
  }

  const winnerQuote = comparisonData
    ? quoteMap.get(comparisonData.recommendedWinnerId) || quotations[0]
    : null;

  const winnerRanking = comparisonData?.rankings.find(
    (r) => r.quotationId === comparisonData.recommendedWinnerId
  ) || comparisonData?.rankings[0];

  const runnerUps = comparisonData
    ? comparisonData.rankings.filter((r) => r.quotationId !== winnerRanking?.quotationId)
    : [];

  return (
    <div className="ai-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ai-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <div className="ai-modal-header-left">
            <div className="ai-modal-sparkle-badge">
              <i className="fas fa-wand-magic-sparkles" />
            </div>
            <div>
              <div className="ai-modal-title-row">
                <h3 className="ai-modal-title">AI Quotation Comparison</h3>
                <span className="ai-modal-pill">Gemini AI</span>
              </div>
              <p className="ai-modal-subtitle">
                {requestTitle ? `Analyzing bids for: ${requestTitle}` : `Comparing ${quotations.length} provider bids`}
              </p>
            </div>
          </div>
          <div className="ai-modal-header-right">
            {!isLoading && (
              <button
                type="button"
                className="ai-modal-refresh-btn"
                onClick={onRefresh}
                title="Re-run AI evaluation"
                aria-label="Re-run AI evaluation"
              >
                <i className="fas fa-rotate" />
              </button>
            )}
            <button
              type="button"
              className="ai-modal-close-btn"
              onClick={onClose}
              aria-label="Close comparison"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>

        <div className="ai-modal-body">
          {isLoading ? (
            <div className="ai-modal-loading-state">
              <div className="ai-modal-loading-orb">
                <i className="fas fa-brain ai-pulse-icon" />
              </div>
              <h4 className="ai-loading-title">Gemini AI is Evaluating Bids</h4>
              <p className="ai-loading-subtitle">{THINKING_MESSAGES[msgIndex]}</p>
              <div className="ai-loading-skeletons">
                <div className="ai-sk-card" />
                <div className="ai-sk-card small" />
              </div>
            </div>
          ) : !comparisonData ? (
            <div className="ai-modal-empty-state">
              <i className="fas fa-circle-exclamation ai-empty-icon" />
              <h4>Unable to load AI comparison</h4>
              <p>We could not analyze the quotations at this time. Please try again.</p>
              <button type="button" className="ai-primary-btn" onClick={onRefresh}>
                Evaluate with AI
              </button>
            </div>
          ) : (
            <>
              {comparisonData.aiSummary && (
                <div className="ai-summary-card">
                  <div className="ai-summary-icon-box">
                    <i className="fas fa-lightbulb" />
                  </div>
                  <div className="ai-summary-content">
                    <span className="ai-summary-label">Executive AI Verdict</span>
                    <p className="ai-summary-text">{comparisonData.aiSummary}</p>
                  </div>
                </div>
              )}

              {winnerQuote && winnerRanking && (
                <div className="ai-winner-spotlight-card">
                  <div className="ai-winner-header-ribbon">
                    <div className="ai-winner-badge">
                      <i className="fas fa-crown" />
                      <span>#1 Top Recommended Pick</span>
                    </div>
                    <div className="ai-score-badge">
                      <span>Match Score</span>
                      <strong>{winnerRanking.score}/100</strong>
                    </div>
                  </div>

                  <div className="ai-winner-provider-row">
                    {winnerQuote.provider.profileImage ? (
                      <img
                        src={winnerQuote.provider.profileImage}
                        alt={winnerQuote.provider.businessName}
                        className="ai-winner-avatar"
                      />
                    ) : (
                      <div className="ai-winner-avatar-fallback">
                        {(winnerQuote.provider.businessName || winnerQuote.provider.name || "P").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ai-winner-provider-info">
                      <h4 className="ai-winner-provider-name">
                        {winnerQuote.provider.businessName || winnerQuote.provider.name}
                      </h4>
                      <div className="ai-winner-provider-meta">
                        {winnerQuote.provider.experience && (
                          <span>
                            <i className="fas fa-briefcase" /> {winnerQuote.provider.experience}
                          </span>
                        )}
                        <span>
                          <i className="fas fa-check-double" /> {winnerQuote.provider.completedJobs} jobs done
                        </span>
                      </div>
                    </div>
                    <div className="ai-winner-price-box">
                      <span className="ai-winner-amount">₹{Number(winnerQuote.amount).toLocaleString("en-IN")}</span>
                      <span className="ai-winner-type">{winnerQuote.quotationType}</span>
                    </div>
                  </div>

                  <p className="ai-winner-description">{winnerQuote.workDescription}</p>

                  <div className="ai-pro-con-grid">
                    {winnerRanking.pros && winnerRanking.pros.length > 0 && (
                      <div className="ai-pro-column">
                        <span className="ai-column-title pro">
                          <i className="fas fa-circle-check" /> Why this bid wins
                        </span>
                        <ul className="ai-points-list">
                          {winnerRanking.pros.map((pro, i) => (
                            <li key={i}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {winnerRanking.cons && winnerRanking.cons.length > 0 && (
                      <div className="ai-con-column">
                        <span className="ai-column-title con">
                          <i className="fas fa-circle-exclamation" /> Keep in mind
                        </span>
                        <ul className="ai-points-list">
                          {winnerRanking.cons.map((con, i) => (
                            <li key={i}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {winnerRanking.verdict && (
                    <div className="ai-winner-verdict-box">
                      <i className="fas fa-quote-left" />
                      <span>{winnerRanking.verdict}</span>
                    </div>
                  )}

                  <div className="ai-winner-actions">
                    <button
                      type="button"
                      className="ai-accept-winner-btn"
                      onClick={() => {
                        onClose();
                        onAcceptQuote(winnerQuote);
                      }}
                    >
                      <i className="fas fa-shield-halved" />
                      <span>Accept This Quotation (₹{Number(winnerQuote.amount).toLocaleString("en-IN")})</span>
                    </button>
                    {onChatWithProvider && (
                      <button
                        type="button"
                        className="ai-chat-winner-btn"
                        onClick={() => {
                          onClose();
                          onChatWithProvider(winnerQuote);
                        }}
                      >
                        <i className="far fa-comment-dots" />
                        <span>Chat</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {runnerUps.length > 0 && (
                <div className="ai-runnerups-section">
                  <h4 className="ai-runnerups-heading">Other Evaluated Proposals</h4>
                  <div className="ai-runnerups-list">
                    {runnerUps.map((runner) => {
                      const quoteItem = quoteMap.get(runner.quotationId);
                      return (
                        <div key={runner.quotationId} className="ai-runnerup-card">
                          <div className="ai-runnerup-top">
                            <div className="ai-runnerup-rank">
                              <span className="ai-runnerup-rank-badge">#{runner.rank}</span>
                              <div>
                                <span className="ai-runnerup-name">
                                  {runner.providerName || quoteItem?.provider.businessName || "Provider"}
                                </span>
                                {quoteItem && (
                                  <span className="ai-runnerup-submeta">
                                    ₹{Number(quoteItem.amount).toLocaleString("en-IN")} • {quoteItem.quotationType}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="ai-runnerup-score-badge">Score: {runner.score}/100</span>
                          </div>

                          <p className="ai-runnerup-verdict">{runner.verdict}</p>

                          {quoteItem && (
                            <div className="ai-runnerup-actions">
                              <button
                                type="button"
                                className="ai-runnerup-select-btn"
                                onClick={() => {
                                  onClose();
                                  onAcceptQuote(quoteItem);
                                }}
                              >
                                Accept Quote
                              </button>
                              {onChatWithProvider && (
                                <button
                                  type="button"
                                  className="ai-runnerup-chat-btn"
                                  onClick={() => {
                                    onClose();
                                    onChatWithProvider(quoteItem);
                                  }}
                                >
                                  Chat
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="ai-modal-footer">
          <span className="ai-footer-note">
            <i className="fas fa-sparkles" /> AI recommendations are objective assessments based on pricing, verified jobs, and detailed inclusions.
          </span>
          <button type="button" className="ai-footer-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
