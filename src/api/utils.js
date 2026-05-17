export const getErrorMessage = (error) => {
  if (!error) return "Something went wrong";

  const responseData = error.response?.data;
  if (!responseData) return error.message || "Something went wrong";

  const detail = responseData.detail;

  if (detail) {
    if (typeof detail === "string") return detail;
    if (detail.message) return detail.message;
    if (detail.msg) return detail.msg;
    if (detail.error) return detail.error;
  }

  if (responseData.message) return responseData.message;

  return error.message || "Something went wrong";
};