'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Menu, X } from 'lucide-react'

interface NavigationItem {
  name: string
  href?: string
  children?: NavigationItem[]
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  badgeColor?: 'primary' | 'success' | 'warning' | 'danger'
}

interface NavigationProps {
  items: NavigationItem[]
  logo?: React.ReactNode
  className?: string
  variant?: 'default' | 'minimal' | 'elevated'
  onItemClick?: (item: NavigationItem) => void
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  logo,
  className,
  variant = 'default',
  onItemClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeDropdown])

  // Close mobile menu when clicking on item
  const handleItemClick = (item: NavigationItem) => {
    if (item.href) {
      setIsMobileMenuOpen(false)
    }
    onItemClick?.(item)
  }

  // Toggle dropdown
  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  const variantClasses = {
    default: 'bg-surface border-b border-border',
    minimal: 'bg-transparent',
    elevated: 'bg-surface shadow-lg border-b border-border'
  }

  const renderBadge = (badge: string, color: string) => (
    <span className={cn(
      'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
      color === 'primary' && 'bg-primary/10 text-primary',
      color === 'success' && 'bg-success/10 text-success',
      color === 'warning' && 'bg-warning/10 text-warning',
      color === 'danger' && 'bg-danger/10 text-danger'
    )}>
      {badge}
    </span>
  )

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0
    const isDropdownOpen = activeDropdown === item.name

    if (hasChildren) {
      return (
        <div key={item.name} className="relative">
          <button
            onClick={() => toggleDropdown(item.name)}
            className={cn(
              'flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200',
              'text-ink hover:text-primary',
              isMobile ? 'w-full justify-between' : 'rounded-lg hover:bg-surface-2'
            )}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.name}</span>
              {item.badge && renderBadge(item.badge, item.badgeColor || 'primary')}
            </div>
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform duration-200',
              isDropdownOpen && 'rotate-180'
            )} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={(el) => { dropdownRefs.current[item.name] = el }}
              className={cn(
                'absolute z-50 mt-2 min-w-48 rounded-lg bg-surface border border-border shadow-lg',
                isMobile ? 'relative mt-0 ml-4 border-l-2 border-border pl-4' : ''
              )}
            >
              <div className="py-2">
                {item.children!.map(child => (
                  <a
                    key={child.name}
                    href={child.href}
                    onClick={() => handleItemClick(child)}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200',
                      'text-body hover:text-primary hover:bg-surface-2'
                    )}
                  >
                    {child.icon && <child.icon className="w-4 h-4" />}
                    <span>{child.name}</span>
                    {child.badge && renderBadge(child.badge, child.badgeColor || 'primary')}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <a
        key={item.name}
        href={item.href}
        onClick={() => handleItemClick(item)}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200',
          'text-ink hover:text-primary',
          isMobile ? 'w-full' : 'rounded-lg hover:bg-surface-2'
        )}
      >
        {item.icon && <item.icon className="w-4 h-4" />}
        <span>{item.name}</span>
        {item.badge && renderBadge(item.badge, item.badgeColor || 'primary')}
      </a>
    )
  }

  return (
    <nav className={cn('sticky top-0 z-50', variantClasses[variant], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {items.map(item => renderNavigationItem(item))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-ink hover:text-primary hover:bg-surface-2 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {items.map(item => renderNavigationItem(item, true))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
