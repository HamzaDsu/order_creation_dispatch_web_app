import type {
  CreateOrderPayload,
  Driver,
  Order,
  OrderStatus
} from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  const url = status
    ? `${API_URL}/orders?status=${status}`
    : `${API_URL}/orders`;

  const response = await fetch(url);

  await handleApiError(response, "Failed to fetch orders");

  return response.json();
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  
  await handleApiError(response, "Failed to create order");

  return response.json();
}

export async function getDrivers(): Promise<Driver[]> {
  const response = await fetch(`${API_URL}/drivers`);

  await handleApiError(response, "Failed to fetch drivers");

  return response.json();
}

export async function dispatchOrder(
  orderId: string,
  driverId: string
): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${orderId}/dispatch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ driverId })
  });

  await handleApiError(response, "Failed to dispatch order");

  return response.json();
}

export async function markDelivered(orderId: string): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${orderId}/deliver`, {
    method: "PATCH"
  });

  await handleApiError(response, "Failed to mark order as delivered");

  return response.json();
}

async function handleApiError(response: Response, fallbackMessage: string) {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || fallbackMessage);
    } catch {
      throw new Error(fallbackMessage);
    }
  }
}