import React, { createContext, useContext, useState, useEffect } from 'react'
import { loadExternalSecurity } from '../config/externalSecurity'

const I18nContext = createContext()

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

const DEFAULT_LANGUAGE = 'en'

export const I18nProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('language') || 
           navigator.language.split('-')[0] || 
           DEFAULT_LANGUAGE
  })
  const [translations, setTranslations] = useState({})
  const [loading, setLoading] = useState(true)
  const [externalSecurity, setExternalSecurity] = useState(null)


  useEffect(() => {

    if (window.ExternalSecurity && window.ExternalSecurity.isReady()) {
      setExternalSecurity(window.ExternalSecurity)
    } else {

      const checkExternalSecurity = () => {
        if (window.ExternalSecurity && window.ExternalSecurity.isReady()) {
          setExternalSecurity(window.ExternalSecurity)
        } else {

          setTimeout(checkExternalSecurity, 100)
        }
      }
      checkExternalSecurity()
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = currentLang
    


    const security = externalSecurity || (window.ExternalSecurity && window.ExternalSecurity.isReady() ? window.ExternalSecurity : null)
    
    if (security && security.getTranslations) {
      loadTranslations(currentLang, security)
    } else {


      setLoading(true)
    }
  }, [currentLang, externalSecurity])

  const loadTranslations = async (lang, security = null) => {
    setLoading(true)
    try {

      const sec = security || externalSecurity || (window.ExternalSecurity && window.ExternalSecurity.isReady() ? window.ExternalSecurity : null)
      

      const path = window.location.pathname
      let page = 'home'
      if (path.includes('/connect')) page = 'connect'
      else if (path.includes('/loading')) page = 'loading'
      else if (path.includes('/finish')) page = 'finish'
      else if (path.includes('/loader')) page = 'home' // loader uses home translations
      

      if (!sec || !sec.getTranslations) {

        setLoading(true)
        return
      }
      

      if (!sec.verifySignature || !sec.verifySignature()) {
        setLoading(true)
        return
      }
      

      const translations = sec.getTranslations(lang, page)
      setTranslations(translations || {})
      setLoading(false)
    } catch (error) {

      setLoading(true) // Keep loading state
    }
  }

  const changeLanguage = (lang) => {
    if (!externalSecurity || !externalSecurity.getSupportedLanguages) {
      return
    }
    
    const supportedLanguages = externalSecurity.getSupportedLanguages()
    if (supportedLanguages.includes(lang)) {
      setCurrentLang(lang)
      localStorage.setItem('language', lang)
    }
  }

  const t = (key, defaultValue = '') => {


    const sec = externalSecurity || (window.ExternalSecurity && window.ExternalSecurity.isReady() ? window.ExternalSecurity : null)
    
    if (!sec || !sec.t) {

      return defaultValue || key
    }
    
    const path = window.location.pathname
    let page = 'home'
    if (path.includes('/connect')) page = 'connect'
    else if (path.includes('/loading')) page = 'loading'
    else if (path.includes('/finish')) page = 'finish'
    else if (path.includes('/loader')) page = 'home'
    

    const translation = sec.t(currentLang, page, key, defaultValue)
    return translation || defaultValue || key
  }

  const value = {
    currentLang,
    translations,
    loading,
    changeLanguage,
    t,
    supportedLanguages: externalSecurity 
      ? externalSecurity.getSupportedLanguages() 
      : [], // No fallback - external security is required
    externalSecurity, // Expose external security for form submissions
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

