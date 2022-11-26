import { useRef } from 'react'

import type { FC } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  tooltip?: string
}

export const Tooltip: FC<Props> = ({ children, tooltip }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !containerRef.current) return
        const { left, top } = containerRef.current.getBoundingClientRect()
        //console.log({ clientX, left, top })
        tooltipRef.current.style.left = `${clientX - left - 45}px`
        tooltipRef.current.style.top = `${top - top - 45}px`
        //console.log(tooltipRef.current.style)
      }}
      className="group relative inline-flex">
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-blue-500 text-white p-1 rounded absolute top-full mt-2 z-10 whitespace-nowrap">
          {tooltip}
        </span>
      ) : null}
    </div>
  )
}
