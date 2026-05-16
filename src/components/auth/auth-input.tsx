'use client'

import { useState } from 'react'

interface Props {
  label: string
  type?: string
  placeholder?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AuthInput({ label, type = 'text', placeholder, name, value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'name'}
        className="h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition duration-150 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600 dark:hover:border-slate-700 dark:focus:border-slate-600 dark:focus:ring-white/5"
      />
    </div>
  )
}