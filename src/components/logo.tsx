import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div className="pointer-events-none translate-y-4 max-h-4 h-auto w-64 md:h-auto md:w-64 flex items-center justify-start border-gray-200 flex-shrink-0 ml-4 mb-0">
        <Image height={53} width={115} src="/logo.png" alt="Logo" className="h-12 md:h-14" />
    </div>
  )
}

export default Logo