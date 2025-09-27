'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  removable?: boolean
  onRemove?: () => void
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  ({ 
    variant = 'default', 
    size = 'md', 
    icon: Icon, 
    removable = false,
    onRemove,
    className, 
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'pill inline-flex items-center gap-2 font-medium transition-all duration-200'
    
    const variantClasses = {
      default: 'bg-surface-2 text-body border-border',
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      danger: 'bg-danger/10 text-danger border-danger/20'
    }
    
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    }
    
    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )
    
    return (
      <div ref={ref} className={classes} {...props}>
        {Icon && <Icon className="w-4 h-4" />}
        <span>{children}</span>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
            aria-label="Remove"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Pill.displayName = 'Pill'

export default Pill
