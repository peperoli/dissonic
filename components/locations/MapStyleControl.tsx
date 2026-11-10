import 'maplibre-gl/dist/maplibre-gl.css'
import { useTranslations } from 'next-intl'
import { useControl } from 'react-map-gl/maplibre'
import streetsDarkImg from '../../public/maps/streets-dark.png'
import hybridImg from '../../public/maps/hybrid.png'
import clsx from 'clsx'
import { useRef } from 'react'

export const mapStyles = {
  streetsDark: {
    label: 'streets',
    url: `https://api.maptiler.com/maps/streets-v4-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
    image: streetsDarkImg.src,
  },
  hybrid: {
    label: 'satellite',
    url: `https://api.maptiler.com/maps/hybrid-v4/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
    image: hybridImg.src,
  },
}

export type MapStyleName = keyof typeof mapStyles
export type MapStyle = (typeof mapStyles)[MapStyleName]

export function MapStyleControl({
  position,
  currentMapStyle,
  switchStyle,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  currentMapStyle: MapStyleName
  switchStyle: (styleName: MapStyleName) => void
}) {
  const t = useTranslations('MapStyleControl')
  const currentMapStyleRef = useRef(currentMapStyle)
  currentMapStyleRef.current = currentMapStyle

  useControl(
    () => {
      const container = document.createElement('div')
      container.className =
        'maplibregl-ctrl bg-white shadow-sm rounded divide-y divide-[#ddd] text-slate-850 font-bold'
      const styleImages = new Map<MapStyleName, HTMLImageElement>()

      function syncSelectedStyle(styleName: MapStyleName) {
        styleImages.forEach((img, imageStyleName) => {
          img.classList.toggle('border-venom', imageStyleName === styleName)
          img.classList.toggle('border-transparent', imageStyleName !== styleName)
        })
      }

      // Add a button for each style with image
      const styleEntries = Object.entries(mapStyles) as [MapStyleName, MapStyle][]
      styleEntries.forEach(([styleName, styleData]) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = clsx('!flex items-center gap-1 !pr-1 !w-auto map-style', styleName)
        button.setAttribute('aria-label', `Switch to ${t(styleData.label)} style`)
        button.title = `Switch to ${styleName} style`

        // Add an image to the button
        const img = document.createElement('img')
        img.src = styleData.image
        img.alt = styleName
        img.width = 29
        img.height = 29
        img.className = 'block border-2 rounded'
        styleImages.set(styleName, img)
        button.appendChild(img)

        // Add a label to the button
        const label = document.createElement('span')
        label.textContent = t(styleData.label)
        button.appendChild(label)

        // Add a click event listener
        button.addEventListener('click', () => {
          currentMapStyleRef.current = styleName
          switchStyle(styleName)
          syncSelectedStyle(styleName)
        })

        container.appendChild(button)
      })

      syncSelectedStyle(currentMapStyleRef.current)

      return {
        onAdd: () => container,
        onRemove: () => container.remove(),
      }
    },
    {
      position: position,
    }
  )

  return null
}
