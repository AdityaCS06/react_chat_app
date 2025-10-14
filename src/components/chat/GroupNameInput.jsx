import React from "react";

const GroupNameInput = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-1">Group Name</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter group name"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default GroupNameInput;
