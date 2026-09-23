import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidths = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1536px]',
  full: 'max-w-full',
};

export default function Container({
  children,
  className = '',
  maxWidth = 'xl'
}: ContainerProps) {
  return (
    <div className={`mx-auto px-6 md:px-12 ${maxWidths[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}
