CREATE TABLE IF NOT EXISTS servers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_sync TIMESTAMP NULL,
  UNIQUE KEY url_idx (url)
);

CREATE TABLE IF NOT EXISTS credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY username_server (username, server_id),
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_id INT NOT NULL,
  category_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_id INT NULL,
  badges JSON DEFAULT NULL COMMENT 'Array of badge objects with type and value',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY category_server (category_id, server_id),
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_id INT NOT NULL,
  stream_id INT NOT NULL,
  num INT NULL,
  name VARCHAR(255) NOT NULL,
  stream_type VARCHAR(50) NOT NULL,
  stream_icon VARCHAR(255),
  epg_channel_id VARCHAR(255),
  added TIMESTAMP NULL,
  category_id VARCHAR(255),
  custom_sid VARCHAR(255),
  tv_archive BOOLEAN DEFAULT FALSE,
  direct_source VARCHAR(255),
  tv_archive_duration INT DEFAULT 0,
  is_adult BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY stream_server (stream_id, server_id),
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);