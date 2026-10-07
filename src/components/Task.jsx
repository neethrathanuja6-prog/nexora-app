import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, RotateCcw, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';

export default function Task({ tasks, setTasks, user, activeCategoryTab, setActiveCategoryTab }) {
  const [activeCategory, setActiveCategory] = useState(activeCategoryTab || 'All');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Focus Timer Popup state with Pause/Continue functionality
  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompletedMsg, setTimerCompletedMsg] = useState(false);

  // Sync category if redirected from Dashboard
  useEffect(() => {
    if (activeCategoryTab) {
      setActiveCategory(activeCategoryTab);
    }
  }, [activeCategoryTab]);

  // Timer interval engine
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerCompletedMsg(true);
      if (activeTimerTask) {
        setTasks(tasks.map(t => t.id === activeTimerTask.id ? { ...t, completed: true } : t));
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeTimerTask]);

  // Task creation form state
  const [taskName, setTaskName] = useState('');
  const [taskSubject, setTaskSubject] = useState(user?.subjects?.[0]?.name || 'Accounting');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskCategory, setTaskCategory] = useState("Today's Mission");
  const [taskDuration, setTaskDuration] = useState('45');

  const categories = [
    'All',
    "Today's Mission",
    'Revision Due',
    'Paper Practice',
    'Backlog',
    'Habits',
    'Homework'
  ];

  const filteredTasks = tasks.filter((t) => {
    const categoryMatch = activeCategory === 'All' || t.category === activeCategory;
    const statusMatch = filterStatus === 'all' 
      ? true 
      : filterStatus === 'completed' 
        ? t.completed 
        : !t.completed;
    return categoryMatch && statusMatch;
  });

  const handleToggleTask = (task) => {
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      id: Date.now(),
      name: taskName,
      subject: taskSubject,
      priority: taskPriority,
      category: taskCategory,
      duration: parseInt(taskDuration) || 30,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    setTaskName('');
  };

  const handleStartFocus = (task) => {
    if (activeTimerTask && activeTimerTask.id === task.id) {
      // Continue session from where paused
      setIsTimerRunning(true);
    } else {
      // Start new timer session
      setActiveTimerTask(task);
      setTimerSeconds(task.duration * 60);
      setIsTimerRunning(true);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F382C]">Task Manager</h1>
          <p className="text-xs text-slate-500 font-medium">Organize and complete tasks to build your analysis</p>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="incomplete">Incomplete</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F382C] text-white text-xs font-bold shadow-md hover:bg-[#08251C]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              if (setActiveCategoryTab) setActiveCategoryTab(cat);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-[#0F382C] text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
            <p className="text-sm font-semibold text-slate-400">No tasks found in this section.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-2xl bg-white border transition-all ${
                task.completed ? 'border-slate-100 bg-slate-50/50 opacity-75' : 'border-slate-200 shadow-sm hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button 
                  onClick={() => handleToggleTask(task)}
                  className="text-slate-400 hover:text-[#0F382C] transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div>
                  <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0F382C]/10 text-[#0F382C]">
                      {task.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {task.duration} mins • {task.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!task.completed && (
                  <button
                    onClick={() => handleStartFocus(task)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0F382C] border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{activeTimerTask?.id === task.id && !isTimerRunning ? 'Continue Session' : 'Start Focus'}</span>
                  </button>
                )}

                <button 
                  onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Focus Timer Overlay (Start, Stop & Continue) */}
      {activeTimerTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md text-white">
          <div className="bg-[#0F382C] rounded-3xl p-8 w-full max-w-sm text-center border border-emerald-700/50 shadow-2xl space-y-6">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">FOCUS SESSION</span>
            
            <div>
              <h3 className="text-xl font-bold">{activeTimerTask.name}</h3>
              <p className="text-xs text-emerald-200 mt-1">{activeTimerTask.subject}</p>
            </div>

            <div className="text-5xl font-mono font-extrabold text-amber-200 my-4">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>

            {timerCompletedMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-800/80 border border-emerald-600 text-emerald-100 text-xs space-y-3">
                <p className="font-bold">Your Focus Timer Is Finished And you did it very well!</p>
                <button
                  onClick={() => {
                    setActiveTimerTask(null);
                    setTimerCompletedMsg(false);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-300 text-emerald-950 font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {isTimerRunning ? (
                    <button
                      onClick={handlePauseTimer}
                      className="flex-1 py-3 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Stop / Pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTimerRunning(true)}
                      className="flex-1 py-3 rounded-xl bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Continue Session</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setActiveTimerTask(null)}
                  className="w-full py-2 rounded-xl bg-white/10 text-slate-300 font-semibold text-xs hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#0F382C]">Add New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Task Name</label>
                <input 
                  type="text" required
                  placeholder="e.g., Complete Economics Past Paper 2022"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
                  <select 
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {user?.subjects?.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select 
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {categories.filter(c=>c!=='All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                  <select 
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Hard">Hard</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Mins)</label>
                  <input 
                    type="number" 
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F382C] text-white text-xs font-semibold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}