CREATE DATABASE IF NOT EXISTS Portofolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Portofolio;

CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role        ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE,
    nama_lengkap    VARCHAR(100),
    nama_panggilan  VARCHAR(50),
    tempat_lahir    VARCHAR(100),
    tanggal_lahir   DATE,
    email           VARCHAR(100),
    telepon         VARCHAR(20),
    universitas     VARCHAR(150),
    fakultas        VARCHAR(150),
    prodi           VARCHAR(150),
    semester        VARCHAR(10),
    alamat          TEXT,
    foto_url        TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experiences (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    posisi      VARCHAR(150) NOT NULL,
    perusahaan  VARCHAR(150) NOT NULL,
    durasi      VARCHAR(100) NOT NULL,
    deskripsi   TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    judul         VARCHAR(200) NOT NULL,
    deskripsi     TEXT,
    gambar_url    TEXT,
    link_project  TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skills (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    nama_skill  VARCHAR(100) NOT NULL,
    icon_class  VARCHAR(100) DEFAULT 'fas fa-code',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, password_hash, role) VALUES
('admin', 'yeftadwi', 'admin')
ON DUPLICATE KEY UPDATE id=id;