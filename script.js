// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form handling)
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
    
    // CTA button functionality
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (button.textContent.includes('Get Involved') || button.textContent.includes('Become a Volunteer')) {
            button.addEventListener('click', function() {
                // Navigate to get involved page
                window.location.href = 'get-involved.html';
            });
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .curriculum-card, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Slideshow functionality
    let slideIndex = 0;
    let slideshowTimeout;

    const slides = document.getElementsByClassName("slide");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

    function showSlides() {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}
        
        // If an image fails to load, skip to the next one
        const currentImg = slides[slideIndex-1].querySelector('img');
        if (currentImg.naturalWidth === 0 && currentImg.naturalHeight === 0) {
            slideshowTimeout = setTimeout(showSlides, 100); // Check again quickly
            return;
        }

        slides[slideIndex-1].style.display = "block";
        slideshowTimeout = setTimeout(showSlides, 5000); // Change image every 5 seconds
    }

    function plusSlides(n) {
        clearTimeout(slideshowTimeout); // Reset timer when user interacts
        slideIndex += n;
        if (slideIndex > slides.length) {slideIndex = 1}
        if (slideIndex < 1) {slideIndex = slides.length}
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex-1].style.display = "block";
        slideshowTimeout = setTimeout(showSlides, 10000); // Wait longer after manual navigation
    }

    if (slides.length > 0) {
        showSlides();
        if(prev && next) {
            prev.addEventListener('click', () => plusSlides(-1));
            next.addEventListener('click', () => plusSlides(1));
        }
    }

    // Desktop Inline Expanding Menu Logic
    function handleDesktopNavExpansion() {
        if (window.innerWidth < 769) return;

        const navList = document.querySelector('.nav-list');
        const navItems = navList.querySelectorAll('li');
        if (!navList || navItems.length === 0 || document.querySelector('.desktop-hamburger-menu-btn')) {
            return; // Exit if already setup
        }

        navList.style.display = 'flex';
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) mobileMenuBtn.style.display = 'none';

        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'desktop-hamburger-menu-btn';
        hamburgerBtn.innerHTML = '<span></span><span></span><span></span>';
        hamburgerBtn.style.display = 'block';

        const hamburgerLi = document.createElement('li');
        hamburgerLi.appendChild(hamburgerBtn);
        hamburgerLi.classList.add('nav-item--hamburger');

        const hiddenItems = [];
        navItems.forEach(item => {
            const link = item.querySelector('a');
            const isLogin = item.id === 'login-signup-btn' || item.id === 'user-info';
            const isActive = link && link.classList.contains('active');

            if (!isActive && !isLogin) {
                item.classList.add('nav-item--hidden-desktop');
                hiddenItems.push(item);
            }
        });

        if (hiddenItems.length > 0) {
            const loginItem = navList.querySelector('#login-signup-btn') || navList.querySelector('#user-info');
            if (loginItem) {
                navList.insertBefore(hamburgerLi, loginItem);
            } else {
                navList.appendChild(hamburgerLi);
            }
        }

        hamburgerBtn.addEventListener('click', function() {
            this.classList.toggle('is-active');
            navList.classList.toggle('nav-list--desktop-expanded');
            if (navList.classList.contains('nav-list--desktop-expanded')) {
                sessionStorage.setItem('desktopNavState', 'open');
            } else {
                sessionStorage.setItem('desktopNavState', 'closed');
            }
        });

        if (sessionStorage.getItem('desktopNavState') === 'open') {
            hamburgerBtn.classList.add('is-active');
            navList.classList.add('nav-list--desktop-expanded');
        }
    }

    handleDesktopNavExpansion();

    window.addEventListener('resize', () => {
        if ((window.innerWidth > 768 && !document.querySelector('.desktop-hamburger-menu-btn')) || (window.innerWidth < 769 && document.querySelector('.desktop-hamburger-menu-btn'))) {
            window.location.reload();
        }
    });
});

// Testimonial Slider
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;

    const prev = document.querySelector('.testimonial-prev');
    const next = document.querySelector('.testimonial-next');
    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[n].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (prev && next) {
        prev.addEventListener('click', prevSlide);
        next.addEventListener('click', nextSlide);
    }

    // Initialize the first slide
    showSlide(currentSlide);
});

