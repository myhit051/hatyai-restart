-- Users table (synced with Supabase Auth via application logic)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Matches Supabase Auth ID
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'general_user', -- 'general_user', 'technician', 'admin'
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

-- Job Categories (General job posting categories)
CREATE TABLE IF NOT EXISTS job_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- icon name
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jobs (General and Repair Jobs)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  job_type TEXT NOT NULL, -- 'repair', 'general'
  category_id TEXT,
  subcategory TEXT, -- for specific job types
  posting_type TEXT NOT NULL, -- 'hiring', 'seeking'
  employer_id TEXT, -- for hiring posts
  seeker_id TEXT, -- for seeking posts
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  location TEXT,
  coordinates TEXT, -- JSON {lat, lng}
  work_location_type TEXT DEFAULT 'onsite', -- 'onsite', 'remote', 'hybrid'
  wage_type TEXT, -- 'daily', 'hourly', 'per_project', 'negotiable'
  wage_amount DECIMAL(10, 2),
  wage_currency TEXT DEFAULT 'THB',
  work_duration TEXT, -- e.g., '3 days', '2 weeks', 'ongoing'
  skills_required TEXT, -- JSON array or comma-separated
  requirements TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  urgency TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  images TEXT, -- JSON array of URLs
  view_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES job_categories(id),
  FOREIGN KEY (employer_id) REFERENCES users(id),
  FOREIGN KEY (seeker_id) REFERENCES users(id)
);

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  applicant_id TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'applied', -- 'applied', 'viewed', 'contacted', 'rejected', 'accepted'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (applicant_id) REFERENCES users(id)
);

-- Job Contacts (Track contact information access)
CREATE TABLE IF NOT EXISTS job_contacts (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  contact_shown BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
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
