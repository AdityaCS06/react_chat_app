import React from "react";

const FormInput = ({ label, type = "text", name, value, onChange, error }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} transition`}
      />
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;