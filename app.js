// Login System - Admin Only
const ADMIN_PASSWORD = '111123';
const LOCK_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
let lockTimer;
let isAdmin = false;

document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is already logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const storedIsAdmin = sessionStorage.getItem('isAdmin');
    if (isLoggedIn === 'true' && storedIsAdmin === 'true') {
        isAdmin = true;
        showAdminFeatures();
        startLockTimer();
    }

    // Admin login button click
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginOverlay();
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const loginOverlay = document.getElementById('loginOverlay');
    const mainContent = document.getElementById('mainContent');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const enteredPassword = passwordInput.value.trim();
            
            if (enteredPassword === ADMIN_PASSWORD) {
                // Admin login successful
                isAdmin = true;
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('isAdmin', 'true');
                hideLoginOverlay();
                showAdminFeatures();
                startLockTimer();
                createLoginSuccessEffect();
            } else {
                // Failed login
                showError();
                
                // Shake the login card
                const loginCard = document.querySelector('.login-card');
                loginCard.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    loginCard.style.animation = '';
                }, 500);
            }
        });
    }

    function showLoginOverlay() {
        const loginOverlay = document.getElementById('loginOverlay');
        const passwordInput = document.getElementById('passwordInput');
        const errorMessage = document.getElementById('errorMessage');
        
        if (loginOverlay) {
            loginOverlay.style.display = 'flex';
            loginOverlay.style.opacity = '0';
            
            // Clear previous input and errors
            if (passwordInput) passwordInput.value = '';
            if (errorMessage) errorMessage.classList.remove('show');
            
            setTimeout(() => {
                loginOverlay.style.opacity = '1';
            }, 50);
            
            // Focus on password input
            setTimeout(() => {
                if (passwordInput) passwordInput.focus();
            }, 300);
        }
    }

    function hideLoginOverlay() {
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (loginOverlay) {
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.style.display = 'none';
            }, 500);
        }
    }

    function showMainContent() {
        // This function is no longer needed since content is visible by default
        // Keeping for compatibility
    }

    function showError() {
        if (errorMessage) {
            errorMessage.classList.add('show');
            passwordInput.value = '';
            passwordInput.focus();
            
            // Hide error message after 3 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
        }
    }

    function createLoginSuccessEffect() {
        // Create floating hearts for successful login
        const colors = ['#ff6b9d', '#feca57', '#ff9ff3', '#ff6348'];
        const heartSymbols = ['❤', '💕', '💖', '💗', '💝'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = '100%';
                heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
                heart.style.color = colors[Math.floor(Math.random() * colors.length)];
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '99999';
                heart.style.animation = `floatUp ${Math.random() * 3 + 2}s ease-out forwards`;
                heart.style.textShadow = '0 0 10px rgba(255, 107, 157, 0.5)';
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 5000);
            }, i * 100);
        }
    }

    // Add enter key support for password field
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }
});

// Auto-lock functionality
function startLockTimer() {
    // Clear any existing timer
    if (lockTimer) {
        clearTimeout(lockTimer);
    }
    
    // Set new timer for 15 minutes
    lockTimer = setTimeout(() => {
        lockWebsite();
    }, LOCK_TIMEOUT);
}

function resetLockTimer() {
    // Reset timer on user activity
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        startLockTimer();
    }
}

function lockWebsite() {
    // Clear login session
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isAdmin');
    isAdmin = false;
    
    // Hide admin features
    hideAdminFeatures();
    
    // Show lock notification
    showLockNotification();
}

function showLockNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b9d, #feca57);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            animation: slideInRight 0.5s ease-out;
            font-size: 0.9rem;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-lock" style="font-size: 1.2rem;"></i>
                <div>
                    <strong>Session Expired</strong><br>
                    <span style="opacity: 0.9;">Please login again for security</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 5000);
}

// Add slide animations for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyle);

// Monitor user activity to reset timer
document.addEventListener('DOMContentLoaded', () => {
    // Events that indicate user activity
    const activityEvents = [
        'mousedown', 'mousemove', 'keypress', 
        'scroll', 'touchstart', 'click', 'keydown'
    ];
    
    activityEvents.forEach(event => {
        document.addEventListener(event, resetLockTimer, true);
    });
    
    // Also reset timer when window gains focus
    window.addEventListener('focus', resetLockTimer);
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Animate memory cards
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });

    // Animate gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Heart floating animation on click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.memory-card') || e.target.closest('.hero')) {
            createHeart(e.clientX, e.clientY);
        }
    });

    // Create floating heart
    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '20px';
        heart.style.color = '#ff6b9d';
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'floatUp 2s ease-out forwards';
        heart.style.zIndex = '9999';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }

    // Add float up animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
});

