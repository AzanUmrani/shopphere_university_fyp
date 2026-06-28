-- Migration script to add subscription and chat system tables
-- Run this script to create the new tables for the enhanced e-commerce platform

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    creator_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    billing_period ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
    features JSON NOT NULL,
    max_subscribers INT,
    subscriber_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    stripe_product_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_creator_id (creator_id),
    INDEX idx_is_active (is_active),
    INDEX idx_billing_period (billing_period),
    INDEX idx_price (price)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    plan_id CHAR(36) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    status ENUM('active', 'canceled', 'past_due', 'trialing', 'incomplete') NOT NULL,
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    canceled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_plan_id (plan_id),
    INDEX idx_status (status),
    INDEX idx_stripe_subscription_id (stripe_subscription_id),
    INDEX idx_current_period_end (current_period_end)
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('direct', 'group', 'support') NOT NULL,
    name VARCHAR(255),
    description TEXT,
    created_by CHAR(36) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_message_at TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_type (type),
    INDEX idx_is_active (is_active),
    INDEX idx_last_activity_at (last_activity_at)
);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    room_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role ENUM('admin', 'moderator', 'member') NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP,
    is_muted BOOLEAN NOT NULL DEFAULT false,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_user (room_id, user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role),
    INDEX idx_joined_at (joined_at)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    room_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('text', 'image', 'file', 'audio', 'video') NOT NULL DEFAULT 'text',
    reply_to_id CHAR(36),
    attachments JSON,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    edited_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL,
    INDEX idx_room_id (room_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_created_at (created_at),
    INDEX idx_reply_to_id (reply_to_id),
    INDEX idx_type (type),
    FULLTEXT idx_content (content)
);

-- Update users table to add Stripe customer ID if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD INDEX IF NOT EXISTS idx_stripe_customer_id (stripe_customer_id);

-- Update products table to add new digital product fields if not exists
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_digital BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS digital_file_size BIGINT,
ADD COLUMN IF NOT EXISTS view_count INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sales_count INT NOT NULL DEFAULT 0,
ADD INDEX IF NOT EXISTS idx_is_digital (is_digital),
ADD INDEX IF NOT EXISTS idx_view_count (view_count),
ADD INDEX IF NOT EXISTS idx_sales_count (sales_count);

-- Create triggers to update subscriber count in subscription_plans
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_subscriber_count_on_insert 
AFTER INSERT ON subscriptions
FOR EACH ROW
BEGIN
    UPDATE subscription_plans 
    SET subscriber_count = (
        SELECT COUNT(*) FROM subscriptions 
        WHERE plan_id = NEW.plan_id AND status IN ('active', 'trialing')
    )
    WHERE id = NEW.plan_id;
END//

CREATE TRIGGER IF NOT EXISTS update_subscriber_count_on_update
AFTER UPDATE ON subscriptions
FOR EACH ROW
BEGIN
    UPDATE subscription_plans 
    SET subscriber_count = (
        SELECT COUNT(*) FROM subscriptions 
        WHERE plan_id = NEW.plan_id AND status IN ('active', 'trialing')
    )
    WHERE id = NEW.plan_id;
    
    -- Update old plan if plan changed
    IF OLD.plan_id != NEW.plan_id THEN
        UPDATE subscription_plans 
        SET subscriber_count = (
            SELECT COUNT(*) FROM subscriptions 
            WHERE plan_id = OLD.plan_id AND status IN ('active', 'trialing')
        )
        WHERE id = OLD.plan_id;
    END IF;
END//

CREATE TRIGGER IF NOT EXISTS update_subscriber_count_on_delete
AFTER DELETE ON subscriptions
FOR EACH ROW
BEGIN
    UPDATE subscription_plans 
    SET subscriber_count = (
        SELECT COUNT(*) FROM subscriptions 
        WHERE plan_id = OLD.plan_id AND status IN ('active', 'trialing')
    )
    WHERE id = OLD.plan_id;
END//

-- Create trigger to update last_message_at in chat_rooms
CREATE TRIGGER IF NOT EXISTS update_room_last_message
AFTER INSERT ON chat_messages
FOR EACH ROW
BEGIN
    UPDATE chat_rooms 
    SET last_message_at = NEW.created_at,
        last_activity_at = NEW.created_at
    WHERE id = NEW.room_id;
END//

DELIMITER ;

-- Insert some sample subscription plans (optional)
INSERT IGNORE INTO subscription_plans (id, creator_id, name, description, price, currency, billing_period, features, is_active) VALUES
(UUID(), 
 (SELECT id FROM users WHERE role = 'creator' LIMIT 1), 
 'Basic Plan', 
 'Access to basic content and features', 
 9.99, 
 'USD', 
 'monthly', 
 JSON_ARRAY('Basic content access', 'Monthly newsletters', 'Community forum access'),
 true),
(UUID(), 
 (SELECT id FROM users WHERE role = 'creator' LIMIT 1), 
 'Premium Plan', 
 'Full access to all premium content', 
 19.99, 
 'USD', 
 'monthly', 
 JSON_ARRAY('Premium content access', 'Weekly exclusive content', 'Direct messaging', 'Priority support'),
 true),
(UUID(), 
 (SELECT id FROM users WHERE role = 'creator' LIMIT 1), 
 'VIP Plan', 
 'VIP access with personal interaction', 
 199.99, 
 'USD', 
 'yearly', 
 JSON_ARRAY('All premium features', 'Personal video calls', 'Custom content requests', '24/7 priority support'),
 true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_status ON subscriptions(plan_id, status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_room ON chat_participants(user_id, room_id);

COMMIT;