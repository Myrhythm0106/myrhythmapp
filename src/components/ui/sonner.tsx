
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-purple-50 group-[.toaster]:to-blue-50 group-[.toaster]:text-purple-900 group-[.toaster]:border-l-4 group-[.toaster]:border-l-purple-500 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-purple-700",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-purple-600 group-[.toast]:to-blue-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-purple-100 group-[.toast]:text-purple-800",
          success: "group-[.toaster]:border-l-teal-500 group-[.toaster]:from-teal-50 group-[.toaster]:to-emerald-50",
          error: "group-[.toaster]:border-l-red-500 group-[.toaster]:from-red-50 group-[.toaster]:to-pink-50",
          warning: "group-[.toaster]:border-l-amber-500 group-[.toaster]:from-amber-50 group-[.toaster]:to-orange-50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
