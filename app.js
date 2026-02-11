// Login System
const CORRECT_PASSWORD = '111123';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showMainContent();
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
            
            if (enteredPassword === CORRECT_PASSWORD) {
                // Successful login
                sessionStorage.setItem('isLoggedIn', 'true');
                showMainContent();
                
                // Create celebration effect
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

    function showMainContent() {
        if (loginOverlay) {
            loginOverlay.style.opacity = '0';
            loginOverlay.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                loginOverlay.style.display = 'none';
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.style.opacity = '0';
                    mainContent.style.transition = 'opacity 0.5s ease-in';
                    
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                    }, 50);
                }
            }, 500);
        }
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

// Check if today is Valentine's Day (February 14th)
function checkValentineDay() {
    const today = new Date();
    const isValentineDay = today.getMonth() === 1 && today.getDate() === 14; // February is month 1 (0-indexed)
    
    if (isValentineDay) {
        // Create special Valentine's Day effects
        createValentineHearts();
        
        // Show Valentine's Day message
        const valentineMessage = document.createElement('div');
        valentineMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff6b9d, #feca57);
                color: white;
                padding: 2rem 3rem;
                border-radius: 20px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                animation: pulse 2s ease-in-out infinite;
            ">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">
                    Happy Valentine's Day! 💕
                </h2>
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                    Today celebrates our beautiful love story
                </p>
                <p style="font-size: 1rem; opacity: 0.9;">
                    Every moment with you is precious
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1.5rem;
                    background: white;
                    color: #ff6b9d;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(valentineMessage);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (valentineMessage.parentElement) {
                valentineMessage.remove();
            }
        }, 10000);
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
