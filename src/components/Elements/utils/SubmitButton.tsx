import React from "react";

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
    >
      {label}
    </button>
  );
}

export default SubmitButton;
