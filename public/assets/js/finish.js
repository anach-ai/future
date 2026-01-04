// Finish Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize internationalization
    const i18nSystem = new I18nSystem();
    window.i18nSystem = i18nSystem; // Make it globally accessible
    i18nSystem.init();

    // Set initial HTML lang attribute
    const initialLang = document.getElementById('langs').value;
    document.documentElement.lang = initialLang;
    
    // Update HTML lang attribute when language changes
    document.getElementById('langs').addEventListener('change', () => {
        const selectedLang = document.getElementById('langs').value;
        document.documentElement.lang = selectedLang;
    });
    
    // Auto redirect after configured delay
    const redirectDelay = window.CONFIG?.autoRedirectDelay || 15000;
    
    // Auto redirect
    setTimeout(() => {
        const websiteDomain = window.CONFIG?.websiteDomain || 'example.com';
        window.location.href = `https://${websiteDomain}`;
    }, redirectDelay);
}); 