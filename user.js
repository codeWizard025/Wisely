// Function to update the navigation based on user login status
function updateNavigation() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.name) {
        // Hide both login and signup buttons
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        
        // Show user info with appropriate name
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        if (userInfo && userName) {
            // Show different text for guest users
            if (currentUser.isGuest) {
                userName.textContent = 'Guest User';
                userName.style.color = '#6c757d'; // Slightly muted color for guest
                userName.title = 'You are browsing as a guest. Your progress will be saved locally but not tied to an account.';
            } else {
                userName.textContent = currentUser.name;
                userName.style.color = ''; // Reset to default color
                userName.title = ''; // Remove tooltip
            }
            userInfo.style.display = 'block';
        }
    } else {
        // Show login and signup buttons
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        
        // Hide user info
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Helper function to check if current user is a guest
function isGuestUser() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    return currentUser && currentUser.isGuest;
}

// Helper function to get guest-specific storage key
function getGuestStorageKey(baseKey) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.isGuest) {
        return `${baseKey}_${currentUser.guestId}`;
    }
    return baseKey;
}

document.addEventListener('DOMContentLoaded', updateNavigation);

// Update navigation when user logs in/out
window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
        updateNavigation();
    }
}); 