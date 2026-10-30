import { Outlet, useLocation } from "react-router-dom";
import { TopNav } from "../shared/components/ui/TopNav/TopNav";

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
    location.pathname.startsWith("/notifications");

  return (
    <div className={`top-nav-layout ${hasSubnav ? "has-subnav" : ""}`}>
      <TopNav />
      <main className="top-nav-content">
        <Outlet />
      </main>
    </div>
  );
}
