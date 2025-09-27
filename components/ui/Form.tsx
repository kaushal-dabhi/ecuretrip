'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    custom?: (value: string | number | boolean) => string | undefined
  }
  help?: string
  className?: string
}

interface FormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, string | number | boolean>) => void
  submitText?: string
  loading?: boolean
  className?: string
  initialData?: Record<string, string | number | boolean>
}

interface FormErrors {
  [key: string]: string
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  className,
  initialData = {}
}) => {
  const [formData, setFormData] = React.useState<Record<string, string | number | boolean>>(initialData)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<Set<string>>(new Set())

  // Validation function
  const validateField = (name: string, value: string | number | boolean): string | undefined => {
    const field = fields.find(f => f.name === name)
    if (!field) return undefined

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`
    }

    // Pattern validation
    if (field.validation?.pattern && typeof value === 'string' && !field.validation.pattern.test(value)) {
      return `${field.label} format is invalid`
    }

    // Length validation
    if (field.validation?.minLength && typeof value === 'string' && value.length < field.validation.minLength) {
      return `${field.label} must be at least ${field.validation.minLength} characters`
    }

    if (field.validation?.maxLength && typeof value === 'string' && value.length > field.validation.maxLength) {
      return `${field.label} must be no more than ${field.validation.maxLength} characters`
    }

    // Number validation
    if (field.validation?.min !== undefined && value && Number(value) < field.validation.min) {
      return `${field.label} must be at least ${field.validation.min}`
    }

    if (field.validation?.max !== undefined && value && Number(value) > field.validation.max) {
      return `${field.label} must be no more than ${field.validation.max}`
    }

    // Custom validation
    if (field.validation?.custom) {
      return field.validation.custom(value)
    }

    return undefined
  }

  // Handle input changes
  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle input blur (mark as touched and validate)
  const handleBlur = (name: string) => {
    setTouched(prev => new Set(prev).add(name))
    
    const error = validateField(name, formData[name])
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: FormErrors = {}
    let hasErrors = false

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name])
      if (error) {
        newErrors[field.name] = error
        hasErrors = true
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
      // Mark all fields as touched
      setTouched(new Set(fields.map(f => f.name)))
      return
    }

    // Submit form
    onSubmit(formData)
  }

  // Render form field
  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]
    const isTouched = touched.has(field.name)
    const showError = isTouched && error

    const baseInputClasses = cn(
      'input',
      showError && 'border-danger focus:border-danger',
      field.className
    )

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            required={field.required}
            className={cn(baseInputClasses, 'h-24 resize-none')}
          />
        )

      case 'select':
        return (
          <select
            name={field.name}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            required={field.required}
            className={baseInputClasses}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={field.name}
              checked={Boolean(value)}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              onBlur={() => handleBlur(field.name)}
              required={field.required}
              className="w-4 h-4 text-primary focus:ring-ring border-border rounded"
            />
            <label className="text-sm text-body">{field.label}</label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  required={field.required}
                  className="w-4 h-4 text-primary focus:ring-ring border-border"
                />
                <label className="text-sm text-body">{option.label}</label>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClasses}
          />
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {fields.map(field => {
        const error = errors[field.name]
        const isTouched = touched.has(field.name)
        const showError = isTouched && error
        
        return (
          <div key={field.name} className="space-y-2">
            {field.type !== 'checkbox' && field.type !== 'radio' && (
              <label htmlFor={field.name} className="label">
                {field.label}
                {field.required && <span className="text-danger ml-1">*</span>}
              </label>
            )}
            
            {renderField(field)}
            
            {showError && (
              <div className="flex items-center space-x-2 text-danger text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            
            {field.help && !showError && (
              <p className="help">{field.help}</p>
            )}
          </div>
        )
      })}
      
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Submitting...
          </div>
        ) : (
          submitText
        )}
      </button>
    </form>
  )
}

export default Form
