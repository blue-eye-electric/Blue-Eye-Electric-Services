import { useEffect, useState } from "react";

// Icons
import { Zap } from "lucide-react";

// Services
import { getOrders } from "../../../../services/orderService";
import { getElectricianForOrder } from "../../../../services/electricianService";
import { assignElectrician } from "../../../../services/orderService";

// Components
import AssignElectricianModal from "../AssignElectricianModal";
import OrderCard from "../../../../organisms/OrderCard/OrderCard";
import CompleteJobModal from "../../../../organisms/CompleteJobModal";
import { showSnackbar } from "../../../../atoms/AppSnackBar";

// Interfaces
import type { Order } from "../../../../types/order";
import type { Electrician } from "../../../../types/electrician";
import { SecondaryButton } from "../../../../atoms";

type AdminOrdersListProps = {
  isProjectDiscussion?: boolean;
};

const AdminOrdersList = ({
  isProjectDiscussion = false,
}: AdminOrdersListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [electricians, setElectricians] = useState<Electrician[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isAssigning, setIsAssigning] = useState(false);

  const [error, setError] = useState("");

  const fetchOrders = async (pageToLoad = 1, append = false) => {
    try {
      setIsLoading(pageToLoad === 1);
      setError("");

      const result = await getOrders({
        page: pageToLoad,
        limit: 10,
        isProjectDiscussion,
      });

      setOrders((currentOrders) =>
        append ? [...currentOrders, ...result.orders] : result.orders,
      );
      setPagination(result.pagination ?? null);
      setCurrentPage(pageToLoad);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    } finally {
      if (pageToLoad === 1) {
        setIsLoading(false);
      }
    }
  };

  const loadMoreOrders = async () => {
    if (!pagination?.hasNextPage) return;

    try {
      setIsLoadingMore(true);
      setError("");

      await fetchOrders(currentPage + 1, true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const fetchElectricians = async () => {
    try {
      const result = await getElectricianForOrder(selectedOrder?.id || "");

      setElectricians(result);
    } catch (error) {
      showSnackbar.error(
        error instanceof Error ? error.message : "Failed to fetch electricians",
      );
    }
  };

  useEffect(() => {
    fetchOrders(1, false);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      fetchElectricians();
    }
  }, [selectedOrder]);

  const handleAssign = async (electricianId: string) => {
    if (!selectedOrder) return;

    try {
      setIsAssigning(true);

      await assignElectrician({
        orderId: selectedOrder.id,
        electricianId: electricianId,
      });

      setOrders((current) =>
        current.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                electrician_id: electricianId,
                status: "assigned",
              }
            : order,
        ),
      );

      setSelectedOrder(null);
    } catch (error) {
      showSnackbar.error(
        "Failed to assign electrician:" +
          (error instanceof Error ? error.message : ""),
      );

      throw error;
    } finally {
      setIsAssigning(false);
    }
  };

  const handleProjectOrderComplete = async () => {
    if (!selectedOrder) return;

    fetchOrders(1, false);

    setSelectedOrder(null);
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-muted">Loading orders...</div>;
  }

  return (
    <div className=" py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Admin Panel
          </p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink md:text-4xl">
                {isProjectDiscussion ? "Project Discussion Orders" : "Orders"}
              </h1>

              <p className="mt-1 text-sm text-muted">
                {isProjectDiscussion
                  ? "Review project discussion bookings and complete them once approved."
                  : "Manage bookings and assign electricians."}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 px-4 py-2">
              <p className="text-xs text-muted">Total Orders</p>

              <p className="text-xl font-bold text-primary">{orders.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-orange/20 bg-orange/5 px-4 py-3">
            <p className="text-sm text-orange">{error}</p>
          </div>
        )}

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <Zap className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-bold text-ink">No orders yet</h3>

            <p className="mt-1 text-sm text-muted">
              New customer bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                electricians={electricians}
                onAssign={() =>
                  !order.is_project_discussion && setSelectedOrder(order)
                }
                onMarkComplete={() =>
                  order.is_project_discussion && setSelectedOrder(order)
                }
                role="admin"
              />
            ))}
          </div>
        )}

        <div className="flex justify-center py-8">
          {pagination?.hasNextPage ? (
            <SecondaryButton onClick={loadMoreOrders} disabled={isLoadingMore}>
              {isLoadingMore ? "Loading orders..." : "Load more"}
            </SecondaryButton>
          ) : (
            <p>No more orders</p>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {selectedOrder && !selectedOrder.is_project_discussion && (
        <AssignElectricianModal
          isOpen={true}
          order={selectedOrder}
          electricians={electricians}
          isSubmitting={isAssigning}
          onClose={() => !isAssigning && setSelectedOrder(null)}
          onAssign={handleAssign}
        />
      )}

      {selectedOrder && selectedOrder.is_project_discussion && (
        <CompleteJobModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCompleted={handleProjectOrderComplete}
          showBlankPaymentDetails
        />
      )}
    </div>
  );
};

export default AdminOrdersList;
