import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Image" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to 0.7 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onChange(compressedDataUrl);
        setIsProcessing(false);
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerGallery = () => fileInputRef.current?.click();
  const triggerCamera = () => cameraInputRef.current?.click();

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="relative group">
        {value ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/20">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={triggerCamera}
              disabled={isProcessing}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all group"
            >
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/10 text-muted group-hover:text-primary transition-all">
                {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-white">Camera</span>
            </button>

            <button
              type="button"
              onClick={triggerGallery}
              disabled={isProcessing}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all group"
            >
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/10 text-muted group-hover:text-primary transition-all">
                {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <ImageIcon size={24} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-white">Gallery</span>
            </button>
          </div>
        )}

        {/* Hidden Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
