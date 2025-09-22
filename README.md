# Football Recruiting Platform

A comprehensive digital recruiting platform for elite football players, featuring both public-facing recruitment tools and private training management.

## 🏈 Project Overview

This platform serves as a complete digital solution for football recruiting, combining:
- **Public Recruiting Website**: Professional showcase for coaches and scouts
- **Private Training Dashboard**: Secure portal for progress tracking and training management
- **Scout Access Portal**: Read-only access for coaches with feedback capabilities

## 📁 Project Structure

```
Football/
├── public/                 # Public-facing recruiting website
│   ├── index.html         # Homepage with hero section and stats
│   ├── highlights.html    # Video highlights and key plays
│   ├── profile.html       # Complete player profile and stats
│   ├── news.html          # News, achievements, and articles
│   └── contact.html       # Contact form and information
├── private/               # Secure training management
│   ├── login.html         # Authentication portal
│   └── dashboard/         # Training dashboard
│       ├── index.html     # Main dashboard with KPIs
│       ├── calendar.html  # Interactive training calendar
│       ├── progress.html  # Progress tracking with charts
│       └── scout-access.html # Scout/coach portal
├── assets/                # Static resources
│   ├── css/              # Stylesheets
│   │   ├── main.css      # Main styling
│   │   └── dashboard.css # Dashboard-specific styles
│   ├── js/               # JavaScript functionality
│   │   ├── auth.js       # Authentication handling
│   │   ├── calendar.js   # Training calendar logic
│   │   ├── contact.js    # Contact form handling
│   │   ├── dashboard.js  # Main dashboard functionality
│   │   ├── progress.js   # Progress tracking with charts
│   │   └── scout-access.js # Scout portal functionality
│   └── images/           # Image assets (add your photos here)
└── README.md             # This file
```

## 🚀 Features

### Public Recruiting Website
- **Professional Homepage**: Hero section with key stats and compelling visuals
- **Highlight Reel**: Embedded video player with timestamped key plays
- **Complete Profile**: Detailed stats, academics, and game film
- **News & Achievements**: Blog-style updates and accomplishments
- **Contact System**: Direct communication with guardians and coaches

### Private Training Dashboard
- **Performance Metrics**: Real-time KPIs and progress tracking
- **Interactive Calendar**: Weekly training schedule with drill details
- **Progress Charts**: Visual representation of improvement over time
- **Data Entry**: Easy logging of combine results and metrics
- **Training Adherence**: Completion tracking and motivation

### Scout Access Portal
- **Read-Only Access**: Secure viewing of training data for coaches
- **Feedback System**: Professional assessment and recommendation tools
- **Performance Reports**: Exportable data for recruiting evaluation
- **Progress Trends**: 6-month improvement analysis

## 🛠️ Setup Instructions

### 1. Basic Setup
1. Download/clone this project to your local machine
2. Replace placeholder content with actual information:
   - Update `[Nephew's Name]` throughout all files
   - Add real stats, dates, and achievements
   - Replace contact information with actual details

### 2. Add Media Content
1. Add photos to `assets/images/`:
   - `hero-bg.jpg` - Action shot for homepage background
   - Player photos for profile sections
2. Upload highlight video to Vimeo or Hudl
3. Update video embed codes in `highlights.html`

### 3. Customize Content
1. **Homepage** (`public/index.html`):
   - Update hero section with real stats
   - Modify bio and achievements
2. **Profile** (`public/profile.html`):
   - Add verified combine results
   - Update academic information
   - Link to actual game film
3. **News** (`public/news.html`):
   - Add real news articles and achievements
   - Update dates and accomplishments

### 4. Configure Authentication
1. Update login credentials in `assets/js/auth.js`
2. Set up secure password hashing (see Backend Setup)
3. Configure user roles and permissions

## 🔐 Demo Login Credentials

**Athlete Access:**
- Username: `athlete`
- Password: `training123`

**Scout/Coach Access:**
- Username: `scout1`
- Password: `scout123`

## 📊 Backend Integration

For production use, you'll need to implement:

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('athlete', 'scout', 'admin'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics
CREATE TABLE performance_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    metric_type VARCHAR(50),
    value DECIMAL(5,2),
    date_recorded DATE,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Training sessions
CREATE TABLE training_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_date DATE,
    workout_type VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Scout feedback
CREATE TABLE scout_feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    scout_id INT,
    athlete_id INT,
    category VARCHAR(50),
    feedback TEXT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scout_id) REFERENCES users(id),
    FOREIGN KEY (athlete_id) REFERENCES users(id)
);
```

### API Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/metrics/:userId` - Get performance metrics
- `POST /api/metrics` - Log new performance data
- `GET /api/training/:userId` - Get training schedule
- `POST /api/training/complete` - Mark workout complete
- `POST /api/feedback` - Submit scout feedback
- `GET /api/feedback/:athleteId` - Get athlete feedback

## 🎨 Customization

### Styling
- Modify `assets/css/main.css` for public site styling
- Update `assets/css/dashboard.css` for dashboard appearance
- Customize colors, fonts, and layout to match preferences

### Functionality
- Add new workout types in `assets/js/calendar.js`
- Extend metrics tracking in `assets/js/progress.js`
- Customize scout feedback categories in `scout-access.html`

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop computers (coaches reviewing at office)
- Tablets (scouts at games and camps)
- Mobile phones (athlete daily use)

## 🔒 Security Considerations

For production deployment:
1. Implement proper password hashing (bcrypt)
2. Use HTTPS for all communications
3. Add CSRF protection for forms
4. Implement rate limiting for login attempts
5. Sanitize all user inputs
6. Use environment variables for sensitive data

## 📈 Analytics & Tracking

Consider adding:
- Google Analytics for public site traffic
- Performance tracking for dashboard usage
- Scout engagement metrics
- Video view analytics

## 🚀 Deployment Options

### Static Hosting (Public Site Only)
- GitHub Pages
- Netlify
- Vercel

### Full-Stack Hosting
- AWS (EC2 + RDS)
- Google Cloud Platform
- Heroku
- DigitalOcean

## 📞 Support

For technical support or customization requests:
- Review the code comments for implementation details
- Check browser console for JavaScript errors
- Ensure all file paths are correct for your hosting environment

## 🏆 Success Tips

1. **Keep Content Fresh**: Regular updates to news and achievements
2. **High-Quality Media**: Professional photos and video content
3. **Mobile-First**: Ensure everything works perfectly on mobile
4. **Fast Loading**: Optimize images and minimize file sizes
5. **SEO Optimization**: Add meta tags and structured data
6. **Regular Backups**: Backup all data and content regularly

---

**Built for Elite Athletes | Designed for Professional Recruiting**