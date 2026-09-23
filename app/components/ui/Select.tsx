import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[#1F2937] mb-1.5"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-2.5
            bg-white border border-[#EAE6DF] rounded-lg
            text-[#1F2937]
            focus:outline-none focus:ring-2 focus:ring-[#176B6B] focus:border-transparent
            disabled:bg-[#F4F0E9] disabled:cursor-not-allowed
            transition-colors cursor-pointer
            ${error ? 'border-[#DC2626] focus:ring-[#DC2626]' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';

export default Select;
