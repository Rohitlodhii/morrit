import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { SourceInfo } from './useInspector'

interface PopupProps {
  info: SourceInfo
  position: { x: number; y: number }
  onClose: () => void
}

const POPUP_WIDTH = 300
const POPUP_HEIGHT = 140
const EMOJIS = ['😀', '😎', '🥰', '🫥', '🤑', '🥴', '🥸', '🤡', '💀']

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 99998,
  },
  popup: {
    position: 'fixed',
    zIndex: 99999,
    background: '#2a2b3d',
    border: '1px solid #45475a',
    borderRadius: 16,
    padding: 16,
    width: POPUP_WIDTH,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 13,
    color: '#cdd6f4',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  filePath: {
    wordBreak: 'break-all',
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#a6adc8',
    lineHeight: 1.4,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#6c7086',
    cursor: 'pointer',
    fontSize: 16,
    padding: 0,
    lineHeight: 1,
    flexShrink: 0,
    marginLeft: 8,
  },
  buttons: {
    display: 'flex',
    gap: 8,
  },
  btn: {
    flex: 1,
    padding: '4px 12px',
    border: '1px solid #45475a',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'background 0.15s, opacity 0.15s',
  },
  copyBtn: {
    background: '#313244',
    color: '#cdd6f4',
  },
  copyBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  openBtn: {
    background: '#89b4fa',
    color: '#1e1e2e',
    borderColor: '#89b4fa',
  },
  openBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  toast: {
    position: 'fixed',
    bottom: 80,
    right: 24,
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    zIndex: 100000,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    animation: 'slideIn 0.2s ease-out',
  },
  toastSuccess: {
    background: '#a6e3a1',
    color: '#1e1e2e',
  },
  toastError: {
    background: '#f38ba8',
    color: '#1e1e2e',
  },
}

export function Popup({ info, position, onClose }: PopupProps) {
  const btnEmoji = useMemo(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)], [])
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [openingEditor, setOpeningEditor] = useState(false)
  const [editorError, setEditorError] = useState(false)

  const adjustPosition = useCallback(() => {
    let x = position.x + 16
    let y = position.y + 16

    if (x + POPUP_WIDTH > window.innerWidth - 16) {
      x = position.x - POPUP_WIDTH - 16
    }
    if (y + POPUP_HEIGHT > window.innerHeight - 16) {
      y = window.innerHeight - POPUP_HEIGHT - 16
    }
    if (x < 16) x = 16
    if (y < 16) y = 16

    return { x, y }
  }, [position])

  const coords = adjustPosition()

  const copyPath = useCallback(async () => {
    const text = `${info.file}:${info.line}:${info.column}`
    let success = false

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        success = true
      } else {
        throw new Error('Clipboard API not available')
      }
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ta.setSelectionRange(0, ta.value.length)
        success = document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {
        success = false
      }
    }

    if (success) {
      setCopied(true)
      setCopyError(false)
    } else {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 3000)
    }
  }, [info])

  const openInEditor = useCallback(async () => {
    setOpeningEditor(true)
    setEditorError(false)

    const fileParam = `${info.file}:${info.line}:${info.column}`
    try {
      const res = await fetch('/__open-in-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: fileParam }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to open editor')
    } catch (err) {
      console.error('[SourceLens] Failed to open in editor:', err)
      setEditorError(true)
      setTimeout(() => setEditorError(false), 3000)
    } finally {
      setOpeningEditor(false)
    }
  }, [info])

  useEffect(() => {
    if (!copied && !copyError) return
    const id = setTimeout(() => {
      setCopied(false)
      setCopyError(false)
    }, 2000)
    return () => clearTimeout(id)
  }, [copied, copyError])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const showToast = copied || copyError || editorError
  const toastMessage = copied
    ? '✓ Copied!'
    : copyError
      ? '✗ Copy failed'
      : editorError
        ? '✗ Failed to open editor'
        : ''

  const toastStyle = copied
    ? styles.toastSuccess
    : styles.toastError

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div
        style={{ ...styles.popup, left: coords.x, top: coords.y }}
        onClick={(e) => e.stopPropagation()}
        data-source-lens-inspector
      >
        <div style={styles.header}>
          <span style={styles.filePath}>{info.file}:{info.line}</span>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={styles.buttons}>
          <button
            style={{
              ...styles.btn,
              ...styles.copyBtn,
              ...(copied || copyError ? styles.copyBtnDisabled : {}),
            }}
            onClick={copyPath}
            disabled={copied || copyError}
          >
            {copied ? '✓ Copied' : copyError ? '✗ Failed' : `${btnEmoji} Copy Path`}
          </button>
          <button
            style={{
              ...styles.btn,
              ...styles.openBtn,
              ...(openingEditor ? styles.openBtnDisabled : {}),
            }}
            onClick={openInEditor}
            disabled={openingEditor}
          >
            {openingEditor ? '⏳ Opening...' : `${btnEmoji} Open in VS Code`}
          </button>
        </div>
      </div>
      {showToast && (
        <div style={{ ...styles.toast, ...toastStyle }}>
          {toastMessage}
        </div>
      )}
    </>
  )
}