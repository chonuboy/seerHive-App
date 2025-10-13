// components/Elements/utils/CloseButton.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { Dialog } from "@headlessui/react";

interface CloseButtonProps {
  onClose: () => void;
  hasUnsavedChanges?: boolean;
  confirmationMessage?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CloseButton({
  onClose,
  hasUnsavedChanges = false,
  confirmationMessage = "Are you sure you want to close? Any unsaved changes will be lost.",
  className = "",
  size = "md"
}: CloseButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onClose();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          text-gray-400 hover:text-gray-600
          hover:bg-gray-100 rounded-full
          transition-colors duration-200
          ${className}
        `}
        aria-label="Close"
      >
        <X className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"}`} />
      </button>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={handleCancel}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Close
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-6">
              {confirmationMessage}
            </Dialog.Description>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Close Anyway
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}