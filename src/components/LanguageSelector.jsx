import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { requestNotificationPermission } from "../reminders/notificationService.js";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (!("Notification" in window)) {
      return "unsupported";
    }

    return Notification.permission;
  });

  const [showNotificationMessage, setShowNotificationMessage] = useState(false);

  useEffect(() => {
    function updatePermission() {
      if (!("Notification" in window)) {
        setNotificationPermission("unsupported");
        return;
      }

      setNotificationPermission(Notification.permission);
    }

    updatePermission();
  }, []);

  async function handleNotificationPermission() {
    if (notificationPermission === "denied") {
      setShowNotificationMessage(true);
      return;
    }

    const granted = await requestNotificationPermission();

    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    setNotificationPermission(granted ? "granted" : Notification.permission);

    setShowNotificationMessage(false);
  }

  function handleChange(event) {
    setLanguage(event.target.value);
  }

  function getNotificationIcon() {
    if (notificationPermission === "granted") {
      return "🔔";
    }

    if (notificationPermission === "denied") {
      return "🔕";
    }

    return "🔔";
  }

  function getNotificationMessage() {
    if (notificationPermission === "denied") {
      return "As notificações estão bloqueadas no navegador. Altere a permissão nas configurações deste site.";
    }

    if (notificationPermission === "unsupported") {
      return "Este navegador não oferece suporte a notificações.";
    }

    return "Clique para permitir as notificações do Lembrol.";
  }

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={language}
        onChange={handleChange}
        className="px-3 py-2 rounded-md bg-stone-200 text-stone-700 focus:outline-none"
      >
        <option value="pt-BR">Português (Brasil)</option>
        <option value="en-US">English (US)</option>
      </select>

      <button
        type="button"
        onClick={handleNotificationPermission}
        className="px-3 py-2 rounded-md bg-stone-200 text-stone-700 hover:bg-stone-300"
        title="Notifications"
      >
        {getNotificationIcon()}
      </button>

      {showNotificationMessage && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-md bg-stone-800 p-3 text-sm text-white shadow-lg">
          {getNotificationMessage()}
        </div>
      )}
    </div>
  );
}
