import { Outlet, useLocation } from "react-router-dom";
import { ProviderTopNav } from "../shared/components/ui/ProviderTopNav/ProviderTopNav";
import { ProviderSubnavSidebar } from "../shared/components/ui/ProviderSubnavSidebar/ProviderSubnavSidebar";

export default function ProviderLayout() {
  const location = useLocation();

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
    location.pathname.startsWith("/provider/dashboard");

  const hasSubnav = isSettingsSection || isWorkspaceSection;

  return (
    <div className="provider-top-layout">
      <ProviderTopNav />
      <div className={`provider-body-layout ${hasSubnav ? "has-subnav" : ""}`}>
        {hasSubnav && <ProviderSubnavSidebar />}
        <main className={`provider-main-content ${hasSubnav ? "with-sidebar" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
