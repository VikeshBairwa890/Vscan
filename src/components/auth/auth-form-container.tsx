import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function AuthFormContainer({ children }: Props) {
  return (
    <div className="w-full rounded-[32px] border border-app-border bg-app-surface/65 p-8 shadow-2xl backdrop-blur-lg">
      {children}
    </div>
  )
}