// Timeline interaction
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
});

// Gallery hover effect
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const placeholder = item.querySelector('.gallery-placeholder');
            if (placeholder) {
                placeholder.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #feca57 100%)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const placeholder = item.querySelector('.gallery-placeholder');
            if (placeholder) {
                placeholder.style.background = 'var(--bg-gradient)';
            }
        });
    });
});

// Add typing effect to hero title
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let charIndex = 0;
    function typeWriter() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 600;
    }
});

// Mobile menu close when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
});

// Add CSS for mobile menu
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
        
        .nav-menu a.active {
            color: var(--primary-color);
        }
    }
`;
document.head.appendChild(mobileMenuStyle);

// Admin Login Button Styling
const adminButtonStyle = document.createElement('style');
adminButtonStyle.textContent = `
    .admin-login-btn {
        color: #000000 !important;
        font-weight: 600;
        padding: 8px 15px;
        border-radius: 20px;
        background: rgba(93, 116, 220, 0.1);
        transition: all 0.3s ease;
        border: 1px solid rgba(102, 126, 234, 0.3);
    }
    
    .admin-login-btn:hover {
        background: rgba(0, 0, 0, 0.95) !important;
        transform: translateY(-2px);
        color:rgba(255, 255, 255, 0.95) !important;
        box-shadow : 0 5px 15px rgb(102, 126, 234);
    }
    
    .admin-login-btn i {
        margin-right: 5px;
        border-radius: 20px;
    }
    
    
    @media (max-width: 768px) {
        .admin-login-btn {
            margin-top: 10px;
            text-align: center;
        }
    }
`;
document.head.appendChild(adminButtonStyle);

// Delete Button Styling
const deleteButtonStyle = document.createElement('style');
deleteButtonStyle.textContent = `
    .delete-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 107, 107, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
    }
    
    .gallery-item:hover .delete-btn {
        opacity: 1;
    }
    
    .delete-btn:hover {
        background: rgba(255, 59, 48, 0.95);
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(255, 59, 48, 0.4);
    }
    
    .delete-btn:active {
        transform: scale(0.95);
    }
    
    .gallery-item {
        position: relative;
        overflow: visible;
    }
