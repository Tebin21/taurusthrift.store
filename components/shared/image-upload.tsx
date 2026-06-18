"use client";

import { useRef, useState, useCallback, DragEvent } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageCropper } from "./image-cropper";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
  className?: string;
  /** Pass an aspect ratio (e.g. 3/4, 1, 4/3) to enable the crop dialog before upload */
  aspect?: number;
  /** Subfolder within the Supabase bucket (defaults to "products") */
  folder?: string;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `"${file.name}" is not supported. Use JPG, PNG, or WebP.`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `"${file.name}" exceeds ${MAX_SIZE_MB}MB limit.`;
  }
  return null;
}

function uploadBlobToSupabase(
  blob: Blob,
  filename: string,
  folder: string,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", blob, filename);
    form.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 401) {
        reject(new Error("Not authenticated — please log in to the admin panel."));
        return;
      }
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error(`Upload service returned unexpected response (HTTP ${xhr.status})`));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.success) {
        resolve((data.data as { url: string }).url);
      } else {
        reject(new Error((data.error as string) ?? `Upload failed (HTTP ${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error — could not reach upload service. Check your internet connection."));
    xhr.send(form);
  });
}

export function ImageUpload({ value, onChange, max, label, className, aspect, folder: folderProp }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  // Crop queue — only used when `aspect` is provided
  const [cropQueue, setCropQueue] = useState<{ file: File; dataUrl: string }[]>([]);
  const pendingBlobsRef = useRef<Blob[]>([]);

  // ─── Upload a list of Blobs to Supabase Storage ──────────────────────────
  const uploadBlobs = useCallback(
    async (blobs: Blob[], names: string[]) => {
      setUploading(true);

      const folder = folderProp ?? "products";
      const results = await Promise.allSettled(
        blobs.map((blob, i) =>
          uploadBlobToSupabase(blob, names[i] ?? `image-${i}.jpg`, folder, (pct) =>
            setProgress((prev) => ({ ...prev, [names[i]]: pct }))
          )
        )
      );

      const urls: string[] = [];
      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          urls.push(r.value);
        } else {
          toast.error(`Failed to upload "${names[i]}": ${(r.reason as Error)?.message ?? "Unknown error"}`);
        }
      });

      if (urls.length > 0) {
        onChange([...value, ...urls]);
        if (urls.length === blobs.length) {
          toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
        }
      }

      setProgress({});
      setUploading(false);
    },
    [value, onChange, folderProp]
  );

  // ─── Receive and validate files ──────────────────────────────────────────
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      if (fileArr.length === 0) return;

      const errors: string[] = [];
      const valid: File[] = [];
      for (const f of fileArr) {
        const err = validateFile(f);
        if (err) errors.push(err);
        else valid.push(f);
      }
      errors.forEach((e) => toast.error(e));

      const remaining = max !== undefined ? max - value.length : Infinity;
      const toProcess = valid.slice(0, remaining);
      if (valid.length > remaining) {
        toast.error(`Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed`);
      }
      if (toProcess.length === 0) return;

      if (aspect !== undefined) {
        // Build a crop queue — read each file as a data URL first
        const queue = await Promise.all(
          toProcess.map(
            (file) =>
              new Promise<{ file: File; dataUrl: string }>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve({ file, dataUrl: e.target!.result as string });
                reader.readAsDataURL(file);
              })
          )
        );
        pendingBlobsRef.current = [];
        setCropQueue(queue);
      } else {
        // No crop — upload files directly as Blobs
        await uploadBlobs(toProcess, toProcess.map((f) => f.name));
      }
    },
    [value, onChange, max, aspect, uploadBlobs]
  );

  // ─── Crop dialog callbacks ───────────────────────────────────────────────
  const handleCropConfirm = useCallback(
    async (blob: Blob) => {
      const remaining = cropQueue.slice(1);

      pendingBlobsRef.current.push(blob);

      if (remaining.length === 0) {
        // All files cropped — upload everything
        const blobs = pendingBlobsRef.current;
        const names = blobs.map((_, i) => `image-${Date.now()}-${i}.jpg`);
        setCropQueue([]);
        pendingBlobsRef.current = [];
        await uploadBlobs(blobs, names);
      } else {
        // Move to next file in queue
        setCropQueue(remaining);
      }
    },
    [cropQueue, uploadBlobs]
  );

  const handleCropCancel = useCallback(() => {
    // Skip just this file; if blobs were already collected, upload them
    const remaining = cropQueue.slice(1);
    if (remaining.length === 0 && pendingBlobsRef.current.length > 0) {
      const blobs = pendingBlobsRef.current;
      const names = blobs.map((_, i) => `image-${Date.now()}-${i}.jpg`);
      setCropQueue([]);
      pendingBlobsRef.current = [];
      uploadBlobs(blobs, names);
    } else {
      setCropQueue(remaining);
    }
  }, [cropQueue, uploadBlobs]);

  // ─── Drag & drop onto the upload zone ───────────────────────────────────
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };

  // ─── Remove an uploaded image ────────────────────────────────────────────
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  // ─── Drag-to-reorder uploaded images ────────────────────────────────────
  const onImageDragStart = (index: number) => { dragIndexRef.current = index; };
  const onImageDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const onImageDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...value];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    onChange(reordered);
    dragIndexRef.current = null;
  };

  const canAdd = max === undefined || value.length < max;
  const uploadKeys = Object.keys(progress);
  const avgProgress =
    uploadKeys.length > 0
      ? Math.round(uploadKeys.reduce((a, k) => a + progress[k], 0) / uploadKeys.length)
      : 0;

  // Index of the item in the original queue (for "X of Y" label)
  const originalTotal = cropQueue.length + pendingBlobsRef.current.length;

  return (
    <>
      <div className={cn("space-y-3", className)}>
        {label && (
          <p className="text-sm font-medium">
            {label}
            <span className="text-xs font-normal text-muted-foreground ml-2">
              JPG, PNG, WebP · max {MAX_SIZE_MB}MB
              {max !== undefined && ` · max ${max} image${max === 1 ? "" : "s"}`}
              {aspect !== undefined && ` · ${aspect === 3 / 4 ? "3:4" : aspect === 1 ? "1:1" : aspect === 4 / 3 ? "4:3" : aspect === 16 / 7 ? "16:7" : ""} ratio`}
            </span>
          </p>
        )}

        {/* Uploaded image previews */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {value.map((url, i) => (
              <div
                key={url}
                draggable
                onDragStart={() => onImageDragStart(i)}
                onDragOver={onImageDragOver}
                onDrop={(e) => onImageDrop(e, i)}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group cursor-grab active:cursor-grabbing"
              >
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="96px" />
                <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3.5 h-3.5 text-white drop-shadow" />
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop / click zone */}
        {canAdd && (
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !uploading && inputRef.current?.click()}
            className={cn(
              "relative rounded-lg border-2 border-dashed transition-colors cursor-pointer",
              value.length === 0 ? "p-10" : "p-4",
              isDragging
                ? "border-brand-brown bg-brand-brown/5"
                : "border-border hover:border-brand-brown/60 hover:bg-muted/30",
              uploading && "pointer-events-none opacity-70"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-sm">
                    Uploading{uploadKeys.length > 1 ? ` ${uploadKeys.length} images` : ""}…
                  </p>
                  <div className="w-full max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-brand-brown rounded-full transition-all duration-200"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                  <p className="text-xs">{avgProgress}%</p>
                </>
              ) : isDragging ? (
                <>
                  <ImageIcon className="w-6 h-6 text-brand-brown" />
                  <p className="text-sm text-brand-brown font-medium">Drop to upload</p>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <p className="text-sm">
                    <span className="font-medium">Click to upload</span> or drag &amp; drop
                  </p>
                  {value.length === 0 && (
                    <p className="text-xs">Supports JPG, PNG, WebP up to {MAX_SIZE_MB}MB</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={max !== 1}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Crop dialog — shown one file at a time */}
      {cropQueue.length > 0 && aspect !== undefined && (
        <ImageCropper
          open
          imageSrc={cropQueue[0].dataUrl}
          aspect={aspect}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
          fileIndex={originalTotal - cropQueue.length}
          fileTotal={originalTotal > 1 ? originalTotal : undefined}
        />
      )}
    </>
  );
}
