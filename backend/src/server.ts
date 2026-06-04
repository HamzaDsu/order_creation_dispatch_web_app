import app from "./app";
import { initDB } from "./db";

const PORT = process.env.PORT || 4000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});