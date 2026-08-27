import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="lembrol-confirm-dialog">
        <div className="lembrol-modal-icon">!</div>

        <h2 className="text-xl font-bold text-slate-100">{title}</h2>

        <p className="mt-2 text-slate-400">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="lembrol-secondary-button"
          >
            {t("common", "cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="lembrol-danger-button"
          >
            {t("common", "delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
