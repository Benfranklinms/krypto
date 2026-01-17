export function Button({ className, variant = "primary", ...props }) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50",
  }

  return <button className={`${baseStyles} ${variants[variant]} ${className || ""}`} {...props} />
}
