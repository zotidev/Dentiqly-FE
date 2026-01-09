import React from 'react'
import { dentalColors } from '../../config/colors'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm font-medium text-[${dentalColors.gray700}] mb-1`}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[${dentalColors.primary}] focus:border-transparent ${
          error 
            ? `border-[${dentalColors.error}]` 
            : `border-[${dentalColors.gray300}] hover:border-[${dentalColors.gray400}]`
        } ${className}`}
        {...props}
      />
      {error && (
        <p className={`mt-1 text-sm text-[${dentalColors.error}]`}>{error}</p>
      )}
      {helperText && !error && (
        <p className={`mt-1 text-sm text-[${dentalColors.gray500}]`}>{helperText}</p>
      )}
    </div>
  )
}