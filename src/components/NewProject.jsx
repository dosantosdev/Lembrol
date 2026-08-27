import { useRef } from "react";
import { useProjectContext } from "../store/ProjectContext.jsx";
import Input from "./Input.jsx";
import Modal from "./Modal.jsx";

export default function NewProject() {
  const { dispatch } = useProjectContext();

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
        id: Math.random(),
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
      <Modal ref={modal} buttonCaption="Okay">
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>

        <p className="text-stone-600 mb-4">
          Oops.. looks like you forgot to enter a value.
        </p>

        <p className="text-stone-600 mb-4">
          Please make sure you provide a valid value for every input field.
        </p>
      </Modal>

      <div className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              className="text-stone-800 hover:text-stone-950"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </li>

          <li>
            <button
              className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:text-stone-950"
              onClick={handleSave}
            >
              Save
            </button>
          </li>
        </menu>

        <div>
          <Input type="text" ref={title} label="Title" />
          <Input ref={description} label="Description" textarea />
          <Input type="date" ref={duedate} label="Due Date" />
        </div>
      </div>
    </>
  );
}
