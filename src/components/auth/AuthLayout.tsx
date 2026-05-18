'use client'
import React from 'react'
import { Toaster } from 'sonner'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-[#F5F3FF] lg:flex">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-violet-300/30 blur-3xl" />

            <div className="absolute bottom-[-140px] right-[-100px] h-[420px] w-[420px] rounded-full bg-indigo-300/30 blur-3xl" />

            <div className="absolute left-[20%] top-[30%] h-[300px] w-[300px] rounded-full bg-pink-200/20 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative flex w-full flex-col justify-between p-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-lg">
                S
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Shopora
                </h1>

                <p className="text-sm text-slate-600">
                  Digital tools for modern local businesses
                </p>
              </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white/70 px-4 py-1 text-sm font-medium text-violet-700 backdrop-blur-xl">
                AI-powered business platform
              </div>

              <h2 className="mt-8 text-6xl font-bold leading-[1.02] tracking-tight text-slate-900">
                Bring your
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}business online
                </span>
                {' '}beautifully.
              </h2>

              <p className="mt-8 max-w-lg text-lg leading-8 text-slate-600">
                Create mini websites, digital business cards,
                customer reviews, and smart tools designed
                for growing local businesses.
              </p>
            </div>

            {/* Bottom Visual */}
            <div className="relative mt-12">
              <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/60 p-8 shadow-2xl backdrop-blur-2xl">
                {/* Floating Glow */}
                <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-violet-300/20 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-bold text-white shadow-lg">
                      ✨
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        Your digital storefront
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Simple tools to help customers discover your business online.
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
                      <p className="text-sm font-medium text-slate-900">
                        Mini Websites
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Launch your business online instantly.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
                      <p className="text-sm font-medium text-slate-900">
                        AI Reviews
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
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
        <div className="relative flex items-center justify-center bg-[#FCFCFD] px-2 lg:px-12">
          {/* subtle pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_30%)]" />

          <div className="relative z-10 w-full lg:w-135">
            <Toaster position="top-right" richColors />

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}