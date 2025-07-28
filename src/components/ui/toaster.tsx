
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts && toasts.map(function ({ id, title, description, action, ...props }) {
        return (
            <Toast 
              key={id} 
              {...props} 
              className="bg-gradient-to-r from-purple-50 to-blue-50"
              onOpenChange={(open) => {
                if (!open) dismiss(id)
              }}
            >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-purple-800 font-semibold">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-purple-700">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-purple-600 hover:text-purple-800" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
