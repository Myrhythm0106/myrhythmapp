
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
              className="bg-gradient-to-r from-neural-purple-50 to-neural-blue-50 border border-neural-indigo-200/50"
              onOpenChange={(open) => {
                if (!open) dismiss(id)
              }}
            >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-neural-purple-800 font-semibold">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-neural-indigo-700">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-neural-purple-600 hover:text-neural-purple-800" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
