/**
 * Hero Video Background JavaScript
 * Handles video playback, mobile fallback, and responsive behavior
 */

class HeroVideoBackground {
    constructor(element) {
        this.element = element;
        this.video = element.querySelector('.hero-video-element');
        this.fallback = element.querySelector('.hero-video-fallback');
        this.content = element.querySelector('.hero-video-content-inner');
        
        // Configuration from data attributes
        this.disableOnMobile = element.dataset.disableOnMobile === 'true';
        this.enableMute = element.dataset.enableMute === 'true';
        this.enableLoop = element.dataset.enableLoop === 'true';
        this.enableAutoplay = element.dataset.enableAutoplay === 'true';
        this.animationStyle = element.dataset.animationStyle || 'fade-in';
        
        // State
        this.isMobile = this.isMobileDevice();
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set animation class
        if (this.animationStyle !== 'none') {
            this.content.classList.add(`animation-${this.animationStyle}`);
        }
        
        // Handle mobile devices
        if (this.isMobile && this.disableOnMobile) {
            this.disableVideo();
        } else if (this.video) {
            this.setupVideo();
        }
        
        // Handle video errors
        if (this.video) {
            this.video.addEventListener('error', () => {
                this.handleVideoError();
            });
            
            // Try to play the video
            this.playVideo();
        }
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    setupVideo() {
        // Set video attributes
        if (this.enableMute) {
            this.video.muted = true;
        }
        
        if (this.enableLoop) {
            this.video.loop = true;
        }
        
        if (this.enableAutoplay) {
            this.video.autoplay = true;
        }
        
        // Add playsinline for mobile
        this.video.setAttribute('playsinline', '');
        
        // Handle video events
        this.video.addEventListener('loadeddata', () => {
            this.onVideoLoaded();
        });
        
        this.video.addEventListener('play', () => {
            this.onVideoPlay();
        });
        
        this.video.addEventListener('pause', () => {
            this.onVideoPause();
        });
    }
    
    playVideo() {
        if (!this.video || this.isMobile && this.disableOnMobile) return;
        
        // Try to play the video
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Video played successfully
                    this.onVideoPlay();
                })
                .catch(error => {
                    // Auto-play was prevented
                    console.warn('Video autoplay prevented:', error);
                    this.handleVideoError();
                });
        }
    }
    
    disableVideo() {
        if (this.video) {
            this.video.pause();
            this.video.style.display = 'none';
        }
        
        // Ensure fallback is visible
        if (this.fallback) {
            this.fallback.style.zIndex = '1';
        }
    }
    
    onVideoLoaded() {
        // Video is loaded and ready
        console.log('Hero video loaded successfully');
    }
    
    onVideoPlay() {
        // Video started playing
        if (this.fallback) {
            this.fallback.style.opacity = '0';
        }
    }
    
    onVideoPause() {
        // Video paused
        if (this.fallback) {
            this.fallback.style.opacity = '1';
        }
    }
    
    handleVideoError() {
        // Video failed to load or play, show fallback
        console.warn('Hero video failed to load, showing fallback image');
        
        if (this.video) {
            this.video.style.display = 'none';
        }
        
        if (this.fallback) {
            this.fallback.style.opacity = '1';
            this.fallback.style.zIndex = '1';
        }
    }
    
    destroy() {
        if (this.video) {
            this.video.pause();
            this.video.removeEventListener('error', this.handleVideoError);
            this.video.removeEventListener('loadeddata', this.onVideoLoaded);
            this.video.removeEventListener('play', this.onVideoPlay);
            this.video.removeEventListener('pause', this.onVideoPause);
        }
    }
}

// Initialize all hero video backgrounds when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const heroVideos = document.querySelectorAll('.hero-video-background');
    heroVideos.forEach(heroVideo => {
        new HeroVideoBackground(heroVideo);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroVideoBackground;
}