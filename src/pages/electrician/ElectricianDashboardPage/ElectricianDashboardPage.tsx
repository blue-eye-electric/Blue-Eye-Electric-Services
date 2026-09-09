import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { Check, LogOut, Zap } from "lucide-react";

// Services
import { getOrders } from "../../../services/orderService";

// Components
import OrderCard from "../../../organisms/OrderCard";
import CompleteJobModal from "../../../organisms/CompleteJobModal";
import { SecondaryButton } from "../../../atoms";
import { showSnackbar } from "../../../atoms/AppSnackBar";

// Interfaces
import type { Order } from "../../../types/order";

const ElectricianHomePage = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Electrician";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  // Selected order for complete confirmation
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogout = () => {
    localStorage.clear();

    navigate("/electrician/login");
  };

  // ==============================
  // Get assigned orders
  // ==============================

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setError("");

      const result = await getOrders({ status: "assigned" });

      setOrders(result.orders);
    } catch (error) {
      showSnackbar.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch assigned jobs",
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch assigned jobs",
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-dvh bg-background text-primary">
      {/* =========================================
          Header
      ========================================= */}
      <header className="border-b border-slate-200 bg-white">
        <div
          className="
            mx-auto
            flex
            max-w-5xl
            items-center
            justify-between
            px-5
            py-4
            md:px-8
          "
        >
          {/* Logo */}
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
              <Zap className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-sm font-bold text-ink md:text-base">
                Electrician Portal
              </h1>

              <p className="text-[10px] text-muted">
                Blue Eye Electric Services
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            {/* <button
              type="button"
              title="Notifications"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-muted
                transition
                hover:bg-slate-50
                hover:text-primary
              "
            >
              <Bell className="h-5 w-5" />

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-2
                  w-2
                  rounded-full
                  bg-primary
                "
              />
            </button> */}

            {/* Electrician Name */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{name}</p>

              <p className="text-[10px] text-muted">Electrician</p>
            </div>

            {/* Logout */}
            <SecondaryButton
              onClick={handleLogout}
              icon={<LogOut className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Logout</span>
            </SecondaryButton>
          </div>
        </div>
      </header>

      {/* =========================================
          Main
      ========================================= */}
      <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
        {/* Welcome */}
        <section>
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[1.3px]
              text-primary
            "
          >
            Electrician Dashboard
          </p>

          <h2 className="mt-2 text-2xl font-bold text-ink md:text-3xl">
            Welcome, {name} 👋
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted md:text-base">
            Manage your assigned electrical jobs and stay updated with customer
            requests.
          </p>
        </section>

        {/* =========================================
            Dashboard Cards
        ========================================= */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {/* Pending Jobs */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <p className="text-sm font-semibold text-muted">Pending Jobs</p>

            <p className="mt-3 text-3xl font-bold text-ink">
              {loadingOrders ? "..." : orders.length}
            </p>

            <p className="mt-1 text-xs text-muted">
              Jobs currently assigned to you
            </p>
          </div>

          {/* Completed */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <p className="text-sm font-semibold text-muted">Completed</p>

            <p className="mt-3 text-3xl font-bold text-ink">0</p>

            <p className="mt-1 text-xs text-muted">
              Jobs completed successfully
            </p>
          </div>
        </section>

        {/* =========================================
            Assigned Jobs
        ========================================= */}
        <section className="mt-8">
          {/* Section Header */}
          <div
            className="
              mb-5
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h3 className="text-xl font-bold text-ink">Assigned Jobs</h3>

              <p className="mt-1 text-sm text-muted">
                Complete the job once the electrical work is finished.
              </p>
            </div>

            {/* Refresh */}
            <SecondaryButton onClick={fetchOrders} disabled={loadingOrders}>
              {loadingOrders ? "Loading..." : "Refresh"}
            </SecondaryButton>
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                mb-5
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-5
              "
            >
              <p className="text-sm font-medium text-red-600">{error}</p>

              <SecondaryButton onClick={fetchOrders}>Try Again</SecondaryButton>
            </div>
          )}

          {/* Loading */}
          {loadingOrders ? (
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-10
                text-center
                shadow-sm
              "
            >
              <p className="text-sm text-muted">Loading assigned jobs...</p>
            </div>
          ) : orders.length === 0 ? (
            /* Empty */
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-10
                text-center
                shadow-sm
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                "
              >
                <Check className="h-5 w-5 text-muted" />
              </div>

              <h4 className="mt-4 text-base font-bold text-ink">
                No assigned jobs
              </h4>

              <p className="mt-1 text-sm text-muted">
                You currently don't have any assigned jobs.
              </p>
            </div>
          ) : (
            /* Orders */
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  role="electrician"
                  onMarkComplete={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* =========================================
          Complete Confirmation Modal
      ========================================= */}
      <CompleteJobModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCompleted={() => {
          setOrders((prev) =>
            prev.filter((order) => order.id !== selectedOrder?.id),
          );

          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default ElectricianHomePage;
