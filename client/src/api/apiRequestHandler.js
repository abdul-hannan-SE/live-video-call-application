import axios from "axios";
import { api } from "../constants/constants";
// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: api, // Base URL for your API
  withCredentials: true,
});

// This function handles API calls and centralizes error handling
const apiRequestHanderl = async (url, method, data = null) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
    });

    return response.data; // Return the response data to use it in the calling function
  } catch (error) {
    // Centralized error handling
    if (error.response) {
      // Server responded with a non-2xx status code
      console.error("API error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      // Request was made but no response was received
      console.error("API no response error:", error.request);
      return { success: false, message: "No response from server" };
    } else {
      // Error while setting up the request
      console.error("Error message:", error.message);
      return { success: false, message: error.message };
    }
  }
};

// Export the `apiRequest` function for reuse
export default apiRequestHanderl;
