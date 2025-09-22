// Progress Tracking with Charts
let fortyYardChart, verticalJumpChart, adherenceChart;

// Sample data - in production, this would come from your database
const progressData = {
    fortyYard: {
        labels: ['Jun 2023', 'Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023'],
        data: [4.50, 4.48, 4.45, 4.40, 4.35, 4.32, 4.30]
    },
    verticalJump: {
        labels: ['Jun 2023', 'Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023'],
        data: [35.0, 35.5, 36.0, 36.5, 37.0, 38.0, 38.5]
    },
    adherence: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [85, 90, 87, 92]
    }
};

// Initialize charts when page loads
window.addEventListener('load', function() {
    initializeCharts();
    loadRecentResults();
});

function initializeCharts() {
    // 40-Yard Dash Chart
    const fortyYardCtx = document.getElementById('fortyYardChart').getContext('2d');
    fortyYardChart = new Chart(fortyYardCtx, {
        type: 'line',
        data: {
            labels: progressData.fortyYard.labels,
            datasets: [{
                label: '40-Yard Dash Time (seconds)',
                data: progressData.fortyYard.data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 4.3,
                    max: 4.6,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2) + 's';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Vertical Jump Chart
    const verticalJumpCtx = document.getElementById('verticalJumpChart').getContext('2d');
    verticalJumpChart = new Chart(verticalJumpCtx, {
        type: 'line',
        data: {
            labels: progressData.verticalJump.labels,
            datasets: [{
                label: 'Vertical Jump (inches)',
                data: progressData.verticalJump.data,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 34,
                    max: 40,
                    ticks: {
                        callback: function(value) {
                            return value + '"';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Training Adherence Chart
    const adherenceCtx = document.getElementById('adherenceChart').getContext('2d');
    adherenceChart = new Chart(adherenceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Missed'],
            datasets: [{
                data: [87, 13],
                backgroundColor: ['#3498db', '#ecf0f1'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Handle progress form submission
document.getElementById('progressForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validate data
    if (!data.date || !data.metric || !data.value) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Add to results table
    addResultToTable(data);
    
    // Update charts if applicable
    updateCharts(data);
    
    // Clear form
    this.reset();
    
    alert('Result logged successfully!');
});

function addResultToTable(data) {
    const tableBody = document.getElementById('resultsTableBody');
    const newRow = document.createElement('tr');
    
    // Calculate change (simplified - in production, compare with previous result)
    const change = calculateChange(data.metric, parseFloat(data.value));
    const changeClass = change > 0 ? 'positive' : 'negative';
    const changeText = change > 0 ? `+${change}` : `${change}`;
    
    newRow.innerHTML = `
        <td>${data.date}</td>
        <td>${getMetricDisplayName(data.metric)}</td>
        <td>${data.value}${getMetricUnit(data.metric)}</td>
        <td class="${changeClass}">${changeText}${getMetricUnit(data.metric)}</td>
        <td>${data.notes || '-'}</td>
    `;
    
    // Insert at the beginning of the table
    tableBody.insertBefore(newRow, tableBody.firstChild);
}

function calculateChange(metric, value) {
    // Simplified calculation - in production, get from database
    const lastValues = {
        '40yard': 4.35,
        'vertical': 37.0,
        'broad': 120,
        'shuttle': 4.20,
        'cone': 6.90
    };
    
    const lastValue = lastValues[metric] || 0;
    
    // For time-based metrics, improvement is negative
    if (metric === '40yard' || metric === 'shuttle' || metric === 'cone') {
        return (lastValue - value).toFixed(2);
    } else {
        return (value - lastValue).toFixed(1);
    }
}

function getMetricDisplayName(metric) {
    const names = {
        '40yard': '40-Yard Dash',
        'vertical': 'Vertical Jump',
        'broad': 'Broad Jump',
        'shuttle': '20-Yard Shuttle',
        'cone': '3-Cone Drill'
    };
    return names[metric] || metric;
}

function getMetricUnit(metric) {
    const units = {
        '40yard': 's',
        'vertical': '"',
        'broad': '"',
        'shuttle': 's',
        'cone': 's'
    };
    return units[metric] || '';
}

function updateCharts(data) {
    // In a real application, you would update the chart data
    // and call chart.update() to refresh the visualization
    console.log('Updating charts with new data:', data);
}

function loadRecentResults() {
    // In production, load from database
    // For demo, the table is pre-populated in HTML
    console.log('Loading recent results...');
}