import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div className="pointer-events-none w-full h-10 md:h-14 flex items-center justify-start border-gray-200 flex-shrink-0 ml-4">
        <Image height={53} width={115} src="/logo.png" alt="Logo" className="h-12 md:h-14" />
    </div>
  )
}

export default Logo