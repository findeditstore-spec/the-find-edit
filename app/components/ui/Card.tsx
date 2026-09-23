import { ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'bordered';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding = true,
  className = '',
  onClick
}: CardProps) {
  const variants = {
    default: 'bg-white border border-[#EAE6DF]',
    elevated: 'bg-white shadow-md',
    bordered: 'bg-white border-2 border-[#176B6B]',
  };

  const paddingClass = padding ? 'p-6' : '';
  const interactiveClass = onClick ? 'cursor-pointer transition-transform hover:scale-[1.02]' : '';

  return (
    <div
      className={`rounded-2xl ${variants[variant]} ${paddingClass} ${interactiveClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
