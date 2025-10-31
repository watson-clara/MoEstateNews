'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

export const Navbar: React.FC = () => {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-background border-b border-border shadow-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/moestate-news" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2L2 7L10 12L18 7L10 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 13L10 18L18 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary">MoFlo</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/moestate-news"
              className={cn(
                'text-sm font-medium transition-colors',
                isActive('/moestate-news')
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Home
            </Link>
            <Link
              href="/moestate-news/create"
              className={cn(
                'text-sm font-medium transition-colors',
                isActive('/moestate-news/create')
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Create
            </Link>
            <Link
              href="/moestate-news/view"
              className={cn(
                'text-sm font-medium transition-colors',
                isActive('/moestate-news/view')
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Manage
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

