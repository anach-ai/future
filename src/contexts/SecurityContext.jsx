import React, { createContext, useContext } from 'react'

const SecurityContext = createContext()

export const useSecurity = () => {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider')
  }
  return context
}

export const SecurityProvider = ({ children, value }) => {
  return (
    <SecurityContext.Provider value={value || { blocked: false }}>
      {children}
    </SecurityContext.Provider>
  )
}

