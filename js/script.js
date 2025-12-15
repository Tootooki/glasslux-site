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

    // Chat Widget Toggle Logic
    const chatToggleBtn = document.querySelector('.chat-toggle-btn');
    const chatOptions = document.querySelector('.chat-options');
    const chatBadge = document.querySelector('.chat-badge');

    if (chatToggleBtn && chatOptions) {
        chatToggleBtn.addEventListener('click', () => {
            const isActive = chatToggleBtn.classList.toggle('active');
            chatOptions.classList.toggle('active');

            // Toggle Icon
            const icon = chatToggleBtn.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-comments');
                icon.classList.add('fa-xmark');
                if (chatBadge) chatBadge.style.display = 'none'; // Hide badge when opened
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-comments');
            }
        });
    }

    // Embedded Chat Form Logic
    const chatForm = document.getElementById('embeddedChatForm');
    const chatStatus = document.getElementById('chatStatus');

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = chatForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;

            // Loading State
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            chatStatus.style.display = 'none';

            // Gather Data
            const formData = {
                name: document.getElementById('chatName').value,
                phone: document.getElementById('chatPhone').value,
                message: document.getElementById('chatMessage').value
            };

            try {
                // Send to Local WhatsApp Bot
                const response = await fetch('http://localhost:3000/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success
                    chatForm.reset();
                    chatStatus.innerHTML = '<i class="fa-solid fa-check-circle" style="color: green;"></i> Message sent! We will WhatsApp you shortly.';
                    chatStatus.style.display = 'block';
                } else {
                    throw new Error(result.error || 'Failed to send');
                }
            } catch (error) {
                console.error('Chat Error:', error);
                chatStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: orange;"></i> Bot is offline. <a href="sms:+13859885129">Click to Text Us</a> instead.';
                chatStatus.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
