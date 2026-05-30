import React from "react";

const DateSeparator = ({ label }) => {
  return (
    <div className="pointer-events-none flex justify-center py-3 sm:py-4">
      <div className="max-w-full rounded-full border border-white/60 bg-white/75 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm shadow-slate-300/30 backdrop-blur-md dark:border-gray-700/70 dark:bg-gray-800/75 dark:text-slate-200 dark:shadow-black/20 sm:px-4 sm:text-xs">
        {label}
      </div>
    </div>
  );
};

export default DateSeparator;
