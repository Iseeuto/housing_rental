import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { setup, serve } from "swagger-ui-express";

import housingsRoutes from "./routes/housings.js";
import usersRoutes from "./routes/users.js";
import bookingsRoutes from "./routes/bookings.js";

const app = express();
const PORT = 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "House Rental API",
      version: "1.0.0",
      description: "A basic API for a house renting service.",
    },
  },

  apis: ["./routes/users.js", "./routes/housings.js", "./routes/bookings.js"],
};

const specs = swaggerJSDoc(options);
app.use("/api-docs", serve, setup(specs));

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
