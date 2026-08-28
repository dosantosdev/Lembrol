import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  showNotification: (title, body, tag) => {
    ipcRenderer.send("show-notification", {
      title,
      body,
      tag,
    });
  },
});
