export type ToastItem = { id?: string; title?: string; description?: string }

let _showToast: ((t: ToastItem) => void) | null = null

export function registerShowToast(fn: (t: ToastItem) => void) {
  _showToast = fn
}

export function showToast(t: ToastItem) {
  if (_showToast) _showToast({ id: String(Date.now()), ...t })
  else console.warn('Toast not initialized yet')
}
