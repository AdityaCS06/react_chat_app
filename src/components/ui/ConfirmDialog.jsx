import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "danger",
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  const confirmClass =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm mx-4 bg-white rounded-xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog;