import React, { useEffect, useRef } from "react";

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
    },
  };

  const style = types[type] || types.success;

  return (
    <div
      className={`rounded-md border ${style.border} ${style.bg} p-4 flex items-center justify-between shadow-lg`}
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div className={`text-sm ${style.text}`}>{message}</div>

      <button
        onClick={onClose}
        className="ml-3 text-gray-500 hover:text-gray-700 transition"
        aria-label="Dismiss"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
