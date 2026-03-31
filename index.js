import express from "express";

import housingsRoutes from "./routes/housings.js";
import usersRoutes from "./routes/users.js";
import bookingsRoutes from "./routes/bookings.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/housings", housingsRoutes);
app.use("/users", usersRoutes);
app.use("/bookings", bookingsRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
