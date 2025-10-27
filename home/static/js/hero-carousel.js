/**
 * Advanced Hero Carousel with Enhanced AJAX
 * Handles auto-rotation, navigation, animations, and robust AJAX interactions
 */

class HeroCarousel {
    constructor(element) {
        this.carousel = element;
        this.wrapper = element.querySelector('.hero-carousel-wrapper');
        this.slides = Array.from(element.querySelectorAll('.hero-carousel-slide'));
        this.indicators = Array.from(element.querySelectorAll('.hero-carousel-indicator'));
        this.prevButton = element.querySelector('.hero-carousel-control-prev');
        this.nextButton = element.querySelector('.hero-carousel-control-next');
        
        // Configuration from data attributes
        this.autoRotate = element.dataset.autoRotate === 'true';
        this.rotationSpeed = parseInt(element.dataset.rotationSpeed) || 5000;
        this.pauseOnHover = element.dataset.pauseOnHover === 'true';
        this.animationStyle = element.dataset.animationStyle || 'fade';
        this.ajaxUrl = element.dataset.ajaxUrl || null;
        this.ajaxMethod = element.dataset.ajaxMethod || 'GET';
        this.csrfToken = this.getCsrfToken();
        
        // State
        this.currentIndex = 0;
        this.isPlaying = this.autoRotate;
        this.timer = null;
        this.isTransitioning = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        this.showSlide(this.currentIndex);
        this.applyAnimation(this.slides[this.currentIndex]);
        this.bindEvents();
        if (this.autoRotate) this.startRotation();
        
        // Load initial carousel data via AJAX if configured
        if (this.ajaxUrl) {
            this.loadCarouselData();
        }
    }
    
    getCsrfToken() {
        // Get CSRF token from meta tag or cookie
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) return metaToken.getAttribute('content');
        
