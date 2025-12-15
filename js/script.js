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
    // SEAMLESS LIVE CHAT LOGIC (Enhanced)
    // ===========================================
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userMessageInput');
    const sendBtn = document.getElementById('sendChatBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const PHONE_NUMBER = '13859885129';

    // Helper: Add a message bubble with avatar for support
    function addMessage(text, isFromSupport = true) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-message';
        wrapper.style.cssText = `
            display: flex;
            align-items: flex-end;
            gap: 8px;
            margin-bottom: 12px;
            ${isFromSupport ? '' : 'flex-direction: row-reverse;'}
        `;

        if (isFromSupport) {
            const avatar = document.createElement('img');
            avatar.src = 'support_avatar.png';
            avatar.style.cssText = 'width: 28px; height: 28px; border-radius: 50%; object-fit: cover;';
            wrapper.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.style.cssText = `
            max-width: 78%;
            padding: 12px 16px;
            border-radius: 18px;
            line-height: 1.45;
            font-size: 0.9rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${isFromSupport
                ? 'background: #2a2a2a; color: #fff; border-bottom-left-radius: 4px; border: 1px solid #39FF14;'
                : 'background: linear-gradient(135deg, #39FF14, #2dd30f); color: #000; border-bottom-right-radius: 4px; font-weight: 500;'}
        `;
        bubble.textContent = text;
        wrapper.appendChild(bubble);

        chatMessages.appendChild(wrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show/Hide Typing Indicator
    function showTyping() {
        if (typingIndicator) typingIndicator.style.display = 'block';
    }
    function hideTyping() {
        if (typingIndicator) typingIndicator.style.display = 'none';
    }

    // Auto-Greeting Sequence on Page Load
    if (chatMessages) {
        showTyping();
        setTimeout(() => {
            hideTyping();
            addMessage("Hey there! 👋 I'm Sofia from GlassLux.");
            showTyping();
        }, 800);

        setTimeout(() => {
            hideTyping();
            addMessage("How can I help you today? Got a cracked windshield? Need a quick quote?");
            showTyping();
        }, 2200);

        setTimeout(() => {
            hideTyping();
            addMessage("Just type your message below and I'll get back to you right away! 💬");
        }, 3500);
    }

    // Handle Send Button Click
    let customerPhone = null;

    if (sendBtn && userInput) {
        const sendMessage = async () => {
            const msg = userInput.value.trim();
            if (!msg) return;

            // Show user's message in chat
            addMessage(msg, false);
            userInput.value = '';

            // Show typing animation
            showTyping();

            // Telegram Bot Config
            const TELEGRAM_BOT_TOKEN = '7573457305:AAEOrbiQBeuFjDneE_y6B-Sakv6Trq2KgRY';
            const TELEGRAM_CHAT_ID = '29544079';

            // Build message with phone if provided
            let telegramMessage = `🌐 *New Website Message*\n\n"${msg}"`;
            if (customerPhone) {
                telegramMessage += `\n\n📱 *Reply to:* ${customerPhone}`;
            }
            telegramMessage += `\n\n⏰ ${new Date().toLocaleString()}`;

            try {
                // Send to Telegram
                const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                const response = await fetch(telegramUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: telegramMessage,
                        parse_mode: 'Markdown'
                    })
                });

                hideTyping();

                if (response.ok) {
                    // First message? Ask for phone
                    if (!customerPhone) {
                        addMessage("Message received! 📩");
                        showTyping();
                        setTimeout(() => {
                            hideTyping();
                            addMessage("To reply to you, please share your phone number (or just keep chatting!)");
                        }, 800);
                    } else {
                        addMessage("Got it! I'll get back to you shortly! 💬");
                    }
                } else {
                    throw new Error('Failed');
                }
            } catch (error) {
                hideTyping();
                addMessage("Oops! Please try again or call us at (385) 988-5129");
            }
        };

        // Check if message looks like a phone number
        userInput.addEventListener('input', () => {
            const val = userInput.value.replace(/\D/g, '');
            if (val.length >= 10 && !customerPhone) {
                customerPhone = userInput.value;
            }
        });

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});
