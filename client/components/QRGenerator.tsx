"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import { useQRStore } from "@/lib/store";
import { downloadFile, generateFileName, fileToBase64 } from "@/lib/utils";

export default function QRGenerator() {
  const { value, setValue, size, setSize, bgColor, setBgColor, fgColor, setFgColor } = useQRStore();
  const qrRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setLogoUrl(base64);
      toast.success("Logo added!");
    } catch {
      toast.error("Failed to load logo");
    }
  };

  const handleDownload = () => {
    if (!value.trim()) {
      toast.error("Enter a URL or text first");
      return;
    }
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      downloadFile(canvas.toDataURL("image/png"), generateFileName("qr-code"));
      toast.success("Downloaded!");
    }
  };

  const logoSize = Math.round(size * 0.22);

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:items-start">
      {/* Settings Panel */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Simple QR</h2>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">Generate a QR code</p>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Content
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder-gray-300"
            />
          </div>

          {/* Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Size</label>
              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{size}px</span>
            </div>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>128</span>
              <span>512</span>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Colors</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Background</p>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className="relative w-9 h-9 rounded-lg border-2 border-gray-200 group-hover:border-blue-300 overflow-hidden transition-colors shrink-0"
                    style={{ backgroundColor: bgColor }}
                  >
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-mono truncate">{bgColor}</span>
                </label>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Foreground</p>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className="relative w-9 h-9 rounded-lg border-2 border-gray-200 group-hover:border-blue-300 overflow-hidden transition-colors shrink-0"
                    style={{ backgroundColor: fgColor }}
                  >
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-mono truncate">{fgColor}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Center Logo</label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
            />
            {logoUrl ? (
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700">Logo applied</p>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Change
                  </button>
                </div>
                <button
                  onClick={() => setLogoUrl("")}
                  className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors text-lg leading-none shrink-0"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl text-xs text-gray-400 hover:text-blue-500 transition-all flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add center logo (optional)
              </button>
            )}
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            Download QR Code
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center min-h-96 p-8">
        {value.trim() ? (
          <div ref={qrRef} className="flex flex-col items-center gap-3">
            <div className="p-5 bg-white rounded-2xl shadow-md ring-1 ring-black/5">
              <QRCodeCanvas
                value={value}
                size={size}
                level={logoUrl ? "H" : "M"}
                bgColor={bgColor}
                fgColor={fgColor}
                marginSize={4}
                imageSettings={logoUrl ? {
                  src: logoUrl,
                  height: logoSize,
                  width: logoSize,
                  excavate: true,
                } : undefined}
              />
            </div>
            <p className="text-xs text-gray-400 max-w-[200px] truncate text-center">{value}</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">Your QR code will appear here</p>
            <p className="text-xs text-gray-400 mt-1">Enter a URL or text to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
