import { ReactNode } from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  alignment?: 'left' | 'center';
}

export default function SectionHeader({
  label,
  title,
  description,
  className = '',
  alignment = 'left'
}: SectionHeaderProps) {
  const alignmentClasses = alignment === 'center' ? 'text-center' : '';

  return (
    <div className={`mb-12 ${alignmentClasses} ${className}`}>
      {label && (
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-4">
          {label}
        </p>
      )}
      <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-lg text-[#5B6470] max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
