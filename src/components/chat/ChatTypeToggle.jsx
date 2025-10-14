import React from "react";

const ChatTypeToggle = ({ isGroup, onToggle }) => (
  <div className="flex items-center justify-between mb-4">
    <label className="text-gray-700 font-medium">Is Group Chat?</label>
    <input
      type="checkbox"
      checked={isGroup}
      onChange={(e) => onToggle(e.target.checked)}
      className="w-5 h-5 accent-blue-600"
    />
  </div>
);

export default ChatTypeToggle;
