import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  label: string;
  className?: string;
}

export function FormSelect({
  id,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  label,
  className = ''
}: FormSelectProps) {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id} className="label">
        {label} {required && '*'}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`input ${error ? 'input-error' : ''}`}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="error-message">{error}</p>
      )}
    </div>
  );
}