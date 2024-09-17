import axios from "axios";

// Define baseURL variable
// export const baseURL = "http://localhost:3003";
export const baseURL = "https://api.leads.paintpulse.in";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
