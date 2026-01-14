import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string, mimeType: string, previewUrl: string) => void;
  disabled: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data
      const base64Data = result.split(',')[1];
      const mimeType = file.type;
      
      onImageSelect(base64Data, mimeType, result);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 ease-out
        flex flex-col items-center justify-center p-10 h-80 bg-white
        ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
        {isDragging ? <Upload size={32} /> : <Camera size={32} />}
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
        {isDragging ? '松开以上传！' : '上传食物照片'}
      </h3>
      
      <p className="text-gray-500 text-center max-w-xs mx-auto text-sm">
        拖放图片或点击浏览。支持 JPG, PNG 和 WebP。
      </p>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-gray-300 opacity-20 transform rotate-12 pointer-events-none">
        <ImageIcon size={64} />
      </div>
    </div>
  );
};

export default ImageUpload;