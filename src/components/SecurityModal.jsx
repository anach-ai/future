import React from 'react'
import { useI18n } from '../contexts/I18nContext'
import '../styles/common.css'

const SecurityModal = ({ isOpen, onClose, variant = 'home' }) => {
  const { t } = useI18n()

  if (!isOpen) return null


  if (variant === 'home') {
    return (
      <div 
        id="securityModal" 
        className="security-modal" 
        style={{ display: 'block' }} 
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close-modal" onClick={onClose}>&times;</span>
          <h3 id="modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#d32f2f" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
              <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM12 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-5h2v-4h-2v4z"/>
            </svg>
            <span id="modal-title-text">{t('modalTitle', 'Security Alert: Compromised Phrases')}</span>
          </h3>
          
          <div className="modal-warning-box">
            <strong id="signs-title">{t('signsTitle', 'Signs of a compromised phrase:')}</strong>
            <ul className="modal-list" id="signs-list">
              {t('signsList', []).map((sign, index) => (
                <li key={index}>{sign}</li>
              ))}
              {!Array.isArray(t('signsList', [])) && (
                <>
                  <li>{t('sign_1', 'Shared it with someone claiming to be support')}</li>
                  <li>{t('sign_2', 'Stored digitally (photos, cloud, messages)')}</li>
                  <li>{t('sign_3', 'Unauthorized transactions in your wallet')}</li>
                </>
              )}
            </ul>
          </div>
          <p className="modal-note" id="modal-note">
            {t('modalNote', 'Note: {websiteName} will never ask for your recovery phrase. This verification process only requires your public wallet address.')}
          </p>
        </div>
      </div>
    )
  }


  return (
    <div 
      id="securityModal" 
      className="security-modal" 
      style={{ display: 'block' }} 
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h3>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#d32f2f" className="modal-icon">
            <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM12 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-5h2v-4h-2v4z"/>
          </svg>
          <span id="modal-title-text">{t('modalTitle', 'Security Alert: Compromised Phrases')}</span>
        </h3>
        
        <div className="modal-warning-box">
          <strong id="best-practices-title">{t('bestPracticesTitle', 'Best Practices:')}</strong>
          <ul className="modal-list" id="best-practices-list">
            {Array.isArray(t('bestPracticesList', [])) ? (
              t('bestPracticesList', []).map((item, index) => (
                <li key={index}>{item}</li>
              ))
            ) : (
              <>
                <li>{t('practice_1', 'Never share your recovery phrase with anyone')}</li>
                <li>{t('practice_2', 'Store it in a secure physical location')}</li>
                <li>{t('practice_3', 'Never take photos or screenshots of it')}</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="modal-info-box">
          <strong id="protection-title">{t('protectionTitle', 'How We Protect You:')}</strong>
          <ul className="modal-list" id="protection-list">
            {Array.isArray(t('protectionList', [])) ? (
              t('protectionList', []).map((item, index) => (
                <li key={index}>{item}</li>
              ))
            ) : (
              <>
                <li>{t('protection_1', 'End-to-end encryption')}</li>
                <li>{t('protection_2', 'Secure verification process')}</li>
                <li>{t('protection_3', 'No storage of sensitive data')}</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="modal-success-box">
          <p id="modal-note" className="modal-note">
            {t('modalNote', 'Note: {websiteName} will never ask for your recovery phrase. This verification process only requires your public wallet address.')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecurityModal
