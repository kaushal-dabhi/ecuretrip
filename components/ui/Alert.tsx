'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon, AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    variant = 'info', 
    title, 
    dismissible = false,
    onDismiss,
    className, 
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'alert'
    
    const variantClasses = {
      info: 'alert--info',
      success: 'alert--success',
      warning: 'alert--warning',
      danger: 'alert--danger'
    }
    
    const iconMap: Record<string, LucideIcon> = {
      info: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      danger: AlertCircle
    }
    
    const Icon = iconMap[variant]
    
    const classes = cn(
      baseClasses,
      variantClasses[variant],
      className
    )
    
    return (
      <div ref={ref} className={classes} role="alert" {...props}>
        <div className="flex items-start gap-3">
          {Icon && <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />}
          
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold mb-1">{title}</h4>
            )}
            <div>{children}</div>
          </div>
          
          {dismissible && (
            <button
              type="button"
              onClick={onDismiss}
              className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export default Alert
