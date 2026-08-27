import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-stone-800">{title}</h2>

        <p className="mt-2 text-stone-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-300"
          >
            {t("common", "cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {t("common", "delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
