import React from 'react'
import { ChevronDown } from 'lucide-react'
import { dentalColors } from '../../config/colors'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
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
      <div className="relative">
        <select
          className={`w-full px-3 py-2 border rounded-lg appearance-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[${dentalColors.primary}] focus:border-transparent ${
            error 
              ? `border-[${dentalColors.error}]` 
              : `border-[${dentalColors.gray300}] hover:border-[${dentalColors.gray400}]`
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[${dentalColors.gray400}] pointer-events-none`} />
      </div>
      {error && (
        <p className={`mt-1 text-sm text-[${dentalColors.error}]`}>{error}</p>
      )}
    </div>
  )
}