DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'movie',
  year INTEGER,
  rating REAL,
  runtime INTEGER,
  poster TEXT,
  backdrop TEXT,
  description TEXT,
  genres TEXT,         -- JSON array: '["Action", "Sci-Fi"]'
  director TEXT,
  cast TEXT,           -- JSON array: '["Matthew McConaughey", "Anne Hathaway"]'
  featured INTEGER DEFAULT 0,
  trending INTEGER DEFAULT 0,
  popular INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movies_slug ON movies(slug);
