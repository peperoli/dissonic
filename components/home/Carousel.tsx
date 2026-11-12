'use client'

import clsx from 'clsx'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ButtonHTMLAttributes, useCallback, useRef, useState, type DragEvent } from 'react'

export function Carousel({
  hideControls = false,
  children: slides,
}: {
  hideControls?: boolean
  children: React.ReactNode[]
}) {
  const carouselRef = useRef<HTMLUListElement | null>(null)
  const scrollRefs = useRef<Map<number, HTMLLIElement> | null>(null)
  const t = useTranslations('Carousel')
  const [activeSlide, setActiveSlide] = useState(0)

  const getScrollRefs = () => {
    if (!scrollRefs.current) {
      scrollRefs.current = new Map()
    }

    return scrollRefs.current
  }

  const navigate = useCallback(
    (index: number) => () => {
      index = (index + slides.length) % slides.length
      const slide = getScrollRefs().get(index)
      slide?.scrollIntoView({
        block: 'nearest',
        inline: 'start',
        // @ts-expect-error - the `container` property is not yet supported in all browsers
        container: 'nearest',
      })
    },
    [slides]
  )

  const handleScroll = useCallback(async () => {
    if (!carouselRef.current) {
      return
    }

    const carouselRect = carouselRef.current.getBoundingClientRect()
    // find the node with the smallest difference to the left of the carousel
    let closestNode: { index: number; node: HTMLLIElement } | null = null
    let closestDiff = Infinity

    for (const [index, node] of getScrollRefs()) {
      const nodeRect = node.getBoundingClientRect()
      const diff = Math.abs(nodeRect.left - carouselRect.left)

      if (diff < closestDiff) {
        closestDiff = diff
        closestNode = { index, node }
      }
    }

    if (closestNode) {
      setActiveSlide(closestNode.index)
    }
  }, [carouselRef])

  const handleDragStart = useCallback((e: DragEvent<HTMLUListElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div className="carousel h-200 relative max-h-screen">
      <ul
        className="carouselItems md:scrollbar-thin flex flex-nowrap gap-2 overflow-x-auto scroll-smooth max-md:-mx-4 max-md:px-4 md:pb-2"
        ref={carouselRef}
        onScroll={handleScroll}
        draggable={false}
        onDragStart={handleDragStart}
      >
        {slides.map((item, index) => (
          <li
            key={index}
            ref={node => {
              if (!node) {
                return
              }

              const refs = getScrollRefs()
              refs.set(index, node)

              return () => {
                refs.delete(index)
              }
            }}
            className="carouselSlide h-200 relative max-h-screen select-none *:h-full"
          >
            {item}
          </li>
        ))}
      </ul>
      {!hideControls && (
        <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 items-center justify-between">
          <CarouselArrow
            onClick={navigate(activeSlide - (activeSlide >= 2 ? 2 : 1))}
            aria-label={t('previousSlide')}
            className={activeSlide === 0 ? 'invisible' : ''}
          >
            <ChevronLeftIcon className="size-icon" />
          </CarouselArrow>
          <CarouselArrow
            onClick={navigate(activeSlide + (activeSlide + 2 <= slides.length ? 2 : 1))}
            aria-label={t('nextSlide')}
          >
            <ChevronRightIcon className="size-icon" />
          </CarouselArrow>
        </div>
      )}
    </div>
  )
}

function CarouselArrow({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={clsx('carouselControl btn btn-icon btn-secondary', className)}>
      {children}
    </button>
  )
}
