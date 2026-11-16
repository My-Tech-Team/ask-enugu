export default function MagicWrapper({ className = "", children }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}
