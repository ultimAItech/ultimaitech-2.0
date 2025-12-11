/**
 * Navigation Component
 * Handles responsive navigation, mobile menu, scroll effects, and active states
 */

class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setActivePage();
    }

    setupScrollEffect() {
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add scrolled class when scrolled past 50px
            if (scrollTop > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        });
    }

    setupMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;

        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            }
        });
    }

    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');

            if (linkPage === currentPage ||
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && linkPage === './')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Navigation();
    });
} else {
    new Navigation();
}

export default Navigation;
