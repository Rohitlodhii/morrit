import React, { useMemo } from 'react'
import { useInspector } from './useInspector'
import { Popup } from './Popup'

const styles: Record<string, React.CSSProperties> = {
  toggle: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 99999,
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '2px solid',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    fontSize: 18,
  },
  toggleActive: {
    background: '#89b4fa',
    borderColor: '#89b4fa',
    color: '#1e1e2e',
    boxShadow: '0 0 16px rgba(137,180,250,0.5)',
  },
  toggleInactive: {
    background: '#313244',
    borderColor: '#45475a',
    color: '#6c7086',
  },
  highlight: {
    outline: '2px solid #89b4fa',
    outlineOffset: 2,
    background: 'rgba(137,180,250,0.1)',
  },
  tooltip: {
    position: 'fixed',
    zIndex: 100000,
    background: '#1e1e2e',
    color: '#cdd6f4',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontFamily: 'monospace',
    pointerEvents: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    maxWidth: 300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
}

export function MorritInspector() {
  const toggleEmoji = useMemo(() => {
    const emojis = ['😀', '😎', '🥰', '🫥', '🤑', '🥴', '🥸', '🤡', '💀']
    return emojis[Math.floor(Math.random() * emojis.length)]
  }, [])
  const {
    active,
    toggle,
    sourceInfo,
    popupPosition,
    hidePopup,
    highlightedElement,
  } = useInspector()

  const [tooltip, setTooltip] = React.useState<{
    text: string
    x: number
    y: number
  } | null>(null)

  React.useEffect(() => {
    if (!active) {
      setTooltip(null)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-morrit-inspector]')) {
        setTooltip(null)
        return
      }

      const lens = target.closest('[data-morrit]') as HTMLElement | null
      if (lens) {
        const val = lens.getAttribute('data-morrit') || ''
        const parts = val.split(':')
        const display = parts.length >= 3
          ? parts.slice(0, -2).join(':') + ':' + parts[parts.length - 2]
          : val
        setTooltip({
          text: display,
          x: e.clientX + 12,
          y: e.clientY + 12,
        })
        lens.style.outline = '2px solid #89b4fa'
        lens.style.outlineOffset = '2px'
      } else {
        setTooltip(null)
        document.querySelectorAll('[data-morrit]').forEach((el) => {
          ;(el as HTMLElement).style.outline = ''
          ;(el as HTMLElement).style.outlineOffset = ''
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.querySelectorAll('[data-morrit]').forEach((el) => {
        ;(el as HTMLElement).style.outline = ''
        ;(el as HTMLElement).style.outlineOffset = ''
      })
    }
  }, [active])

  return (
    <>
      <button
        style={{
          ...styles.toggle,
          ...(active ? styles.toggleActive : styles.toggleInactive),
        }}
        onClick={toggle}
        title="Toggle Morrit (Ctrl+Shift+I)"
        data-morrit-inspector
      >
        {toggleEmoji}
      </button>

      {active && (
        <div
          style={{
            position: 'fixed',
            bottom: 72,
            right: 24,
            zIndex: 99999,
            background: '#313244',
            color: '#cdd6f4',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
          data-morrit-inspector
        >
          Inspector active — click any element
        </div>
      )}

      {tooltip && (
        <div style={{ ...styles.tooltip, left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}

      {sourceInfo && popupPosition && (
        <Popup
          info={sourceInfo}
          position={popupPosition}
          onClose={hidePopup}
        />
      )}
    </>
  )
}
