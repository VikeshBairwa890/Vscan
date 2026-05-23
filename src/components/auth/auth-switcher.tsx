'use client'

import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

export default function AuthSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === '/auth/login'

  return (
    <div className="mb-8 flex justify-center w-full">
      <div className="relative flex rounded-lg bg-app-surface border border-app-border p-1">
        {/* Animated pill */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          className={`absolute inset-y-1 rounded-md bg-gradient-to-r from-primary to-secondary shadow-md ${
            isLogin ? 'left-1 right-1/2' : 'left-1/2 right-1'
          }`}
        />

        <button
          onClick={() => router.push('/auth/login')}
          className={`relative z-10 rounded-md px-5 py-2 text-sm font-medium transition-colors duration-200 ${
            isLogin
              ? 'text-white'
              : 'text-app-text-muted hover:text-white'
          }`}
        >
          Sign in
        </button>

        <button
          onClick={() => router.push('/auth/signup')}
          className={`relative z-10 rounded-md px-5 py-2 text-sm font-medium transition-colors duration-200 ${
            !isLogin
              ? 'text-white'
              : 'text-app-text-muted hover:text-white'
          }`}
        >
          Sign up
        </button>
      </div>
    </div>
  )
}