// Course Search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('course-search');
    if (!searchInput) return;

    const allCourses = Array.from(document.querySelectorAll('.course-button'));
    const resultsContainer = document.getElementById('search-results-container');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (searchTerm.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        const matchedCourses = allCourses.filter(course => {
            const title = course.querySelector('h3').textContent.toLowerCase();
            const description = course.querySelector('p').textContent.toLowerCase();
            const keywords = course.dataset.keywords.toLowerCase();
            return title.includes(searchTerm) || description.includes(searchTerm) || keywords.includes(searchTerm);
        });

        if (matchedCourses.length > 0) {
            matchedCourses.forEach(course => {
                const resultItem = document.createElement('a');
                resultItem.href = course.href;
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `<h3>${course.querySelector('h3').textContent}</h3><p>${course.querySelector('p').textContent}</p>`;
                resultsContainer.appendChild(resultItem);
            });
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
            resultsContainer.style.display = 'none';
        }
    });
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 1rem;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function isVisible(el) {
    // ... existing code ...
}

// Add CSS for mobile menu and animations
const additionalStyles = `
    .nav-list.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        padding: 1rem;
        border-radius: 0 0 15px 15px;
    }
    
    .mobile-menu-btn {
        position: relative;
        width: 25px;
        height: 17px;
    }

    .mobile-menu-btn span {
        position: absolute;
        left: 0;
        width: 100%;
        height: 3px;
        transition: all 0.3s ease-in-out;
    }
    
    .mobile-menu-btn span:nth-child(1) { top: 0; }
    .mobile-menu-btn span:nth-child(2) { top: 50%; transform: translateY(-50%); }
    .mobile-menu-btn span:nth-child(3) { bottom: 0; }

    .mobile-menu-btn.active span:nth-child(1) {
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
    }
    
    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-btn.active span:nth-child(3) {
        top: 50%;
        transform: translateY(-50%) rotate(-45deg);
    }
    
    .feature-card,
    .curriculum-card,
    .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.animate-in,
    .curriculum-card.animate-in,
    .testimonial-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .nav-list {
            display: none;
        }
        
        .nav-list.active {
            display: flex !important;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', (event) => {
    // Check for logged-in user
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        // Hide both login and signup buttons
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (signupBtn) {
            signupBtn.style.display = 'none';
        }

        // Show user info
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        if (userInfo && userName) {
            userName.textContent = currentUser.name;
            userName.style.padding = '10px 20px';
            userName.style.fontWeight = '600';
            userName.style.color = 'var(--white)';
            userName.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            userName.style.borderRadius = '8px';
            userName.style.cursor = 'pointer';
            userName.style.transition = 'all 0.2s ease';
            userInfo.style.display = 'block';

            // Add hover effect
            userName.addEventListener('mouseenter', () => {
                userName.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            userName.addEventListener('mouseleave', () => {
                userName.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });

            // Logout functionality is now handled in the dropdown menu
        }
    } else {
        // Ensure login/signup buttons are visible when not logged in
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        if (loginBtn) {
            loginBtn.style.display = 'block';
        }
        if (signupBtn) {
            signupBtn.style.display = 'block';
        }
        
        // Ensure user info is hidden when not logged in
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.style.display = 'none';
        }
    }

    // Logout Modal Logic
    const logoutModal = document.getElementById('logout-modal-overlay');
    const cancelLogout = document.getElementById('cancel-logout');
    const confirmLogout = document.getElementById('confirm-logout');

    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            logoutModal.classList.remove('active');
        });
    }

    if (confirmLogout) {
        confirmLogout.addEventListener('click', () => {
            // Clear user session data
            sessionStorage.removeItem('currentUser');
            
            // Note: We keep localStorage progress data so users don't lose their progress
            // when they log back in on the same device. Progress is now tied to their email.
            
            // Close the modal
            logoutModal.classList.remove('active');
            
            // Redirect to login page
            window.location.href = 'auth.html#login';
        });
    }

    // Close modal when clicking outside
    if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.classList.remove('active');
            }
        });
    }

    // Slideshow
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let i;
        const slides = document.getElementsByClassName("slide");
        if (slides.length === 0) return;

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 3000); // Change image every 3 seconds
    }

    // Manual slide navigation
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

    if (prev && next) {
        prev.addEventListener("click", () => plusSlides(-1));
        next.addEventListener("click", () => plusSlides(1));
    }

    function plusSlides(n) {
        slideIndex += n;
        let slides = document.getElementsByClassName("slide");
        if (slideIndex > slides.length) { slideIndex = 1 }
        if (slideIndex < 1) { slideIndex = slides.length }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
});
