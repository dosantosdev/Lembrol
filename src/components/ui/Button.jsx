export default function Button({ children, ...props }) {
  return (
    <button className="lembrol-primary-button" {...props}>
      {children}
    </button>
  );
}
