import { Outlet, useLocation } from "react-router-dom";
import { ProviderTopNav } from "../shared/components/ui/ProviderTopNav/ProviderTopNav";

export default function ProviderLayout() {
  const location = useLocation();

  if (
    location.pathname.endsWith("/register") ||
    location.pathname.endsWith("/register/")
  ) {
    return <Outlet />;
  }

  return (
    <div className="provider-top-layout">
      <ProviderTopNav />
      <main className="provider-main-content">
        <Outlet />
      </main>
    </div>
  );
}
