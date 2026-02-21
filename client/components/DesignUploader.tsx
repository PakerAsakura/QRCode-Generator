"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import { useDesignStore, useQRStore } from "@/lib/store";
import { fileToBase64, downloadFile, generateFileName } from "@/lib/utils";

export default function DesignUploader() {
  const { designImage, setDesignImage, qrPosition, setQRPosition } = useDesignStore();
  const { value, setValue } = useQRStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFileDragging, setIsFileDragging] = useState(false);
  const [link, setLink] = useState("");
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

  // Refs to avoid stale closures in document-level listeners
  const isDraggingQR = useRef(false);
  const isResizingQR = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, qrX: 0, qrY: 0 });
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, size: 0 });
  const qrPositionRef = useRef(qrPosition);

  useEffect(() => {
    qrPositionRef.current = qrPosition;
  }, [qrPosition]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setDesignImage(base64);
      setQRPosition({ x: 20, y: 20, size: 120 });
      toast.success("Design uploaded!");
    } catch {
      toast.error("Failed to upload design");
    }
  };

  const startDrag = (clientX: number, clientY: number) => {
    const pos = qrPositionRef.current;
    isDraggingQR.current = true;
    dragStart.current = { mouseX: clientX, mouseY: clientY, qrX: pos.x, qrY: pos.y };
  };

  const startResize = (clientX: number, clientY: number) => {
    const pos = qrPositionRef.current;
    isResizingQR.current = true;
    resizeStart.current = { mouseX: clientX, mouseY: clientY, size: pos.size };
  };

  const handleQRMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  const handleQRTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startResize(e.clientX, e.clientY);
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const t = e.touches[0];
    startResize(t.clientX, t.clientY);
  };

  const applyMove = useCallback((clientX: number, clientY: number) => {
    const img = imageRef.current;
    if (!img) return;
    const imgRect = img.getBoundingClientRect();
    const pos = qrPositionRef.current;

    if (isDraggingQR.current) {
      const dx = clientX - dragStart.current.mouseX;
      const dy = clientY - dragStart.current.mouseY;
      setQRPosition({
        x: Math.max(0, Math.min(dragStart.current.qrX + dx, imgRect.width - pos.size)),
        y: Math.max(0, Math.min(dragStart.current.qrY + dy, imgRect.height - pos.size)),
        size: pos.size,
      });
    }

    if (isResizingQR.current) {
      const dx = clientX - resizeStart.current.mouseX;
      const newSize = Math.max(50, Math.min(resizeStart.current.size + dx, 300));
      setQRPosition({ x: pos.x, y: pos.y, size: newSize });
    }
  }, [setQRPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    applyMove(e.clientX, e.clientY);
  }, [applyMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingQR.current && !isResizingQR.current) return;
    e.preventDefault();
    applyMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [applyMove]);

  const handlePointerUp = useCallback(() => {
    isDraggingQR.current = false;
    isResizingQR.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handlePointerUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handlePointerUp);
    };
  }, [handleMouseMove, handleTouchMove, handlePointerUp]);

  const handleDownload = async () => {
    if (!designImage || !value.trim()) {
      toast.error("Please upload a design and enter a link");
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx || !imageRef.current) return;

      const imgEl = imageRef.current;
      const scaleX = imgEl.naturalWidth / imgEl.getBoundingClientRect().width;
      const scaleY = imgEl.naturalHeight / imgEl.getBoundingClientRect().height;

      const naturalImg = new Image();
      naturalImg.onload = () => {
        canvas.width = naturalImg.width;
        canvas.height = naturalImg.height;
        ctx.drawImage(naturalImg, 0, 0);

        const qrCanvas = containerRef.current?.querySelector("canvas") as HTMLCanvasElement;
        if (qrCanvas) {
          ctx.drawImage(
            qrCanvas,
            qrPosition.x * scaleX,
            qrPosition.y * scaleY,
            qrPosition.size * scaleX,
            qrPosition.size * scaleY,
          );
        }

        downloadFile(canvas.toDataURL("image/png"), generateFileName("design-qr"));
        toast.success("Downloaded!");
      };
      naturalImg.src = designImage;
    } catch {
      toast.error("Failed to download");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      {/* Settings Panel */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">With Design</h2>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">Overlay QR on your image</p>
          </div>

          {/* Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Upload Image
            </label>
            <div
              onDragEnter={(e) => { e.preventDefault(); setIsFileDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsFileDragging(false); }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsFileDragging(false);
                if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isFileDragging
                  ? "border-purple-400 bg-purple-50"
                  : designImage
                  ? "border-purple-200 bg-purple-50/50"
                  : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              {designImage ? (
                <div className="flex items-center gap-3 text-left">
                  <img
                    src={designImage}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-purple-100 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-medium text-purple-600">Image uploaded</p>
                    <p className="text-xs text-gray-400">Click to replace</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Click or drop image</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, SVG, WEBP</p>
                </>
              )}
            </div>
          </div>

          {/* Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              QR Code Link
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => { setLink(e.target.value); setValue(e.target.value); }}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all placeholder-gray-300"
            />
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
              <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700">Logo applied</p>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="text-xs text-purple-500 hover:text-purple-700"
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
                className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 rounded-xl text-xs text-gray-400 hover:text-purple-500 transition-all flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add center logo (optional)
              </button>
            )}
          </div>

          {designImage && value.trim() && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2 text-center">
              Drag QR to move · Corner handle to resize
            </p>
          )}

          {/* Download */}
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            Download with QR
          </button>

          {designImage && (
            <button
              onClick={() => { setDesignImage(null); setLink(""); setValue(""); }}
              className="w-full py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      {/* Canvas / Preview Area */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center min-h-96 p-4">
        {designImage ? (
          <div ref={containerRef} className="relative inline-block select-none">
            <img
              ref={imageRef}
              src={designImage}
              alt="Design"
              draggable={false}
              className="block max-w-full rounded-xl shadow-sm"
              style={{ maxHeight: "72vh" }}
            />

            {/* QR Code overlay */}
            {value.trim() && (
              <div
                onMouseDown={handleQRMouseDown}
                onTouchStart={handleQRTouchStart}
                className="absolute cursor-move select-none"
                style={{
                  left: qrPosition.x,
                  top: qrPosition.y,
                  width: qrPosition.size,
                  height: qrPosition.size,
                  touchAction: "none",
                }}
              >
                <div className="w-full h-full bg-white rounded-xl shadow-xl p-1 border-2 border-purple-500 ring-2 ring-white">
                  <QRCodeCanvas
                    value={value}
                    size={qrPosition.size - 8}
                    level="H"
                    marginSize={0}
                    imageSettings={logoUrl ? {
                      src: logoUrl,
                      height: Math.round((qrPosition.size - 8) * 0.22),
                      width: Math.round((qrPosition.size - 8) * 0.22),
                      excavate: true,
                    } : undefined}
                  />
                </div>
                {/* Resize handle */}
                <div
                  onMouseDown={handleResizeMouseDown}
                  onTouchStart={handleResizeTouchStart}
                  className="absolute bottom-0 right-0 w-4 h-4 bg-purple-600 hover:bg-purple-700 rounded-full cursor-se-resize border-2 border-white shadow-md"
                  style={{ transform: "translate(50%, 50%)" }}
                />
              </div>
            )}

            {!value.trim() && (
              <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Enter a link to place the QR code
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">Upload an image to get started</p>
            <p className="text-xs text-gray-400 mt-1">Then drag and resize the QR code anywhere on it</p>
          </div>
        )}
      </div>
    </div>
  );
}
