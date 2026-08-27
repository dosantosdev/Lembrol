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
  const duedate = useRef();

  function handleSave() {
    const enteredTitle = title.current.value;
    const enteredDescription = description.current.value;
    const enteredDueDate = duedate.current.value;

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
        <h2 className="text-xl font-bold text-stone-700 my-4">
          {t("validation", "invalidInput")}
        </h2>

        <p className="text-stone-600 mb-4">
          {t("validation", "missingValues")}
        </p>

        <p className="text-stone-600 mb-4">
          {t("validation", "requiredFields")}
        </p>
      </Modal>

      <div className="w-140 mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              className="text-stone-800 hover:text-stone-950"
              onClick={handleCancel}
            >
              {t("common", "cancel")}
            </button>
          </li>

          <li>
            <button
              className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:text-stone-950"
              onClick={handleSave}
            >
              {t("common", "save")}
            </button>
          </li>
        </menu>

        <div>
          <Input type="text" ref={title} label={t("projects", "titleLabel")} />

          <Input
            ref={description}
            label={t("projects", "descriptionLabel")}
            textarea
          />

          <Input
            type="date"
            ref={duedate}
            label={t("projects", "dueDateLabel")}
          />
        </div>
      </div>
    </>
  );
}
