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

    // High-Performance Comparison Slider
    const slider = document.getElementById('comparisonSlider');

    if (slider) {
        const beforeImageContainer = slider.querySelector('.slider-image.before');
        const beforeImg = beforeImageContainer.querySelector('img');
        const sliderHandle = slider.querySelector('.slider-handle');

        // State
        let isDragging = false;
        let startX = 0;
        let currentPos = 50; // Percentage
        let sliderWidth = 0;
        let sliderLeft = 0;

        // Optimized Renderer
        const render = () => {
            beforeImageContainer.style.width = `${currentPos}%`;
            sliderHandle.style.left = `${currentPos}%`;
        };

        // Geometry Updater (Robust Resizing)
        const updateGeometry = () => {
            const rect = slider.getBoundingClientRect();
            sliderWidth = rect.width;
            sliderLeft = rect.left + window.scrollX; // Account for scroll

            // Critical: Lock inner image width to container width
            // This prevents the "squashing" effect
            beforeImg.style.width = `${sliderWidth}px`;
        };

        // Resize Observer is better than window.resize
        // It tracks the element itself (e.g. if layout changes)
        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(updateGeometry);
        });
        resizeObserver.observe(slider);

        // Input Handler
        const handleMove = (pageX) => {
            if (!isDragging) return;

            // Calculate percentage
            // We use cached sliderWidth/Left for performance, but need to be careful with scroll
            // Re-calculating rect on move is safer for correctness, slightly slower but negligible here
            const rect = slider.getBoundingClientRect();
            const x = pageX - rect.left;

            let pos = (x / rect.width) * 100;

            // Clamp
            pos = Math.max(0, Math.min(100, pos));

            currentPos = pos;
            window.requestAnimationFrame(render);
        };

        const onPointerDown = (e) => {
            isDragging = true;
            slider.classList.add('active');
            handleMove(e.pageX || e.touches[0].pageX); // Jump to pos
        };

        const onPointerUp = () => {
            isDragging = false;
            slider.classList.remove('active');
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
            handleMove(pageX);
        };

        // Event Binding
        // Mouse
        slider.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mouseup', onPointerUp);
        window.addEventListener('mousemove', onPointerMove);

        // Touch
        slider.addEventListener('touchstart', (e) => {
            onPointerDown(e);
            // Prevent scrolling ONLY if we are mostly moving horizontally?
            // checking passive: false allows us to call preventDefault if needed
        }, { passive: true });

        window.addEventListener('touchend', onPointerUp);

        window.addEventListener('touchmove', (e) => {
            if (isDragging) {
                onPointerMove(e);
            }
        }, { passive: false });

        // Initial setup
        updateGeometry();
        // Force update after image load
        beforeImg.onload = updateGeometry;
    }
});
