import { markDelivered } from "../api/ordersApi";
import type { Order } from "../types";
import StatusBadge from "./StatusBadge";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onAssignDriver: (order: Order) => void;
  onOrderUpdated: () => void;
}

export default function OrderList({
  orders,
  loading,
  onAssignDriver,
  onOrderUpdated
}: OrderListProps) {
  async function handleMarkDelivered(orderId: string) {
    try {
      await markDelivered(orderId);
      onOrderUpdated();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to mark order as delivered."
      );
    }
  }

  function formatAddress(order: Order, type: "pickup" | "delivery") {
    const address =
      type === "pickup" ? order.pickupAddress : order.deliveryAddress;

    return `${address.street}, ${address.city}, ${address.postalCode}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
        <p className="text-gray-600">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Order ID
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Pickup Address
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Delivery Address
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Priority
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Driver
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {order.id}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatAddress(order, "pickup")}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatAddress(order, "delivery")}
                </td>

                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={order.status} />
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.priority}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.assignedDriver?.name || "-"}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatDate(order.createdAt)}
                </td>

                <td className="px-4 py-3 text-sm">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => onAssignDriver(order)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Assign Driver
                    </button>
                  )}

                  {order.status === "Dispatched" && (
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Mark Delivered
                    </button>
                  )}

                  {order.status === "Delivered" && (
                    <span className="text-sm font-medium text-gray-500">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}