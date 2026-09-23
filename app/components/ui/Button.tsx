import { ButtonHTMLAttributes, forwardRef } from 'react';
import { colors, transitions } from '@/app/lib/design-tokens';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    className = '',
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: `bg-[${colors.teal.DEFAULT}] text-white hover:bg-[${colors.teal.dark}] focus:ring-[${colors.teal.DEFAULT}]`,
      secondary: `bg-[${colors.sand}] text-[${colors.text.primary}] hover:bg-[${colors.border}] focus:ring-[${colors.teal.DEFAULT}]`,
      outline: `border-2 border-[${colors.teal.DEFAULT}] text-[${colors.teal.DEFAULT}] hover:bg-[${colors.teal.DEFAULT}] hover:text-white focus:ring-[${colors.teal.DEFAULT}]`,
      ghost: `text-[${colors.text.primary}] hover:bg-[${colors.sand}] focus:ring-[${colors.teal.DEFAULT}]`,
      link: `text-[${colors.teal.DEFAULT}] hover:underline focus:ring-0`,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-full',
      md: 'px-5 py-2.5 text-sm rounded-full',
      lg: 'px-7 py-3.5 text-base rounded-full',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`.trim();

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
