import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#1F2937] mb-1.5"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5
            bg-white border border-[#EAE6DF] rounded-lg
            text-[#1F2937] placeholder:text-[#7A827D]
            focus:outline-none focus:ring-2 focus:ring-[#176B6B] focus:border-transparent
            disabled:bg-[#F4F0E9] disabled:cursor-not-allowed
            transition-colors
            ${error ? 'border-[#DC2626] focus:ring-[#DC2626]' : ''}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-sm text-[#DC2626]">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#7A827D]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
