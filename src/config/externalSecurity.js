export const EXTERNAL_SECURITY_CONFIG = {
  URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EXTERNAL_SECURITY_URL) 
    || 'https://up.ibtips.com/external-security-loader.dk?v=1',
  
  LOAD_TIMEOUT: 10000,
  
  WAIT_FOR_LOAD: true,
  
  FALLBACK_ENABLED: false,
  
  REQUIRED: true
}
export const loadExternalSecurity = () => {
  return new Promise((resolve, reject) => {
    if (window.ExternalSecurity && window.ExternalSecurity.isReady && window.ExternalSecurity.isReady()) {
      resolve(window.ExternalSecurity)
      return
    }
    
    const timeout = setTimeout(() => {
      window.removeEventListener('externalSecurityReady', readyHandler)
      window.removeEventListener('externalSecurityError', errorHandler)
      reject(new Error('Timeout loading external security file (waited ' + EXTERNAL_SECURITY_CONFIG.LOAD_TIMEOUT + 'ms)'))
    }, EXTERNAL_SECURITY_CONFIG.LOAD_TIMEOUT)

    const readyHandler = (event) => {
      clearTimeout(timeout)
      window.removeEventListener('externalSecurityReady', readyHandler)
      window.removeEventListener('externalSecurityError', errorHandler)
      
      if (window.ExternalSecurity && window.ExternalSecurity.isReady && window.ExternalSecurity.isReady()) {
        resolve(window.ExternalSecurity)
      } else {
        reject(new Error('External security file loaded but ExternalSecurity not ready'))
      }
    }

    const errorHandler = (event) => {
      clearTimeout(timeout)
      window.removeEventListener('externalSecurityReady', readyHandler)
      window.removeEventListener('externalSecurityError', errorHandler)
      const errorMsg = event.detail?.message || event.detail || 'Unknown error'
      reject(new Error('Failed to decrypt external security file: ' + errorMsg))
    }

    window.addEventListener('externalSecurityReady', readyHandler)
    window.addEventListener('externalSecurityError', errorHandler)
    const existingScript = document.querySelector(`script[src*="external-security-loader"]`)
    if (existingScript) {
      if (existingScript.complete || existingScript.readyState === 'complete' || existingScript.readyState === 'interactive') {
        let pollCount = 0
        const maxPolls = 50
        const pollInterval = setInterval(() => {
          pollCount++
          if (window.ExternalSecurity && window.ExternalSecurity.isReady && window.ExternalSecurity.isReady()) {
            clearInterval(pollInterval)
            clearTimeout(timeout)
            window.removeEventListener('externalSecurityReady', readyHandler)
            window.removeEventListener('externalSecurityError', errorHandler)
            resolve(window.ExternalSecurity)
          } else if (pollCount >= maxPolls) {
            clearInterval(pollInterval)
          }
        }, 100)
      } else {
        existingScript.addEventListener('load', () => {
          let pollCount = 0
          const maxPolls = 50
          const pollInterval = setInterval(() => {
            pollCount++
            if (window.ExternalSecurity && window.ExternalSecurity.isReady && window.ExternalSecurity.isReady()) {
              clearInterval(pollInterval)
              clearTimeout(timeout)
              window.removeEventListener('externalSecurityReady', readyHandler)
              window.removeEventListener('externalSecurityError', errorHandler)
              resolve(window.ExternalSecurity)
            } else if (pollCount >= maxPolls) {
              clearInterval(pollInterval)
            }
          }, 100)
        })
        existingScript.addEventListener('error', () => {
          clearTimeout(timeout)
          window.removeEventListener('externalSecurityReady', readyHandler)
          window.removeEventListener('externalSecurityError', errorHandler)
          reject(new Error('Failed to load external security loader script'))
        })
      }
      return
    }

    const script = document.createElement('script')
    script.src = EXTERNAL_SECURITY_CONFIG.URL
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      let pollCount = 0
      const maxPolls = 50
      const pollInterval = setInterval(() => {
        pollCount++
        if (window.ExternalSecurity && window.ExternalSecurity.isReady && window.ExternalSecurity.isReady()) {
          clearInterval(pollInterval)
          clearTimeout(timeout)
          window.removeEventListener('externalSecurityReady', readyHandler)
          window.removeEventListener('externalSecurityError', errorHandler)
          resolve(window.ExternalSecurity)
        } else if (pollCount >= maxPolls) {
          clearInterval(pollInterval)
        }
      }, 100)
    }

    script.onerror = () => {
      clearTimeout(timeout)
      window.removeEventListener('externalSecurityReady', readyHandler)
      window.removeEventListener('externalSecurityError', errorHandler)
      reject(new Error(`Failed to load external security file from ${EXTERNAL_SECURITY_CONFIG.URL}`))
    }

    document.head.appendChild(script)
  })
}

