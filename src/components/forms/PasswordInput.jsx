import React, { useState } from "react";

const PasswordInput = ({ label, name, value, onChange, error }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? "border-red-500" : "border-gray-300"} transition`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-2 text-gray-500 text-sm font-medium hover:text-gray-700"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
