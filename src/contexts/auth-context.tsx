// // src/contexts/auth-context.tsx
// import { createContext, useContext, useEffect, useState } from "react"

// type AuthContextType = {
//   isLoggedIn: boolean
//   login: () => void
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken")
//     setIsLoggedIn(!!token)
//   }, [])

//   const login = () => setIsLoggedIn(true)
//   const logout = () => setIsLoggedIn(false)

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider")
//   }
//   return context
// }
