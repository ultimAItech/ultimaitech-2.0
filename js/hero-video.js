// Seamless video loop with crossfade transition
document.addEventListener('DOMContentLoaded', function () {
    const video1 = document.querySelector('.hero-video-1');
    const video2 = document.querySelector('.hero-video-2');

    if (!video1 || !video2) {
        console.error('Hero videos not found');
        return;
    }

    let activeVideo = 1;
    const crossfadeDuration = 2; // 2 second overlap
    let hasTriggeredCrossfade = false;

    console.log('Hero video script initialized');

    // Preload video 2
    video2.load();

    // Monitor video 1 playback with more frequent checks
    video1.addEventListener('timeupdate', function () {
        const duration = video1.duration;
        if (!duration || duration === Infinity) return;

        const timeRemaining = duration - video1.currentTime;

        // Trigger crossfade when 2 seconds remain
        if (timeRemaining <= crossfadeDuration && activeVideo === 1 && !hasTriggeredCrossfade) {
            hasTriggeredCrossfade = true;
            console.log('Crossfading to video 2 at', video1.currentTime, 'of', duration);
            crossfadeToVideo2();
        }
    });

    // Monitor video 2 playback
    video2.addEventListener('timeupdate', function () {
        const duration = video2.duration;
        if (!duration || duration === Infinity) return;

        const timeRemaining = duration - video2.currentTime;

        // Trigger crossfade when 2 seconds remain
        if (timeRemaining <= crossfadeDuration && activeVideo === 2 && !hasTriggeredCrossfade) {
            hasTriggeredCrossfade = true;
            console.log('Crossfading to video 1 at', video2.currentTime, 'of', duration);
            crossfadeToVideo1();
        }
    });

    // Fallback to ended event
    video1.addEventListener('ended', function () {
        if (activeVideo === 1 && !hasTriggeredCrossfade) {
            console.log('Video 1 ended - emergency crossfade');
            crossfadeToVideo2();
        }
    });

    video2.addEventListener('ended', function () {
        if (activeVideo === 2 && !hasTriggeredCrossfade) {
            console.log('Video 2 ended - emergency crossfade');
            crossfadeToVideo1();
        }
    });

    function crossfadeToVideo2() {
        activeVideo = 2;
        video2.currentTime = 0;

        // Start playing video 2
        video2.play().then(() => {
            console.log('Video 2 playing');
        }).catch(err => {
            console.error('Error playing video 2:', err);
        });

        // Crossfade
        video1.style.opacity = '0';
        video2.style.opacity = '1';

        // Reset video 1 after transition and prepare for next cycle
        setTimeout(() => {
            video1.pause();
            video1.currentTime = 0;
            hasTriggeredCrossfade = false;
            console.log('Ready for next cycle (video 2 active)');
        }, crossfadeDuration * 1000);
    }

    function crossfadeToVideo1() {
        activeVideo = 1;
        video1.currentTime = 0;

        // Start playing video 1
        video1.play().then(() => {
            console.log('Video 1 playing');
        }).catch(err => {
            console.error('Error playing video 1:', err);
        });

        // Crossfade
        video2.style.opacity = '0';
        video1.style.opacity = '1';

        // Reset video 2 after transition and prepare for next cycle
        setTimeout(() => {
            video2.pause();
            video2.currentTime = 0;
            hasTriggeredCrossfade = false;
            console.log('Ready for next cycle (video 1 active)');
        }, crossfadeDuration * 1000);
    }
});
