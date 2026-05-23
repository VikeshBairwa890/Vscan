import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function AuthFormContainer({ children }: Props) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {children}
    </div>
  )
}