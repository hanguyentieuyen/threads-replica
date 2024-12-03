import { createContext, useState } from "react"
import { User } from "~/types/user.type"
import { getProfileFromLocalStorage } from "~/utils/auth"

type AppContextTypes = {
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const initialAppContext: AppContextTypes = {
  profile: getProfileFromLocalStorage(),
  setProfile: () => null
}
export const AppContext = createContext<AppContextTypes>(initialAppContext)
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  return <AppContext.Provider value={{ profile, setProfile }}> {children}</AppContext.Provider>
}
