// 在卷軸的開頭，我們從魔法書架上拿出所有需要的魔法元素
const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// 我們需要一個全域變數來存放我們的主要宮殿(視窗)，
// 這樣它才不會因為魔法世界的規則而被意外清除
let mainWindow;

/**
 * 咒語一：建造水晶宮殿 (創建瀏覽器視窗)
 */
function createWindow() {
  // 實例化一個新的 BrowserWindow，設定它的外觀與大小
  mainWindow = new BrowserWindow({
    width: 1200,    // 宮殿的寬度
    height: 900,    // 宮殿的高度
    webPreferences: {
      // 這是關鍵的咒語，允許視窗內的魔法卷軸（前端頁面）
      // 使用 Node.js 的力量，就像讓卷軸也能使用書房裡的工具
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'assets/icon.png') // 視窗左上角的圖示
  });

  // 讓宮殿載入你的主要魔法卷軸 (index.html)
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 當宮殿被關閉時，我們需要確保它的參考也被清除
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

/**
 * 咒語二：訓練並喚醒魔法信鴿 (設定自動更新)
 */
function setupAutoUpdater() {
  // 讓信鴿立刻去遠方的皇家發布台(GitHub Releases)檢查一次有沒有新消息
  autoUpdater.checkForUpdatesAndNotify();

  // 設定信鴿的行為模式...

  // 當信鴿回報「有新版本喔！」的時候，我們在背景默默做事
  autoUpdater.on('update-available', (info) => {
    console.log('發現新版本，版本號:', info.version);
    // 在這裡你也可以彈出一個提示，告訴使用者「正在為您下載新版本...」
  });

  // 當信鴿沒有發現任何新版本時
  autoUpdater.on('update-not-available', (info) => {
    console.log('目前已是最新版本，版本號:', info.version);
  });

  // 當更新過程中發生錯誤時
  autoUpdater.on('error', (err) => {
    console.error('自動更新出錯:', err.message);
    // dialog.showErrorBox('更新失敗', `更新過程中發生錯誤，請稍後再試。\n\n錯誤訊息: ${err.message}`);
  });

  // 當信鴿成功將新的建築藍圖(更新檔)下載回來時
  autoUpdater.on('update-downloaded', (info) => {
    console.log('新版本下載完成，版本號:', info.version);
    
    // 跳出一個對話框，詢問使用者是否要立即進行宮殿的翻修(安裝更新)
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '發現新版本',
      message: `發現了新的版本 (${info.version})，是否要立即重新啟動應用程式以進行更新？`,
      buttons: ['馬上更新', '稍後再說'],
      defaultId: 0, // 預設按鈕是 "馬上更新"
      cancelId: 1   // 點擊 "稍後再說" 或關閉視窗時的行為
    }).then(result => {
      if (result.response === 0) {
        // 如果使用者選擇 "馬上更新"，則執行這個強大的咒語
        autoUpdater.quitAndInstall();
      }
    });
  });
}


// =======================================================================
//                           魔法儀式的正式開始
// =======================================================================

// 當整個魔法世界(Electron)準備就緒時，我們舉行盛大的開幕儀式
app.on('ready', () => {
  // 儀式第一步：建造我們的水晶宮殿
  createWindow();

  // 儀式第二步：立刻派出魔法信鴿，檢查是否有新的皇家公告
  setupAutoUpdater();
});


// 當所有宮殿的窗戶都關閉時，就正式結束程式
// (在 macOS 上，除非使用者明確退出，否則應用程式會留在 Dock 中)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 當使用者點擊 Dock 圖示，但沒有任何宮殿視窗是開啟時
// (macOS 專用)，就重新建造一座新的宮殿
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});