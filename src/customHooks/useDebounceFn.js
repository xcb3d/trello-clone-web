import { debounce } from 'lodash'
import { useCallback } from 'react'

export const useDebounceFn = (fn, delay = 500) => {
  if (isNaN(delay)) {
    throw new Error('Delay must be a number')
  }

  if (!fn || typeof(fn) !== 'function') {
    throw new Error('Debounce must have a function')
  }

  return useCallback(debounce(fn, delay), [fn, delay])
}