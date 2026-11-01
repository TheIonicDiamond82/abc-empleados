import { watch } from 'vue'

export function useDebouncedWatch(source, callback, delay = 280) {
  let timeoutId

  watch(source, (value, oldValue) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback(value, oldValue)
    }, delay)
  })
}
