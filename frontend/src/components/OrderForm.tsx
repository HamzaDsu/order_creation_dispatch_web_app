import { useState } from "react";
import type { FormEvent } from "react";
import { createOrder } from "../api/ordersApi";
import type { CreateOrderPayload, Priority } from "../types";

interface OrderFormProps {
  onOrderCreated: () => void;
}

const initialFormData: CreateOrderPayload = {
  pickupAddress: {
    street: "",
    city: "",
    postalCode: ""
  },
  deliveryAddress: {
    street: "",
    city: "",
    postalCode: ""
  },
  packageDescription: "",
  scheduledPickupTime: "",
  priority: "Standard"
};

export default function OrderForm({ onOrderCreated }: OrderFormProps) {
  const [formData, setFormData] =
    useState<CreateOrderPayload>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updatePickupAddress(field: string, value: string) {
    setFormData(prev => ({
      ...prev,
      pickupAddress: {
        ...prev.pickupAddress,
        [field]: value
      }
    }));
  }

  function updateDeliveryAddress(field: string, value: string) {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [field]: value
      }
    }));
  }

  function validateForm() {
    if (
      !formData.pickupAddress.street ||
      !formData.pickupAddress.city ||
      !formData.pickupAddress.postalCode ||
      !formData.deliveryAddress.street ||
      !formData.deliveryAddress.city ||
      !formData.deliveryAddress.postalCode ||
      !formData.packageDescription ||
      !formData.scheduledPickupTime ||
      !formData.priority
    ) {
      return "Please fill in all required fields.";
    }

    const selectedDate = new Date(formData.scheduledPickupTime);

    if (isNaN(selectedDate.getTime())) {
      return "Please select a valid pickup date and time.";
    }

    if (selectedDate < new Date()) {
      return "Scheduled pickup time cannot be in the past.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await createOrder(formData);
      setFormData(initialFormData);
      setSuccess("Order created successfully.");
      onOrderCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Create New Delivery Order
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="mb-3 font-medium text-gray-800">Pickup Address</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Street"
              value={formData.pickupAddress.street}
              onChange={e => updatePickupAddress("street", e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="City"
              value={formData.pickupAddress.city}
              onChange={e => updatePickupAddress("city", e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Postal Code"
              value={formData.pickupAddress.postalCode}
              onChange={e => updatePickupAddress("postalCode", e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium text-gray-800">Delivery Address</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Street"
              value={formData.deliveryAddress.street}
              onChange={e => updateDeliveryAddress("street", e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="City"
              value={formData.deliveryAddress.city}
              onChange={e => updateDeliveryAddress("city", e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Postal Code"
              value={formData.deliveryAddress.postalCode}
              onChange={e =>
                updateDeliveryAddress("postalCode", e.target.value)
              }
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Scheduled Pickup Time
            </label>

            <input
              type="datetime-local"
              value={formData.scheduledPickupTime}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  scheduledPickupTime: e.target.value
                }))
              }
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              value={formData.priority}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  priority: e.target.value as Priority
                }))
              }
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Same-day">Same-day</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Package Description
            </label>

            <input
              type="text"
              placeholder="e.g. Small box, fragile items"
              value={formData.packageDescription}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  packageDescription: e.target.value
                }))
              }
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}