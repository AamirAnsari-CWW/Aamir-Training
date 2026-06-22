const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Shared API helper for every frontend request. It attaches the JWT when a
// user is logged in and normalizes backend validation errors into one message.
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("crmToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const result = await response.json();

  // The backend can return either a single message or an array of validation
  // errors, so convert both shapes into a normal JavaScript Error.
  if (!response.ok) {
    const validationMessage = result.errors
      ?.map((error) => error.message)
      .join(", ");

    throw new Error(validationMessage || result.message || "Request failed");
  }

  return result;
}
