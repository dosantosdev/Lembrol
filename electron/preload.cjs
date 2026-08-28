const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  showNotification: (title, body, tag) => {
    ipcRenderer.send("show-notification", {
      title,
      body,
      tag,
    });
  },

  getSystemSoundPath: (type) => {
    return ipcRenderer.invoke("get-system-sound-path", type);
  },

  selectCustomSound: () => {
    return ipcRenderer.invoke("select-custom-sound");
  },

  getCustomSoundData: (filePath) => {
    return ipcRenderer.invoke("get-custom-sound-data", filePath);
  },

  updateTrayCount: (count) => {
    ipcRenderer.send("update-tray-count", count);
  },
});
