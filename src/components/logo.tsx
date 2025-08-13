import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div className="pointer-events-none translate-y-2 max-h-3 h-4 w-fit md:h-4 md:w-fit flex items-center justify-start border-gray-200 flex-shrink-0 ml-2 mb-0 pt-4">
        <Image height={30} width={120} src="/logo.png" alt="Logo" className="h-8 md:h-10" />
    </div>
  )
}

export default Logo