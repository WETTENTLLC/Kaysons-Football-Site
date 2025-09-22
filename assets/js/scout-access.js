// Scout Access Portal Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has scout/coach access
    const userType = sessionStorage.getItem('userType');
    if (userType !== 'scout') {
        // Redirect non-scout users
        window.location.href = '../login.html';
        return;
    }
    
    initializeScoutPortal();
});

function initializeScoutPortal() {
    // Load performance data
    loadPerformanceMetrics();
    
    // Handle feedback form
    setupFeedbackForm();
    
    // Load previous feedback
    loadPreviousFeedback();
}

function loadPerformanceMetrics() {
    // In production, this would fetch from your API
    const metrics = {
        fortyYard: { value: '4.42s', date: 'Dec 1, 2023', trend: 'improved' },
        verticalJump: { value: '38.5"', date: 'Nov 28, 2023', trend: 'improved' },
        shuttle: { value: '4.15s', date: 'Nov 25, 2023', trend: 'improved' },
        cone: { value: '6.85s', date: 'Nov 20, 2023', trend: 'improved' }
    };
    
    // Update metric cards with latest data
    updateMetricCards(metrics);
}

function updateMetricCards(metrics) {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach((card, index) => {
        const metricKeys = Object.keys(metrics);
        if (index < metricKeys.length) {
            const metric = metrics[metricKeys[index]];
            const valueElement = card.querySelector('.metric-value');
            const dateElement = card.querySelector('.metric-date');
            
            if (valueElement) valueElement.textContent = metric.value;
            if (dateElement) dateElement.textContent = `Latest: ${metric.date}`;
            
            // Add trend indicator
            if (metric.trend === 'improved') {
                card.classList.add('improved');
            }
        }
    });
}

function setupFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const feedback = Object.fromEntries(formData);
        
        // Validate required fields
        if (!feedback.coachName || !feedback.school || !feedback.category || !feedback.feedback) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Submit feedback
        submitFeedback(feedback);
    });
}

function submitFeedback(feedback) {
    const submitBtn = document.querySelector('#feedbackForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Add feedback to the list
        addFeedbackToList(feedback);
        
        // Reset form
        document.getElementById('feedbackForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        alert('Thank you for your feedback! It has been submitted successfully.');
    }, 2000);
    
    // In production, send to your backend API
    console.log('Submitting feedback:', feedback);
}

function addFeedbackToList(feedback) {
    const feedbackList = document.querySelector('.feedback-list');
    if (!feedbackList) return;
    
    const feedbackItem = document.createElement('div');
    feedbackItem.className = 'feedback-item';
    
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    feedbackItem.innerHTML = `
        <div class="feedback-header">
            <h4>${feedback.coachName} - ${feedback.school}</h4>
            <span class="feedback-date">${currentDate}</span>
        </div>
        <div class="feedback-category">${feedback.category}</div>
        <p>"${feedback.feedback}"</p>
    `;
    
    // Insert at the beginning of the list
    feedbackList.insertBefore(feedbackItem, feedbackList.firstChild);
}

function loadPreviousFeedback() {
    // In production, load from database
    // For demo, feedback is pre-populated in HTML
    console.log('Loading previous feedback...');
}

// Export data functionality (for coaches who want to save reports)
function exportPerformanceReport() {
    const reportData = {
        athlete: '[Nephew\'s Name]',
        exportDate: new Date().toISOString(),
        metrics: {
            fortyYard: '4.42s',
            verticalJump: '38.5"',
            shuttle: '4.15s',
            cone: '6.85s'
        },
        trainingAdherence: '87%',
        notes: 'Consistent improvement across all metrics. Strong work ethic and coachability.'
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${reportData.athlete.replace(/\s+/g, '_')}_performance_report.json`;
    link.click();
}

// Add export button functionality if needed
document.addEventListener('click', function(e) {
    if (e.target.id === 'exportReport') {
        exportPerformanceReport();
    }
});

// Real-time updates (in production, you might use WebSockets)
function checkForUpdates() {
    // Simulate checking for new data
    console.log('Checking for performance updates...');
}

// Check for updates every 5 minutes
setInterval(checkForUpdates, 5 * 60 * 1000);