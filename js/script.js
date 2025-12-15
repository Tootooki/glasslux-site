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

    // Generic Slider Logic (Supports Multiple Instances)
    const sliders = document.querySelectorAll('.slider-container');

    // Global state for tracking which slider is currently being dragged
    let activeSlider = null;
    let activeSliderState = {
        isDragging: false,
        updateSlider: null,
        handleMove: null,
        sliderElement: null
    };

    const globalOnPointerUp = () => {
        if (activeSliderState.isDragging && activeSliderState.sliderElement) {
            activeSliderState.isDragging = false;
            activeSliderState.sliderElement.classList.remove('active');

            // Reset state
            activeSlider = null;
            activeSliderState = {
                isDragging: false,
                updateSlider: null,
                handleMove: null,
                sliderElement: null
            };
        }
    };

    const globalOnPointerMove = (e) => {
        if (!activeSliderState.isDragging || !activeSliderState.handleMove) return;
        const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
        activeSliderState.handleMove(pageX);
    };

    // Attach global listeners once
    window.addEventListener('mouseup', globalOnPointerUp);
    window.addEventListener('touchend', globalOnPointerUp);
    window.addEventListener('mousemove', globalOnPointerMove);
    window.addEventListener('touchmove', (e) => {
        if (activeSliderState.isDragging) {
            globalOnPointerMove(e);
        }
    }, { passive: false });

    sliders.forEach(slider => {
        const beforeImageContainer = slider.querySelector('.slider-image.before');
        const beforeImg = beforeImageContainer.querySelector('img');
        const sliderHandle = slider.querySelector('.slider-handle');

        // Renderer
        const updateSlider = (percent) => {
            beforeImageContainer.style.width = `${percent}%`;
            sliderHandle.style.left = `${percent}%`;
        };

        // Geometry (Lock Image Width)
        const updateGeometry = () => {
            const width = slider.offsetWidth;
            beforeImg.style.width = `${width}px`;
        };

        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(updateGeometry);
        });
        resizeObserver.observe(slider);

        // Input Handling
        const handleMove = (pageX) => {
            const rect = slider.getBoundingClientRect();
            const x = pageX - rect.left;
            let percent = (x / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            window.requestAnimationFrame(() => updateSlider(percent));
        };

        const onPointerDown = (e) => {
            if (activeSliderState.isDragging) return; // Ignore if already dragging another

            activeSliderState = {
                isDragging: true,
                updateSlider: updateSlider,
                handleMove: handleMove,
                sliderElement: slider
            };

            slider.classList.add('active');
            handleMove(e.pageX || e.touches[0].pageX);
        };

        slider.addEventListener('mousedown', onPointerDown);
        slider.addEventListener('touchstart', (e) => onPointerDown(e), { passive: true });

        // Init
        updateGeometry();
        beforeImg.onload = updateGeometry;
    });
});
