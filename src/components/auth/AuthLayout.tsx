'use client'
import React from 'react'
import { Toaster } from 'sonner'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-app-bg text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-app-surface border-r border-app-border lg:flex">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" />

            <div className="absolute bottom-[-140px] right-[-100px] h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl" />

            <div className="absolute left-[20%] top-[30%] h-[300px] w-[300px] rounded-full bg-primary-light/5 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative flex w-full flex-col justify-between p-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white shadow-lg">
                V
              </div>

              <div className='flex w-full justify-between item-baseline'>
                <div className='space-y-1'>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-syne">
                    Vscan
                  </h1>

                  <p className="text-sm text-app-text-muted">
                    Digital tools for modern local businesses
                  </p>
                </div>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary-light backdrop-blur-xl mt-2">
                  AI-powered business platform
                </div>

              </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 max-w-xl">


              <h2 className="mt-8 text-6xl font-bold leading-[1.02] tracking-tight text-white font-syne">
                Bring your
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  {' '}business online
                </span>
                {' '}beautifully.
              </h2>

              <p className="mt-8 max-w-lg text-lg leading-8 text-app-text-muted">
                Create mini websites, digital business cards,
                customer reviews, and smart tools designed
                for growing local businesses.
              </p>
            </div>

            {/* Bottom Visual */}
            <div className="relative mt-12">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/3 p-8 shadow-2xl backdrop-blur-2xl">
                {/* Floating Glow */}
                <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-bold text-white shadow-lg">
                      ✨
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Your digital storefront
                      </h3>

                      <p className="mt-1 text-sm text-app-text-muted">
                        Simple tools to help customers discover your business online.
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-5 shadow-sm">
                      <p className="text-sm font-medium text-white">
                        Mini Websites
                      </p>

                      <p className="mt-2 text-sm leading-6 text-app-text-muted">
                        Launch your business online instantly.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/5 p-5 shadow-sm">
                      <p className="text-sm font-medium text-white">
                        AI Reviews
                      </p>

                      <p className="mt-2 text-sm leading-6 text-app-text-muted">
                        Build trust with smart review tools.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center justify-center bg-app-bg px-2 lg:px-12">
          {/* subtle pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.1),transparent_35%)]" />

          <div className="relative z-10 w-full lg:w-135">
            <Toaster position="top-right" richColors />

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}