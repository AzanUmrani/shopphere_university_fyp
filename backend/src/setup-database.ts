// Emergency Database Setup Script
// Run this ONCE to create all tables automatically

import { sequelize } from './config/database';
import './models'; // Import all models to register them

const setupDatabase = async () => {
  try {
    console.log('🔧 Starting database setup...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    
    // Check current database
    const [results] = await sequelize.query('SELECT DATABASE() as db');
    console.log('Current database:', (results[0] as any).db);
    
    // Show existing tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Existing tables:', tables.length);
    
    if (tables.length === 0) {
      console.log('\n⚠️  No tables found. Creating all tables...\n');
      
      // Create all tables based on models
      // Use alter: true for safer updates, or force: true to recreate
      await sequelize.sync({ 
        alter: true,  // Modify existing tables safely
        // force: true // ⚠️ DANGER: Uncomment only if you want to DROP ALL TABLES
      });
      
      console.log('\n✓ All tables created successfully!\n');
    } else {
      console.log('\n✓ Tables already exist. Syncing models...\n');
      await sequelize.sync({ alter: true });
      console.log('✓ Models synced successfully!\n');
    }
    
    // Show all tables
    const [finalTables] = await sequelize.query('SHOW TABLES');
    console.log('Final table count:', finalTables.length);
    console.log('Tables:', finalTables);
    
    console.log('\n✅ Database setup complete!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('\nPossible issues:');
    console.error('1. Database "ecom_db" does not exist - Create it first:');
    console.error('   mysql -u root -p');
    console.error('   CREATE DATABASE ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.error('2. MySQL credentials are incorrect');
    console.error('3. MySQL server is not running');
    process.exit(1);
  }
};

setupDatabase();