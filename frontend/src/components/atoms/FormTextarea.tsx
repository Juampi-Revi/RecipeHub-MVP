import React from 'react';

interface FormTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  label: string;
  rows?: number;
  className?: string;
}

export function FormTextarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  label,
  rows = 4,
  className = ''
}: FormTextareaProps) {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id} className="label">
        {label} {required && '*'}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`input ${error ? 'input-error' : ''}`}
        required={required}
      />
      {error && (
        <p className="error-message">{error}</p>
      )}
    </div>
  );
}