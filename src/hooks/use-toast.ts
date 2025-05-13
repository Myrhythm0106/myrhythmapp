
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = React.ComponentProps<typeof sonnerToast>;

const useToast = () => {
  return {
    toast: sonnerToast,
  };
};

export { useToast, sonnerToast as toast };
