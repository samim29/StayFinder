/**
 * Utility function to handle error messages based on HTTP status codes.
 * @param {Object} error - The error object from an HTTP request.
 * @param {string} fallback - A fallback error message to use if no specific message is found.
 * @return {string} - A user-friendly error message.
 */
export const getErrorMessage = (error, fallback) => {
  const status = error?.response?.status;

  if (status === 401) {
    return "Invalid email/phone or password.";
  }

  if (status === 403) {
    return "You are not authorized to perform this action.";
  }

  if (status === 404) {
    return "Account not found.";
  }

  if (status >= 500) {
    return "Something went wrong on our server. Please try again later.";
  }

  return error?.response?.data?.message || fallback;
};
