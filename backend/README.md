# E-commerce Backend

A comprehensive e-commerce backend built with Express, TypeScript, Sequelize ORM, Socket.io, Redis, and MySQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Database**: MySQL with Sequelize ORM
- **Caching**: Redis for session management and caching
- **Real-time Communication**: Socket.io for real-time notifications and chat
- **File Upload**: Multer for handling file uploads
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Winston for comprehensive logging
- **API Documentation**: RESTful API with comprehensive error handling

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Redis (v6.0 or higher)

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:

   - Database credentials
   - JWT secrets
   - Redis URL
   - Other configuration options

5. Create the database:

   ```bash
   npm run db:create
   ```

6. Run database migrations:

   ```bash
   npm run db:migrate
   ```

7. (Optional) Seed the database:
   ```bash
   npm run db:seed
   ```

## Development

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:8000`

## Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:query` - Search products

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Cart (Authenticated)

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders (Authenticated)

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/cancel` - Cancel order

### Payments (Authenticated)

- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:paymentId/status` - Get payment status

### File Upload (Authenticated)

- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Socket.io Events

### Client to Server

- `chat_message` - Send chat message
- `typing` - Typing indicator
- `join_order_room` - Join order updates room
- `leave_order_room` - Leave order updates room
- `join_admin` - Join admin notifications room

### Server to Client

- `chat_message` - Receive chat message
- `typing` - Typing indicator
- `notification` - General notifications
- `order_update` - Order status updates

## Environment Variables

Check `.env.example` for all available environment variables.

## Database Schema

The application uses the following main entities:

- Users
- Addresses
- UserPreferences
- Products
- ProductImages
- ProductVariants
- Categories
- Cart
- CartItems
- Orders
- OrderItems
- Wishlist
- Reviews
- Coupons

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention through Sequelize ORM

## Error Handling

Comprehensive error handling with:

- Custom error classes
- Global error middleware
- Structured error responses
- Logging of all errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
