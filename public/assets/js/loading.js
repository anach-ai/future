// Loading Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize internationalization
    const i18nSystem = new I18nSystem();
    i18nSystem.init();
    
    // Set initial HTML lang attribute
    const initialLang = document.getElementById('langs').value;
    document.documentElement.lang = initialLang;
    
    // Update HTML lang attribute when language changes
    document.getElementById('langs').addEventListener('change', () => {
        const selectedLang = document.getElementById('langs').value;
        document.documentElement.lang = selectedLang;
    });

    // Auto-redirect after configured time
    setTimeout(function() {
        window.location.href = '?AUTH-TOKEN=' + btoa(Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) + '&cur=connect';
    }, CONFIG.loadingPageTimeout || 3000);
}); 