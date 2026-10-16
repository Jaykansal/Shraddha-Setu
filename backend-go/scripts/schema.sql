-- ShraddhaSetu PostgreSQL Database Schema
-- Run this script to initialize PostgreSQL tables

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(64) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'CLIENT', -- 'CLIENT', 'PANDIT', 'ADMIN'
    city VARCHAR(128) NOT NULL,
    gurukul VARCHAR(255) DEFAULT '',
    vedic_specialization VARCHAR(255) DEFAULT '',
    experience_years INT DEFAULT 0,
    languages TEXT DEFAULT 'Hindi,Sanskrit',
    is_verified BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    poojas_conducted INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);

CREATE TABLE IF NOT EXISTS poojas (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    price_without_samagri INT NOT NULL,
    samagri_cost INT NOT NULL,
    price_with_samagri INT NOT NULL,
    duration VARCHAR(64) NOT NULL,
    deity VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    samagri_included BOOLEAN DEFAULT TRUE,
    image VARCHAR(255) NOT NULL,
    samagri_kit TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    booking_code VARCHAR(32) UNIQUE NOT NULL,
    client_id VARCHAR(64) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(64) NOT NULL,
    client_email VARCHAR(255) DEFAULT '',
    pooja_id VARCHAR(64) NOT NULL REFERENCES poojas(id),
    pooja_title VARCHAR(255) NOT NULL,
    with_samagri BOOLEAN NOT NULL DEFAULT TRUE,
    base_price INT NOT NULL,
    samagri_price INT NOT NULL DEFAULT 0,
    total_amount INT NOT NULL,
    booking_date VARCHAR(64) NOT NULL,
    time_slot VARCHAR(64) DEFAULT 'Morning Auspicious Muhurat (09:00 AM)',
    city VARCHAR(128) NOT NULL,
    occasion VARCHAR(255) DEFAULT 'Devotional Puja',
    special_notes TEXT DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED', -- 'PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    assigned_pandit_id VARCHAR(64) DEFAULT '',
    assigned_pandit_name VARCHAR(255) DEFAULT '',
    assigned_pandit_phone VARCHAR(64) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pandit_id ON bookings(assigned_pandit_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
