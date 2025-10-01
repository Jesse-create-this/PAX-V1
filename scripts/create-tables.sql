-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('student', 'issuer', 'admin')),
    name TEXT,
    email TEXT,
    institution_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Credentials table
CREATE TABLE IF NOT EXISTS credentials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_wallet TEXT NOT NULL,
    issuer_wallet TEXT NOT NULL,
    credential_hash TEXT UNIQUE NOT NULL,
    document_type TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'verified', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    wallet_address TEXT,
    user_agent TEXT,
    ip_address TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily analytics table
CREATE TABLE IF NOT EXISTS daily_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_visitors INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    credentials_issued INTEGER DEFAULT 0,
    verifications INTEGER DEFAULT 0,
    wallet_connections INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_credentials_student_wallet ON credentials(student_wallet);
CREATE INDEX IF NOT EXISTS idx_credentials_issuer_wallet ON credentials(issuer_wallet);
CREATE INDEX IF NOT EXISTS idx_credentials_hash ON credentials(credential_hash);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_wallet ON analytics_events(wallet_address);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
