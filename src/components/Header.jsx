import React from 'react'
import { useI18n } from '../contexts/I18nContext'
import '../styles/common.css'

const Header = () => {
  const { currentLang, changeLanguage, supportedLanguages, t, translations } = useI18n()


  const getLanguageName = (langCode) => {

    if (window.ExternalSecurity && window.ExternalSecurity.getTranslations) {
      try {

        const homeTranslations = window.ExternalSecurity.getTranslations(currentLang, 'home')
        if (homeTranslations?.languageOptions?.[langCode]) {
          return homeTranslations.languageOptions[langCode]
        }
        

        const enTranslations = window.ExternalSecurity.getTranslations('en', 'home')
        if (enTranslations?.languageOptions?.[langCode]) {
          return enTranslations.languageOptions[langCode]
        }
      } catch (error) {
      }
    }
    

    if (translations?.languageOptions?.[langCode]) {
      return translations.languageOptions[langCode]
    }
    

    return langCode.toUpperCase()
  }

  return (
    <header id="header">
      <div className="container">
        <div className="logo">
          <img src="/files/logo.svg" alt={t('app_name', 'Metamask')} />
        </div>
        <div className="language">
          <select
            name="langs"
            id="langs"
            className="form-select"
            value={currentLang}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {getLanguageName(lang)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}

export default Header

