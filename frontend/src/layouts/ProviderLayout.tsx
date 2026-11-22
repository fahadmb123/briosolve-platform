import { Outlet, useLocation } from "react-router-dom";
import { ProviderNavbar } from "../shared/components/ui/ProviderTopNav/ProviderTopNav";
import { ProviderSubnavSidebar } from "../shared/components/ui/ProviderSubnavSidebar/ProviderSubnavSidebar";
import { useAuthStore } from "../features/auth/stores/auth.store";

export default function ProviderLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const verifications = useAuthStore((state) => state.verifications);
  const isVerified = verifications !== null && Object.values(verifications).every(Boolean);
  const showVerificationWarning = Boolean(isAuthenticated && !isVerified);

  if (
    location.pathname.endsWith("/register") ||
    location.pathname.endsWith("/register/")
  ) {
    return <Outlet />;
  }

  const isSettingsSection =
    location.pathname.startsWith("/provider/settings") ||
    location.pathname.startsWith("/provider/profile") ||
    location.pathname.startsWith("/provider/kyc") ||
    location.pathname.startsWith("/provider/notifications") ||
    location.pathname.startsWith("/provider/verification");

  const isWorkspaceSection =
    location.pathname === "/provider/dashboard" ||
    location.pathname.startsWith("/provider/dashboard") ||
    location.pathname.startsWith("/provider/service-requests") ||
    location.pathname.startsWith("/provider/requests") ||
    location.pathname.startsWith("/provider/bookings") ||
    location.pathname.startsWith("/provider/messages") ||
    location.pathname.startsWith("/provider/support") ||
    location.pathname.startsWith("/provider/tickets") ||
    location.pathname.startsWith("/provider/chat");

  const isFinancesSection =
    location.pathname.startsWith("/provider/quotations") ||
    location.pathname.startsWith("/provider/wallet");

  const hasSubnav = isSettingsSection || isWorkspaceSection || isFinancesSection;

  return (
    <div className={`provider-top-layout ${showVerificationWarning ? "has-verification-warning" : ""}`}>
      <ProviderNavbar />
      <div className={`provider-body-layout ${hasSubnav ? "has-subnav" : ""} ${showVerificationWarning ? "has-verification-warning" : ""}`}>
        {hasSubnav && <ProviderSubnavSidebar />}
        <main className={`provider-main-content ${hasSubnav ? "with-sidebar" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
