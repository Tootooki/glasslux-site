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

    // ===========================================
    // SEAMLESS LIVE CHAT LOGIC
    // ===========================================
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userMessageInput');
    const sendBtn = document.getElementById('sendChatBtn');
    const PHONE_NUMBER = '13859885129';

    // Helper: Add a message bubble
    function addMessage(text, isFromSupport = true) {
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            max-width: 80%;
            padding: 10px 14px;
            margin-bottom: 10px;
            border-radius: 15px;
            line-height: 1.4;
            font-size: 0.95rem;
            animation: fadeIn 0.3s ease;
            ${isFromSupport
                ? 'background: #fff; color: #333; margin-right: auto; border-bottom-left-radius: 5px;'
                : 'background: #DCF8C6; color: #333; margin-left: auto; border-bottom-right-radius: 5px;'}
        `;
        bubble.textContent = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Auto-Greeting on Page Load
    if (chatMessages) {
        setTimeout(() => {
            addMessage("Hey there! 👋 Welcome to GlassLux!");
        }, 500);
        setTimeout(() => {
            addMessage("Need a quote or have a question about your windshield? Just type your message below – we reply fast!");
        }, 1200);
    }

    // Handle Send Button Click
    if (sendBtn && userInput) {
        const sendMessage = () => {
            const msg = userInput.value.trim();
            if (!msg) return;

            // Show user's message in chat
            addMessage(msg, false);
            userInput.value = '';

            // Show "sending" response
            setTimeout(() => {
                addMessage("Thanks! Opening WhatsApp to continue the chat...");
            }, 400);

            // Open WhatsApp with pre-filled message after a short delay
            setTimeout(() => {
                const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
                window.open(waUrl, '_blank');
            }, 1200);
        };

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});
