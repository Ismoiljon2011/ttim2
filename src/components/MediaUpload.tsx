import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Link as LinkIcon, Loader2, ImageIcon, Video, FileText, AlertCircle } from 'lucide-react';

interface MediaUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: 'image' | 'video' | 'file' | 'any';
  label?: string;
  required?: boolean;
}

const ACCEPT_MAP: Record<string, string> = {
  image: 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
  video: 'video/mp4,video/webm,video/ogg',
  file: 'application/pdf',
  any: 'image/*,video/*,application/pdf',
};

const BUCKET = 'media';

function getMediaType(filename: string): 'image' | 'video' | 'file' {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
  return 'file';
}

export default function MediaUpload({ value, onChange, accept = 'any', label, required }: MediaUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'url' : 'upload');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(0);

    const ext = file.name.split('.').pop() || '';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      setProgress(100);
      onChange(urlData.publicUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Yuklashda xatolik yuz berdi';
      setError(message);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [onChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleRemove = useCallback(() => {
    onChange(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onChange]);

  const mediaType = value ? getMediaType(value) : null;
  const PreviewIcon = mediaType === 'video' ? Video : mediaType === 'file' ? FileText : ImageIcon;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}{required && <span className="text-error-500"> *</span>}
        </label>
      )}

      {error && (
        <div className="mb-2 flex items-center gap-2 p-2 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-1 mb-2 p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Yuklash
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === 'url'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Havola
        </button>
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <div>
          {value && !uploading ? (
            <div className="relative rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900">
              {mediaType === 'image' && (
                <img src={value} alt="Preview" className="w-full max-h-48 object-contain" />
              )}
              {mediaType === 'video' && (
                <video src={value} controls className="w-full max-h-48 object-contain" />
              )}
              {mediaType === 'file' && (
                <div className="flex items-center gap-3 p-4">
                  <FileText className="h-8 w-8 text-primary-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{value.split('/').pop()}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                title="O'chirish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : uploading ? (
            <div className="rounded-lg border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Yuklanmoqda... {progress > 0 && `${progress}%`}</p>
              <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-xs mx-auto">
                <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-lg border-2 border-dashed cursor-pointer p-6 text-center transition-colors ${
                dragOver
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-600'
              }`}
            >
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Faylni shu yerga tashlang yoki <span className="text-primary-600 font-medium">tanlash</span> uchun bosing
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {accept === 'image' && 'JPG, PNG, GIF, WebP, SVG'}
                {accept === 'video' && 'MP4, WebM, OGG'}
                {accept === 'file' && 'PDF'}
                {accept === 'any' && 'Rasm, video yoki PDF — 50MB gacha'}
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_MAP[accept]}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              ref={urlInputRef}
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value || null)}
              required={required}
              placeholder="https://..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none text-sm"
            />
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2.5 rounded-lg text-slate-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/30"
                title="Tozalash"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {value && getMediaType(value) === 'image' && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900">
              <img src={value} alt="Preview" className="w-full max-h-32 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          )}
          {value && getMediaType(value) === 'video' && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900">
              <video src={value} controls className="w-full max-h-32 object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
