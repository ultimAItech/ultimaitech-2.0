/**
 * Contact Form Handler
 * Client-side validation, spam protection, and form submission
 */

class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea, .form-select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        // Check honeypot (spam protection)
        const honeypot = this.form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value !== '') {
            console.log('Spam detected');
            return false;
        }

        // Validate all fields
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea, .form-select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Remove honeypot from data
        delete data.website;

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Simulate form submission (replace with actual backend API)
        setTimeout(() => {
            this.showSuccess();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            this.form.reset();
        }, 1500);

        // TODO: Replace with actual form submission to backend
        /*
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          this.showSuccess();
          this.form.reset();
        })
        .catch((error) => {
          this.showError('An error occurred. Please try again.');
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        });
        */
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        // Clear previous errors
        this.clearError(field);

        // Check if required field is empty
        if (required && value === '') {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation (optional, basic check)
        if (type === 'tel' && value !== '') {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.form-error');

        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }

        field.classList.add('error');
    }

    clearError(field) {
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.form-error');

        if (errorDiv) {
            errorDiv.remove();
        }

        field.classList.remove('error');
    }

    showSuccess() {
        const successMessage = document.getElementById('form-success');
        if (successMessage) {
            successMessage.classList.remove('hidden');

            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
        } else {
            alert('Thank you! Your message has been sent successfully.');
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('form-error');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');

            setTimeout(() => {
                errorMessage.classList.add('hidden');
            }, 5000);
        } else {
            alert(message);
        }
    }
}

// Initialize contact form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContactForm('contact-form');
    });
} else {
    new ContactForm('contact-form');
}

export default ContactForm;
