import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, textarea, ...props }, ref) {
  return (
    <div className="mb-5">
      <label className="lembrol-label">{label}</label>

      {textarea ? (
        <textarea ref={ref} className="lembrol-input resize-y" {...props} />
      ) : (
        <input ref={ref} className="lembrol-input" {...props} />
      )}
    </div>
  );
});

export default Input;
