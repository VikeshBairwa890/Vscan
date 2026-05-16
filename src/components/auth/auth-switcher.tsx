'use client'

import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

export default function AuthSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === '/auth/login'

  return (
    <div className="mb-8 flex justify-center w-full">
      <div className="relative flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
        {/* Animated pill */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          className={`absolute inset-y-1 rounded-md bg-white shadow-sm dark:bg-slate-800 ${
            isLogin ? 'left-1 right-1/2' : 'left-1/2 right-1'
          }`}
        />

        <button
          onClick={() => router.push('/auth/login')}
          className={`relative z-10 rounded-md px-5 py-2 text-sm font-medium transition-colors duration-200 ${
            isLogin
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Sign in
        </button>

        <button
          onClick={() => router.push('/auth/signup')}
          className={`relative z-10 rounded-md px-5 py-2 text-sm font-medium transition-colors duration-200 ${
            !isLogin
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Sign up
        </button>
      </div>
    </div>
  )
}