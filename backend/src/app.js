// backend/src/app.js
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/auth.routes.js";

import projectRoutes from "./routes/project.routes.js";
import milestoneRoutes from "./routes/milestone.routes.js";
import documentRoutes from "./routes/document.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import publicRoutes from "./routes/public.routes.js";


// Middlewares
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/public", publicRoutes);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

// Error Middleware (must be after all routes)
app.use(errorMiddleware);

export default app;