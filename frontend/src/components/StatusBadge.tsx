import type { OrderStatus } from "../types";

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Dispatched: "bg-blue-100 text-blue-800 border-blue-300",
    Delivered: "bg-green-100 text-green-800 border-green-300"
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}