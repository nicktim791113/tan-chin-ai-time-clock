// --- 引入必要的魔法模組 ---
// `app` 模組：控制我們應用程式生命週期的魔法師，像是船的啟動與熄火。
// `BrowserWindow` 模組：用來創造應用程式視窗的魔法師，就像是船上的窗戶。
// `autoUpdater` 模組：從 `electron-updater` 來的魔法羅盤，負責自動更新。
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path'); // `path` 是 Node.js 內建的工具，幫助我們處理檔案路徑，確保在不同電腦上都能找到對的路。

// --- 船長的主要指令 ---

// createWindow 函數：這是我們最重要的指令，用來「建造並打開船艙的主視窗」。
function createWindow() {
  // 創造一個新的瀏覽器視窗 (我們的船艙主視窗)。
  const mainWindow = new BrowserWindow({
    // 設定視窗的初始寬度。
    width: 1200,
    // 設定視窗的初始高度。
    height: 900,
    // `webPreferences` 是一些與網頁內容相關的進階設定。
    webPreferences: {
      // `nodeIntegration: true` 是一個強大的魔法，它允許我們在網頁(index.html)中，直接使用 Node.js 的能力，比如讀寫檔案。
      // 對於一個完全本地端的應用程式，這是最簡單的入門方式。
      nodeIntegration: true,
      // `contextIsolation: false` 關閉了上下文隔離。與上面一樣，這是為了簡化開發，讓網頁與Electron主程式能更輕易地溝通。
      // 注意：如果要載入外部網站，基於安全考量，建議將這兩項設為預設值(false 和 true)，並使用 preload.js 腳本。但對於我們自己的本地檔案，這樣設定很方便。
      contextIsolation: false
    }
  });

  // 讓主視窗載入我們的寶藏圖 `index.html`。
  // `path.join(__dirname, 'index.html')` 會產生一個絕對路徑，確保萬無一失。
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 這行是給喜歡探險的你，可以在測試時打開開發者工具，就像得到一個能看透船隻內部結構的魔法鏡。
  // mainWindow.webContents.openDevTools();

  // 當視窗準備好後，就命令魔法羅盤開始檢查更新。
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

// --- 監聽船隻的各種狀態 ---

// `app.whenReady()`: 這是一個承諾。當 Electron 完成所有初始化，我們的船已經準備好啟航時，就執行 `.then()` 裡面的指令。
app.whenReady().then(() => {
  // 啟航！呼叫 createWindow 指令來打開主視窗。
  createWindow();

  // 這是針對 macOS 的特別指令。在 macOS 上，即使所有視窗都關閉了，應用程式通常還會留在 Dock 上。
  // 當使用者點擊 Dock 圖示時，如果沒有開啟的視窗，就再重新打開一個。
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// `app.on('window-all-closed', ...)`: 當所有的船窗都關閉時觸發。
app.on('window-all-closed', () => {
  // 在 Windows 和 Linux 上，關閉所有視窗通常意味著要完全退出應用程式。
  // `process.platform` 可以判斷當前的作業系統。'darwin' 就是 macOS。
  // 所以，如果不是在 macOS 上，我們就呼叫 `app.quit()` 讓船隻完全熄火。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- 自動更新魔法羅盤的細節設定 ---
// 這裡我們監聽魔法羅盤回報的各種訊息，你可以客製化提示給使用者。

// 當開始檢查更新時...
autoUpdater.on('checking-for-update', () => {
  console.log('正在尋找新版本的寶藏圖...');
});

// 當找到新版本時...
autoUpdater.on('update-available', (info) => {
  console.log('找到了！新版本的寶藏圖！', info);
});

// 當沒有新版本時...
autoUpdater.on('update-not-available', (info) => {
  console.log('目前的寶藏圖已經是最新版了。', info);
});

// 當更新出錯時...
autoUpdater.on('error', (err) => {
  console.log('糟糕！魔法羅盤在尋寶途中迷路了：', err);
});

// 當新版本下載完成時...
autoUpdater.on('update-downloaded', (info) => {
  console.log('新寶藏圖已經下載完畢！將在關閉程式後自動更換。');
  // 你可以在這裡跳出一個提示，詢問使用者是否要立刻重新啟動來安裝更新。
});