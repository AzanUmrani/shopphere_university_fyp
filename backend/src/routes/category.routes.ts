import { Router } from "express";

const router = Router();

// Get all categories
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Categories retrieved successfully",
    data: { categories: [] },
  });
});

// Get category by ID
router.get("/:id", (req, res) => {
  res.json({
    success: true,
    message: "Category retrieved successfully",
    data: { category: {} },
  });
});

export default router;
