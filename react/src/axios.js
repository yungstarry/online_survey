import axios from "axios";
import router from "./router";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
  const token = 123; // Replace with actual token logic
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      router.navigate("/login");
      return error;
    } else if (error.response?.status === 422) {
      console.error("Validation Errors: ", error.response.data.errors);
      // Assuming setError is defined or imported
      if (typeof setError === "function") {
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          setError(key, {
            type: "manual",
            message: Array.isArray(value) ? value.join(", ") : value, // Ensure it's a string
          });
        }
      }
    } else {
      console.error("Error: ", error.response?.data || error.message);
    }
    throw error;
  }
);

export default axiosClient;
