// Training Calendar Handler
const workoutData = {
    'speed-agility': {
        title: 'Speed & Agility Training',
        description: 'Focus on acceleration, top speed, and change of direction',
        drills: [
            '40-yard dash (3 attempts)',
            '20-yard shuttle (3 attempts)', 
            'Cone drills (5-10-5, 3-cone)',
            'Ladder drills for footwork'
        ],
        video: 'https://example.com/speed-agility-demo'
    },
    'coverage-drills': {
        title: 'Coverage Technique Drills',
        description: 'Develop press coverage, backpedal, and hip turn techniques',
        drills: [
            'Press coverage stance and jam',
            'Backpedal with proper posture',
            'Hip turn and recovery drills',
            'Mirror drill with partner'
        ],
        video: 'https://example.com/coverage-demo'
    },
    'ball-skills': {
        title: 'Ball Skills Training',
        description: 'Improve catching, tracking, and ball-hawking abilities',
        drills: [
            'High-point catches',
            'Ball tracking with distractions',
            'One-handed catches',
            'Interception drills'
        ],
        video: 'https://example.com/ball-skills-demo'
    },
    'strength': {
        title: 'Strength Training',
        description: 'Build functional strength for football performance',
        drills: [
            'Squats (3x8)',
            'Deadlifts (3x6)',
            'Single-leg RDL (3x8 each)',
            'Core stability circuit'
        ],
        video: 'https://example.com/strength-demo'
    },
    'combine-prep': {
        title: 'Combine Preparation',
        description: 'Full combine simulation with timing',
        drills: [
            '40-yard dash (timed)',
            'Vertical jump',
            'Broad jump',
            '20-yard shuttle',
            '3-cone drill'
        ],
        video: 'https://example.com/combine-demo'
    },
    'film-study': {
        title: 'Film Study Session',
        description: 'Analyze technique and game situations',
        drills: [
            'Review previous workout footage',
            'Study NFL cornerback techniques',
            'Analyze game film',
            'Identify areas for improvement'
        ],
        video: 'https://example.com/film-study-demo'
    }
};

// Handle workout detail buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('workout-details')) {
        const workoutItem = e.target.closest('.workout-item');
        const workoutType = workoutItem.dataset.workout;
        showWorkoutDetails(workoutType);
    }
});

function showWorkoutDetails(workoutType) {
    const workout = workoutData[workoutType];
    if (!workout) return;
    
    const modal = document.getElementById('workoutModal');
    const detailsDiv = document.getElementById('workoutDetails');
    
    detailsDiv.innerHTML = `
        <h2>${workout.title}</h2>
        <p><strong>Description:</strong> ${workout.description}</p>
        <h3>Drills:</h3>
        <ul>
            ${workout.drills.map(drill => `<li>${drill}</li>`).join('')}
        </ul>
        <p><strong>Demo Video:</strong> <a href="${workout.video}" target="_blank">Watch Technique Demo</a></p>
    `;
    
    modal.style.display = 'block';
}

// Handle modal close
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('workoutModal').style.display = 'none';
});

window.addEventListener('click', function(e) {
    const modal = document.getElementById('workoutModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle workout completion checkboxes
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('workout-checkbox')) {
        const workoutItem = e.target.closest('.workout-item');
        const workoutType = workoutItem.dataset.workout;
        const isCompleted = e.target.checked;
        
        // Store completion status
        const completionData = JSON.parse(localStorage.getItem('workoutCompletions') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        if (!completionData[today]) {
            completionData[today] = {};
        }
        
        completionData[today][workoutType] = isCompleted;
        localStorage.setItem('workoutCompletions', JSON.stringify(completionData));
        
        // Visual feedback
        if (isCompleted) {
            workoutItem.style.opacity = '0.7';
            workoutItem.style.backgroundColor = '#d4edda';
        } else {
            workoutItem.style.opacity = '1';
            workoutItem.style.backgroundColor = '#f8f9fa';
        }
    }
});

// Save workout notes
function saveNotes() {
    const notes = document.getElementById('workoutNotes').value;
    if (notes.trim()) {
        // In a real app, save to database
        localStorage.setItem('workoutNotes_' + Date.now(), notes);
        alert('Notes saved successfully!');
        document.getElementById('workoutNotes').value = '';
    }
}

// Calendar navigation
document.getElementById('prevWeek')?.addEventListener('click', function() {
    // Implement week navigation
    console.log('Previous week');
});

document.getElementById('nextWeek')?.addEventListener('click', function() {
    // Implement week navigation
    console.log('Next week');
});

// Load completion status on page load
window.addEventListener('load', function() {
    const completionData = JSON.parse(localStorage.getItem('workoutCompletions') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = completionData[today] || {};
    
    document.querySelectorAll('.workout-checkbox').forEach(checkbox => {
        const workoutItem = checkbox.closest('.workout-item');
        const workoutType = workoutItem.dataset.workout;
        
        if (todayCompletions[workoutType]) {
            checkbox.checked = true;
            workoutItem.style.opacity = '0.7';
            workoutItem.style.backgroundColor = '#d4edda';
        }
    });
});