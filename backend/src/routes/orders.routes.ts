import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "../db";
import { Order } from "../types";

const router = Router();

router.get("/", async (req, res) => {
  await db.read();

  const status = req.query.status as string | undefined;

  let orders = db.data?.orders || [];

  if (status) {
    orders = orders.filter(order => order.status === status);
  }

  res.json(orders);
});

router.post("/", async (req, res) => {
  await db.read();

  const {
    pickupAddress,
    deliveryAddress,
    packageDescription,
    scheduledPickupTime,
    priority
  } = req.body;

  if (
    !pickupAddress?.street ||
    !pickupAddress?.city ||
    !pickupAddress?.postalCode ||
    !deliveryAddress?.street ||
    !deliveryAddress?.city ||
    !deliveryAddress?.postalCode ||
    !packageDescription ||
    !scheduledPickupTime ||
    !priority
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const pickupDate = new Date(scheduledPickupTime);

  if (isNaN(pickupDate.getTime())) {
    return res.status(400).json({ message: "Invalid pickup date/time." });
  }

  const newOrder: Order = {
    id: randomUUID(),
    pickupAddress,
    deliveryAddress,
    packageDescription,
    scheduledPickupTime,
    priority,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  db.data!.orders.push(newOrder);
  await db.write();

  res.status(201).json(newOrder);
});

router.patch("/:id/dispatch", async (req, res) => {
  await db.read();

  const { driverId } = req.body;
  const order = db.data!.orders.find(order => order.id === req.params.id);
  const driver = db.data!.drivers.find(driver => driver.id === driverId);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  if (!driver) {
    return res.status(404).json({ message: "Driver not found." });
  }

  if (order.status !== "Pending") {
    return res.status(400).json({ message: "Only pending orders can be dispatched." });
  }

  if (driver.availabilityStatus !== "Available") {
    return res.status(400).json({ message: "Driver is not available." });
  }

  order.status = "Dispatched";
  order.assignedDriver = driver;

  await db.write();

  res.json(order);
});

router.patch("/:id/deliver", async (req, res) => {
  await db.read();

  const order = db.data!.orders.find(order => order.id === req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  if (order.status !== "Dispatched") {
    return res.status(400).json({ message: "Only dispatched orders can be delivered." });
  }

  order.status = "Delivered";

  await db.write();

  res.json(order);
});

export default router;