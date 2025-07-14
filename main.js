// --- 引入必要的魔法模組 ---
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// --- 船長的主要指令 ---
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 當視窗準備好後，就命令魔法羅盤開始檢查更新。
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

// --- 監聽船隻的各種狀態 ---
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- 自動更新魔法羅盤的細節設定 ---
autoUpdater.on('checking-for-update', () => {
  console.log('正在尋找新版本的寶藏圖...');
});

autoUpdater.on('update-available', (info) => {
  console.log('找到了！新版本的寶藏圖！', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('目前的寶藏圖已經是最新版了。', info);
});

autoUpdater.on('error', (err) => {
  console.log('糟糕！魔法羅盤在尋寶途中迷路了：', err);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('新寶藏圖已經下載完畢！將在關閉程式後自動更換。');
});