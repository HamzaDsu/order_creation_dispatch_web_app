import { useCallback, useEffect, useState } from "react";
import { getOrders } from "./api/ordersApi";
import DispatchModal from "./components/DispatchModal";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import type { Order, OrderStatus } from "./types";

type FilterStatus = "All" | OrderStatus;

const filters: FilterStatus[] = [
  "All",
  "Pending",
  "Dispatched",
  "Delivered"
];

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      setError("");

      const data =
        filter === "All" ? await getOrders() : await getOrders(filter);

      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load orders."
      );
    } finally {
      setLoadingOrders(false);
    }
  }, [filter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">
            Logistics Platform
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Order Creation & Dispatch Dashboard
          </h1>

          <p className="mt-2 max-w-3xl text-gray-600">
            Create delivery orders, assign available drivers, and update
            delivery status from one dashboard.
          </p>
        </header>

        <OrderForm onOrderCreated={loadOrders} />

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Orders Dashboard
              </h2>

              <p className="text-sm text-gray-600">
                View and manage all delivery orders.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map(item => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    filter === item
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <OrderList
            orders={orders}
            loading={loadingOrders}
            onAssignDriver={setSelectedOrder}
            onOrderUpdated={loadOrders}
          />
        </section>

        {selectedOrder && (
          <DispatchModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onDispatched={loadOrders}
          />
        )}
      </div>
    </div>
  );
}