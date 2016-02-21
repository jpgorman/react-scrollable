export function timestamp() {
  return window.performance ? window.performance.now() : Date.now()
}