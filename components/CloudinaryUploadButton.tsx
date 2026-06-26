"use client";

import { useCallback } from "react";

interface CloudinaryUploadResult {
  event: string;
  info?: {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
  };
}

interface CloudinaryWidget {
  open: () => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: CloudinaryUploadResult) => void
      ) => CloudinaryWidget;
    };
  }
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "lokayantra_unsigned";

interface CloudinaryUploadButtonProps {
  onUploaded: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function CloudinaryUploadButton({
  onUploaded,
  label = "Upload Image",
  folder = "thumbnails",
}: CloudinaryUploadButtonProps) {
  const openWidget = useCallback(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget script not loaded yet.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder,
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 16 / 9,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5_000_000,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return;
        }
        if (result.event === "success" && result.info?.secure_url) {
          onUploaded(result.info.secure_url);
        }
      }
    );

    widget.open();
  }, [onUploaded, folder]);

  return (
    <button
      type="button"
      onClick={openWidget}
      className="px-4 py-2 bg-[var(--red)] text-white rounded hover:opacity-90 transition text-sm font-medium"
    >
      {label}
    </button>
  );
}
