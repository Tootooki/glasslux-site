document.addEventListener('DOMContentLoaded', () => {
    // Navbar Mobile Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
    }

    // Comparison Slider Logic
    const slider = document.getElementById('comparisonSlider');

    if (slider) {
        const afterImage = slider.querySelector('.slider-image.after');
        const beforeImage = slider.querySelector('.slider-image.before');
        const sliderHandle = slider.querySelector('.slider-handle');

        let isDragging = false;

        const getPosition = (event) => {
            const sliderRect = slider.getBoundingClientRect();
            let pageX = event.pageX || event.touches[0].pageX;
            let position = ((pageX - sliderRect.left) / sliderRect.width) * 100;
            return Math.min(Math.max(position, 0), 100);
        };

        const updateSlider = (position) => {
            beforeImage.style.width = `${position}%`;
            sliderHandle.style.left = `${position}%`;
        };

        // Start Dragging
        const startDrag = (e) => {
            isDragging = true;
            slider.classList.add('active'); // Optional for styling
            // Prevent default drag behaviors for images
            e.preventDefault();
        };

        // Stop Dragging
        const stopDrag = () => {
            isDragging = false;
            slider.classList.remove('active');
        };

        // Move handle
        const moveDrag = (e) => {
            if (!isDragging) return;
            const pos = getPosition(e);
            updateSlider(pos);
        };

        // Event Listeners (Mouse)
        sliderHandle.addEventListener('mousedown', startDrag);
        slider.addEventListener('mousedown', (e) => {
            startDrag(e);
            moveDrag(e); // Jump to click position immediately
        });

        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('mousemove', moveDrag);

        // Event Listeners (Touch)
        sliderHandle.addEventListener('touchstart', startDrag);
        slider.addEventListener('touchstart', (e) => {
            startDrag(e);
            moveDrag(e);
        }, { passive: false });

        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchmove', moveDrag, { passive: false });
    }
});
