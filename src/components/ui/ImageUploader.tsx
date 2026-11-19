'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, Link2, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export default function ImageUploader({
  label = 'Image',
  value,
  onChange,
  required = false,
}: ImageUploaderProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('url');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error('ImgBB API key not found in env. Falling back to URL input.');
      setMode('url');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        onChange(data.data.url);
        toast.success('Image successfully uploaded to ImgBB!');
      } else {
        toast.error(data.error?.message || 'Failed to upload image to ImgBB.');
      }
    } catch (err) {
      toast.error('Network error during image upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
          {label} {required && '*'}
        </label>
        <div className="flex items-center gap-1.5 text-xs bg-stone-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              mode === 'url' ? 'bg-white text-salon-700 shadow-2xs' : 'text-stone-500'
            }`}
          >
            <Link2 className="w-3 h-3 inline mr-1" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              mode === 'upload' ? 'bg-white text-salon-700 shadow-2xs' : 'text-stone-500'
            }`}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            ImgBB Upload
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
        />
      ) : (
        <div className="border border-dashed border-stone-300 rounded-2xl p-4 text-center bg-stone-50/50 hover:bg-stone-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-salon-600 file:text-white hover:file:bg-salon-700 cursor-pointer"
          />
          {isUploading && (
            <p className="text-xs text-salon-600 mt-2 flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Uploading to ImgBB...
            </p>
          )}
        </div>
      )}

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 border border-stone-100">
          <img
            src={value}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover border border-stone-200"
          />
          <div className="overflow-hidden flex-1">
            <span className="text-[11px] font-semibold text-green-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              Image linked
            </span>
            <p className="text-[10px] text-stone-400 truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
