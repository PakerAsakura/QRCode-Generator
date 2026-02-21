"use client";

import { create } from "zustand";

interface QRCodeState {
  value: string;
  setValue: (value: string) => void;
  size: number;
  setSize: (size: number) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  fgColor: string;
  setFgColor: (color: string) => void;
  level: "L" | "M" | "Q" | "H";
  setLevel: (level: "L" | "M" | "Q" | "H") => void;
}

export const useQRStore = create<QRCodeState>((set) => ({
  value: "https://example.com",
  setValue: (value) => set({ value }),
  size: 256,
  setSize: (size) => set({ size }),
  bgColor: "#ffffff",
  setBgColor: (color) => set({ bgColor: color }),
  fgColor: "#000000",
  setFgColor: (color) => set({ fgColor: color }),
  level: "M",
  setLevel: (level) => set({ level }),
}));

interface DesignState {
  designImage: string | null;
  setDesignImage: (image: string | null) => void;
  qrPosition: { x: number; y: number; size: number };
  setQRPosition: (position: { x: number; y: number; size: number }) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  designImage: null,
  setDesignImage: (image) => set({ designImage: image }),
  qrPosition: { x: 100, y: 100, size: 150 },
  setQRPosition: (position) => set({ qrPosition: position }),
}));
