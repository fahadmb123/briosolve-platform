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

  return (
    <div className="top-nav-layout">
      <TopNav />
      <main className="top-nav-content">
        <Outlet />
      </main>
    </div>
  );
}
