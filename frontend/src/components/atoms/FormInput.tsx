import React from 'react';

interface FormInputProps {
  id: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'url';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  label: string;
  className?: string;
  min?: string;
}

export function FormInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  label,
  className = '',
  min
}: FormInputProps) {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id} className="label">
        {label} {required && '*'}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''}`}
        required={required}
        min={min}
      />
      {error && (
        <p className="error-message">{error}</p>
      )}
    </div>
  );
}