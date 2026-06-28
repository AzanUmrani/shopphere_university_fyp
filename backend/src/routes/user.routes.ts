import { Router } from "express";
import { authenticate, authorize } from "@/middleware/auth";

const router = Router();

// Get all users (admin only)
router.get("/", authenticate, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Users retrieved successfully",
    data: { users: [] },
  });
});

// Get user by ID (admin only)
router.get("/:id", authenticate, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "User retrieved successfully",
    data: { user: {} },
  });
});

// Update user (admin only)
router.put("/:id", authenticate, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "User updated successfully",
    data: { user: {} },
  });
});

// Delete user (admin only)
router.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "User deleted successfully",
  });
});

export default router;
