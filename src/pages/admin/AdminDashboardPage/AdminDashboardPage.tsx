import { useNavigate } from "react-router-dom";

// Icons
import { LogOut, LayoutDashboard, ArrowRight } from "lucide-react";

// Components
import { SecondaryButton } from "../../../atoms";
import AdminOrdersList from "./AdminOrdersList";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.clear();

    navigate("/admin/login");
  };

  return (
    <div className="min-h-dvh bg-background text-primary">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-white
              "
            >
              <LayoutDashboard className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-ink">Admin Dashboard</h1>

              <p className="text-xs text-muted">Blue Eye Electric Services</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{name}</p>

              <p className="text-xs text-muted">Admin</p>
            </div>

            <SecondaryButton onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4" />
            </SecondaryButton>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-5 py-8">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink md:text-3xl">
              Welcome back, {name} 👋
            </h2>

            <p className="mt-2 text-sm text-muted">
              Here's what's happening with your service platform today.
            </p>
          </div>

          <SecondaryButton
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate("/admin/electricians")}
          >
            See Electricians
          </SecondaryButton>
        </div>

        {/* Content */}
        <AdminOrdersList />
      </main>
    </div>
  );
};

export default AdminDashboardPage;
