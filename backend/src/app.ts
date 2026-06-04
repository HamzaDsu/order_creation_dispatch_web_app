import express from "express";
import cors from "cors";
import ordersRoutes from "./routes/orders.routes";
import driversRoutes from "./routes/drivers.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orders", ordersRoutes);
app.use("/api/drivers", driversRoutes);

app.get("/", (_req, res) => {
  res.send("Order Dispatch API is running");
});

export default app;