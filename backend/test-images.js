const express = require("express");
const path = require("path");

// Simple test server to verify static file serving
const app = express();

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Test route
app.get("/test-image", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Image Test</h1>
        <h2>Placeholder Image:</h2>
        <img src="/uploads/products/placeholder-product.svg" alt="Placeholder" style="width: 200px; height: 200px; border: 1px solid #ccc;">
        
        <h2>Sample Product Images:</h2>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <img src="/uploads/products/smartphone-x1.svg" alt="Smartphone" style="width: 150px; height: 150px; border: 1px solid #ccc;">
          <img src="/uploads/products/laptop-elite.svg" alt="Laptop" style="width: 150px; height: 150px; border: 1px solid #ccc;">
          <img src="/uploads/products/headphones-wireless.svg" alt="Headphones" style="width: 150px; height: 150px; border: 1px solid #ccc;">
          <img src="/uploads/products/tshirt-cotton.svg" alt="T-Shirt" style="width: 150px; height: 150px; border: 1px solid #ccc;">
        </div>
      </body>
    </html>
  `);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Test images at: http://localhost:${PORT}/test-image`);
});
