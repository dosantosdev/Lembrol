export function isNotificationSupported() {
  return "electronAPI" in window || "Notification" in window;
}

export async function requestNotificationPermission() {
  // Electron não precisa pedir permissão através da API do navegador.
  if ("electronAPI" in window) {
    return true;
  }

  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export function showNotification(title, options = {}) {
  const { body = "", tag = "" } = options;

  // Quando estiver rodando dentro do Electron,
  // usa a notificação nativa do Windows.
  if ("electronAPI" in window) {
    window.electronAPI.showNotification(title, body, tag);

    return null;
  }

  // Fallback para navegador/PWA.
  if (!("Notification" in window)) {
    return null;
  }

  if (Notification.permission !== "granted") {
    return null;
  }

  return new Notification(title, options);
}
