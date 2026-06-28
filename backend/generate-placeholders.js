const fs = require("fs");
const path = require("path");

// Create simple placeholder images using SVG
const createPlaceholderSVG = (
  width,
  height,
  text,
  color = "#e5e5e5",
  textColor = "#999"
) => {
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="${textColor}" 
        text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`.trim();
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create placeholder images
const placeholders = [
  {
    name: "placeholder-product.jpg",
    text: "No Image Available",
    width: 400,
    height: 400,
  },
  {
    name: "smartphone-x1.jpg",
    text: "Smartphone X1",
    width: 400,
    height: 400,
    color: "#f0f8ff",
  },
  {
    name: "smartphone-x1-back.jpg",
    text: "Smartphone Back",
    width: 400,
    height: 400,
    color: "#f0f8ff",
  },
  {
    name: "smartphone-x1-side.jpg",
    text: "Smartphone Side",
    width: 400,
    height: 400,
    color: "#f0f8ff",
  },
  {
    name: "laptop-elite.jpg",
    text: "ProBook Elite 15",
    width: 500,
    height: 300,
    color: "#fff8dc",
  },
  {
    name: "laptop-elite-open.jpg",
    text: "Laptop Open View",
    width: 500,
    height: 300,
    color: "#fff8dc",
  },
  {
    name: "headphones-wireless.jpg",
    text: "Wireless Headphones",
    width: 400,
    height: 400,
    color: "#f5f5f5",
  },
  {
    name: "headphones-wireless-case.jpg",
    text: "Headphones with Case",
    width: 400,
    height: 400,
    color: "#f5f5f5",
  },
  {
    name: "tshirt-cotton.jpg",
    text: "Cotton T-Shirt (Blue)",
    width: 300,
    height: 400,
    color: "#e6f3ff",
  },
  {
    name: "tshirt-cotton-red.jpg",
    text: "Cotton T-Shirt (Red)",
    width: 300,
    height: 400,
    color: "#ffe6e6",
  },
  {
    name: "tshirt-cotton-black.jpg",
    text: "Cotton T-Shirt (Black)",
    width: 300,
    height: 400,
    color: "#f0f0f0",
  },
];

placeholders.forEach((placeholder) => {
  const svgContent = createPlaceholderSVG(
    placeholder.width,
    placeholder.height,
    placeholder.text,
    placeholder.color || "#e5e5e5",
    "#666"
  );

  // For simplicity, we'll save as SVG files but rename them with .jpg extension
  // In a real application, you'd want to convert SVG to actual JPG
  const filePath = path.join(
    uploadsDir,
    placeholder.name.replace(".jpg", ".svg")
  );
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created placeholder: ${filePath}`);
});

console.log("All placeholder images created successfully!");
console.log(`Images saved to: ${uploadsDir}`);
