/**
 * Hero Banner Module
 * 
 * This module provides functionality for handling hero banners, including CTA button handlers, 
 * advanced parallax effects, particle background effects, and video background handling.
 * 
 * @author Jobet P. Casquejo
 * @version 1.0
 * @date 2025-27-10
 */

document.addEventListener('DOMContentLoaded', () => {
    // Enhanced CTA Button Handler with Analytics and Loading States
    const initCTAButtons = () => {
        const buttons = document.querySelectorAll('.hero-cta');
        const responseBox = document.getElementById('hero-response');

        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.dataset.action;
                const url = this.href;
                const originalText = this.innerHTML;
                
                // Add loading state
                this.classList.add('loading');
                this.disabled = true;
                this.innerHTML = '<span class="loading-spinner"></span> Processing...';

                // Send analytics event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cta_click', {
                        'event_category': 'engagement',
                        'event_label': action,
                        'transport_type': 'beacon'
                    });
                }

                fetch(url, {
                    method: 'GET',
                    headers: { 
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': this.dataset.csrf || getCookie('csrftoken')
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    // Show success message
                    if (responseBox) {
                        responseBox.innerHTML = `<div class="ajax-success">Action "${action}" triggered successfully!</div>`;
                        responseBox.classList.add('show');
                        
                        // Auto-hide after 3 seconds
                        setTimeout(() => {
                            responseBox.classList.remove('show');
                        }, 3000);
                    }
                    
                    console.log('CTA action completed:', data);
                })
                .catch(err => {
                    // Show error message
                    if (responseBox) {
                        responseBox.innerHTML = `<div class="ajax-error">Error triggering "${action}"! Please try again.</div>`;
                        responseBox.classList.add('show');
                    }
                    
                    console.error('CTA action failed:', err);
                })
                .finally(() => {
                    // Restore button state
                    setTimeout(() => {
                        this.classList.remove('loading');
                        this.disabled = false;
                        this.innerHTML = originalText;
                    }, 1000);
                });
            });
        });
    };

    // Advanced Parallax Effect with Performance Optimization
    const initParallaxEffect = () => {
        const parallaxBanners = document.querySelectorAll('[data-parallax="True"]');
        if (parallaxBanners.length === 0) return;

        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            parallaxBanners.forEach(banner => {
                const speed = banner.dataset.parallaxSpeed || 0.5;
                const yPos = -(scrolled * speed);
                banner.style.backgroundPosition = `center ${yPos}px`;
            });
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    };

    // Particle Background Effect
    const initParticleEffect = () => {
        const particleBanners = document.querySelectorAll('[data-particles="True"]');
        particleBanners.forEach(banner => {
            if (!banner.querySelector('.particles-container')) {
                const particlesContainer = document.createElement('div');
                particlesContainer.className = 'particles-container';
                banner.appendChild(particlesContainer);
                
                // Create particles
                const particleCount = banner.dataset.particleCount || 30;
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    particle.style.width = `${Math.random() * 5 + 2}px`;
                    particle.style.height = particle.style.width;
                    particlesContainer.appendChild(particle);
                }
            }
        });
    };

    // Video Background Handler
    const initVideoBackground = () => {
        const videoBanners = document.querySelectorAll('[data-video-bg]');
        videoBanners.forEach(banner => {
            const videoUrl = banner.dataset.videoBg;
            if (videoUrl) {
                const video = document.createElement('video');
                video.className = 'hero-video-bg';
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.src = videoUrl;
                banner.appendChild(video);
                
                // Play video when in viewport
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            video.play().catch(e => console.log('Video play failed:', e));
                        } else {
                            video.pause();
                        }
                    });
                });
                
                observer.observe(banner);
            }
        });
    };

    // Animation on Scroll for Hero Content
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animation]');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animation;
                    element.style.animation = `${animation} 0.8s ease-out forwards`;
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    };

    // Utility function to get cookie value
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    // Initialize all features
    initCTAButtons();
    initParallaxEffect();
    initParticleEffect();
    initVideoBackground();
    initScrollAnimations();
});