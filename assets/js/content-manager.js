// Content Management System
document.addEventListener('DOMContentLoaded', function() {
    loadExistingContent();
    setupForms();
});

// Tab Management
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Stats Form Handler
document.getElementById('statsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const stats = {
        fortyTime: document.getElementById('fortyTime').value,
        verticalJump: document.getElementById('verticalJump').value,
        broadJump: document.getElementById('broadJump').value,
        shuttle: document.getElementById('shuttle').value,
        cone: document.getElementById('cone').value,
        height: document.getElementById('height').value,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('playerStats', JSON.stringify(stats));
    updatePublicSiteStats(stats);
    alert('Stats updated successfully!');
});

// Video Form Handler
document.getElementById('videoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const video = {
        id: Date.now(),
        title: document.getElementById('videoTitle').value,
        url: document.getElementById('videoUrl').value,
        description: document.getElementById('videoDescription').value,
        dateAdded: new Date().toISOString()
    };
    
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    videos.unshift(video);
    localStorage.setItem('videos', JSON.stringify(videos));
    
    this.reset();
    loadMediaGallery();
    alert('Video added successfully!');
});

// Photo Form Handler
document.getElementById('photoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('photoUpload');
    const caption = document.getElementById('photoCaption').value;
    
    if (fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photo = {
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    caption: caption,
                    filename: file.name,
                    dateAdded: new Date().toISOString()
                };
                
                const photos = JSON.parse(localStorage.getItem('photos') || '[]');
                photos.unshift(photo);
                localStorage.setItem('photos', JSON.stringify(photos));
                loadMediaGallery();
            };
            reader.readAsDataURL(file);
        });
        
        this.reset();
        alert('Photos uploaded successfully!');
    }
});

// Profile Form Handler
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profile = {
        bio: document.getElementById('bio').value,
        gpa: document.getElementById('gpa').value,
        satScore: document.getElementById('satScore').value,
        intendedMajor: document.getElementById('intendedMajor').value,
        achievements: document.getElementById('achievements').value,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('playerProfile', JSON.stringify(profile));
    alert('Profile updated successfully!');
});

// News Form Handler
document.getElementById('newsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const article = {
        id: Date.now(),
        title: document.getElementById('newsTitle').value,
        date: document.getElementById('newsDate').value,
        content: document.getElementById('newsContent').value,
        link: document.getElementById('newsLink').value,
        dateAdded: new Date().toISOString()
    };
    
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    news.unshift(article);
    localStorage.setItem('news', JSON.stringify(news));
    
    this.reset();
    loadNewsList();
    alert('Article published successfully!');
});

// Load Media Gallery
function loadMediaGallery() {
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    const mediaList = document.getElementById('mediaList');
    
    mediaList.innerHTML = '';
    
    // Display videos
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.className = 'media-item';
        videoElement.innerHTML = `
            <div class="media-content">
                <h4>${video.title}</h4>
                <p>${video.description}</p>
                <a href="${video.url}" target="_blank">View Video</a>
                <button onclick="deleteMedia('videos', ${video.id})" class="btn-delete">Delete</button>
            </div>
        `;
        mediaList.appendChild(videoElement);
    });
    
    // Display photos
    photos.forEach(photo => {
        const photoElement = document.createElement('div');
        photoElement.className = 'media-item';
        photoElement.innerHTML = `
            <div class="media-content">
                <img src="${photo.src}" alt="${photo.caption}" style="max-width: 200px;">
                <p>${photo.caption}</p>
                <button onclick="deleteMedia('photos', ${photo.id})" class="btn-delete">Delete</button>
            </div>
        `;
        mediaList.appendChild(photoElement);
    });
}

// Load News List
function loadNewsList() {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const newsList = document.getElementById('newsList');
    
    newsList.innerHTML = news.map(article => `
        <div class="news-item">
            <h4>${article.title}</h4>
            <p><strong>Date:</strong> ${new Date(article.date).toLocaleDateString()}</p>
            <p>${article.content.substring(0, 100)}...</p>
            ${article.link ? `<a href="${article.link}" target="_blank">Read More</a>` : ''}
            <button onclick="deleteNews(${article.id})" class="btn-delete">Delete</button>
        </div>
    `).join('');
}

// Delete Functions
function deleteMedia(type, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        const items = JSON.parse(localStorage.getItem(type) || '[]');
        const filtered = items.filter(item => item.id !== id);
        localStorage.setItem(type, JSON.stringify(filtered));
        loadMediaGallery();
    }
}

function deleteNews(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        const news = JSON.parse(localStorage.getItem('news') || '[]');
        const filtered = news.filter(article => article.id !== id);
        localStorage.setItem('news', JSON.stringify(filtered));
        loadNewsList();
    }
}

// Update Public Site Stats
function updatePublicSiteStats(stats) {
    // This would update the public site in a real implementation
    // For now, we'll just update the dashboard display
    const dashboardStats = document.querySelectorAll('.metric-value');
    if (dashboardStats.length > 0) {
        // Update dashboard if we're on that page
        window.location.reload();
    }
}

// Load Existing Content
function loadExistingContent() {
    // Load saved stats
    const savedStats = JSON.parse(localStorage.getItem('playerStats') || '{}');
    Object.keys(savedStats).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.value = savedStats[key];
    });
    
    // Load saved profile
    const savedProfile = JSON.parse(localStorage.getItem('playerProfile') || '{}');
    Object.keys(savedProfile).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.value = savedProfile[key];
    });
    
    // Load media and news
    loadMediaGallery();
    loadNewsList();
    
    // Set today's date as default for news
    document.getElementById('newsDate').value = new Date().toISOString().split('T')[0];
}

// Setup Forms
function setupForms() {
    // Auto-save functionality
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Auto-save draft content
            const drafts = JSON.parse(localStorage.getItem('drafts') || '{}');
            drafts[this.id] = this.value;
            localStorage.setItem('drafts', JSON.stringify(drafts));
        });
    });
}