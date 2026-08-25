import { useEffect, useState } from "react";
import { Bell, Check, LogOut, MapPin, Phone, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOrders, completeOrder } from "../../../services/orderService";

interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  service?: string;
  address?: string;
  description?: string;
  status: string;
  created_at: string;
}

const ElectricianHomePage = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Electrician";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  // Selected order for complete confirmation
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [completeLoading, setCompleteLoading] = useState(false);

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

      setOrders(
        (result.orders || []).map((order) => ({
          id: order.id,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          service: order.service_type || undefined,
          address: order.customer_address,
          description: order.description || undefined,
          status: order.status,
          created_at: order.created_at,
        })),
      );
    } catch (error) {
      console.error("Fetch orders error:", error);

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

  // ==============================
  // Mark order as completed
  // ==============================

  const handleMarkComplete = async () => {
    if (!selectedOrder) return;

    try {
      setCompleteLoading(true);

      await completeOrder(selectedOrder.id);

      // Remove completed order from the list
      setOrders((prev) =>
        prev.filter((order) => order.id !== selectedOrder.id),
      );

      // Close confirmation modal
      setSelectedOrder(null);
    } catch (error) {
      console.error("Mark complete error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to mark job as completed",
      );
    } finally {
      setCompleteLoading(false);
    }
  };
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
            max-w-7xl
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
            <button
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
            </button>

            {/* Electrician Name */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{name}</p>

              <p className="text-[10px] text-muted">Electrician</p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-2.5
                text-sm
                font-semibold
                text-ink
                transition
                hover:bg-white
              "
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================
          Main
      ========================================= */}
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
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
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-sm
                font-semibold
                text-ink
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loadingOrders ? "Loading..." : "Refresh"}
            </button>
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

              <button
                type="button"
                onClick={fetchOrders}
                className="
                  mt-3
                  rounded-lg
                  bg-primary
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Try Again
              </button>
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
                <div
                  key={order.id}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    md:p-6
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >
                    {/* Order Details */}
                    <div className="min-w-0">
                      {/* Customer */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-base font-bold text-ink">
                          {order.customer_name}
                        </h4>

                        <span
                          className="
                            rounded-full
                            bg-amber-50
                            px-3
                            py-1
                            text-[11px]
                            font-semibold
                            capitalize
                            text-amber-600
                          "
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Service */}
                      {order.service && (
                        <p className="mt-2 text-sm font-semibold text-primary">
                          {order.service}
                        </p>
                      )}

                      {/* Phone */}
                      {order.customer_phone && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                          <Phone className="h-4 w-4 shrink-0" />

                          <span>{order.customer_phone}</span>
                        </div>
                      )}

                      {/* Address */}
                      {order.address && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-muted">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                          <span>{order.address}</span>
                        </div>
                      )}

                      {/* Description */}
                      {order.description && (
                        <p className="mt-3 text-sm leading-6 text-muted">
                          {order.description}
                        </p>
                      )}
                    </div>

                    {/* Mark Complete */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-primary
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:opacity-90
                      "
                    >
                      <Check className="h-4 w-4" />
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* =========================================
          Complete Confirmation Modal
      ========================================= */}
      {selectedOrder && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-5
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-white
              p-6
              shadow-2xl
              md:p-8
            "
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Check className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-ink">
                  Complete Job?
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted">
                  Are you sure you want to mark this job as completed?
                </p>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                disabled={completeLoading}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-muted
                  transition
                  hover:bg-slate-100
                  disabled:opacity-50
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selected Order */}
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >
              <p className="text-sm font-bold text-ink">
                {selectedOrder.customer_name}
              </p>

              {selectedOrder.service && (
                <p className="mt-1 text-sm font-semibold text-primary">
                  {selectedOrder.service}
                </p>
              )}

              {selectedOrder.customer_phone && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <Phone className="h-4 w-4" />

                  <span>{selectedOrder.customer_phone}</span>
                </div>
              )}

              {selectedOrder.address && (
                <div className="mt-2 flex items-start gap-2 text-sm text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{selectedOrder.address}</span>
                </div>
              )}
            </div>

            {/* Warning */}
            <p className="mt-4 text-xs leading-5 text-muted">
              Only mark this job as completed after the electrical work has been
              finished successfully.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              {/* Cancel */}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                disabled={completeLoading}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-ink
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              {/* Complete */}
              <button
                type="button"
                onClick={handleMarkComplete}
                disabled={completeLoading}
                className="
                  flex-1
                  rounded-xl
                  bg-primary
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {completeLoading ? "Completing..." : "Yes, Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricianHomePage;
