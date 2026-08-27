import { showNotification } from "./notificationService.js";
import { playReminderSound } from "./soundService.js";

export function triggerReminderAlert(task, settings) {
  if (settings.notification) {
    showNotification("Lembrol", {
      body: task.text,
      tag: `lembrol-${task.id}`,
    });
  }

  if (settings.sound) {
    playReminderSound();
  }
}
