import React, { createContext, useContext, useState, useEffect } from 'react'

const SessionContext = createContext()

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

export const SessionProvider = ({ children }) => {
  const [verificationStage, setVerificationStage] = useState(() => {
    return sessionStorage.getItem('verification_stage') || 'home'
  })
  const [formData, setFormData] = useState(() => {
    const stored = sessionStorage.getItem('form_data')
    return stored ? JSON.parse(stored) : {}
  })
  const [homeVisited, setHomeVisited] = useState(() => {
    return sessionStorage.getItem('home_visited') === 'true'
  })
  const [verificationStarted, setVerificationStarted] = useState(() => {
    return sessionStorage.getItem('verification_started') || Date.now()
  })

  useEffect(() => {
    sessionStorage.setItem('verification_stage', verificationStage)
  }, [verificationStage])

  useEffect(() => {
    sessionStorage.setItem('form_data', JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    sessionStorage.setItem('home_visited', homeVisited.toString())
  }, [homeVisited])

  useEffect(() => {
    sessionStorage.setItem('verification_started', verificationStarted.toString())
  }, [verificationStarted])

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const resetSession = () => {
    sessionStorage.clear()
    setVerificationStage('home')
    setFormData({})
    setHomeVisited(false)
    setVerificationStarted(Date.now())
  }

  const value = {
    verificationStage,
    setVerificationStage,
    formData,
    updateFormData,
    homeVisited,
    setHomeVisited,
    verificationStarted,
    resetSession,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

