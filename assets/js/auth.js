// Authentication Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate authentication
    setTimeout(() => {
        // Demo credentials - in production, this would be handled by your backend
        const validCredentials = {
            'athlete': 'training123',
            'scout1': 'scout123',
            'coach1': 'coach123'
        };
        
        if (validCredentials[username] === password) {
            // Store user session
            sessionStorage.setItem('user', username);
            sessionStorage.setItem('userType', username.startsWith('scout') || username.startsWith('coach') ? 'scout' : 'athlete');
            
            // Redirect based on user type
            if (username.startsWith('scout') || username.startsWith('coach')) {
                window.location.href = 'dashboard/scout-access.html';
            } else {
                window.location.href = 'dashboard/index.html';
            }
        } else {
            alert('Invalid username or password.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
});

// Check if user is already logged in
window.addEventListener('load', function() {
    const user = sessionStorage.getItem('user');
    if (user) {
        const userType = sessionStorage.getItem('userType');
        if (userType === 'scout') {
            window.location.href = 'dashboard/scout-access.html';
        } else {
            window.location.href = 'dashboard/index.html';
        }
    }
});