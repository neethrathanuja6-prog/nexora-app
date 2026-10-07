import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();

// CORS සක්‍රීය කිරීම
app.use(cors());

// ngrok warning page එක bypass කිරීම සඳහා මේ කොටස එකතු කරන්න
app.use((req, res, next) => {
  res.header("ngrok-skip-browser-warning", "true");
  next();
});

app.use(express.json());

// MySQL Database Connection Config
// (ඔබේ MySQL Workbench එකේ password එකක් ඇත්නම් 'password' ලෙස ලබා දෙන්න, නැතහොත් හිස්ව '' තබන්න)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Thanuja@1978', // මෙතැන password කියන key එක තබා අගය ලෙස ඔබේ password එක දෙන්න
  database: 'nexora_study',
  port: 3306
};

// Create MySQL Pool
const pool = mysql.createPool(dbConfig);

// Test DB Connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'ok', message: 'Connected to MySQL Database successfully!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 1. User Registration Route
app.post('/api/register', async (req, res) => {
  const { userId, firstName, lastName, email, password, grade, alStream, subjects } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    await pool.query(
      `INSERT INTO users (user_id, first_name, last_name, email, password, grade, al_stream, subjects) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, firstName, lastName, email, password || 'defaultpass', grade, alStream, JSON.stringify(subjects)]
    );

    res.json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Database registration failed' });
  }
});

// 2. User Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    res.json({
      success: true,
      user: {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        grade: user.grade,
        alStream: user.al_stream,
        subjects: typeof user.subjects === 'string' ? JSON.parse(user.subjects) : user.subjects
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Database login failed' });
  }
});

// 3. Get User Tasks
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
    const tasks = rows.map(t => ({
      id: Number(t.id),
      name: t.name,
      subject: t.subject,
      priority: t.priority,
      category: t.category,
      duration: t.duration,
      completed: Boolean(t.completed)
    }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// 4. Save Task
app.post('/api/tasks', async (req, res) => {
  const { id, userId, name, subject, priority, category, duration, completed } = req.body;
  try {
    await pool.query(
      `INSERT INTO tasks (id, user_id, name, subject, priority, category, duration, completed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE completed = VALUES(completed)`,
      [id, userId, name, subject, priority, category, duration, completed ? 1 : 0]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Task Save Error:', error);
    res.status(500).json({ error: 'Failed to save task' });
  }
});

// 5. Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// 6. Get User Schedules
app.get('/api/schedules/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedules WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
    const schedules = rows.map(s => ({
      id: Number(s.id),
      title: s.title,
      time: s.time_range,
      type: s.type
    }));
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// 7. Save Schedule
app.post('/api/schedules', async (req, res) => {
  const { id, userId, title, time, type } = req.body;
  try {
    await pool.query(
      `INSERT INTO schedules (id, user_id, title, time_range, type) VALUES (?, ?, ?, ?, ?)`,
      [id, userId, title, time, type]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save schedule' });
  }
});

// 8. Delete Schedule
app.delete('/api/schedules/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM schedules WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

const PORT = 5000;
const path = require('path');

// Frontend static files serve කිරීම
app.use(express.static(path.join(__dirname, 'dist')));

// ඕනෑම Route එකකට ආවොත් React App එකේ index.html එක ලබාදීම
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`🚀 NEXORA Backend Server running on http://localhost:${PORT}`);
});