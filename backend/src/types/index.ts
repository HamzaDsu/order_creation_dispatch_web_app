export type Priority = "Standard" | "Express" | "Same-day";
export type OrderStatus = "Pending" | "Dispatched" | "Delivered";

export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface Driver {
  id: string;
  name: string;
  currentLocation: string;
  availabilityStatus: "Available" | "Busy";
}

export interface Order {
  id: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  packageDescription: string;
  scheduledPickupTime: string;
  priority: Priority;
  status: OrderStatus;
  createdAt: string;
  assignedDriver?: Driver;
}