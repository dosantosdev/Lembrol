export function isNotificationSupported() {
  return "Notification" in window;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
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
  if (!isNotificationSupported()) {
    return null;
  }

  if (Notification.permission !== "granted") {
    return null;
  }

  return new Notification(title, options);
}
