import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  other: {
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache',
  },
}

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      {children}
    </>
  )
}

export default AdminLayout
