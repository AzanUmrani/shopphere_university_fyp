// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

// Clean Express Server
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { sequelize } from "./config/database";
import "./models";
import { configureSocket } from "./config/socket";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";

// Import all routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import uploadRoutes from "./routes/upload.routes";
import creatorRoutes from "./routes/creator.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import chatRoutes from "./routes/chat.routes";
import wishlistRoutes from "./routes/wishlist.routes";
// import reviewRoutes from './routes/review.routes';
import notificationRoutes from "./routes/notification.routes";
import adminRoutes from "./routes/admin.routes";
import onboardingRoutes from "./routes/onboarding.routes";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Configure Socket.IO
configureSocket(io);

// Security Middleware with custom configuration for static files
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "*"],
        mediaSrc: ["'self'", "*"],
        connectSrc: ["'self'", "*"],
      },
    },
  }),
);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

// Body Parser & Logger
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("combined"));

// Global middleware for static file CORS
const staticFileCORS = (req: any, res: any, next: any) => {
  // Set CORS headers for all static files
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Cross-Origin-Resource-Policy", "cross-origin");

  // Set caching headers for images
  if (req.url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    res.header("Cache-Control", "public, max-age=31536000"); // 1 year cache
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};

// Serve static files for uploads with global CORS
app.use(
  "/uploads",
  staticFileCORS,
  express.static(path.join(__dirname, "../uploads")),
);
app.use(
  "/api/uploads",
  staticFileCORS,
  express.static(path.join(__dirname, "../uploads")),
);

// Test Route
app.get("/test", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Test static file CORS
app.get("/test-cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
    timestamp: new Date().toISOString(),
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/creators", creatorRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/wishlist", wishlistRoutes);
// app.use('/api/reviews', reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/onboarding", onboardingRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = 5001;

const getExistingTableNames = async (): Promise<Set<string>> => {
  const [tables] = await sequelize.query("SHOW TABLES");

  if (!Array.isArray(tables)) {
    return new Set();
  }

  const tableNames = tables
    .map((row) => {
      if (!row || typeof row !== "object") {
        return "";
      }

      const firstColumnValue = Object.values(row as Record<string, unknown>)[0];
      return typeof firstColumnValue === "string" ? firstColumnValue : "";
    })
    .filter((tableName): tableName is string => tableName.length > 0)
    .map((tableName) => tableName.toLowerCase());

  return new Set(tableNames);
};

const getModelTableNames = (): string[] => {
  const modelTables = Object.values(sequelize.models)
    .map((model) => model.getTableName())
    .map((tableName) => {
      if (typeof tableName === "string") {
        return tableName;
      }

      if (
        tableName &&
        typeof tableName === "object" &&
        "tableName" in tableName
      ) {
        const tableNameValue = (tableName as { tableName?: unknown }).tableName;
        return typeof tableNameValue === "string" ? tableNameValue : "";
      }

      return "";
    })
    .filter((tableName): tableName is string => tableName.length > 0);

  return [...new Set(modelTables)];
};

const bootstrapOrRepairSchema = async (): Promise<void> => {
  const existingTables = await getExistingTableNames();
  const modelTables = getModelTableNames();
  const missingTables = modelTables.filter(
    (tableName) => !existingTables.has(tableName.toLowerCase()),
  );

  const existingTableCount = existingTables.size;

  if (existingTableCount === 0) {
    console.log("No database tables found. Creating all tables from models...");
    await sequelize.sync();

    const createdTableCount = (await getExistingTableNames()).size;

    console.log(
      `Database bootstrap complete. Created ${createdTableCount} tables.`,
    );
    return;
  }

  if (missingTables.length > 0) {
    console.log(
      `Database has ${existingTableCount} tables but is missing ${missingTables.length} model tables. Creating missing tables...`,
    );
    console.log(`Missing tables: ${missingTables.join(", ")}`);

    await sequelize.sync();

    const existingTablesAfterSync = await getExistingTableNames();

    const remainingMissingTables = getModelTableNames().filter(
      (tableName) => !existingTablesAfterSync.has(tableName.toLowerCase()),
    );

    if (remainingMissingTables.length > 0) {
      throw new Error(
        `Schema repair incomplete. Missing tables after sync: ${remainingMissingTables.join(", ")}`,
      );
    }

    const finalTableCount = (await getExistingTableNames()).size;
    console.log(
      `Database schema repair complete. Database now has ${finalTableCount} tables.`,
    );
  } else {
    console.log(
      `Database contains all ${existingTableCount} expected tables. Skipping bootstrap.`,
    );
  }
};

const startServer = async () => {
  try {
    // Debug environment variables
    console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
    console.log("Environment variables loaded successfully");

    // Database Connection
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Auto-create missing schema artifacts
    await bootstrapOrRepairSchema();

    // Start Server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log("Database connected and schema bootstrap check completed");
      console.log("Socket.IO server configured and ready");
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`🎯 All API routes loaded and ready!`);
      // Socket.IO integration completed
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