        // Fallback to cookie
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') return value;
        }
        return null;
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevButton?.addEventListener('click', () => this.prevSlide());
        this.nextButton?.addEventListener('click', () => this.nextSlide());

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause on hover
        if (this.pauseOnHover) {
            this.carousel.addEventListener('mouseenter', () => this.pauseRotation());
            this.carousel.addEventListener('mouseleave', () => this.autoRotate && this.startRotation());
        }

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Slide click AJAX
        if (this.ajaxUrl) {
            this.slides.forEach((slide, index) => {
                slide.addEventListener('click', (e) => {
                    // Only trigger AJAX if clicked on specific elements
                    if (e.target.closest('.ajax-trigger')) {
                        this.triggerAjax(index);
                    }
                });
            });
        }
    }

    showSlide(index) {
        if (index < 0 || index >= this.slides.length || this.isTransitioning) return;
        
        this.isTransitioning = true;
        const previousIndex = this.currentIndex;
        
        // Update indicators and slides
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.classList.toggle('prev', i === (index === 0 ? this.slides.length - 1 : index - 1));
        });

        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        this.applyAnimation(this.slides[index]);
        this.currentIndex = index;
        
        // Track slide view via AJAX
        if (this.ajaxUrl) {
            this.trackSlideView(index);
        }
        
        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    applyAnimation(slide) {
        if (!slide) return;
        slide.classList.remove('fade', 'slide', 'zoom');
        slide.classList.add(this.animationStyle);
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
        if (this.autoRotate) this.restartRotation();
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
        if (this.autoRotate) this.restartRotation();
    }

    goToSlide(index) {
        if (index === this.currentIndex || this.isTransitioning) return;
        this.showSlide(index);
        if (this.autoRotate) this.restartRotation();
    }

    startRotation() {
        if (this.timer) return;
        this.isPlaying = true;
        this.timer = setInterval(() => this.nextSlide(), this.rotationSpeed);
    }

    pauseRotation() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.isPlaying = false;
    }

    restartRotation() {
        this.pauseRotation();
        if (this.autoRotate) this.startRotation();
    }
    
    // Load carousel data via AJAX
    async loadCarouselData() {
        try {
            const response = await this.makeAjaxRequest(this.ajaxUrl, 'GET');
            if (response.slides) {
                this.updateCarouselContent(response.slides);
            }
        } catch (error) {
            console.error('Failed to load carousel data:', error);
        }
    }
    
    // Track slide views for analytics
    async trackSlideView(index) {
        if (!this.ajaxUrl) return;
        
        const slide = this.slides[index];
        const data = {
            action: 'view',
            slideIndex: index,
            slideId: slide.dataset.id || index,
            timestamp: new Date().toISOString()
        };
        
        try {
            await this.makeAjaxRequest(this.ajaxUrl, 'POST', data);
        } catch (error) {
            console.warn('Failed to track slide view:', error);
        }
    }
    
    // Trigger AJAX action for slide interaction
    async triggerAjax(index) {
        if (!this.ajaxUrl) return;
        
        const slide = this.slides[index];
        const actionElement = slide.querySelector('.ajax-trigger');
        if (!actionElement) return;
        
        const action = actionElement.dataset.action || 'click';
        const data = {
            action: action,
            slideIndex: index,
            slideId: slide.dataset.id || index,
            elementId: actionElement.dataset.elementId || null
        };
        
        try {
            const response = await this.makeAjaxRequest(this.ajaxUrl, 'POST', data);
            this.handleAjaxResponse(response, slide);
        } catch (error) {
            this.handleAjaxError(error, slide);
        }
    }
    
    // Generic AJAX request method with CSRF support
    async makeAjaxRequest(url, method = 'GET', data = null) {
        const options = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        
        // Add CSRF token for POST requests
        if (method.toUpperCase() === 'POST' && this.csrfToken) {
            options.headers['X-CSRFToken'] = this.csrfToken;
        }
        
        // Add data for POST requests
        if (data && method.toUpperCase() === 'POST') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Handle AJAX response
    handleAjaxResponse(response, slide) {
        console.log('AJAX Response:', response);
        
        // Remove any existing response indicators
        const existing = slide.querySelector('.ajax-response');
        if (existing) existing.remove();
        
        // Create response indicator
        const responseDiv = document.createElement('div');
        responseDiv.classList.add('ajax-response');
        
        if (response.success) {
            responseDiv.classList.add('ajax-success');
            responseDiv.innerHTML = `<span>${response.message || 'Action completed successfully'}</span>`;
        } else {
            responseDiv.classList.add('ajax-error');
            responseDiv.innerHTML = `<span>${response.message || 'Action failed'}</span>`;
        }
        
        slide.appendChild(responseDiv);
        
        // Auto-remove after delay
        setTimeout(() => {
            if (responseDiv.parentNode) {
                responseDiv.remove();
            }
        }, 3000);
        
        // Trigger custom event
        const event = new CustomEvent('carouselAjaxResponse', {
            detail: { response, slide }
        });
        this.carousel.dispatchEvent(event);
    }
    
    // Handle AJAX errors
    handleAjaxError(error, slide) {
        console.error('AJAX Error:', error);
        
        // Remove any existing response indicators
        const existing = slide.querySelector('.ajax-response');
        if (existing) existing.remove();
        
        // Create error indicator
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('ajax-response', 'ajax-error');
        errorDiv.innerHTML = '<span>Failed to process request</span>';
        slide.appendChild(errorDiv);
        
        // Auto-remove after delay
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
        
        // Trigger custom event
        const event = new CustomEvent('carouselAjaxError', {
            detail: { error, slide }
        });
        this.carousel.dispatchEvent(event);
    }
    
    // Update carousel content dynamically
    updateCarouselContent(slidesData) {
        // Clear existing slides
        this.wrapper.innerHTML = '';
        this.indicators.forEach(indicator => indicator.remove());
        
        // Create new slides
        slidesData.forEach((slideData, index) => {
            const slide = this.createSlideElement(slideData, index);
            this.wrapper.appendChild(slide);
        });
        
        // Update references
        this.slides = Array.from(this.carousel.querySelectorAll('.hero-carousel-slide'));
        this.indicators = Array.from(this.carousel.querySelectorAll('.hero-carousel-indicator'));
        
        // Rebind events
        this.bindEvents();
        
        // Show first slide
        this.showSlide(0);
    }
    
    // Create slide element from data
    createSlideElement(slideData, index) {
        const slide = document.createElement('div');
        slide.className = 'hero-carousel-slide';
        slide.dataset.id = slideData.id || index;
        
        // Add slide content
        slide.innerHTML = `
            <div class="hero-carousel-background" style="background-image: url('${slideData.backgroundImage || ''}');">
                <div class="hero-carousel-overlay" style="opacity: ${slideData.overlayOpacity || 0.5};"></div>
            </div>
            <div class="hero-carousel-content" style="text-align: ${slideData.textAlignment || 'center'};">
                <h1 class="hero-carousel-headline">${slideData.headline || ''}</h1>
                <h2 class="hero-carousel-subtitle">${slideData.subtitle || ''}</h2>
                <div class="hero-carousel-description">${slideData.description || ''}</div>
                <div class="hero-carousel-cta">
                    <a href="${slideData.ctaLink || '#'}" class="btn btn-${slideData.ctaStyle || 'primary'} ajax-trigger" 
                       data-action="cta-click" data-element-id="${slideData.ctaId || ''}">
                        ${slideData.ctaText || 'Learn More'}
                    </a>
                </div>
            </div>
        `;
        
        return slide;
    }

    destroy() {
        this.pauseRotation();
        this.prevButton?.removeEventListener('click', this.prevSlide);
        this.nextButton?.removeEventListener('click', this.nextSlide);
        this.slides.forEach((slide, index) => {
            slide.removeEventListener('click', () => this.triggerAjax(index));
        });
        if (this.pauseOnHover) {
            this.carousel.removeEventListener('mouseenter', this.pauseRotation);
            this.carousel.removeEventListener('mouseleave', this.startRotation);
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-carousel').forEach(el => new HeroCarousel(el));
});

// Module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroCarousel;
}