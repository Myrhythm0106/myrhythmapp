
import * as React from "react"
import { createContext, useContext } from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

interface ToastContextType {
  toast: (props: ToastProps & { description?: React.ReactNode }) => void
  dismiss: (toastId: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function toast(props: ToastProps & { description?: React.ReactNode }) {
  const { toast } = useToast()
  return toast(props)
}
