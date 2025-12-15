document.addEventListener('DOMContentLoaded', () => {
    console.log('Glass Lux Website Loaded');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Before/After Slider Logic
const slider = document.getElementById('comparisonSlider');
const beforeImage = slider.querySelector('.slider-image.before');
const sliderHandle = slider.querySelector('.slider-handle');

if (slider) {
    const slide = (x) => {
        const sliderRect = slider.getBoundingClientRect();
        let position = ((x - sliderRect.left) / sliderRect.width) * 100;

        // Clamp values between 0 and 100
        if (position < 0) position = 0;
        if (position > 100) position = 100;

        beforeImage.style.width = `${position}%`;
        sliderHandle.style.left = `${position}%`;
    };

    // Mouse events
    slider.addEventListener('mousemove', (e) => {
        slide(e.clientX);
    });

    // Touch events for mobile
    slider.addEventListener('touchmove', (e) => {
        slide(e.touches[0].clientX);
    });
}
