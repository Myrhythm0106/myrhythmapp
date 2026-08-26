import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  UNDO_WINDOW_MS,
  DELETE_WORDING,
  undoToastTitle,
} from "@/lib/deleteStandard";

interface UndoableDeleteOptions {
  /** Stable id of the thing being removed. */
  id: string;
  /** Human name, shown in the toast in quotes. */
  label?: string;
  /** Remove it from the on-screen list straight away. */
  onOptimisticRemove?: () => void;
  /** Put it back if the person taps Undo. */
  onRestore?: () => void;
  /** The real delete. Runs once the undo window closes. */
  onCommit: () => void | Promise<void>;
  /** Item came from a Memory Bridge capture — reassure instead of warn. */
  fromCapture?: boolean;
  /** Override the toast description. */
  description?: string;
}

/**
 * Tier 1 of the delete standard: remove now, commit after the undo window.
 *
 * Only use this where Undo is honest. If we cannot genuinely restore the item,
 * it belongs in Tier 2 (confirm dialog) instead.
 */
export function useUndoableDelete() {
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const flush = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      // Commit anything still pending rather than silently losing the delete.
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, []);

  const deleteWithUndo = useCallback(
    ({
      id,
      label,
      onOptimisticRemove,
      onRestore,
      onCommit,
      fromCapture,
      description,
    }: UndoableDeleteOptions) => {
      flush(id);
      onOptimisticRemove?.();

      let undone = false;

      const timer = setTimeout(() => {
        timers.current.delete(id);
        if (!undone) {
          void Promise.resolve(onCommit()).catch(() => {
            onRestore?.();
            toast.error("Couldn't remove that", {
              description: "It's been put back. Please try again.",
            });
          });
        }
      }, UNDO_WINDOW_MS);

      timers.current.set(id, timer);

      toast(undoToastTitle(label), {
        description:
          description ?? (fromCapture ? DELETE_WORDING.traceable : undefined),
        duration: UNDO_WINDOW_MS,
        action: {
          label: "Undo",
          onClick: () => {
            undone = true;
            flush(id);
            onRestore?.();
          },
        },
      });
    },
    [flush]
  );

  return { deleteWithUndo };
}
