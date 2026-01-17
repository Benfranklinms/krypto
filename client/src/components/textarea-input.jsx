export default function TextareaInput({ value, onChange, placeholder, readOnly, className }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
        className || "min-h-37.5"
      }`}
    />
  )
}
