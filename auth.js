// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const forgotPasswordView = document.getElementById('forgot-password-view');
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    const switchToSignupLink = document.getElementById('switchToSignup');
    const switchToLoginLink = document.getElementById('switchToLogin');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLogin');
    const continueAsGuestBtn = document.getElementById('continueAsGuest');
    const continueAsGuestSignupBtn = document.getElementById('continueAsGuestSignup');

    // Function to switch between login and signup views
    function switchView(viewName) {
        loginView.style.display = 'none';
        signupView.style.display = 'none';
        forgotPasswordView.style.display = 'none';

        if (viewName === 'signup') {
            signupView.style.display = 'block';
        } else if (viewName === 'forgot') {
            forgotPasswordView.style.display = 'block';
        } else {
            loginView.style.display = 'block';
        }
    }

    // Add click event listeners to switch links
    switchToSignupLink.addEventListener('click', (e) => { e.preventDefault(); switchView('signup'); });
    switchToLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchView('login'); });
    forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); switchView('forgot'); });
    backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchView('login'); });

    // Handle guest login functionality
    function handleGuestLogin() {
        // Generate a unique guest ID
        const guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Create guest user object
        const guestUser = {
            name: 'Guest User',
            email: null,
            isGuest: true,
            guestId: guestId,
            loginTime: new Date().toISOString()
        };
        
        // Store guest user in session
        sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
        
        // Update navigation if updateNavigation function exists
        if (typeof updateNavigation === 'function') {
            updateNavigation();
        }
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    // Handle guest login from login page
    if (continueAsGuestBtn) {
        continueAsGuestBtn.addEventListener('click', handleGuestLogin);
    }

    // Handle guest login from signup page
    if (continueAsGuestSignupBtn) {
        continueAsGuestSignupBtn.addEventListener('click', handleGuestLogin);
    }

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                this.textContent = 'Show';
            }
        });
    });

    // Password validation rules
    const passwordRules = {
        minLength: 10, // As per the new design
        hasUpperCase: /[A-Z]/,
        hasLowerCase: /[a-z]/,
        hasNumber: /[0-9]/,
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
    };

    // Create error message elements
    const createErrorMessage = (message, linkText = null, linkHandler = null) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '1rem';
        
        const messageNode = document.createTextNode(message);
        errorDiv.appendChild(messageNode);

        if (linkText && linkHandler) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = ` ${linkText}`;
            link.style.color = 'var(--primary)';
            link.style.textDecoration = 'underline';
            link.onclick = (e) => {
                e.preventDefault();
                linkHandler();
            };
            errorDiv.appendChild(link);
        }
        
        return errorDiv;
    };

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const existingError = loginForm.querySelector('.error-message');
        if(existingError) existingError.remove();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                
                // Update navigation if updateNavigation function exists
                if (typeof updateNavigation === 'function') {
                    updateNavigation();
                }
                
                window.location.href = 'index.html';
            } else {
                const errorDiv = createErrorMessage('Incorrect email or password.');
                loginForm.appendChild(errorDiv);
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorDiv = createErrorMessage('An error occurred during login.');
            loginForm.appendChild(errorDiv);
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const existingError = signupForm.querySelector('.error-message');
        if(existingError) existingError.remove();
        
        const firstName = document.getElementById('signupFirstName').value.trim();
        const lastName = document.getElementById('signupLastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        
        if (!firstName || !lastName || !email || !password) {
            const errorDiv = createErrorMessage('Please fill in all fields.');
            signupForm.appendChild(errorDiv);
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            const errorDiv = createErrorMessage('Please enter a valid email address.');
            signupForm.appendChild(errorDiv);
            return;
        }

        if (password.length < 10) {
            const errorDiv = createErrorMessage('Password must be at least 10 characters long.');
            signupForm.appendChild(errorDiv);
            return;
        }
        
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(user => user.email === email)) {
                const errorDiv = createErrorMessage('Email already registered.', 'Reset your password?', () => switchView('forgot'));
                signupForm.appendChild(errorDiv);
                return;
            }
            
            const newUser = {
                name: `${firstName} ${lastName}`,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registration successful! Please log in.');
            switchView('login');
            signupForm.reset();

        } catch (error) {
            console.error('Signup error:', error);
            const errorDiv = createErrorMessage('An error occurred during sign up.');
            signupForm.appendChild(errorDiv);
        }
    });

    // Handle forgot password form submission
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const existingError = forgotPasswordForm.querySelector('.error-message');
        if (existingError) existingError.remove();

        const email = document.getElementById('forgotEmail').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (!email || !newPassword || !confirmNewPassword) {
            const errorDiv = createErrorMessage('Please fill in all fields.');
            forgotPasswordForm.appendChild(errorDiv);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            const errorDiv = createErrorMessage('Passwords do not match.');
            forgotPasswordForm.appendChild(errorDiv);
            return;
        }

        if (newPassword.length < 10) {
            const errorDiv = createErrorMessage('Password must be at least 10 characters long.');
            forgotPasswordForm.appendChild(errorDiv);
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));

                showNotification('Password reset successfully! You can now log in with your new password.', 'success');
                setTimeout(() => {
                    document.getElementById('forgot-password-view').style.display = 'none';
                    document.getElementById('login-view').style.display = 'block';
                    forgotPasswordForm.reset();
                }, 1000);
            } else {
                const errorDiv = createErrorMessage('No account found with that email address.');
                forgotPasswordForm.appendChild(errorDiv);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            const errorDiv = createErrorMessage('An error occurred during password reset.');
            forgotPasswordForm.appendChild(errorDiv);
        }
    });

    // Check URL hash and initialize appropriate view
    function initializeView() {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash === 'signup') {
            switchView('signup');
        } else if (hash === 'login') {
            switchView('login');
        } else {
            switchView('login'); // Default to login view
        }
    }

    // Initialize view based on URL hash
    initializeView();

    // Listen for hash changes (if user uses browser back/forward)
    window.addEventListener('hashchange', initializeView);
});

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Get root styles
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary').trim() || '#026670';
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : primaryColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 1rem;
        font-family: 'Avenir', sans-serif;
        max-width: 300px;
        transform: translateX(120%);
        transition: transform 0.3s ease-in-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
} 