import React from 'react'

interface Props {
  title: string
  description: string
  children: React.ReactNode
}

export default function AuthCard({
  title,
  description,
  children,
}: Props) {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {children}
      </div>
    </div>
  )
}