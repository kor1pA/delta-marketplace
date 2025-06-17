import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadProductImage } from '@/app/actions/product-actions';
import Image from 'next/image';

interface ImageUploadProps {
  onFileSelect?: (file: File) => void;
  label?: string;
}

export function ImageUpload({ onFileSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    
    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    if (onFileSelect) {
      onFileSelect(file);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
      {preview && (
        <div className="relative w-40 h-40">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
      
      <div className="flex items-center gap-4">          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button 
              variant="outline" 
              className="cursor-pointer"
              asChild
            >
              <span>
                Select Image
              </span>
            </Button>
          </label>
      </div>
    </div>
  );
}
