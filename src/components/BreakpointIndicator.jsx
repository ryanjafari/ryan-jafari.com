'use client'

import { useEffect } from 'react'

function BreakpointIndicator() {
  useEffect(() => {
    const w = () => {
      document.querySelectorAll('.debug-width-container').forEach((element) => {
        element.textContent = window.innerWidth + 'px'
      })
    }

    window.addEventListener('resize', w)
    w()

    return () => {
      window.removeEventListener('resize', w)
    }
  }, [])

  return (
    <div className="fixed left-0 top-0 z-[51] flex flex-grow items-center bg-blue-500 p-1.5 text-center font-mono text-gray-700 sm:bg-pink-400 md:bg-yellow-300 lg:bg-red-400 xl:bg-green-300 2xl:bg-blue-200">
      <div className="hidden flex-grow flex-row sm:hidden md:hidden lg:hidden xl:hidden 2xl:visible 2xl:block">
        <div>
          <span className="debug-width-container mr-2"></span>2XL
        </div>
        <div className="text-sm">min-width: 1536px</div>
      </div>
      <div className="hidden flex-grow flex-row sm:hidden md:hidden lg:hidden xl:visible xl:block 2xl:hidden">
        <div>
          <span className="debug-width-container mr-2"></span>XL
        </div>
        <div className="text-sm">min-width: 1280px</div>
        <div className="text-sm">max-width: 1535px</div>
      </div>
      <div className="hidden flex-grow flex-row sm:hidden md:hidden lg:visible lg:block xl:hidden 2xl:hidden">
        <div>
          <span className="debug-width-container mr-2"></span>LG
        </div>
        <div className="text-sm">min-width: 1024px</div>
        <div className="text-sm">max-width: 1279px</div>
      </div>
      <div className="hidden flex-grow flex-row sm:hidden  md:visible md:block lg:hidden xl:hidden 2xl:hidden">
        <div>
          <span className="debug-width-container mr-2"></span>MD
        </div>
        <div className="text-sm">min-width: 768px</div>
        <div className="text-sm">max-width: 1023px</div>
      </div>
      <div className="hidden flex-grow flex-row sm:visible sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        <div>
          <span className="debug-width-container mr-2"></span>SM
        </div>
        <div className="text-sm">min-width: 640px</div>
        <div className="text-sm">max-width: 767px</div>
      </div>
      <div className="visible block flex-grow sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
        <div>
          <span className="debug-width-container mr-2"></span>&lt; SM
        </div>
        <div className="text-sm">max-width: 639px</div>
      </div>
    </div>
  )
}

export default BreakpointIndicator
