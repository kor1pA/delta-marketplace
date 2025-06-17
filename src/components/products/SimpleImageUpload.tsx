'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SimpleImageUploadProps {
  onFileSelect: (file: File) => void;
  label?: string;
  buttonText?: string;
}

export function SimpleImageUpload({ 
  onFileSelect, 
  label = "Нажмите для выбора изображения",
  buttonText = "Выбрать файл" 
}: SimpleImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    const input = document.getElementById('product-image') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div className="w-full">
      <Label>Изображение товара</Label>
      <div className="mt-2 flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="product-image"
        />
        <label 
          htmlFor="product-image" 
          className="cursor-pointer flex items-center gap-4"
        >
          {preview && (
            <div className="relative w-10 h-10">
              <Image
                src={preview}
                alt="Preview"
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors text-xs"
              >
                ×
              </button>
            </div>
          )}
          <div>
            <Button type="button" variant="outline" size="sm">
              {preview ? buttonText : "Выбрать изображение"}
            </Button>
          </div>
        </label>
      </div>
    </div>
  );
}
