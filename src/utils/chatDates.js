const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toDate = (value) => new Date(value);

const getDayStart = (value) => {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const isSameDay = (first, second) => {
  if (!first || !second) return false;
  const firstDay = getDayStart(first);
  const secondDay = getDayStart(second);
  return firstDay.getTime() === secondDay.getTime();
};

export const formatDateSeparator = (dateValue) => {
  if (!dateValue) return "";

  const targetDay = getDayStart(dateValue);
  const today = getDayStart(new Date());
  const diffInDays = Math.round((today.getTime() - targetDay.getTime()) / DAY_IN_MS);

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays > 1 && diffInDays < 7) {
    return targetDay.toLocaleDateString([], { weekday: "long" });
  }

  return targetDay.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
