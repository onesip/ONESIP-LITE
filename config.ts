
// ==============================================================================
// 🟢 全局配置文件 / GLOBAL APP CONFIGURATION
// ==============================================================================
// 这里是应用程序的核心配置。密钥已根据您的要求硬编码。
// This is the core configuration for the application. Keys are hardcoded as requested.
// ==============================================================================

export const APP_CONFIG = {
  // 1. 开启/关闭云端同步功能 (Enable/Disable Cloud Sync)
  // 设置为 `true`，应用将自动连接到下方指定的云端数据库。
  // Set to `true`, the app will automatically connect to the cloud database specified below.
  ENABLE_CLOUD_SYNC: true,

  // 2. 您的主内容 Bin ID (Main Content Bin ID)
  // 这个 ID 指向存储网站所有文本和设置的数据库。
  // This ID points to the database storing all website text and settings.
  CLOUD_BIN_ID: "69275df2ae596e708f72d6ce", 

  // 3. 您的 API Master Key (Your API Master Key)
  // 这是访问和修改云端数据的唯一密钥。请妥善保管。
  // This is the secret key to access and modify your cloud data. Keep it safe.
  CLOUD_API_KEY: "$2a$10$ArBj9GKj1OOnSOIUmXX1qOf2O8OrLMaTIX88Xn37hYXl97IqoKYEy",
};
