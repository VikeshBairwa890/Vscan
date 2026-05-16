'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AuthFormContainer from '@/components/auth/auth-form-container'
import AuthInput from '@/components/auth/auth-input'
import AuthLayout from '@/components/auth/AuthLayout'
import AuthSwitcher from '@/components/auth/auth-switcher'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <AuthLayout>

      <AuthFormContainer>
        <AuthSwitcher />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Create account
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Get started for free
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <AuthInput
              label="Full name"
              name="fullName"
              placeholder="Jane Smith"
              value={formData.fullName}
              onChange={handleChange}
            />
            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition duration-150 hover:bg-slate-700 active:scale-[0.99] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              Create account
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google */}
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-50 active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <GoogleIcon />
            Continue with Google
          </button>
        </motion.div>
      </AuthFormContainer>
    </AuthLayout>
  )
}


function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}