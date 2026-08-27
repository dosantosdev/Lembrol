import { useRef } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import { generateId } from "../../utils/id.js";
import Input from "../ui/Input.jsx";
import Modal from "../ui/Modal.jsx";

export default function NewProject() {
  const { dispatch } = useProjectContext();
  const { t } = useLanguage();

  const modal = useRef();
  const title = useRef();
  const description = useRef();
  const dueDate = useRef();

  function handleSave() {
    const enteredTitle = title.current.value;
    const enteredDescription = description.current.value;
    const enteredDueDate = dueDate.current.value;

    if (
      enteredTitle.trim() === "" ||
      enteredDescription.trim() === "" ||
      enteredDueDate.trim() === ""
    ) {
      modal.current.open();
      return;
    }

    dispatch({
      type: "ADD_PROJECT",
      payload: {
        id: generateId(),
        title: enteredTitle,
        description: enteredDescription,
        dueDate: enteredDueDate,
      },
    });
  }

  function handleCancel() {
    dispatch({
      type: "CANCEL_ADD_PROJECT",
    });
  }

  return (
    <>
      <Modal ref={modal} buttonCaption={t("common", "okay")}>
        <div className="lembrol-modal-icon">✦</div>

        <h2 className="text-xl font-bold text-slate-100">
          {t("validation", "invalidInput")}
        </h2>

        <p className="mt-3 text-slate-300">
          {t("validation", "missingValues")}
        </p>

        <p className="mt-3 text-sm text-slate-400">
          {t("validation", "requiredFields")}
        </p>
      </Modal>

      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <p className="lembrol-section-kicker">
            {t("projects", "create")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-100">
            {t("projects", "create")}
          </h1>
        </div>

        <div className="lembrol-form-card">
          <Input type="text" ref={title} label={t("projects", "titleLabel")} />

          <Input
            ref={description}
            label={t("projects", "descriptionLabel")}
            textarea
          />

          <Input
            type="date"
            ref={dueDate}
            label={t("projects", "dueDateLabel")}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="lembrol-secondary-button"
              onClick={handleCancel}
            >
              {t("common", "cancel")}
            </button>

            <button
              type="button"
              className="lembrol-primary-button"
              onClick={handleSave}
            >
              {t("common", "save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
