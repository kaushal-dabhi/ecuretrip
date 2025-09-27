import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpecialtyPillProps {
  icon: ReactNode;
  label: string;
  variant?: 'health' | 'sky' | 'gold' | 'mint' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  health: 'bg-health text-white',
  sky: 'bg-sky text-white',
  gold: 'bg-gold text-white',
  mint: 'bg-mint text-navy',
  navy: 'bg-navy text-white'
};

const sizeStyles = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-16 h-16 text-base',
  lg: 'w-20 h-20 text-lg'
};

export default function SpecialtyPill({
  icon,
  label,
  variant = 'health',
  size = 'md',
  className
}: SpecialtyPillProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 hover:scale-105',
      className
    )}>
      <div className={cn(
        'rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200',
        variantStyles[variant],
        sizeStyles[size]
      )}>
        {icon}
      </div>
      <span className="text-sm font-medium text-navy-600 max-w-[80px] leading-tight">
        {label}
      </span>
    </div>
  );
}

// Predefined specialty icons for common medical procedures
export const SpecialtyIcons = {
  // Orthopedics
  TKR: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  THR: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  ACL: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  
  // IVF
  IVF: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  
  // Cardiology
  Cardiology: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  
  // Neurology
  Neurology: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  
  // Oncology
  Oncology: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
    </svg>
  ),
  
  // Dental
  Dental: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 11.5h10M7 15h10m-5-8v8m-3-8v8m6-8v8"/>
    </svg>
  ),
  
  // Cosmetic
  Cosmetic: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a4 4 0 00-4-4v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a4 4 0 01-4 4z"/>
    </svg>
  ),
  
  // Spine
  Spine: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
    </svg>
  ),
  
  // Transplant
  Transplant: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>
  ),
  
  // Pediatrics
  Pediatrics: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
    </svg>
  )
};

