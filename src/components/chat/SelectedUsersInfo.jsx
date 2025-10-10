import React from "react";

const SelectedUsersInfo = ({ selectedUsers }) => {
  if (selectedUsers.length === 0) return null;
  return (
    <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
      <p>Selected Users: {selectedUsers.length}</p>
      <p>User IDs: {selectedUsers.map((u) => u.id).join(", ")}</p>
    </div>
  );
};

export default SelectedUsersInfo;
