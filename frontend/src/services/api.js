import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const analyzeCode = async (code, language, platform) => {
  try {
    const response = await api.post("/analyze", {
      code,
      language,
      platform,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.detail || "Server error occurred"
      );
    }
    throw new Error("Failed to connect to backend server");
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch {
    return { status: "error", grok_configured: false };
  }
};
