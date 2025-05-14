
import * as React from "react"
import { createContext, useContext, useState } from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

// Define a type for a toast
type Toast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface ToastContextType {
  toasts: Toast[]
  toast: (props: ToastProps & { title?: React.ReactNode, description?: React.ReactNode }) => void
  dismiss: (toastId: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ ...props }: ToastProps & { title?: React.ReactNode, description?: React.ReactNode }) => {
    const id = crypto.randomUUID()
    const newToast = { id, ...props }
    
    setToasts((prevToasts) => [...prevToasts, newToast])
    
    return id
  }

  const dismiss = (toastId: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }

  const value = {
    toasts,
    toast,
    dismiss
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function toast(props: ToastProps & { title?: React.ReactNode, description?: React.ReactNode }) {
  const { toast } = useToast()
  return toast(props)
}
