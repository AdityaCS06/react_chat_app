import React, { useState } from "react";

const COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-indigo-500 to-blue-500",
];

const Avatar = ({ src, name, className = "", textClassName = "" }) => {
  const [error, setError] = useState(false);

  if (src && !error) {
    return (
      <img
        src={src}
        alt=""
        onError={() => setError(true)}
        className={className}
      />
    );
  }

  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const color = COLORS[(name || "U").charCodeAt(0) % COLORS.length];

  return (
    <div className={`bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold ${className}`}>
      <span className={textClassName || "text-sm"}>{initials}</span>
    </div>
  );
};

export default Avatar;
