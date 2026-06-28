// Test script for cart functionality
const BASE_URL = "http://localhost:5001/api";
let authToken = "";
let sessionId = `test-session-${Date.now()}`;

// Helper function to make API calls
async function apiCall(method, endpoint, body = null, useAuth = false) {
  const headers = {
    "Content-Type": "application/json",
    "x-session-id": sessionId,
  };

  if (useAuth && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    console.log(`${method} ${endpoint}:`, {
      status: response.status,
      success: data.success,
      message: data.message || "",
      data: data.data || data,
    });
    return data;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error);
    return null;
  }
}

async function testCartFunctionality() {
  console.log("=== Testing Dynamic Cart Functionality ===\n");

  // 1. Test getting empty cart (guest user)
  console.log("1. Testing empty cart (guest user):");
  await apiCall("GET", "/cart");

  // 2. Get a product to add to cart
  console.log("\n2. Getting product to add to cart:");
  const productsResponse = await apiCall("GET", "/products?limit=1");
  const productId = productsResponse?.data?.products?.[0]?.id;

  if (!productId) {
    console.log("No products found. Cannot continue testing.");
    return;
  }

  console.log(`Using product ID: ${productId}`);

  // 3. Add item to cart (guest user)
  console.log("\n3. Adding item to cart (guest user):");
  await apiCall("POST", "/cart/items", {
    productId,
    quantity: 2,
  });

  // 4. Get cart with items
  console.log("\n4. Getting cart with items:");
  const cartWithItems = await apiCall("GET", "/cart");
  const cartItemId = cartWithItems?.data?.items?.[0]?.id;

  // 5. Get cart count
  console.log("\n5. Getting cart count:");
  await apiCall("GET", "/cart/count");

  // 6. Update cart item quantity
  if (cartItemId) {
    console.log("\n6. Updating cart item quantity:");
    await apiCall("PUT", `/cart/items/${cartItemId}`, {
      quantity: 3,
    });
  }

  // 7. Add another product to cart
  console.log("\n7. Getting second product and adding to cart:");
  const moreProducts = await apiCall("GET", "/products?limit=2");
  const secondProductId = moreProducts?.data?.products?.[1]?.id;

  if (secondProductId) {
    await apiCall("POST", "/cart/items", {
      productId: secondProductId,
      quantity: 1,
    });
  }

  // 8. Get updated cart
  console.log("\n8. Getting updated cart:");
  await apiCall("GET", "/cart");

  // 9. Test user login and cart merge
  console.log("\n9. Testing user login:");
  const loginResponse = await apiCall("POST", "/auth/login", {
    email: "muhammad1juman@gmail.com",
    password: "password123",
  });

  if (loginResponse?.token) {
    authToken = loginResponse.token;
    console.log("Login successful, token acquired");

    // 10. Test cart merge after login
    console.log("\n10. Testing cart merge after login:");
    await apiCall(
      "POST",
      "/cart/merge",
      {
        sessionId: sessionId,
      },
      true
    );

    // 11. Get cart after merge (authenticated user)
    console.log("\n11. Getting cart after merge (authenticated user):");
    await apiCall("GET", "/cart", null, true);
  }

  // 12. Clear cart
  console.log("\n12. Clearing cart:");
  await apiCall("DELETE", "/cart", null, !!authToken);

  // 13. Verify cart is empty
  console.log("\n13. Verifying cart is empty:");
  await apiCall("GET", "/cart", null, !!authToken);

  console.log("\n=== Cart Functionality Test Complete ===");
}

// Run the test
testCartFunctionality().catch(console.error);
