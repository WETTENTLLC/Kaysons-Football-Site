// Main Dashboard Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = sessionStorage.getItem('user');
    if (!user) {
        window.location.href = '../login.html';
        return;
    }
    
    initializeDashboard();
});

function initializeDashboard() {
    // Load dashboard data
    loadDashboardMetrics();
    
    // Setup real-time updates
    setupRealTimeUpdates();
    
    // Handle logout
    setupLogout();
}

function loadDashboardMetrics() {
    // In production, fetch from your API
    const metrics = {
        trainingAdherence: 87,
        workoutsCompleted: 23,
        fortyYardTime: 4.42,
        verticalJump: 38.5,
        recentActivity: [
            {
                date: 'Today',
                title: 'Hip-Turn Gauntlet',
                description: 'Completed 3 sets with improved technique'
            },
            {
                date: 'Yesterday', 
                title: 'Speed & Agility Session',
                description: '40-yard dash: 4.42s (new personal best)'
            },
            {
                date: '2 days ago',
                title: 'Coverage Drills',
                description: 'Worked on press coverage and backpedal technique'
            }
        ],
        upcomingWorkouts: [
            {
                date: 'Tomorrow',
                title: 'Ball Skills Training',
                description: 'Focus on high-point catches and tracking'
            },
            {
                date: 'Friday',
                title: 'Combine Prep',
                description: 'Full combine simulation with timing'
            }
        ]
    };
    
    updateDashboardUI(metrics);
}

function updateDashboardUI(metrics) {
    // Update metric cards
    updateMetricCard('training-adherence', metrics.trainingAdherence, '%');
    updateMetricCard('workouts-completed', metrics.workoutsCompleted, '');
    updateMetricCard('forty-yard-time', metrics.fortyYardTime, 's');
    updateMetricCard('vertical-jump', metrics.verticalJump, '"');
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = metrics.trainingAdherence + '%';
    }
    
    // Update activity lists
    updateActivityList('.recent-activity .activity-list', metrics.recentActivity);
    updateActivityList('.upcoming-workouts .workout-list', metrics.upcomingWorkouts);
}

function updateMetricCard(cardId, value, unit) {
    const card = document.querySelector(`[data-metric="${cardId}"]`);
    if (!card) return;
    
    const valueElement = card.querySelector('.metric-value');
    if (valueElement) {
        valueElement.textContent = value + unit;
    }
}

function updateActivityList(selector, activities) {
    const list = document.querySelector(selector);
    if (!list) return;
    
    list.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-date">${activity.date}</div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
        </div>
    `).join('');
}

function setupRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateTrainingAdherence();
    }, 30000);
}

function updateTrainingAdherence() {
    // Calculate current week's adherence
    const completionData = JSON.parse(localStorage.getItem('workoutCompletions') || '{}');
    const thisWeek = getCurrentWeekDates();
    
    let completed = 0;
    let total = 0;
    
    thisWeek.forEach(date => {
        const dayData = completionData[date];
        if (dayData) {
            const dayCompleted = Object.values(dayData).filter(Boolean).length;
            const dayTotal = Object.keys(dayData).length;
            completed += dayCompleted;
            total += dayTotal;
        }
    });
    
    const adherence = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update UI
    updateMetricCard('training-adherence', adherence, '%');
    
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = adherence + '%';
    }
}

function getCurrentWeekDates() {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
}

function setupLogout() {
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear session
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('userType');
            
            // Redirect to login
            window.location.href = '../login.html';
        });
    });
}

// Quick actions
function quickAddWorkout() {
    // Open modal or redirect to calendar
    window.location.href = 'calendar.html';
}

function quickLogResult() {
    // Open modal or redirect to progress
    window.location.href = 'progress.html';
}

// Motivational messages based on progress
function getMotivationalMessage(adherence) {
    if (adherence >= 90) {
        return "Outstanding dedication! Keep up the excellent work!";
    } else if (adherence >= 80) {
        return "Great consistency! You're on track for success!";
    } else if (adherence >= 70) {
        return "Good progress! Let's push for even better consistency!";
    } else {
        return "Every workout counts! Let's get back on track!";
    }
}

// Performance trends
function calculateTrend(currentValue, previousValue, metricType) {
    const difference = currentValue - previousValue;
    
    // For time-based metrics (40-yard, shuttle), lower is better
    if (metricType === 'time') {
        return difference < 0 ? 'improved' : 'declined';
    } else {
        return difference > 0 ? 'improved' : 'declined';
    }
}

// Export dashboard data
function exportDashboardData() {
    const dashboardData = {
        exportDate: new Date().toISOString(),
        athlete: sessionStorage.getItem('user'),
        metrics: {
            trainingAdherence: document.querySelector('[data-metric="training-adherence"] .metric-value')?.textContent,
            workoutsCompleted: document.querySelector('[data-metric="workouts-completed"] .metric-value')?.textContent,
            fortyYardTime: document.querySelector('[data-metric="forty-yard-time"] .metric-value')?.textContent,
            verticalJump: document.querySelector('[data-metric="vertical-jump"] .metric-value')?.textContent
        },
        workoutCompletions: JSON.parse(localStorage.getItem('workoutCompletions') || '{}')
    };
    
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `training_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}