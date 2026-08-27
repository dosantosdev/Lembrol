import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(function Modal({ children, buttonCaption }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
    };
  });

  return createPortal(
    <dialog ref={dialog} className="lembrol-modal">
      <div className="lembrol-modal__content">
        {children}

        <form method="dialog" className="mt-6 flex justify-end">
          <button type="submit" className="lembrol-primary-button">
            {buttonCaption}
          </button>
        </form>
      </div>
    </dialog>,
    document.getElementById("modal-root"),
  );
});

export default Modal;
