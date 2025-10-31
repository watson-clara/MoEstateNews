import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DigestsProvider } from '@/context/DigestsContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'MoEstateNews - Real Estate Brief Generator',
  description: 'Generate, manage, and export professional real estate briefs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <DigestsProvider>
          {children}
        </DigestsProvider>
      </body>
    </html>
  )
}