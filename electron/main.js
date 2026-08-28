import {
  app,
  BrowserWindow,
  Menu,
  Notification,
  Tray,
  dialog,
  ipcMain,
  nativeImage,
} from "electron";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let tray = null;
let isQuitting = false;

const trayIconPath = path.join(__dirname, "../build/icon-32.png");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },

    autoHideMenuBar: true,
  });

  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createTrayIcon() {
  if (!fs.existsSync(trayIconPath)) {
    return nativeImage.createEmpty();
  }

  return nativeImage.createFromPath(trayIconPath);
}

function showMainWindow() {
  if (!mainWindow) {
    createWindow();
    return;
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
}

function createTray() {
  tray = new Tray(createTrayIcon());

  tray.setToolTip("Lembrol");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Abrir Lembrol",
      click: () => {
        showMainWindow();
      },
    },

    {
      type: "separator",
    },

    {
      label: "Sair",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    showMainWindow();
  });

  tray.on("double-click", () => {
    showMainWindow();
  });
}

/*
 * Notificação nativa do Windows.
 */
ipcMain.on("show-notification", (_event, data) => {
  if (!data) {
    return;
  }

  const notification = new Notification({
    title: data.title || "Lembrol",
    body: data.body || "",
    silent: true,
  });

  notification.show();
});

/*
 * Seleciona o áudio personalizado,
 * copia para a pasta de dados do Lembrol
 * e retorna somente as informações
 * necessárias para o renderer.
 */
ipcMain.handle("select-custom-sound", async () => {
  if (!mainWindow) {
    return null;
  }

  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Escolher som do alarme",

    properties: ["openFile"],

    filters: [
      {
        name: "Arquivos de áudio",

        extensions: ["mp3", "wav", "ogg", "m4a", "aac", "flac"],
      },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const selectedFile = result.filePaths[0];

  const soundsDirectory = path.join(app.getPath("userData"), "sounds");

  fs.mkdirSync(soundsDirectory, {
    recursive: true,
  });

  const extension = path.extname(selectedFile).toLowerCase();

  const destinationFile = path.join(
    soundsDirectory,
    `custom-alarm${extension}`,
  );

  try {
    fs.copyFileSync(selectedFile, destinationFile);

    return {
      path: destinationFile,
      name: path.basename(selectedFile),
    };
  } catch (error) {
    console.error("Erro ao copiar o áudio personalizado:", error);

    return null;
  }
});

/*
 * Lê o áudio personalizado e devolve
 * o conteúdo como Data URL.
 *
 * Dessa forma o renderer não precisa
 * acessar diretamente um arquivo local
 * do Windows.
 */
ipcMain.handle("get-custom-sound-data", async (_event, filePath) => {
  if (!filePath) {
    return null;
  }

  try {
    if (!fs.existsSync(filePath)) {
      console.error("Arquivo de áudio personalizado não encontrado:", filePath);

      return null;
    }

    const extension = path.extname(filePath).toLowerCase();

    const mimeTypes = {
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".ogg": "audio/ogg",
      ".m4a": "audio/mp4",
      ".aac": "audio/aac",
      ".flac": "audio/flac",
    };

    const mimeType = mimeTypes[extension];

    if (!mimeType) {
      console.error("Formato de áudio não suportado:", extension);

      return null;
    }

    const audioBuffer = await fs.promises.readFile(filePath);

    const base64 = audioBuffer.toString("base64");

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Erro ao ler o áudio personalizado:", error);

    return null;
  }
});

/*
 * Retorna o caminho dos sons padrão
 * disponíveis no Windows.
 */
ipcMain.handle("get-system-sound-path", (_event, type) => {
  const windowsDirectory = process.env.WINDIR || "C:\\Windows";

  const soundFiles = {
    notification: "Windows Notify System Generic.wav",

    alarm: "Alarm01.wav",
  };

  const fileName = soundFiles[type];

  if (!fileName) {
    return null;
  }

  const soundPath = path.join(windowsDirectory, "Media", fileName);

  if (!fs.existsSync(soundPath)) {
    return null;
  }

  return soundPath;
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    showMainWindow();
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("window-all-closed", (event) => {
  /*
   * O Lembrol continua funcionando
   * na bandeja do Windows.
   */
  event.preventDefault();
});
