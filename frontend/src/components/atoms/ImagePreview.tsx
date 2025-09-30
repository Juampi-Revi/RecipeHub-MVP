import React from 'react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImagePreview({ src, alt, className = '' }: ImagePreviewProps) {
  if (!src) return null;

  return (
    <div className={`image-preview ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-32 h-24 object-cover rounded-lg border border-gray-300"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}