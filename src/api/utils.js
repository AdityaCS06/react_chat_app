export const getErrorMessage = (error) => {
  if (!error) return "Something went wrong";

  const responseData = error.response?.data || error;

  if (typeof responseData === "string") return responseData;

  const detail = responseData.detail;

  if (detail) {
    if (typeof detail === "string") return detail;
    if (detail.message) return detail.message;
    if (detail.msg) return detail.msg;
    if (Array.isArray(detail)) {
      const firstDetail = detail.find((item) => item?.message || item?.msg);
      if (firstDetail?.message) return firstDetail.message;
      if (firstDetail?.msg) return firstDetail.msg;
    }
  }

  if (responseData.message) return responseData.message;
  if (responseData.msg) return responseData.msg;

  return error.message || "Something went wrong";
};
