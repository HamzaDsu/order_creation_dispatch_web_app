import { useEffect, useState } from "react";
import { dispatchOrder, getDrivers } from "../api/ordersApi";
import type { Driver, Order } from "../types";

interface DispatchModalProps {
  order: Order;
  onClose: () => void;
  onDispatched: () => void;
}

export default function DispatchModal({
  order,
  onClose,
  onDispatched
}: DispatchModalProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningDriverId, setAssigningDriverId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      try {
        setLoading(true);
        const data = await getDrivers();
        setDrivers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load drivers."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDrivers();
  }, []);

  async function handleAssignDriver(driverId: string) {
    try {
      setError("");
      setAssigningDriverId(driverId);

      await dispatchOrder(order.id, driverId);

      onDispatched();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to assign driver."
      );
    } finally {
      setAssigningDriverId("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Driver
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Order ID: <span className="font-medium">{order.id}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Loading drivers...</p>
        ) : (
          <div className="space-y-3">
            {drivers.map(driver => {
              const isAvailable = driver.availabilityStatus === "Available";
              const isAssigning = assigningDriverId === driver.id;

              return (
                <div
                  key={driver.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {driver.name}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Current location: {driver.currentLocation}
                    </p>

                    <p
                      className={`mt-1 text-sm font-medium ${
                        isAvailable ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {driver.availabilityStatus}
                    </p>
                  </div>

                  <button
                    disabled={!isAvailable || Boolean(assigningDriverId)}
                    onClick={() => handleAssignDriver(driver.id)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {isAssigning ? "Assigning..." : "Select Driver"}
                  </button>
                </div>
              );
            })}

            {drivers.length === 0 && (
              <p className="text-gray-600">No drivers available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}