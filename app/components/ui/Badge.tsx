import { ReactNode } from 'react';

type BadgeVariant = 'tfe-pick' | 'trending' | 'new' | 'deal' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variants = {
    'tfe-pick': 'bg-[#176B6B] text-white',
    'trending': 'bg-[#C9A86A] text-[#1F2937]',
    'new': 'bg-[#059669] text-white',
    'deal': 'bg-[#DC2626] text-white',
    'neutral': 'bg-[#EAE6DF] text-[#5B6470]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
