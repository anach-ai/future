import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useSession } from '../contexts/SessionContext'
import Header from '../components/Header'
import '../styles/common.css'
import '../styles/loading.css'

const Loading = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { setVerificationStage } = useSession()

  useEffect(() => {
    setVerificationStage('loading')
    const timer = setTimeout(() => {
      const authToken = btoa(Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
      navigate(`/connect?AUTH-TOKEN=${authToken}`, { replace: true })
    }, 3000) // LOADING_PAGE_TIMEOUT

    return () => clearTimeout(timer)
  }, [navigate, setVerificationStage])

  return (
    <div className="loading-page">
      <Header />
      <main id="main">
        <div className="container">
          <div className="thebox">
            <div className="loading-container">
              <div className="spinner"></div>
              <h2 className="loading-title" id="main-title">
                {t('main_title', 'Processing...')}
              </h2>
              <p className="loading-description" id="description">
                {t('description', 'Please wait while we process your request')}
              </p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="loading-note" id="note">
                {t('note', 'This may take a few moments')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Loading
