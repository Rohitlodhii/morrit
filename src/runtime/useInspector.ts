import { useState, useCallback, useEffect } from 'react'

export interface SourceInfo {
  file: string
  line: number
  column: number
}

const ATTRIBUTE_NAME = 'data-vilson'

function findNearestVilson(el: HTMLElement | null): SourceInfo | null {
  let current: HTMLElement | null = el
  while (current) {
    const value = current.getAttribute(ATTRIBUTE_NAME)
    if (value) {
      const parts = value.split(':')
      if (parts.length >= 3) {
        return {
          file: parts.slice(0, -2).join(':') || parts[0],
          line: parseInt(parts[parts.length - 2], 10),
          column: parseInt(parts[parts.length - 1], 10),
        }
      }
    }
    current = current.parentElement
  }
  return null
}

interface UseInspectorReturn {
  active: boolean
  toggle: () => void
  sourceInfo: SourceInfo | null
  popupPosition: { x: number; y: number } | null
  showPopup: (info: SourceInfo, x: number, y: number) => void
  hidePopup: () => void
  highlightedElement: HTMLElement | null
}

export function useInspector(): UseInspectorReturn {
  const [active, setActive] = useState(false)
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)

  const toggle = useCallback(() => {
    setActive((prev) => !prev)
    setSourceInfo(null)
    setPopupPosition(null)
    setHighlightedElement(null)
  }, [])

  const showPopup = useCallback((info: SourceInfo, x: number, y: number) => {
    setSourceInfo(info)
    setPopupPosition({ x, y })
  }, [])

  const hidePopup = useCallback(() => {
    setSourceInfo(null)
    setPopupPosition(null)
  }, [])

  useEffect(() => {
    if (!active) return

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-vilson-inspector]')) return
      setHighlightedElement(target)
    }

    const handleMouseOut = () => {
      setHighlightedElement(null)
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-vilson-inspector]')) return

      if (sourceInfo) {
        hidePopup()
        return
      }

      e.preventDefault()
      e.stopPropagation()

      const info = findNearestVilson(target)
      if (!info) {
        return
      }

      showPopup(info, e.clientX, e.clientY)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'i' || e.key === 'I')
      ) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active, sourceInfo, showPopup, hidePopup, toggle])

  return {
    active,
    toggle,
    sourceInfo,
    popupPosition,
    showPopup,
    hidePopup,
    highlightedElement,
  }
}

export { findNearestVilson, ATTRIBUTE_NAME }
