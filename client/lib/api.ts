import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface QRGenerateRequest {
  data: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

export interface QRGenerateResponse {
  qrCode: string;
  dataUrl: string;
  fileName: string;
}

export const qrService = {
  generateQR: async (data: string) => {
    try {
      const response = await api.post<QRGenerateResponse>("/api/qr/generate", {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadDesign: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/api/design/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDesign: async (fileId: string) => {
    try {
      const response = await api.delete(`/api/design/${fileId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