`;
document.head.appendChild(deleteButtonStyle);

// Love Counter - Anniversary since 11/11/2023
function updateLoveCounter() {
    const anniversaryDate = new Date('2023-11-11T00:00:00');
    const currentDate = new Date();
    
    // Calculate the difference
    const timeDifference = currentDate - anniversaryDate;
    
    // Calculate years, months, days, hours, minutes, seconds
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    // Update the display with animation
    animateCounter('years', years);
    animateCounter('months', months);
    animateCounter('days', days);
    animateCounter('hours', hours);
    animateCounter('minutes', minutes);
    animateCounter('seconds', seconds);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent);
    const increment = targetValue > currentValue ? 1 : -1;
    const steps = Math.abs(targetValue - currentValue);
    
    if (steps === 0) return;
    
    let current = currentValue;
    const duration = 1000; // 1 second animation
    const stepDuration = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === targetValue) {
            clearInterval(timer);
        }
    }, stepDuration);
}

// Valentine's Day Special Effects
function createValentineHearts() {
    const colors = ['#ff6b9d', '#feca57', '#ff9ff3', '#ff6348'];
    const heartSymbols = ['❤', '💕', '💖', '💗', '💝'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '100%';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.animation = `floatUp ${Math.random() * 3 + 2}s ease-out forwards`;
            heart.style.textShadow = '0 0 10px rgba(255, 107, 157, 0.5)';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, i * 200);
    }
}

// Create beautiful flowers for Valentine's Day
function createValentineFlowers() {
    const flowerEmojis = ['🌹', '🌸', '🌺', '🌷', '🌻', '🌹', '💐', '🌹'];
    const colors = ['#ff6b9d', '#ff69b4', '#ff1493', '#ff69b4', '#ffc0cb', '#ffb6c1'];
    
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.innerHTML = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
            flower.style.position = 'fixed';
            flower.style.left = Math.random() * 100 + '%';
            flower.style.top = '-50px';
            flower.style.fontSize = (Math.random() * 25 + 20) + 'px';
            flower.style.color = colors[Math.floor(Math.random() * colors.length)];
            flower.style.pointerEvents = 'none';
            flower.style.zIndex = '9998';
            flower.style.animation = `fallDown ${Math.random() * 4 + 3}s ease-in-out forwards`;
            flower.style.textShadow = '0 0 15px rgba(255, 107, 157, 0.6)';
            flower.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(flower);
            
            setTimeout(() => {
                flower.remove();
            }, 7000);
        }, i * 150);
    }
}

// Add falling flowers animation
const flowerStyle = document.createElement('style');
flowerStyle.textContent = `
    @keyframes fallDown {
        0% {
            opacity: 0;
            transform: translateY(-50px) rotate(0deg) scale(0.5);
        }
        10% {
            opacity: 1;
            transform: translateY(0px) rotate(45deg) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(90vh) rotate(315deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(100vh) rotate(360deg) scale(0.8);
        }
    }
`;
document.head.appendChild(flowerStyle);

// Check if today is Valentine's Day (February 14th)
function checkValentineDay() {
    const today = new Date();
    const isValentineDay = today.getMonth() === 1 && today.getDate() === 14; // February is month 1 (0-indexed)
    
    if (isValentineDay) {
        // Create special Valentine's Day effects
        createValentineHearts();
        createValentineFlowers();
        
        // Show Valentine's Day message with flowers
        const valentineMessage = document.createElement('div');
        valentineMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff6b9d, #feca57);
                color: white;
                padding: 2.5rem 3.5rem;
                border-radius: 25px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(15px);
                animation: pulse 2s ease-in-out infinite;
                border: 2px solid rgba(255, 255, 255, 0.3);
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem; animation: bounce 1s ease-in-out infinite;">
                    🌹💕🌸
                </div>
                <h2 style="font-size: 2.2rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                    Happy Valentine's Day! 💕
                </h2>
                <p style="font-size: 1.3rem; margin-bottom: 1rem; text-shadow: 0 1px 5px rgba(0,0,0,0.2);">
                    Today celebrates our beautiful love story
                </p>
                <p style="font-size: 1.1rem; opacity: 0.95; margin-bottom: 1.5rem; text-shadow: 0 1px 5px rgba(0,0,0,0.2);">
                    Every moment with you is precious, my love 🌹
                </p>
                <div style="font-size: 2rem; margin-bottom: 1.5rem; animation: float 2s ease-in-out infinite;">
                    💐🌺🌷🌹
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 1rem;
                    padding: 0.8rem 2rem;
                    background: white;
                    color: #ff6b9d;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1.1rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Continue to Our Story 💕
                </button>
            </div>
        `;
        
        document.body.appendChild(valentineMessage);
        
        // Create periodic flowers while message is shown
        const flowerInterval = setInterval(() => {
            if (valentineMessage.parentElement) {
                createValentineFlowers();
            } else {
                clearInterval(flowerInterval);
            }
        }, 8000);
        
        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (valentineMessage.parentElement) {
                valentineMessage.remove();
                clearInterval(flowerInterval);
            }
        }, 15000);
    }
}

// Anniversary celebration effects
function checkAnniversary() {
    const today = new Date();
    const anniversaryDate = new Date('2023-11-11');
    const isAnniversary = today.getMonth() === 10 && today.getDate() === 11; // November is month 10 (0-indexed)
    
    if (isAnniversary) {
        // Create anniversary celebration
        const years = today.getFullYear() - anniversaryDate.getFullYear();
        
        const anniversaryMessage = document.createElement('div');
        anniversaryMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 2rem 3rem;
                border-radius: 20px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                animation: pulse 2s ease-in-out infinite;
            ">
                <h2 style="font-size: 2.5rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">
                    Happy Anniversary! 🎉
                </h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem;">
                    ${years} Year${years > 1 ? 's' : ''} of Amazing Memories!
                </p>
                <p style="font-size: 1.2rem; opacity: 0.9;">
                    Thank you for ${years} wonderful year${years > 1 ? 's' : ''} of love
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1.5rem;
                    background: white;
                    color: #667eea;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(anniversaryMessage);
        
        // Create celebration hearts
        createValentineHearts();
        
        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (anniversaryMessage.parentElement) {
                anniversaryMessage.remove();
            }
        }, 15000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update counter immediately
    updateLoveCounter();
    
    // Update counter every second for real-time minutes and seconds
    setInterval(updateLoveCounter, 1000);
    
    // Check for special days
    checkValentineDay();
    checkAnniversary();
    
    // Create floating hearts periodically on love counter section
    const loveCounterSection = document.querySelector('.love-counter');
    if (loveCounterSection) {
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                const heart = document.createElement('div');
                heart.innerHTML = '❤';
                heart.style.position = 'absolute';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.bottom = '0';
                heart.style.fontSize = '20px';
                heart.style.color = '#ff6b9d';
                heart.style.pointerEvents = 'none';
                heart.style.animation = 'floatUp 4s ease-out forwards';
                heart.style.zIndex = '1';
                
                loveCounterSection.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 4000);
            }
        }, 3000);
    }
});

