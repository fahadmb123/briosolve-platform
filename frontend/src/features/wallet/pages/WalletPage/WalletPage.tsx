import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetMyWallet } from "../../hooks/useWallet";
import type { WalletTransactionItem } from "../../types/wallet.types";
import "./WalletPage.css";

interface WalletPageProps {
  role?: "customer" | "provider";
}

export const WalletPage: React.FC<WalletPageProps> = ({ role: roleProp }) => {
  const location = useLocation();
  const role = roleProp || (location.pathname.startsWith("/provider") ? "provider" : "customer");
  const isProvider = role === "provider";

  const { data: responseData, isLoading, error, refetch } = useGetMyWallet(100, 0);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const wallet = responseData?.data;
  const transactions: WalletTransactionItem[] = wallet?.transactions || [];
  const balance = Number(wallet?.balance || 0);

  const stats = useMemo(() => {
    let totalRefunded = 0;
    let totalEarnings = 0;
    let totalSpent = 0;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      if (tx.category === "REFUND") {
        totalRefunded += amt;
      } else if (tx.category === "EARNINGS") {
        totalEarnings += amt;
      }

      if (tx.type === "DEBIT") {
        totalSpent += amt;
      }
    });

    return {
      totalRefunded,
      totalEarnings,
      totalSpent,
      count: transactions.length
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (isProvider) {
        if (activeTab === "EARNINGS" && tx.category !== "EARNINGS") return false;
        if (activeTab === "DEDUCTIONS" && tx.type !== "DEBIT") return false;
      } else {
        if (activeTab === "REFUND" && tx.category !== "REFUND") return false;
        if (activeTab === "PAYMENT" && tx.type !== "DEBIT") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const desc = (tx.description || "").toLowerCase();
        const ref = (tx.referenceId || "").toLowerCase();
        return desc.includes(q) || ref.includes(q);
      }

      return true;
    });
  }, [transactions, activeTab, searchQuery, isProvider]);

  return (
    <div className="wpage-container">
      <div className="wpage-hero-section">
        <div className="wpage-hero-content">
          <div className="wpage-breadcrumb">
            <Link to={isProvider ? "/provider/dashboard" : "/dashboard"}>
              {isProvider ? "Provider" : "Dashboard"}
            </Link>
            <span className="sep">/</span>
            <span>{isProvider ? "Finances" : "More"}</span>
            <span className="sep">/</span>
            <span>Wallet</span>
            <span className="sep">•</span>
            <span className={`wpage-role-badge ${isProvider ? "provider" : "customer"}`}>
              {isProvider ? "Provider Earnings" : "Customer Escrow"}
            </span>
          </div>
          <h1 className="wpage-hero-title">
            {isProvider ? "Wallet & Earnings" : "My Wallet"}
          </h1>
          <p className="wpage-hero-subtitle">
            {isProvider
              ? "Track your completed service earnings, payouts, and available balance."
              : "Securely hold and manage your refunds, advance deposits, and service balances."}
          </p>
        </div>
        <button className="wpage-refresh-btn" onClick={() => refetch()} title="Refresh Balance">
          Refresh
        </button>
      </div>

      <div className="wpage-overview-grid">
        <div className="wpage-card balance-card">
          <div className="wpage-balance-top">
            <span className="wpage-label">Available Balance</span>
            <span className="wpage-escrow-pill">Escrow Protected</span>
          </div>
          <div className="wpage-balance-number">
            <span className="wpage-currency">₹</span>
            <span className="wpage-val">
              {balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="wpage-balance-footer">
            <span className="wpage-footer-info">
              {isProvider
                ? "Job earnings are credited immediately upon booking completion"
                : "Automatic instant credit on pre-dispatch cancellation"}
            </span>
          </div>
        </div>

        <div className="wpage-stat-card">
          <div className="wpage-stat-details">
            <span className="wpage-stat-label">
              {isProvider ? "Total Earnings" : "Total Refunded"}
            </span>
            <span className="wpage-stat-val text-green">
              ₹
              {(isProvider ? stats.totalEarnings : stats.totalRefunded).toLocaleString("en-IN", {
                minimumFractionDigits: 2
              })}
            </span>
            <span className="wpage-stat-sub">
              {isProvider ? "From completed bookings" : "From cancelled bookings"}
            </span>
          </div>
        </div>

        <div className="wpage-stat-card">
          <div className="wpage-stat-details">
            <span className="wpage-stat-label">Total Activity</span>
            <span className="wpage-stat-val">{stats.count} Transactions</span>
            <span className="wpage-stat-sub">Lifetime ledger count</span>
          </div>
        </div>
      </div>

      <div className="wpage-banner">
        <div className="wpage-banner-content">
          <h4>{isProvider ? "Escrow Payment Protection" : "Escrow Refund Policy"}</h4>
          <p>
            {isProvider
              ? "When a customer books your service, advance funds are securely locked in escrow. Once you finish the service and mark the booking completed, your net earnings (amount minus platform fee) are credited directly to your wallet."
              : "When you book a service, advance payments are held safely. If you or the provider cancels before the provider is dispatched, the advance is immediately credited back into this wallet as a refund."}
          </p>
        </div>
      </div>

      <div className="wpage-transactions-section">
        <div className="wpage-section-header">
          <div className="wpage-section-titles">
            <h2>Transaction Ledger</h2>
            <p>Historical log of all wallet deposits and deductions</p>
          </div>
          <div className="wpage-filter-controls">
            <div className="wpage-tabs">
              <button
                type="button"
                className={`wpage-tab ${activeTab === "ALL" ? "active" : ""}`}
                onClick={() => setActiveTab("ALL")}
              >
                All
              </button>
              {isProvider ? (
                <>
                  <button
                    type="button"
                    className={`wpage-tab ${activeTab === "EARNINGS" ? "active" : ""}`}
                    onClick={() => setActiveTab("EARNINGS")}
                  >
                    Earnings
                  </button>
                  <button
                    type="button"
                    className={`wpage-tab ${activeTab === "DEDUCTIONS" ? "active" : ""}`}
                    onClick={() => setActiveTab("DEDUCTIONS")}
                  >
                    Deductions
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`wpage-tab ${activeTab === "REFUND" ? "active" : ""}`}
                    onClick={() => setActiveTab("REFUND")}
                  >
                    Refunds
                  </button>
                  <button
                    type="button"
                    className={`wpage-tab ${activeTab === "PAYMENT" ? "active" : ""}`}
                    onClick={() => setActiveTab("PAYMENT")}
                  >
                    Payments
                  </button>
                </>
              )}
            </div>
            <div className="wpage-search-box">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="wpage-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="wpage-loading-container">
            <div className="wpage-shimmer-row" />
            <div className="wpage-shimmer-row" />
            <div className="wpage-shimmer-row" />
          </div>
        ) : error ? (
          <div className="wpage-error-card">
            <p>Failed to load wallet details. Please try again.</p>
            <button type="button" onClick={() => refetch()}>Retry</button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="wpage-empty-state">
            <h3>No Transactions Found</h3>
            <p>
              {searchQuery
                ? "No transactions match your search filter."
                : "You have no wallet activity yet. Any transaction records will be listed here automatically."}
            </p>
          </div>
        ) : (
          <div className="wpage-list">
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === "CREDIT";
              const isRefund = tx.category === "REFUND";
              const isEarnings = tx.category === "EARNINGS";
              const dateObj = new Date(tx.createdAt);
              const formattedDate = dateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });
              const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
              });

              const bookingRoute = isProvider
                ? `/provider/bookings/${tx.bookingId}`
                : `/bookings/${tx.bookingId}`;

              return (
                <div key={tx.id} className="wpage-item">
                  <div className="wpage-item-info">
                    <div className="wpage-item-header">
                      <span
                        className={`wpage-badge ${
                          isRefund
                            ? "refund"
                            : isEarnings
                            ? "earnings"
                            : isCredit
                            ? "credit"
                            : "debit"
                        }`}
                      >
                        {tx.category}
                      </span>
                      {tx.referenceId && (
                        <span className="wpage-item-ref">Ref: {tx.referenceId}</span>
                      )}
                      {tx.bookingId && (
                        <Link to={bookingRoute} className="wpage-item-booking-link">
                          View Booking
                        </Link>
                      )}
                    </div>
                    <p className="wpage-item-desc">{tx.description || `${tx.type} Transaction`}</p>
                    <span className="wpage-item-date">
                      {formattedDate} at {formattedTime}
                    </span>
                  </div>
                  <div className="wpage-item-amount-block">
                    <span className={`wpage-item-amount ${isCredit ? "positive" : "negative"}`}>
                      {isCredit ? "+" : "-"}₹
                      {Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="wpage-item-balance-after">
                      Bal: ₹{Number(tx.balanceAfter).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
