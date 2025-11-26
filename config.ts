
// ==============================================================================
// 全局配置文件 / GLOBAL CONFIGURATION
// ==============================================================================
// 💡 说明 / INSTRUCTIONS:
// 为了实现像 Firebase 一样的“全员自动同步”，请将您的 JSONBin 密钥填入下方。
// 填好后，任何打开此网页的人（包括您的手机）都会自动连接到同一个云端数据库。
//
// To achieve "Instant Sync" for everyone, fill in your JSONBin keys below.
// Once filled, anyone opening this app will automatically connect to the same cloud data.
// ==============================================================================

export const APP_CONFIG = {
  // 1. 设置为 true 以启用云端同步 / Set to true to enable cloud sync
  ENABLE_CLOUD_SYNC: true,

  // 2. 您的 Bin ID (从 Admin 后台获取) / Your Bin ID
  // 例如 / Example: "65f8a1234..."
  CLOUD_BIN_ID: "", 

  // 3. 您的 Master Key (从 Admin 后台获取) / Your Master Key
  // 例如 / Example: "$2a$10$AbCdEf..."
  CLOUD_API_KEY: "",

  // (可选) 如果您只想用本地演示模式，保持上方为空即可。
};
