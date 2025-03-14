const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');

let mainWindow;

// Функция для поиска порта, на котором запущен клиент
function findClientPort(startPort = 3001, endPort = 3010, attempts = 20) {
  return new Promise((resolve) => {
    let tries = 0;

    function checkPort(port) {
      if (tries >= attempts) {
        console.error(
          '❌ Клиент не найден после 20 попыток. Загружаем локальные файлы.'
        );
        return resolve(null);
      }

      tries++;
      const server = net.createServer();

      server.once('error', () => {
        checkPort(port + 1);
      });

      server.once('listening', () => {
        server.close();
        resolve(port);
      });

      server.listen(port);
    }

    checkPort(startPort);
  });
}

// Создаём окно Electron после нахождения порта клиента
async function createWindow() {
  const clientPort = await findClientPort(3001, 3010);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  let startUrl;

  if (clientPort) {
    console.log(`✅ Найден клиент на порту: ${clientPort}`);
    startUrl = `http://localhost:${clientPort}`;
  } else {
    console.error('❌ Клиент не найден! Загружаем локальные файлы.');
    startUrl = `file://${path.join(__dirname, '../build/index.html')}`;
  }

  console.log(`🚀 Загружаем клиент из: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.on('did-fail-load', () => {
    console.error('❌ Ошибка загрузки клиента! Пересоберите клиент.');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
