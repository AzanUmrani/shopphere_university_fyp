import { User } from "./User";
import { Address } from "./Address";
import { UserPreferences } from "./UserPreferences";
import { Product } from "./Product";
import { CreatorProfile } from "./CreatorProfile";
import { ProductImage } from "./ProductImage";
import { Category } from "./Category";
import Order from "./Order";
import OrderItem from "./OrderItem";
import { Subscription } from "./Subscription";
import { SubscriptionPlan } from "./SubscriptionPlan";
import { ChatRoom } from "./ChatRoom";
import { ChatMessage } from "./ChatMessage";
import { ChatParticipant } from "./ChatParticipant";
// import { Review } from "./Review"; // Temporarily disabled
import { Wishlist } from "./Wishlist";
import { Notification } from "./Notification";
import { PaymentMethod } from "./PaymentMethod";
import { Cart, CartItem } from "./Cart";
import { ShippingZone, ShippingRate } from "./Shipping";
import { Coupon, CouponUsage } from "./Coupon";

// Define associations

// User associations
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(UserPreferences, { foreignKey: "userId", as: "preferences" });
UserPreferences.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(CreatorProfile, { foreignKey: "userId", as: "creatorProfile" });
CreatorProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Product, { foreignKey: "creatorId", as: "products" });
Product.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

// Product associations
Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Category associations
Category.hasMany(Category, { foreignKey: "parentId", as: "children" });
Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });

Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Order associations
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Subscription associations
User.hasMany(SubscriptionPlan, {
  foreignKey: "creatorId",
  as: "subscriptionPlans",
});
SubscriptionPlan.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });
Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });

SubscriptionPlan.hasMany(Subscription, {
  foreignKey: "planId",
  as: "subscriptions",
});
Subscription.belongsTo(SubscriptionPlan, { foreignKey: "planId", as: "plan" });

// Chat associations
User.hasMany(ChatRoom, { foreignKey: "createdBy", as: "createdRooms" });
ChatRoom.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

ChatRoom.hasMany(ChatMessage, { foreignKey: "roomId", as: "messages" });
ChatMessage.belongsTo(ChatRoom, { foreignKey: "roomId", as: "room" });

ChatRoom.hasMany(ChatParticipant, { foreignKey: "roomId", as: "participants" });
ChatParticipant.belongsTo(ChatRoom, { foreignKey: "roomId", as: "room" });

User.hasMany(ChatMessage, { foreignKey: "senderId", as: "sentMessages" });
ChatMessage.belongsTo(User, { foreignKey: "senderId", as: "sender" });

User.hasMany(ChatParticipant, {
  foreignKey: "userId",
  as: "chatParticipations",
});
ChatParticipant.belongsTo(User, { foreignKey: "userId", as: "user" });

// Message reply associations
ChatMessage.hasMany(ChatMessage, { foreignKey: "replyToId", as: "replies" });
ChatMessage.belongsTo(ChatMessage, { foreignKey: "replyToId", as: "replyTo" });

// Review associations (temporarily disabled)
// User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
// Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
// Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Order.hasMany(Review, { foreignKey: "orderId", as: "reviews" });
// Review.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Wishlist associations
User.hasMany(Wishlist, { foreignKey: "userId", as: "wishlist" });
Wishlist.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.hasMany(Wishlist, { foreignKey: "productId", as: "wishlistEntries" });
Wishlist.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Notification associations
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// Payment Method associations
User.hasMany(PaymentMethod, { foreignKey: "userId", as: "paymentMethods" });
PaymentMethod.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart associations
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Shipping associations
User.hasMany(ShippingZone, { foreignKey: "creatorId", as: "shippingZones" });
ShippingZone.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

ShippingZone.hasMany(ShippingRate, { foreignKey: "zoneId", as: "rates" });
ShippingRate.belongsTo(ShippingZone, { foreignKey: "zoneId", as: "zone" });

// Coupon associations
User.hasMany(Coupon, { foreignKey: "creatorId", as: "coupons" });
Coupon.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

Coupon.hasMany(CouponUsage, { foreignKey: "couponId", as: "usages" });
CouponUsage.belongsTo(Coupon, { foreignKey: "couponId", as: "coupon" });

User.hasMany(CouponUsage, { foreignKey: "userId", as: "couponUsages" });
CouponUsage.belongsTo(User, { foreignKey: "userId", as: "user" });

Order.hasMany(CouponUsage, { foreignKey: "orderId", as: "couponUsages" });
CouponUsage.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Export all models
export {
  User,
  Address,
  UserPreferences,
  Product,
  CreatorProfile,
  ProductImage,
  Category,
  Order,
  OrderItem,
  Subscription,
  SubscriptionPlan,
  ChatRoom,
  ChatMessage,
  ChatParticipant,
  // Review, // Temporarily disabled
  Wishlist,
  Notification,
  PaymentMethod,
  Cart,
  CartItem,
  ShippingZone,
  ShippingRate,
  Coupon,
  CouponUsage,
};

// Export database instance
export { sequelize } from "@/config/database";
