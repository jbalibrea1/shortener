import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export default api;
