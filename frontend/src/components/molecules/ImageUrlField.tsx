import React from 'react';
import { FormInput } from '../atoms/FormInput';
import { ImagePreview } from '../atoms/ImagePreview';

interface ImageUrlFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export function ImageUrlField({ value, onChange, error, className = '' }: ImageUrlFieldProps) {
  return (
    <div className={className}>
      <FormInput
        id="imageUrl"
        name="imageUrl"
        type="url"
        value={value}
        onChange={onChange}
        placeholder="https://example.com/image.jpg"
        error={error}
        label="Recipe Image URL"
      />
      <ImagePreview src={value} alt="Recipe preview" className="mt-2" />
    </div>
  );
}