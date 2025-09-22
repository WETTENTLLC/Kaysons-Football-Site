// Example Node.js/Express Backend for Football Recruiting Platform
// This is a basic implementation - expand based on your needs

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'football_recruiting'
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Authentication
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
        
        await connection.end();
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get performance metrics
app.get('/api/metrics/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user can access this data
        if (req.user.userId !== parseInt(userId) && req.user.role !== 'scout') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM performance_metrics WHERE user_id = ? ORDER BY date_recorded DESC',
            [userId]
        );
        
        res.json(rows);
        await connection.end();
    } catch (error) {
        console.error('Get metrics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Log new performance metric
app.post('/api/metrics', authenticateToken, async (req, res) => {
    try {
        const { metric_type, value, date_recorded, notes } = req.body;
        const userId = req.user.userId;
        
        if (req.user.role !== 'athlete') {
            return res.status(403).json({ error: 'Only athletes can log metrics' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO performance_metrics (user_id, metric_type, value, date_recorded, notes) VALUES (?, ?, ?, ?, ?)',
            [userId, metric_type, value, date_recorded, notes]
        );
        
        res.json({ id: result.insertId, message: 'Metric logged successfully' });
        await connection.end();
    } catch (error) {
        console.error('Log metric error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get training schedule
app.get('/api/training/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (req.user.userId !== parseInt(userId) && req.user.role !== 'scout') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM training_sessions WHERE user_id = ? AND session_date >= CURDATE() ORDER BY session_date',
            [userId]
        );
        
        res.json(rows);
        await connection.end();
    } catch (error) {
        console.error('Get training error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark workout as complete
app.post('/api/training/complete', authenticateToken, async (req, res) => {
    try {
        const { sessionId, completed, notes } = req.body;
        const userId = req.user.userId;
        
        if (req.user.role !== 'athlete') {
            return res.status(403).json({ error: 'Only athletes can update training' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        
        // Verify session belongs to user
        const [sessions] = await connection.execute(
            'SELECT * FROM training_sessions WHERE id = ? AND user_id = ?',
            [sessionId, userId]
        );
        
        if (sessions.length === 0) {
            return res.status(404).json({ error: 'Training session not found' });
        }
        
        await connection.execute(
            'UPDATE training_sessions SET completed = ?, notes = ? WHERE id = ?',
            [completed, notes, sessionId]
        );
        
        res.json({ message: 'Training session updated' });
        await connection.end();
    } catch (error) {
        console.error('Update training error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit scout feedback
app.post('/api/feedback', authenticateToken, async (req, res) => {
    try {
        const { athleteId, category, feedback, rating } = req.body;
        const scoutId = req.user.userId;
        
        if (req.user.role !== 'scout') {
            return res.status(403).json({ error: 'Only scouts can submit feedback' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO scout_feedback (scout_id, athlete_id, category, feedback, rating) VALUES (?, ?, ?, ?, ?)',
            [scoutId, athleteId, category, feedback, rating]
        );
        
        res.json({ id: result.insertId, message: 'Feedback submitted successfully' });
        await connection.end();
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get athlete feedback
app.get('/api/feedback/:athleteId', authenticateToken, async (req, res) => {
    try {
        const { athleteId } = req.params;
        
        // Athletes can see their own feedback, scouts can see all
        if (req.user.userId !== parseInt(athleteId) && req.user.role !== 'scout') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT sf.*, u.username as scout_name 
            FROM scout_feedback sf 
            JOIN users u ON sf.scout_id = u.id 
            WHERE sf.athlete_id = ? 
            ORDER BY sf.created_at DESC
        `, [athleteId]);
        
        res.json(rows);
        await connection.end();
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, title, school, email, phone, message } = req.body;
        
        // In production, you might want to:
        // 1. Send email notification
        // 2. Store in database
        // 3. Integrate with CRM
        
        console.log('Contact form submission:', {
            name, title, school, email, phone, message
        });
        
        // Simulate email sending
        res.json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Public site: http://localhost:${PORT}`);
    console.log(`API endpoints: http://localhost:${PORT}/api`);
});

module.exports = app;