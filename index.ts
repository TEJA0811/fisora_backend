import * as dotenv from "dotenv";
dotenv.config();

// Log environment variables
console.log("Environment Check:");
console.log("- MYSQL_ENABLED:", process.env.MYSQL_ENABLED);
console.log("- DB_HOST:", process.env.DB_HOST);
console.log("- DB_PORT:", process.env.DB_PORT);
console.log("- DB_NAME:", process.env.DB_NAME);

import express from "express";

import adminRoutes from "./src/routes/admin.route.js";
import authRoutes from "./src/routes/auth.route.js";
import errorHandler from "./src/middleware/error.middleware.js";

const app = express();
const port = process.env.PORT || 3000;

app.use("/static", express.static("public"));
app.use(express.json());
app.use("/", adminRoutes);
app.use("/", authRoutes);

// Centralized error handler (should be after routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
