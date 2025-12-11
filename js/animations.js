/**
 * Animation System
 * Handles scroll-triggered animations, parallax effects, and smooth scrolling
 */

class Animations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSmoothScroll();
    }

    setupScrollAnimations() {
        if (!window.IntersectionObserver) {
            // Fallback for browsers without IntersectionObserver
            this.animatedElements.forEach(el => {
                el.classList.add(el.getAttribute('data-animate'));
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationClass = entry.target.getAttribute('data-animate');
                    const delay = entry.target.getAttribute('data-delay') || 0;

                    setTimeout(() => {
                        entry.target.classList.add(animationClass);
                    }, delay);

                    // Unobserve after animation (one-time animation)
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Typing animation for hero text
class TypingAnimation {
    constructor(element, words, speed = 100) {
        this.element = element;
        this.words = words;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.speed = speed;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Animations();

        // Initialize typing animation if element exists
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            const words = typingElement.getAttribute('data-words').split(',');
            new TypingAnimation(typingElement, words);
        }

        // Initialize counter animations
        document.querySelectorAll('[data-counter]').forEach(el => {
            const target = parseInt(el.getAttribute('data-counter'));
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(el, target);
                        observer.unobserve(el);
                    }
                });
            });
            observer.observe(el);
        });
    });
} else {
    new Animations();
}

export { Animations, TypingAnimation, animateCounter };
