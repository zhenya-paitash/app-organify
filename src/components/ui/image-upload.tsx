'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ImageIcon, Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value?: string | File;
  onChange: (value: File | null) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  disabled,
  label = 'Image',
  description = 'SVG, PNG, JPG or JPEG (max. 1MB).',
  className
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col gap-y-2', className)}>
      <div className="flex items-center gap-x-6 p-4 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
        <div className="relative group">
          {value ? (
            <div className="size-[72px] relative rounded-md overflow-hidden ring-2 ring-primary/20 transition-all group-hover:ring-primary/40">
              <Image
                className="object-cover"
                src={value instanceof File ? URL.createObjectURL(value) : value}
                alt="Uploaded image"
                fill
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 bg-white/20 hover:bg-white/30"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="size-4 text-white" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="size-[72px] relative rounded-md overflow-hidden ring-2 ring-dashed ring-primary/20 transition-all group-hover:ring-primary/40 cursor-pointer bg-white/50 dark:bg-black/20"
              onClick={() => inputRef.current?.click()}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="size-8 text-primary/40" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-1.5 flex-1">
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
          {!value && (
            <Button
              type="button"
              variant="upload"
              size="xs"
              className="w-fit"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              <Upload className="size-4 mr-2" />
              Upload image
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.png,.jpeg,.svg"
        className="hidden"
        onChange={handleImageChange}
        disabled={disabled}
      />
    </div>
  );
}; 