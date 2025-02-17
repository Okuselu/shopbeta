import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label text-muted small">{label}</label>}
      <input
        className={`form-control ${error ? "is-invalid" : ""} ${className}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {helperText && !error && (
        <small className="text-muted">{helperText}</small>
      )}
    </div>
  );
};

export default Input;
