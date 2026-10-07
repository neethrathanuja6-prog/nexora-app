import React, { useState, useEffect } from 'react';
import LaunchAnimation from './components/LaunchAnimation';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Task from './components/Task';
import Analysis from './components/Analysis';
import Report from './components/Report';
import Settings from './components/Settings';

export default function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // Fetch Tasks and Schedules from MySQL Backend on Login
  useEffect(() => {
    if (user?.userId) {
      // Fetch Tasks
      fetch(`http://[https://most-fanciness-moonscape.ngrok-free.dev](https://most-fanciness-moonscape.ngrok-free.dev)/api/tasks/${user.userId}`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setTasks(data); })
        .catch(err => console.error('Error fetching tasks from DB:', err));

      // Fetch Schedules
      fetch(`http://[https://most-fanciness-moonscape.ngrok-free.dev](https://most-fanciness-moonscape.ngrok-free.dev)/api/schedules/${user.userId}`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setSchedules(data); })
        .catch(err => console.error('Error fetching schedules from DB:', err));
    }
  }, [user]);

  // Sync Task Additions/Updates with MySQL Backend
  const handleSetTasks = (newTasksOrFn) => {
    setTasks(prev => {
      const nextTasks = typeof newTasksOrFn === 'function' ? newTasksOrFn(prev) : newTasksOrFn;
      
      // Save/Update in DB
      if (user?.userId) {
        nextTasks.forEach(t => {
          fetch('http://[https://most-fanciness-moonscape.ngrok-free.dev](https://most-fanciness-moonscape.ngrok-free.dev)/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...t, userId: user.userId })
          }).catch(err => console.error('Error syncing task to DB:', err));
        });

        // Detect deleted task
        if (prev.length > nextTasks.length) {
          const deletedTask = prev.find(p => !nextTasks.some(n => n.id === p.id));
          if (deletedTask) {
            fetch(`http://[https://most-fanciness-moonscape.ngrok-free.dev](https://most-fanciness-moonscape.ngrok-free.dev)/api/tasks/${deletedTask.id}`, { method: 'DELETE' })
              .catch(err => console.error('Error deleting task from DB:', err));
          }
        }
      }

      return nextTasks;
    });
  };

  // Sync Schedule Additions/Deletions with MySQL Backend
  const handleSetSchedules = (newSchedulesOrFn) => {
    setSchedules(prev => {
      const nextSchedules = typeof newSchedulesOrFn === 'function' ? newSchedulesOrFn(prev) : newSchedulesOrFn;
      
      if (user?.userId) {
        nextSchedules.forEach(s => {
          fetch('http://[https://most-fanciness-moonscape.ngrok-free.dev](https://most-fanciness-moonscape.ngrok-free.dev)/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...s, userId: user.userId })
          }).catch(err => console.error('Error syncing schedule to DB:', err));
        });

        if (prev.length > nextSchedules.length) {
          const deletedSchedule = prev.find(p => !nextSchedules.some(n => n.id === p.id));
          if (deletedSchedule) {
            fetch(`http://[https://most-fanciness-moonscape.ngrok-free.dev](https://most-fanciness-moonscape.ngrok-free.dev)/api/schedules/${deletedSchedule.id}`, { method: 'DELETE' })
              .catch(err => console.error('Error deleting schedule from DB:', err));
          }
        }
      }

      return nextSchedules;
    });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  if (showAnimation) {
    return <LaunchAnimation onComplete={() => setShowAnimation(false)} />;
  }

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFBF7]">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={() => {
          setIsAuthenticated(false);
          setUser(null);
          setTasks([]);
          setSchedules([]);
        }}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            user={user} 
            tasks={tasks} 
            schedules={schedules} 
            setActiveTab={setActiveTab} 
            setTaskCategoryTab={setActiveCategoryTab}
          />
        )}
        {activeTab === 'schedule' && <Schedule tasks={tasks} schedules={schedules} setSchedules={handleSetSchedules} />}
        {activeTab === 'task' && (
          <Task 
            tasks={tasks} 
            setTasks={handleSetTasks} 
            user={user} 
            activeCategoryTab={activeCategoryTab}
            setActiveCategoryTab={setActiveCategoryTab}
          />
        )}
        {activeTab === 'analysis' && <Analysis tasks={tasks} />}
        {activeTab === 'report' && <Report user={user} tasks={tasks} />}
        {activeTab === 'settings' && <Settings user={user} setUser={setUser} />}
      </main>
    </div>
  );
}