/**
 * Waitlist Contact Form Handler
 * Handles submission and redirect to thank you page
 */

class WaitlistContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.init();
    }

    init() {
        // Pre-fill email from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        if (email) {
            const emailInput = this.form.querySelector('#email');
            if (emailInput) {
                emailInput.value = email;
            }
        }

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input validation listeners
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea, .form-select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorDiv = input.closest('.form-group')?.querySelector('.form-error');
                if (errorDiv) errorDiv.remove();
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Basic validation
        const requiredInputs = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            }
        });

        if (!isValid) return;

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Securing Spot...';

        // Prepare data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Send to FormSubmit.co
            const response = await fetch('https://formsubmit.co/ajax/info@ultimaitech.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    company: data.company || 'Not provided',
                    phone: data.phone || 'Not provided',
                    chatbot_count: data.chatbot_count,
                    message: data.message || 'No specific message',
                    _subject: `🚀 WAITLIST CLAIMED: ${data.name}`,
                    _template: 'table',
                    source: 'Waitlist Detailed Form'
                })
            });

            const result = await response.json();

            if (result.success) {
                // Redirect to Thank You page
                window.location.href = 'thank-you.html';
            } else {
                throw new Error('Submission failed');
            }

        } catch (error) {
            console.error('Submission error:', error);
            this.showError('Something went wrong. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    showError(message) {
        let errorDiv = document.getElementById('form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'form-error';
            errorDiv.className = 'form-error';
            this.form.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');

        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WaitlistContactForm('waitlist-contact-form');
    });
} else {
    new WaitlistContactForm('waitlist-contact-form');
}
