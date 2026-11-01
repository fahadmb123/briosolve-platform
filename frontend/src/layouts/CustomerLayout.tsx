import { Outlet, useLocation } from "react-router-dom";
import { TopNav } from "../shared/components/ui/TopNav/TopNav";
import { CustomerSubnavSidebar } from "../shared/components/ui/CustomerSubnavSidebar/CustomerSubnavSidebar";

export default function CustomerLayout() {
  const location = useLocation();

  if (
    location.pathname.endsWith("/register") ||
    location.pathname.endsWith("/register/")
  ) {
    return <Outlet />;
  }

  const hasSubnav =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/nearby-providers") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/request-service");

  return (
    <div className="top-nav-layout">
      <TopNav />
      <div className={`customer-body-layout ${hasSubnav ? "has-subnav" : ""}`}>
        {hasSubnav && <CustomerSubnavSidebar />}
        <main className={`top-nav-content ${hasSubnav ? "with-sidebar" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
