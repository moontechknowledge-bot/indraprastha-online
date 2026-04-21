import React from 'react';
import { Image as ImageIcon, X, Plus, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ images = [], onChange, maxImages = 5 }) => {
  const handleAddImage = (url: string) => {
    if (url && images.length < maxImages) {
      onChange([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
          <ImageIcon size={14} className="text-primary/50" />
          Business Gallery ({images.length}/{maxImages})
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 group">
            <img 
              src={url} 
              alt={`Gallery ${index + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all scale-0 group-hover:scale-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="bg-white/5 rounded-2xl border-2 border-dashed border-white/10 p-4 hover:border-primary/50 transition-all">
            <ImageUpload 
              value="" 
              onChange={handleAddImage} 
              label="Add Photo"
            />
          </div>
        )}
      </div>
      
      {images.length === 0 && (
        <p className="text-[10px] text-muted/50 font-bold uppercase tracking-widest text-center py-10 border-2 border-dashed border-white/5 rounded-3xl">
          No gallery photos added yet. Add up to {maxImages} photos.
        </p>
      )}
    </div>
  );
};

export default MultiImageUpload;
