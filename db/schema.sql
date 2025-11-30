-- Users table (synced with Supabase Auth via application logic)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Matches Supabase Auth ID
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'volunteer', -- 'victim', 'volunteer', 'technician', 'donor', 'coordinator'
  avatar_url TEXT,
  skills TEXT, -- JSON string or comma-separated
  location TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Resources (Donations)
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'food', 'water', 'medicine', etc.
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'items',
  donor_id TEXT NOT NULL,
  status TEXT DEFAULT 'available', -- 'available', 'assigned', 'distributed', 'expired'
  location TEXT,
  priority TEXT DEFAULT 'medium',
  quality_condition TEXT DEFAULT 'good',
  expiration_date DATETIME,
  images TEXT, -- JSON array of URLs
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id)
);

-- Resource Needs (Requests)
CREATE TABLE IF NOT EXISTS needs (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  required_quantity INTEGER DEFAULT 1,
  unit TEXT DEFAULT 'items',
  urgency TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  description TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'matched', 'fulfilled'
  matched_resource_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (matched_resource_id) REFERENCES resources(id)
);

-- Jobs (Repairs)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  job_type TEXT NOT NULL, -- 'electric', 'plumbing', 'structure', 'cleaning', 'other'
  requester_id TEXT NOT NULL,
  technician_id TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  location TEXT,
  urgency TEXT DEFAULT 'medium',
  images TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- Waste Reports
CREATE TABLE IF NOT EXISTS waste_reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL,
  waste_type TEXT NOT NULL, -- 'organic', 'plastic', 'hazardous', 'construction', 'mixed'
  description TEXT,
  location TEXT,
  coordinates TEXT, -- JSON {lat, lng}
  status TEXT DEFAULT 'reported', -- 'reported', 'acknowledged', 'in_progress', 'cleared'
  severity TEXT DEFAULT 'medium',
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);
