-- =========================================
-- CRIAÇÃO DO BANCO
-- =========================================

CREATE DATABASE IF NOT EXISTS manager_system
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE manager_system;

-- =========================================
-- TABELA USERS
-- =========================================

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  user_name VARCHAR(50) NOT NULL,
  position VARCHAR(50) NOT NULL,
  level_user TINYINT UNSIGNED NOT NULL,
  password_user VARCHAR(255) NOT NULL,

  reset_password TINYINT(1) NOT NULL DEFAULT 0,
  path_img VARCHAR(255) DEFAULT NULL,

  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Usuário administrador inicial
INSERT INTO users
(user_name, position, level_user, password_user)
VALUES
(
  'Administrador',
  'Administrador',
  2,
  '$2b$10$cgXznwWXzPJYfhzucYvurezYsccCUgUnJAOkyX4ZCB61bScE6fpqO'
);

-- =========================================
-- TABELA COMPUTERS
-- =========================================

DROP TABLE IF EXISTS computers;

CREATE TABLE computers (
  id_computer INT UNSIGNED NOT NULL AUTO_INCREMENT,

  name_computer VARCHAR(30) NOT NULL,
  type_computer VARCHAR(20) NOT NULL,
  mac_computer VARCHAR(30) NOT NULL,
  asset_number BIGINT UNSIGNED NOT NULL,

  status_computer TINYINT(1) NOT NULL DEFAULT 1,
  -- 1 = Ativo | 0 = Desativado

  exit_date DATE DEFAULT NULL,
  reason TEXT DEFAULT NULL,
  return_date DATE DEFAULT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id_computer),
  UNIQUE KEY uk_computer_asset (asset_number),
  UNIQUE KEY uk_computer_mac (mac_computer)
) ENGINE=InnoDB;

-- =========================================
-- TABELA PRINTERS
-- =========================================

DROP TABLE IF EXISTS printers;

CREATE TABLE printers (
  id_printer INT UNSIGNED NOT NULL AUTO_INCREMENT,

  name_printer VARCHAR(50) NOT NULL,
  mac_printer VARCHAR(30) NOT NULL,
  asset_number BIGINT UNSIGNED NOT NULL,

  status_printer TINYINT(1) NOT NULL DEFAULT 1,
  -- 1 = Ativo | 0 = Desativado

  exit_date DATE DEFAULT NULL,
  reason TEXT DEFAULT NULL,
  return_date DATE DEFAULT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id_printer),
  UNIQUE KEY uk_printer_asset (asset_number),
  UNIQUE KEY uk_printer_mac (mac_printer)
) ENGINE=InnoDB;
-- =========================================