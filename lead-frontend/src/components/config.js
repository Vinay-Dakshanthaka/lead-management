import axios from "axios";

// Define baseURL variable
// export const baseURL = "http://localhost:3004";
// export const baseURL = "https://api.leads.paintpulse.in";
export const baseURL = "https://api.leads.laragrooming.com";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
  