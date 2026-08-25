import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { getOrders } from "../../../../services/orderService";

import {
  getElectricians,
  type Electrician,
} from "../../../../services/electricianService";

import { assignElectrician } from "../../../../services/orderService";

import AssignElectricianModal from "../AssignElectricianModal";
import OrderCard from "../../../../organisms/OrderCard/OrderCard";
import type { Order } from "../../../../types/order";

const AdminOrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [electricians, setElectricians] = useState<Electrician[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isAssigning, setIsAssigning] = useState(false);

  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await getOrders();

      setOrders(result.orders);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElectricians = async () => {
    try {
      const result = await getElectricians("approved");

      setElectricians(result);
    } catch (error) {
      console.error("Failed to fetch electricians:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchElectricians();
  }, []);

  const handleAssign = async (electricianId: string) => {
    if (!selectedOrder) return;

    try {
      setIsAssigning(true);

      await assignElectrician({
        orderId: selectedOrder.id,
        electricianId: electricianId,
      });

      // Update the order locally
      const electrician = electricians.find(
        (item) => item.id === electricianId,
      );

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
      console.error("Assign electrician error:", error);

      throw error;
    } finally {
      setIsAssigning(false);
    }
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
                Orders
              </h1>

              <p className="mt-1 text-sm text-muted">
                Manage bookings and assign electricians.
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
                onAssign={() => setSelectedOrder(order)}
                role="admin"
              />
            ))}
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {selectedOrder && (
        <AssignElectricianModal
          isOpen={true}
          order={selectedOrder}
          electricians={electricians}
          isSubmitting={isAssigning}
          onClose={() => !isAssigning && setSelectedOrder(null)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default AdminOrdersList;
