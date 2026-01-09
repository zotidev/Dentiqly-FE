import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { dentalColors } from '../config/colors'

// Import both apps
import { BookingForm } from './booking/BookingForm'
import { AdminApp } from './admin/AdminApp'

const BookingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: dentalColors.gray50 }}>
      <main className="flex-1 py-8">
        {/* Formulario de reserva */}
        <BookingForm />
      </main>
    </div>
  )
}

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BookingLayout />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}