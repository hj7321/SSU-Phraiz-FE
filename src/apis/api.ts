import axios from "axios";

const BASE_URL = "백엔드 API BASE URL"; // TODO: 나중에 진짜 base url 넣어야 함

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
