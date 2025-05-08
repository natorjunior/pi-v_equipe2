CREATE DATABASE IF NOT EXISTS run2learn_app;
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'ForaTemer0';
GRANT ALL PRIVILEGES ON run2learn_app.* TO 'admin'@'%';
FLUSH PRIVILEGES;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivation TEXT,
    genres TEXT
);

CREATE TABLE `group` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_alias VARCHAR(100) UNIQUE NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES user(id)
);

CREATE TABLE checkin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `group`(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE group_participant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `group`(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE checkin (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES "group"(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id)
);