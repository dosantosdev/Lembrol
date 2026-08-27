export function getReminderDate(task) {
  if (!task.dueDate || !task.dueTime || task.reminderMinutes === null) {
    return null;
  }

  const dueDate = new Date(`${task.dueDate}T${task.dueTime}`);

  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  return new Date(dueDate.getTime() - task.reminderMinutes * 60 * 1000);
}

export function shouldRemind(task, now = new Date()) {
  if (task.completed) {
    return false;
  }

  const reminderDate = getReminderDate(task);

  if (!reminderDate) {
    return false;
  }

  return (
    now >= reminderDate && now < new Date(reminderDate.getTime() + 60 * 1000)
  );
}
