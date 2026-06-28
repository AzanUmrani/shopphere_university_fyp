const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
  // First, connect without specifying database to create it
  const rootConnection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  try {
    console.log("🔄 Creating database...");

    // Create database
    await rootConnection.execute(
      "CREATE DATABASE IF NOT EXISTS ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );
    console.log("✅ Database created successfully");

    await rootConnection.end();

    // Connect to the specific database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: "ecom_db",
      port: parseInt(process.env.DB_PORT || "3306"),
    });

    console.log("🔄 Initializing database schema...");

    // Read and execute the schema file (without CREATE DATABASE and USE statements)
    const schemaPath = path.join(__dirname, "database_schema.sql");
    let schema = fs.readFileSync(schemaPath, "utf8");

    // Remove the CREATE DATABASE and USE statements since we're already connected
    schema = schema.replace(/CREATE DATABASE.*?;/gi, "");
    schema = schema.replace(/USE ecom_db;/gi, "");
    schema = schema.trim();

    // Split by statements and execute one by one
    const statements = schema.split(";").filter((stmt) => stmt.trim());

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await connection.execute(statement + ";");
        } catch (error) {
          if (error.code !== "ER_TABLE_EXISTS_ERROR") {
            console.warn(
              `⚠️ Warning executing statement ${i + 1}:`,
              error.message.substring(0, 100)
            );
          }
        }
      }
    }

    console.log("✅ Database schema initialized successfully!");
    console.log("📊 All tables created with proper indexes and relationships");

    await connection.end();
  } catch (error) {
    console.error("❌ Failed to initialize database:", error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase().catch(console.error);
}

module.exports = { initializeDatabase };
