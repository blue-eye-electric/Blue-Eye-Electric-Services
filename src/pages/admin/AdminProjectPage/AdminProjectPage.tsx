import { useNavigate } from "react-router-dom";

import { ArrowLeft, LogOut } from "lucide-react";

import { SecondaryButton } from "../../../atoms";
import AdminOrdersList from "../AdminDashboardPage/AdminOrdersList";

const AdminProjectPage = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-dvh bg-background text-primary">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <SecondaryButton
              onClick={() => navigate("/admin/dashboard")}
              title="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </SecondaryButton>

            <div>
              <h1 className="text-lg font-bold text-ink">Project Discussion</h1>
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

      <main className="mx-auto max-w-5xl px-5 py-8">
        <AdminOrdersList isProjectDiscussion />
      </main>
    </div>
  );
};

export default AdminProjectPage;
