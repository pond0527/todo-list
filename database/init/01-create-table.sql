USE todo;

-- ユーザーを管理
CREATE TABLE IF NOT EXISTS member (
  member_id VARCHAR(26) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- TODOを管理
CREATE TABLE IF NOT EXISTS todo (
  todo_id VARCHAR(26) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  detail VARCHAR(2000),
  assign_member_id VARCHAR(26),
  toto_status VARCHAR(10) NOT NULL,  -- Open/Doing/Pending/Done,
  is_warning BOOLEAN NOT NULL DEFAULT false,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- グループを管理 
CREATE TABLE IF NOT EXISTS todo_group (
  group_id VARCHAR(26) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);




-- next auth(session)
-- TODO: スキーマ分離
-- USE user;
CREATE TABLE  IF NOT EXISTS  user(
  user_id VARCHAR(26) PRIMARY KEY,
  name VARCHAR(255),
  password TEXT NOT NULL, -- 暗号化
  salt  TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
