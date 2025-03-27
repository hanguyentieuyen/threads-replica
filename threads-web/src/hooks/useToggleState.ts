/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */
import { useCallback, useState } from "react"

export const useToggleState = (initialState: boolean = false) => {
  const [state, setState] = useState(initialState)
  const toggleState = useCallback(() => setState((state) => !state), [])
  return [state, toggleState] as const
}
