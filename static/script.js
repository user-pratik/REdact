document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('redactionForm');
    const submitBtn = document.getElementById('submitBtn');
    const sensitivitySlider = document.getElementById('sensitivity');
    const sensitivityValue = document.getElementById('sensitivityValue');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const buttonText = submitBtn.querySelector('.button-text');
    const spinner = submitBtn.querySelector('.spinner');

    // Enhanced slider functionality
    function updateSliderBackground(value) {
        const percentage = (value / sensitivitySlider.max) * 100;
        sensitivitySlider.style.background = `linear-gradient(to right, 
            var(--primary-light) 0%, 
            var(--primary-light) ${percentage}%, 
            #e5e7eb ${percentage}%, 
            #e5e7eb 100%)`;
    }

    sensitivitySlider.addEventListener('input', function() {
        sensitivityValue.textContent = this.value;
        updateSliderBackground(this.value);
        
        // Add pulse animation
        sensitivityValue.style.animation = 'none';
        sensitivityValue.offsetHeight; // Trigger reflow
        sensitivityValue.style.animation = 'pulse 0.3s ease';
    });

    // Initialize slider background
    updateSliderBackground(sensitivitySlider.value);

    // Enhanced file drop zone functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.style.borderColor = 'var(--primary)';
        dropZone.style.transform = 'scale(1.02)';
        dropZone.style.background = 'rgba(255, 255, 255, 0.9)';
    }

    function unhighlight() {
        dropZone.style.borderColor = '#d1d5db';
        dropZone.style.transform = 'scale(1)';
        dropZone.style.background = 'rgba(255, 255, 255, 0.5)';
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;

        // Add success animation
        dropZone.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            dropZone.style.animation = '';
        }, 300);
    }

    // Enhanced form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state with smooth transition
        submitBtn.style.transform = 'scale(0.98)';
        submitBtn.disabled = true;
        buttonText.style.opacity = '0';
        
        setTimeout(() => {
            buttonText.textContent = 'Processing...';
            buttonText.style.opacity = '1';
            spinner.classList.remove('hidden');
        }, 200);

        try {
            // Simulate processing with progress indication
            //await simulateProcessing();
            
            // Success animation
            showSuccessMessage();
        } catch (error) {
            // Error animation
            showErrorMessage();
        } finally {
            // Reset button state with smooth transition
            setTimeout(() => {
                submitBtn.disabled = false;
                buttonText.style.opacity = '0';
                spinner.classList.add('hidden');
                
                setTimeout(() => {
                    buttonText.textContent = 'Redact';
                    buttonText.style.opacity = '1';
                    submitBtn.style.transform = 'scale(1)';
                }, 200);
            }, 500);
        }
    });

    async function simulateProcessing() {
        const steps = ['Analyzing document...', 'Applying redactions...', 'Finalizing...'];
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 800));
            buttonText.style.opacity = '0';
            setTimeout(() => {
                buttonText.textContent = step;
                buttonText.style.opacity = '1';
            }, 200);
        }
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        `;
        message.textContent = 'Document redacted successfully!';
        document.body.appendChild(message);

        requestAnimationFrame(() => {
            message.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    function showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        `;
        message.textContent = 'An error occurred while processing the document.';
        document.body.appendChild(message);

        requestAnimationFrame(() => {
            message.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Enhanced checkbox interactions
    document.querySelectorAll('.checkbox-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const icon = item.querySelector('.checkbox-icon');

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                item.style.background = 'rgba(99, 102, 241, 0.1)';
                icon.style.color = 'var(--primary)';
                item.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                item.style.transform = 'translateX(5px)';
            } else {
                item.style.background = 'rgba(255, 255, 255, 0.5)';
                icon.style.color = 'var(--text-light)';
                item.style.borderColor = 'transparent';
                item.style.transform = 'translateX(0)';
            }
        });
    });

    // Scroll-based header effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.style.boxShadow = '0 4px 20px -5px rgba(0, 0, 0, 0.1)';
            return;
        }

        if (currentScroll > lastScroll) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 4px 20px -5px rgba(0, 0, 0, 0.2)';
        }

        lastScroll = currentScroll;
    });
});