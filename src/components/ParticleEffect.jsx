import { useEffect, useCallback, useRef } from 'react'

const COLORS = [
  '#4f46e5', '#818cf8', '#f59e0b', '#f97316',
  '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4',
  '#10b981', '#e11d48', '#a855f7', '#14b8a6',
]

function createParticle(x, y, color) {
  const el = document.createElement('span')
  el.className = 'click-particle'
  const size = 4 + Math.random() * 7
  const angle = Math.random() * Math.PI * 2
  const dist = 30 + Math.random() * 50
  const dx = Math.cos(angle) * dist
  const dy = Math.sin(angle) * dist
  const dur = 400 + Math.random() * 300

  el.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    --dx: ${dx}px;
    --dy: ${dy}px;
    --dur: ${dur}ms;
    animation: particleBurst var(--dur) cubic-bezier(0, .9, .6, 1) both;
  `
  document.body.appendChild(el)
  setTimeout(() => el.remove(), dur + 50)
}

export default function ParticleEffect() {
  const handlerRef = useRef(null)

  const onClick = useCallback((e) => {
    // Find nearest interactive element
    const el = e.target.closest('button, .option-item, .sheet-num')
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const count = 6 + Math.floor(Math.random() * 7)
    for (let i = 0; i < count; i++) {
      createParticle(cx, cy, COLORS[Math.floor(Math.random() * COLORS.length)])
    }
  }, [])

  useEffect(() => {
    handlerRef.current = onClick
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [onClick])

  return null
}
