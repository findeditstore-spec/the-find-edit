import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'cream' | 'sand' | 'white' | 'dark' | 'teal';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const backgrounds = {
  cream: 'bg-[#FFFDF9]',
  sand: 'bg-[#F4F0E9]',
  white: 'bg-white',
  dark: 'bg-[#1F2937] text-white',
  teal: 'bg-[#176B6B] text-white',
};

const paddings = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-20',
  xl: 'py-20 md:py-28',
};

export default function Section({
  children,
  className = '',
  background = 'cream',
  padding = 'lg'
}: SectionProps) {
  return (
    <section className={`${backgrounds[background]} ${paddings[padding]} ${className}`}>
      {children}
    </section>
  );
}
