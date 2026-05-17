import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditGroupModal = ({ isOpen, onClose, chat, onSave, loading }) => {
  const [groupName, setGroupName] = useState(chat?.name || "");

  useEffect(() => {
    if (isOpen) {
      setGroupName(chat?.name || "");
    }
  }, [isOpen, chat?.name]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!groupName.trim()) return;
    onSave(groupName.trim());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden mx-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60">
            <h2 className="text-lg font-semibold text-slate-800">Edit Group</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400"
              autoFocus
            />
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-slate-200/60 bg-slate-50/50">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !groupName.trim()}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditGroupModal;