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

        // Auto-Animation: Slowly move slider from left to right
        let autoAnimationId = null;
        let autoPercent = 50; // Start at center
        let autoDirection = 1; // 1 = moving right, -1 = moving left
        let pauseTimeout = null;
        let isPaused = false;
        const autoSpeed = 0.15; // Lower = slower animation

        const startAutoAnimation = () => {
            if (autoAnimationId) return; // Already running
            isPaused = false;

            const animate = () => {
                if (isPaused) {
                    autoAnimationId = null;
                    return;
                }

                autoPercent += autoSpeed * autoDirection;

                // Reverse direction at edges
                if (autoPercent >= 85) {
                    autoDirection = -1;
                } else if (autoPercent <= 15) {
                    autoDirection = 1;
                }

                updateSlider(autoPercent);
                autoAnimationId = requestAnimationFrame(animate);
            };

            autoAnimationId = requestAnimationFrame(animate);
        };

        const pauseAutoAnimation = () => {
            isPaused = true;
            if (autoAnimationId) {
                cancelAnimationFrame(autoAnimationId);
                autoAnimationId = null;
            }

            // Clear any existing resume timeout
            if (pauseTimeout) {
                clearTimeout(pauseTimeout);
            }

            // Resume after 3 seconds of inactivity
            pauseTimeout = setTimeout(() => {
                startAutoAnimation();
            }, 3000);
        };

        // Pause animation on user interaction
        slider.addEventListener('mousedown', pauseAutoAnimation);
        slider.addEventListener('touchstart', pauseAutoAnimation, { passive: true });
        slider.addEventListener('mouseenter', pauseAutoAnimation);

        // Start auto-animation
        startAutoAnimation();
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
    // SEAMLESS LIVE CHAT LOGIC (Crisp Powered)
    // ===========================================
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userMessageInput');
    const sendBtn = document.getElementById('sendChatBtn');
    const typingIndicator = document.getElementById('typingIndicator');

    // Crisp Chat Configuration - Show bubble
    window.$crisp = window.$crisp || [];
    // Keep bubble visible (removed hide settings)

    // Helper: Add a message bubble with avatar for support
    function addMessage(text, isFromSupport = true) {
        if (!chatMessages) return;
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
            addMessage("How can I help you today? Need a quote or have a question?");
        }, 2200);
    }

    // Listen for Crisp replies to show in our UI
    window.$crisp.push(['on', 'message:received', (data) => {
        if (data && data.content) {
            hideTyping();
            addMessage(data.content, true);
        }
    }]);

    // Track message count for phone prompt
    let messageCount = 0;
    let phoneCollected = false;

    // Handle Send Button Click
    if (sendBtn && userInput) {
        const sendMessage = () => {
            const msg = userInput.value.trim();
            if (!msg) return;

            messageCount++;

            // Show user's message in our custom chat
            addMessage(msg, false);
            userInput.value = '';

            // Check if this looks like a phone number
            const phonePattern = /[\d\-\(\)\s]{10,}/;
            if (phonePattern.test(msg) && !phoneCollected) {
                phoneCollected = true;
            }

            // Send to Crisp
            if (typeof $crisp !== 'undefined') {
                $crisp.push(['do', 'message:send', ['text', msg]]);
            }

            // After first message, nicely ask for phone
            if (messageCount === 1 && !phoneCollected) {
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    addMessage("Thanks for reaching out! 📱 If you'd like a faster callback, drop your phone number and we'll call you right back!");
                }, 1200);
            } else {
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    addMessage("Got it! We'll get back to you shortly 💬");
                }, 800);
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Emoji Button - Simple emoji picker
    const emojiBtn = document.getElementById('emojiBtn');
    const emojis = ['😊', '👍', '🚗', '💪', '✅', '📱', '🔧', '💬', '❤️', '👋'];

    if (emojiBtn && userInput) {
        emojiBtn.addEventListener('click', () => {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            userInput.value += randomEmoji;
            userInput.focus();
        });
    }

    // File Button
    const fileBtn = document.getElementById('fileBtn');
    const fileInput = document.getElementById('fileInput');

    if (fileBtn && fileInput) {
        fileBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                addMessage(`📎 Attached: ${fileName}`, false);
                addMessage("Thanks! I received your file. Let me take a look...", true);
            }
        });
    }

    // Voice Button
    const voiceBtn = document.getElementById('voiceBtn');

    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            addMessage("🎤 Voice messages coming soon! For now, please type your message or call us at (385) 988-5129", true);
        });
    }
});
