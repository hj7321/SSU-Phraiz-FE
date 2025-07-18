import axios from "axios";

export const BASE_URL = "http://52.79.34.104/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
