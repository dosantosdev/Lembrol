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

const trayIconPaths = {
  0: path.join(__dirname, "../build/tray-0-32.png"),

  1: path.join(__dirname, "../build/tray-1-32.png"),

  2: path.join(__dirname, "../build/tray-2-32.png"),

  3: path.join(__dirname, "../build/tray-3-32.png"),

  4: path.join(__dirname, "../build/tray-4-32.png"),

  5: path.join(__dirname, "../build/tray-5-32.png"),

  6: path.join(__dirname, "../build/tray-6-32.png"),

  7: path.join(__dirname, "../build/tray-7-32.png"),

  8: path.join(__dirname, "../build/tray-8-32.png"),

  9: path.join(__dirname, "../build/tray-9-32.png"),

  plus: path.join(__dirname, "../build/tray-9plus-32.png"),
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,

    icon: path.join(__dirname, "../build/icon.ico"),

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
  const iconPath = trayIconPaths[0];

  if (!fs.existsSync(iconPath)) {
    return nativeImage.createEmpty();
  }

  return nativeImage.createFromPath(iconPath);
}

function getTrayIconPath(count) {
  if (count <= 0) {
    return trayIconPaths[0];
  }

  if (count >= 10) {
    return trayIconPaths.plus;
  }

  return trayIconPaths[count];
}

function updateTrayCount(count) {
  if (!tray) {
    return;
  }

  const normalizedCount = Math.max(0, Number(count) || 0);

  const iconPath = getTrayIconPath(normalizedCount);

  if (!iconPath || !fs.existsSync(iconPath)) {
    tray.setImage(createTrayIcon());
  } else {
    tray.setImage(nativeImage.createFromPath(iconPath));
  }

  if (normalizedCount === 0) {
    tray.setToolTip("Lembrol");

    return;
  }

  tray.setToolTip(
    normalizedCount === 1
      ? "Lembrol — 1 lembrete ativo"
      : `Lembrol — ${normalizedCount} lembretes ativos`,
  );
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
 * Recebe do React a quantidade
 * de lembretes ativos.
 */
ipcMain.on("update-tray-count", (_event, count) => {
  updateTrayCount(count);
});

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