// Admin Functions
function showAdminFeatures() {
    // Show admin upload button in gallery section
    const gallerySection = document.querySelector('#gallery .container');
    if (gallerySection) {
        const existingAdminPanel = document.getElementById('adminPanel');
        if (!existingAdminPanel) {
            const adminPanel = document.createElement('div');
            adminPanel.id = 'adminPanel';
            adminPanel.innerHTML = `
                <div class="admin-controls" style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 15px;
                    margin-bottom: 2rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                ">
                    <h3 style="margin-bottom: 1rem; font-size: 1.3rem;">
                        <i class="fas fa-crown"></i> Admin Panel
                    </h3>
                    <div class="upload-section">
                        <label for="imageUpload" style="
                            display: inline-block;
                            padding: 0.8rem 1.5rem;
                            background: white;
                            color: #667eea;
                            border-radius: 25px;
                            cursor: pointer;
                            font-weight: 600;
                            margin-right: 1rem;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-upload"></i> Upload Images
                        </label>
                        <input type="file" id="imageUpload" accept="image/*" multiple style="display: none;">
                        <span id="uploadStatus" style="opacity: 0.8;">Select images to upload</span>
                    </div>
                    <div id="uploadedImages" style="margin-top: 1rem;"></div>
                </div>
            `;
            gallerySection.insertBefore(adminPanel, gallerySection.firstChild);
            
            // Add upload functionality
            setupImageUpload();
        }
        
        // Add delete buttons to existing gallery images
        addDeleteButtonsToGallery();
    }
}

function hideAdminFeatures() {
    // Hide admin panel
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.remove();
    }
    
    // Remove delete buttons from gallery
    removeDeleteButtonsFromGallery();
}

function addDeleteButtonsToGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        addDeleteButtonToItem(item);
    });
}

function addDeleteButtonToItem(item) {
    // Check if delete button already exists
    if (!item.querySelector('.delete-btn')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete image';
        deleteBtn.onclick = () => confirmDelete(item);
        item.appendChild(deleteBtn);
    }
}

function removeDeleteButtonsFromGallery() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => btn.remove());
}

function confirmDelete(galleryItem) {
    const confirmation = confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (confirmation) {
        deleteGalleryItem(galleryItem);
    }
}

function deleteGalleryItem(galleryItem) {
    // Add fade out animation
    galleryItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        galleryItem.remove();
        showDeleteNotification();
    }, 300);
}

function showDeleteNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b9d, #feca57);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            animation: slideInRight 0.5s ease-out;
            font-size: 0.9rem;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <div>
                    <strong>Image Deleted</strong><br>
                    <span style="opacity: 0.9;">Image removed successfully</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 3000);
}

function setupImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadStatus = document.getElementById('uploadStatus');
    const uploadedImages = document.getElementById('uploadedImages');
    
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            if (files.length > 0) {
                uploadStatus.textContent = `Processing ${files.length} image(s)...`;
                
                files.forEach((file, index) => {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Create new gallery item
                        const galleryGrid = document.querySelector('.gallery-grid');
                        if (galleryGrid) {
                            const newItem = document.createElement('div');
                            newItem.className = 'gallery-item';
                            newItem.innerHTML = `
                                <div class="gallery-placeholder" style="position: relative;">
                                    <img src="${e.target.result}" alt="Uploaded image" style="width: 100%; height: 100%; object-fit: cover;">
                                    <div style="
                                        position: absolute;
                                        top: 5px;
                                        right: 5px;
                                        background: rgba(255,255,255,0.9);
                                        color: #667eea;
                                        padding: 5px 10px;
                                        border-radius: 15px;
                                        font-size: 0.8rem;
                                        font-weight: 600;
                                    ">New</div>
                                </div>
                            `;
                            
                            // Add animation
                            newItem.style.opacity = '0';
                            newItem.style.transform = 'scale(0.8)';
                            galleryGrid.appendChild(newItem);
                            
                            setTimeout(() => {
                                newItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                                newItem.style.opacity = '1';
                                newItem.style.transform = 'scale(1)';
                                
                                // Add delete button to new image
                                if (isAdmin) {
                                    addDeleteButtonToItem(newItem);
                                }
                            }, index * 100);
                        }
                        
                        // Update status
                        if (index === files.length - 1) {
                            uploadStatus.textContent = `Successfully uploaded ${files.length} image(s)!`;
                            uploadStatus.style.color = '#9339e2';
                            
                            setTimeout(() => {
                                uploadStatus.textContent = 'Select images to upload';
                                uploadStatus.style.color = '';
                            }, 3000);
                        }
                    };
                    
                    reader.readAsDataURL(file);
                });
            }
        });
    }
}
