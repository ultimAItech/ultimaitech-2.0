// Tooltip functionality for use case cards
// On mobile, tap to toggle tooltip visibility
// On desktop, show on hover (handled by CSS)

document.addEventListener('DOMContentLoaded', function () {
    const useCaseCards = document.querySelectorAll('.use-case-card');

    // Check if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        useCaseCards.forEach(card => {
            card.addEventListener('click', function (e) {
                // Toggle active class on the card
                const wasActive = this.classList.contains('active');

                // Remove active from all cards
                useCaseCards.forEach(c => c.classList.remove('active'));

                // If this card wasn't active, make it active
                if (!wasActive) {
                    this.classList.add('active');
                }
            });
        });

        // Close tooltips when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.use-case-card')) {
                useCaseCards.forEach(c => c.classList.remove('active'));
            }
        });
    }
});
