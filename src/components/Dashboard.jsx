import React, { useState } from 'react';
import { Bell, Calendar, Plus, Clock, ArrowUpRight } from 'lucide-react';

export default function Dashboard({ user, tasks, setActiveTab, setTaskCategoryTab, schedules = [] }) {
  const [showNotification, setShowNotification] = useState(false);
  const [motivationCard, setMotivationCard] = useState({
    title: 'Create Your Goal',
    goal: 'Set your target in settings or motivation card',
    bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  });
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGoal, setNewGoal] = useState('');

  // 100% Dynamic Calculations
  const todayMissions = tasks.filter(t => t.category === "Today's Mission");
  const completedMissions = todayMissions.filter(t => t.completed).length;

  const revisionDue = tasks.filter(t => t.category === "Revision Due");
  const paperPractice = tasks.filter(t => t.category === "Paper Practice");
  const backlog = tasks.filter(t => t.category === "Backlog");
  const habits = tasks.filter(t => t.category === "Habits");
  const homework = tasks.filter(t => t.category === "Homework");

  const totalTasks = tasks.length;
  const totalCompleted = tasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const totalFocusMinutes = tasks
    .filter(t => t.completed)
    .reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handleMetricClick = (categoryName) => {
    if (setTaskCategoryTab) {
      setTaskCategoryTab(categoryName);
    }
    setActiveTab('task');
  };

  const handleSaveMotivation = (e) => {
    e.preventDefault();
    if (newTitle) {
      setMotivationCard({
        ...motivationCard,
        title: newTitle,
        goal: newGoal || motivationCard.goal
      });
      setShowMotivationModal(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F382C]">
            Good Morning, {user?.firstName || 'Student'}!
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Small steps every day lead to big results. Keep going!
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="relative">
            <button 
              onClick={() => setShowNotification(!showNotification)} 
              className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700"
            >
              <Bell className="w-5 h-5" />
              {showNotification && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-[#1B5E4B]" />
            <span>{formattedDate}</span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-white flex items-center justify-center font-bold text-sm shadow-md">
            {user?.firstName ? user.firstName[0] : 'U'}
          </div>
        </div>
      </div>

      {/* Dynamic Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Today's Mission", total: todayMissions.length, done: completedMissions, cat: "Today's Mission" },
          { label: "Revision Due", total: revisionDue.length, done: revisionDue.filter(t=>t.completed).length, cat: "Revision Due" },
          { label: "Paper Practice", total: paperPractice.length, done: paperPractice.filter(t=>t.completed).length, cat: "Paper Practice" },
          { label: "Backlog", total: backlog.length, done: backlog.filter(t=>t.completed).length, cat: "Backlog" },
          { label: "Habits", total: habits.length, done: habits.filter(t=>t.completed).length, cat: "Habits" },
          { label: "Homework", total: homework.length, done: homework.filter(t=>t.completed).length, cat: "Homework" },
        ].map((item, idx) => (
          <div 
            key={idx}
            onClick={() => handleMetricClick(item.cat)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0F382C] transition-all cursor-pointer group"
          >
            <p className="text-xs font-semibold text-slate-500 truncate group-hover:text-[#0F382C]">{item.label}</p>
            <p className="text-xl font-extrabold text-[#0F382C] mt-2">{item.done}/{item.total}</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#1B5E4B] h-full rounded-full transition-all"
                style={{ width: item.total > 0 ? `${(item.done / item.total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-slate-700 w-full text-left mb-4">Today's Progress</h3>
            
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="72" cy="72" r="58" 
                  stroke="#0F382C" 
                  strokeWidth="12" 
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * progressPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent" 
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-[#0F382C]">{progressPercentage}%</span>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Completed</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#1B5E4B] mt-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              {totalTasks === 0 ? "Add tasks to start tracking your progress today!" : "Progress, not perfection. Keep going!"}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">Study Capacity Today</h3>
              <Clock className="w-4 h-4 text-[#1B5E4B]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F382C]">{focusHours}h {focusMins}m</span>
              <span className="text-xs text-slate-500 font-medium">Logged Focus</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#1B5E4B] h-full rounded-full transition-all" style={{ width: `${Math.min(100, (totalFocusMinutes / 300) * 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">Today's Schedule</h3>
              <button onClick={() => setActiveTab('schedule')} className="text-xs font-semibold text-[#1B5E4B] hover:underline flex items-center gap-1">
                <span>Manage Schedule</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 font-medium">No schedules planned for today.</p>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className="mt-2 text-xs font-bold text-[#0F382C] underline"
                >
                  + Create your daily schedule
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {schedules.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <p className="text-[11px] font-bold text-[#0F382C]">{item.title}</p>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">{item.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div 
            className="relative rounded-3xl p-6 text-white overflow-hidden shadow-md flex items-center justify-between bg-cover bg-center min-h-[120px]"
            style={{ backgroundImage: `linear-gradient(rgba(15, 56, 44, 0.85), rgba(15, 56, 44, 0.85)), url(${motivationCard.bg})` }}
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300">My Inspiration</span>
              <h4 className="text-xl font-extrabold mt-1">{motivationCard.title}</h4>
              <p className="text-xs text-emerald-100 mt-1 font-medium">{motivationCard.goal}</p>
            </div>
            <button 
              onClick={() => setShowMotivationModal(true)}
              className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {showMotivationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#0F382C]">Create Motivation Label</h3>
            <form onSubmit={handleSaveMotivation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Motivation Name</label>
                <input 
                  type="text" required
                  placeholder="e.g., District Rank 1 in A/L"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Aspiration / Goal</label>
                <input 
                  type="text"
                  placeholder="e.g., Get selected to University"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowMotivationModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F382C] text-white text-xs font-semibold"
                >
                  Save Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}