import React from "react";

/**
 * QRCodeDisplay Component
 * Renders a QR code with optional styling and framing
 */
export interface QRCodeDisplayProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
  className?: string;
}

/**
 * DesignCanvas Component
 * Provides canvas for placing QR codes on uploaded designs
 */
export interface DesignCanvasProps {
  designImage: string;
  qrPosition: {
    x: number;
    y: number;
    size: number;
  };
  onPositionChange: (position: { x: number; y: number; size: number }) => void;
  qrImage?: string;
}

/**
 * UploadZone Component Props
 * Handles file upload with drag & drop
 */
export interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
}
